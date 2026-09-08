#!/usr/bin/env ruby

require "json"
require "optparse"
require "pathname"
require "set"

PackGraph = Struct.new(:name, :version, :roots, :reachable, :child_only, :roles, :biomes, :land, keyword_init: true)

def load_json(path)
  JSON.parse(path.read)
rescue JSON::ParserError => error
  abort("Invalid JSON at #{path}: #{error.message}")
end

def biome_key(root, path)
  path.relative_path_from(root.join("biomes")).to_s.delete_suffix(".json")
end

def add_river_roles(roles, value, context)
  fields = {
    "surfaceBiomes" => "sea",
    "mouthBiomes" => "sea",
    "shoreBiomes" => "shore",
    "bankBiomes" => "land",
    "floodedCaveBiomes" => "cave"
  }
  targets = []
  if value.is_a?(Hash)
    value.each do |field, entry|
      if fields.key?(field)
        Array(entry).each do |key|
          roles[key] << [context, fields.fetch(field)]
          targets << key
        end
      else
        targets.concat(add_river_roles(roles, entry, context))
      end
    end
  elsif value.is_a?(Array)
    value.each { |entry| targets.concat(add_river_roles(roles, entry, context)) }
  end
  targets
end

def geometry_without(value, fields)
  if value.is_a?(Hash)
    value.reject { |key, _entry| fields.include?(key) }.transform_values { |entry| geometry_without(entry, fields) }
  elsif value.is_a?(Array)
    value.map { |entry| geometry_without(entry, fields) }
  else
    value
  end
end

def check_geometry(errors, label, overworld, underworld)
  errors << "Paired geometry differs at #{label}" unless overworld == underworld
end

