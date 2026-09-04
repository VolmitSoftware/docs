(() => {
  const storageKey = "volmit-project-sidebar-collapsed";
  const themeStorageKey = "volmit-color-mode";
  const excludedPaths = new Set(["", "home", "a", "login"]);
  const projects = [
    { name: "Iris", path: "iris", icon: "/home-assets/iris.png", group: "Plugins" },
    { name: "Adapt", path: "adapt", icon: "/home-assets/adapt.png", group: "Plugins" },
    { name: "React", path: "react", icon: "/home-assets/react.png", group: "Plugins" },
    { name: "Wormholes", path: "wormholes", icon: "/home-assets/wormholes.png", group: "Plugins" },
    { name: "Gloss", path: "gloss", icon: "/home-assets/gloss.png", group: "Plugins" },
    { name: "Foundation", path: "foundation", mark: "F", group: "Plugins" },
    { name: "HiddenOre", path: "hiddenore", icon: "/home-assets/hiddenore.jpg", group: "Plugins" },
    { name: "Rift World Manager", path: "rift", icon: "/home-assets/riftworldmanager.jpg", group: "Plugins" },
    { name: "Shaped Portals", path: "shapedportals", icon: "/home-assets/shapedportals.jpg", group: "Plugins" },
    { name: "BileTools", path: "biletools", icon: "/home-assets/biletools.png", group: "Tools" },
    { name: "VolmLib", path: "volmlib", icon: "/home-assets/volmit.png", group: "Tools" }
  ];

  function currentPath() {
    return window.location.pathname.split("/").filter(Boolean)[0] ?? "";
  }

  function createIcon(project) {
    const icon = document.createElement("span");
    icon.className = "volmit-project-sidebar__icon";
    icon.setAttribute("aria-hidden", "true");
    if (project.icon) {
      const image = document.createElement("img");
      image.src = project.icon;
      image.alt = "";
      image.width = 28;
      image.height = 28;
      icon.append(image);
    } else {
      icon.textContent = project.mark;
    }
    return icon;
  }

  function setCollapsed(sidebar, toggle, collapsed) {
    sidebar.classList.toggle("is-collapsed", collapsed);
    toggle.setAttribute("aria-expanded", String(!collapsed));
    toggle.setAttribute("aria-label", collapsed ? "Expand project navigation" : "Collapse project navigation");
    toggle.title = collapsed ? "Expand navigation" : "Collapse navigation";
    try {
      window.localStorage.setItem(storageKey, collapsed ? "1" : "0");
    } catch (_) {
    }
  }

  function createSidebar(activePath) {
    const sidebar = document.createElement("aside");
    sidebar.className = "volmit-project-sidebar";
    sidebar.setAttribute("aria-label", "Project navigation");

    const masthead = document.createElement("div");
    masthead.className = "volmit-project-sidebar__masthead";

    const home = document.createElement("a");
    home.className = "volmit-project-sidebar__home";
    home.href = "/";
    home.title = "All documentation";
    home.setAttribute("aria-label", "All documentation");
    const homeMark = document.createElement("img");
    homeMark.className = "volmit-project-sidebar__home-mark";
    homeMark.src = "/logo.png";
    homeMark.alt = "";
    homeMark.width = 28;
    homeMark.height = 28;
    const homeLabel = document.createElement("span");
    homeLabel.className = "volmit-project-sidebar__label";
    homeLabel.textContent = "All documentation";
    home.append(homeMark, homeLabel);

    const toggle = document.createElement("button");
    toggle.className = "volmit-project-sidebar__toggle";
    toggle.type = "button";
    const toggleIcon = document.createElement("span");
    toggleIcon.className = "volmit-project-sidebar__toggle-icon";
    toggleIcon.setAttribute("aria-hidden", "true");
    toggle.append(toggleIcon);
    masthead.append(home, toggle);
    sidebar.append(masthead);

    const navigation = document.createElement("nav");
    navigation.className = "volmit-project-sidebar__nav";
    navigation.setAttribute("aria-label", "Documentation projects");

    for (const group of ["Plugins", "Tools"]) {
      const section = document.createElement("div");
      section.className = "volmit-project-sidebar__group";
      const heading = document.createElement("div");
      heading.className = "volmit-project-sidebar__heading";
      heading.textContent = group;
      section.append(heading);

      for (const project of projects.filter((item) => item.group === group)) {
        const link = document.createElement("a");
        link.className = "volmit-project-sidebar__link";
        link.href = `/${project.path}`;
        link.title = project.name;
        link.dataset.project = project.path;
        if (project.path === activePath) {
          link.classList.add("is-active");
          link.setAttribute("aria-current", "page");
        }
        const label = document.createElement("span");
        label.className = "volmit-project-sidebar__label";
        label.textContent = project.name;
        link.append(createIcon(project), label);
        section.append(link);
      }
      navigation.append(section);
    }

    sidebar.append(navigation);
    let collapsed = false;
    try {
      collapsed = window.localStorage.getItem(storageKey) === "1";
    } catch (_) {
    }
    setCollapsed(sidebar, toggle, collapsed);
    toggle.addEventListener("click", () => setCollapsed(sidebar, toggle, !sidebar.classList.contains("is-collapsed")));
    return sidebar;
  }

  function mountHomeLink() {
    const lockup = document.querySelector(".nav-header-inner .v-toolbar__content");
    if (!lockup || lockup.dataset.volmitHomeLink === "true") {
      return;
    }
    lockup.dataset.volmitHomeLink = "true";
    lockup.classList.add("volmit-home-link");
    lockup.setAttribute("role", "link");
    lockup.setAttribute("tabindex", "0");
    lockup.setAttribute("aria-label", "VolmitSoftware documentation home");
    lockup.addEventListener("click", () => {
      window.location.assign("/");
    });
    lockup.addEventListener("keydown", (event) => {
      if (event.key !== "Enter" && event.key !== " ") {
        return;
      }
      event.preventDefault();
      window.location.assign("/");
    });
  }

  function syncVuetifyTheme(light) {
    if (light) {
      for (const element of document.querySelectorAll(".theme--dark")) {
        element.classList.remove("theme--dark");
        element.classList.add("theme--light");
        element.dataset.volmitThemeConverted = "true";
      }
      return;
    }
    for (const element of document.querySelectorAll('[data-volmit-theme-converted="true"]')) {
      element.classList.remove("theme--light");
      element.classList.add("theme--dark");
      delete element.dataset.volmitThemeConverted;
    }
  }

  function setColorMode(app, button, mode) {
    const light = mode === "light";
    app.classList.toggle("volmit-light-mode", light);
    syncVuetifyTheme(light);
    button.setAttribute("aria-pressed", String(light));
    button.setAttribute("aria-label", light ? "Use midnight theme" : "Use light theme");
    button.title = light ? "Use midnight theme" : "Use light theme";
    const icon = button.querySelector(".v-icon");
    icon?.classList.toggle("mdi-weather-night", light);
    icon?.classList.toggle("mdi-white-balance-sunny", !light);
    try {
      window.localStorage.setItem(themeStorageKey, light ? "light" : "midnight");
    } catch (_) {
    }
  }

  function mountThemeToggle() {
    const app = document.querySelector(".v-application");
    const toolbar = document.querySelector(".nav-header > .v-toolbar__content > .layout.row > .flex:last-child .v-toolbar__content");
    if (!app || !toolbar) {
      return;
    }
    const existing = toolbar.querySelector(".volmit-theme-toggle");
    if (existing) {
      syncVuetifyTheme(app.classList.contains("volmit-light-mode"));
      return;
    }
    const button = document.createElement("button");
    button.className = "volmit-theme-toggle";
    button.type = "button";
    const icon = document.createElement("i");
    icon.className = "v-icon notranslate mdi theme--dark";
    icon.setAttribute("aria-hidden", "true");
    button.append(icon);
    const anchor = toolbar.querySelector("a:last-of-type");
    toolbar.insertBefore(button, anchor ?? null);
    let mode = "midnight";
    try {
      mode = window.localStorage.getItem(themeStorageKey) === "light" ? "light" : "midnight";
    } catch (_) {
    }
    setColorMode(app, button, mode);
    button.addEventListener("click", () => {
      setColorMode(app, button, app.classList.contains("volmit-light-mode") ? "midnight" : "light");
    });
  }

  function mount() {
    mountHomeLink();
    mountThemeToggle();
    const activePath = currentPath();
    const existing = document.querySelector(".volmit-project-sidebar");
    const main = document.querySelector(".v-main");
    const content = main?.querySelector(".contents");
    const isHome = Boolean(content?.querySelector('img[src="/home-assets/volmit.png"][alt="Volmit Software"]'));
    if (!main || !content || isHome || excludedPaths.has(activePath)) {
      existing?.remove();
      return;
    }
    if (existing?.dataset.activePath === activePath) {
      return;
    }
    existing?.remove();
    const sidebar = createSidebar(activePath);
    sidebar.dataset.activePath = activePath;
    main.prepend(sidebar);
  }

  let scheduled = false;
  function scheduleMount() {
    if (scheduled) {
      return;
    }
    scheduled = true;
    window.requestAnimationFrame(() => {
      scheduled = false;
      mount();
    });
  }

  new MutationObserver(scheduleMount).observe(document.documentElement, { childList: true, subtree: true });
  window.addEventListener("popstate", scheduleMount);
  window.addEventListener("hashchange", scheduleMount);
  scheduleMount();
})();
