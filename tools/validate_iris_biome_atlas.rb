#!/usr/bin/env ruby

require "json"
require "optparse"
require "pathname"
require "set"

PackGraph = Struct.new(:name, :version, :roots, :reachable, :child_only, :roles, keyword_init: true)

def load_json(path)
  JSON.parse(path.read)
rescue JSON::ParserError => error
  abort("Invalid JSON at #{path}: #{error.message}")
end

def biome_key(root, path)
  path.relative_path_from(root.join("biomes")).to_s.delete_suffix(".json")
end

def build_graph(root, dimension_key)
  dimension = load_json(root.join("dimensions", "#{dimension_key}.json"))
  biomes = root.join("biomes").glob("**/*.json").to_h do |path|
    [biome_key(root, path), load_json(path)]
  end

  roles = Hash.new { |hash, key| hash[key] = [] }
  dimension.fetch("regions").each do |region_key|
    region = load_json(root.join("regions", "#{region_key}.json"))
    {
      "land" => "landBiomes",
      "sea" => "seaBiomes",
      "shore" => "shoreBiomes",
      "cave" => "caveBiomes"
    }.each do |role, field|
      Array(region[field]).each { |key| roles[key] << [region_key, role] }
    end
  end

  Array(dimension["carving"]).each do |entry|
    key = entry["biome"]
    roles[key] << ["dimension", "carving"] if key.is_a?(String) && !key.empty?
  end

  roots = roles.keys.to_set
  reachable = roots.dup
  queue = roots.to_a
  until queue.empty?
    key = queue.shift
    biome = biomes[key]
    abort("Missing biome #{key} in #{root}") unless biome

    targets = Array(biome["children"])
    carving_biome = biome["carvingBiome"]
    targets << carving_biome if carving_biome.is_a?(String) && !carving_biome.empty?
    Array(biome["floatingChildBiomes"]).each do |entry|
      floating_key = entry["biome"]
      targets << floating_key if floating_key.is_a?(String) && !floating_key.empty?
      carving_key = entry["carving"]
      targets << carving_key if carving_key.is_a?(String) && biomes.key?(carving_key)
    end

    targets.each do |target|
      next unless biomes.key?(target)
      next if reachable.include?(target)

      reachable << target
      queue << target
    end
  end

  PackGraph.new(
    name: dimension.fetch("name"),
    version: dimension.fetch("version"),
    roots: roots,
    reachable: reachable,
    child_only: reachable - roots,
    roles: roles
  )
end

script_path = Pathname(__FILE__).realpath
docs_root = script_path.dirname.parent
remote_git_root = docs_root.parent.parent
options = {
  docs: docs_root,
  overworld: remote_git_root.join("IrisDimensions", "overworld"),
  underworld: remote_git_root.join("IrisDimensions", "underworld")
}

OptionParser.new do |parser|
  parser.banner = "Usage: validate_iris_biome_atlas.rb [options]"
  parser.on("--docs PATH") { |path| options[:docs] = Pathname.new(path).expand_path }
  parser.on("--overworld PATH") { |path| options[:overworld] = Pathname.new(path).expand_path }
  parser.on("--underworld PATH") { |path| options[:underworld] = Pathname.new(path).expand_path }
end.parse!

options.each do |label, path|
  abort("Missing #{label} root: #{path}") unless path.directory?
end

overworld = build_graph(options[:overworld], "overworld")
underworld = build_graph(options[:underworld], "underworld")
errors = []

unless overworld.reachable == underworld.reachable
  only_overworld = (overworld.reachable - underworld.reachable).to_a.sort
  only_underworld = (underworld.reachable - overworld.reachable).to_a.sort
  errors << "Reachable biome sets differ. Overworld only: #{only_overworld.join(', ')}; Underworld only: #{only_underworld.join(', ')}"
end

atlas_root = options[:docs].join("iris", "biomes")
landing_path = options[:docs].join("iris", "44-biome-catalog.md")
errors << "Missing atlas landing page #{landing_path}" unless landing_path.file?
errors << "Missing atlas tree #{atlas_root}" unless atlas_root.directory?

markdown_paths = atlas_root.glob("**/*.md")
markdown = markdown_paths.to_h { |path| [path, path.read] }
all_markdown = markdown.values.join("\n")

combined_roots = overworld.roots | underworld.roots
combined_roles = Hash.new { |hash, key| hash[key] = Set.new }
[overworld, underworld].each do |graph|
  graph.roles.each do |key, memberships|
    memberships.each { |_region, role| combined_roles[key] << role }
  end
end

combined_roots.sort.each do |key|
  roles = combined_roles[key]
  expected_path = if roles.include?("shore")
                    atlas_root.join("shorelines.md")
                  elsif key.start_with?("carving/prismatic-")
                    atlas_root.join("carving", "prismatic-caves.md")
                  else
                    atlas_root.join("#{key}.md")
                  end
  unless expected_path.file?
    errors << "Missing atlas classification for root #{key}: expected #{expected_path}"
    next
  end

  body = markdown.fetch(expected_path, expected_path.read)
  errors << "#{expected_path} does not name #{key}" unless body.include?(key)
  unless body.include?("Overworld") && body.include?("Underworld")
    errors << "#{expected_path} must document both Overworld and Underworld"
  end
end

combined_child_only = (overworld.child_only | underworld.child_only).sort
combined_child_only.each do |key|
  errors << "Child-only biome #{key} is not embedded in the atlas" unless all_markdown.include?(key)
end

if landing_path.file?
  landing = landing_path.read
  [overworld, underworld].each do |graph|
    label = "#{graph.name} #{graph.version}"
    errors << "Atlas landing page does not declare #{label}" unless landing.include?(label)
  end
  errors << "Atlas landing page must state the pack-update maintenance requirement" unless landing.include?("Pack maintenance requirement")
end

unless errors.empty?
  warn(errors.join("\n"))
  exit(1)
end

puts("Biome atlas valid: #{combined_roots.size} roots, #{combined_child_only.size} child-only variants, #{overworld.reachable.size} shared reachable keys")
puts("Versions: Overworld #{overworld.version}, Underworld #{underworld.version}")