def build_graph(root, dimension_key)
  dimension = load_json(root.join("dimensions", "#{dimension_key}.json"))
  biomes = root.join("biomes").glob("**/*.json").to_h do |path|
    [biome_key(root, path), load_json(path)]
  end

  roles = Hash.new { |hash, key| hash[key] = [] }
  land = Set.new
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
    land.merge(Array(region["landBiomes"]))
    add_river_roles(roles, region["riverPolicy"], "#{region_key}/rivers")
  end
  add_river_roles(roles, dimension["riverPolicy"], "dimension/rivers")
  add_river_roles(roles, dimension["hydrology"], "dimension/hydrology")

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
    targets = targets + add_river_roles(roles, biome["riverPolicy"], "#{key}/rivers")
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

  roots = roles.keys.to_set
  queue = land.to_a
  until queue.empty?
    key = queue.shift
    Array(biomes.fetch(key)["children"]).each do |child|
      next if land.include?(child)

      land << child
      queue << child
    end
  end

  PackGraph.new(
    name: dimension.fetch("name"),
    version: dimension.fetch("version"),
    roots: roots,
    reachable: reachable,
    child_only: reachable - roots,
    roles: roles,
    biomes: biomes,
    land: land
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

overworld_dimension = load_json(options[:overworld].join("dimensions", "overworld.json"))
underworld_dimension = load_json(options[:underworld].join("dimensions", "underworld.json"))
dimension_fields = %w[dimensionHeight logicalHeight fluidHeight regions regionStyle regionZoom continentalStyle continentZoom coordFractureZoom dimensionAngleDeg landChance landBiomeStyle seaBiomeStyle shoreBiomeStyle caveBiomeStyle carvingEnabled carving upperDimension upperDimensionGap upperDimensionCarving]
dimension_fields.each do |field|
  check_geometry(errors, "dimension/#{field}", overworld_dimension[field], underworld_dimension[field])
end
%w[caveProfile riverPolicy hydrology].each do |field|
  ignored = case field
            when "caveProfile" then %w[allowFluid]
            when "riverPolicy" then %w[profiles]
            else %w[deepFluids fluidPalette id]
            end
  check_geometry(errors, "dimension/#{field}", geometry_without(overworld_dimension[field], ignored), geometry_without(underworld_dimension[field], ignored))
end

region_fields = %w[rarity biomeStyle landBiomeZoom seaBiomeZoom shoreBiomeZoom caveBiomeZoom landBiomes seaBiomes shoreBiomes caveBiomes shoreHeightMin shoreHeightMax shoreHeightZoom]
Array(overworld_dimension["regions"]).each do |key|
  left = load_json(options[:overworld].join("regions", "#{key}.json"))
  right = load_json(options[:underworld].join("regions", "#{key}.json"))
  region_fields.each { |field| check_geometry(errors, "regions/#{key}/#{field}", left[field], right[field]) }
  check_geometry(errors, "regions/#{key}/caveProfile", geometry_without(left["caveProfile"], %w[allowFluid]), geometry_without(right["caveProfile"], %w[allowFluid]))
  check_geometry(errors, "regions/#{key}/riverPolicy", geometry_without(left["riverPolicy"], %w[profiles]), geometry_without(right["riverPolicy"], %w[profiles]))
end

biome_fields = %w[generators children childShrinkFactor childStyle biomeStyle rarity caveMinDepthBelowSurface mergeFloatingChildBiomes terrain3D]
floating_material_fields = %w[bottomPalette bottomPaletteMode topObjectOverrides bottomObjectOverrides inheritObjects inheritDecorators objectShrinkFactor topObjectMode bottomObjectMode]
(overworld.reachable & underworld.reachable).each do |key|
  left = overworld.biomes.fetch(key)
  right = underworld.biomes.fetch(key)
  biome_fields.each { |field| check_geometry(errors, "biomes/#{key}/#{field}", left[field], right[field]) }
  check_geometry(errors, "biomes/#{key}/floatingChildBiomes", geometry_without(left["floatingChildBiomes"], floating_material_fields), geometry_without(right["floatingChildBiomes"], floating_material_fields))
  check_geometry(errors, "biomes/#{key}/caveProfile", geometry_without(left["caveProfile"], %w[allowFluid]), geometry_without(right["caveProfile"], %w[allowFluid]))
  check_geometry(errors, "biomes/#{key}/riverPolicy", geometry_without(left["riverPolicy"], %w[profiles]), geometry_without(right["riverPolicy"], %w[profiles]))
  Array(left["generators"]).each do |link|
    generator_key = link.fetch("generator")
    check_geometry(errors, "generators/#{generator_key}", load_json(options[:overworld].join("generators", "#{generator_key}.json")), load_json(options[:underworld].join("generators", "#{generator_key}.json")))
  end
end

[overworld, underworld].each do |graph|
  graph.land.each do |key|
    profile = graph.biomes.fetch(key)["terrain3D"]
    errors << "#{graph.name} land biome #{key} must declare terrain3D, including an explicit disabled setting for protected terrain" unless profile.is_a?(Hash) && [true, false].include?(profile["enabled"])
  end
end

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

overworld.reachable.each do |key|
  profile = overworld.biomes.fetch(key)["terrain3D"]
  next unless profile.is_a?(Hash)

  rows = markdown.values.map do |body|
    section = body.split("\n## 3D terrain\n", 2)[1]
    section && section.split("\n## ", 2)[0].lines.find { |line| line.start_with?("| `#{key}` |") }
  end.compact
  errors << "Biome #{key} has terrain3D settings without a paired atlas terrain row" if rows.empty?
  expected = if profile["enabled"]
               crack = profile.fetch("crackDepth").zero? ? "None" : %w[crackDepth crackWidth crackScale].map { |field| format("%g", profile.fetch(field)) }.join(" / ")
               [
                 format("%g", profile.fetch("amplitude")),
                 %w[horizontalScale verticalScale].map { |field| format("%g", profile.fetch(field)) }.join(" / "),
                 crack,
                 [profile.fetch("minimumSlope"), profile.fetch("minimumSlope") + profile.fetch("slopeFade")].map { |value| format("%g", value) }.join(" / ")
               ]
             else
               ["0", "None", "None", "None"]
             end
  rows.each do |row|
    errors << "Biome #{key} has stale terrain3D numbers in the paired atlas" unless row.split("|").map(&:strip)[3, 4] == expected
  end
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
profiles = overworld.reachable.map { |key| overworld.biomes.fetch(key)["terrain3D"] }.compact
puts("Paired terrain geometry valid: #{profiles.count { |profile| profile["enabled"] }} active profiles, #{profiles.count { |profile| !profile["enabled"] }} protected profiles")
