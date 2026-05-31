(function () {
  const body = document.body;
  const navToggle = document.querySelector(".nav-toggle");
  const navLinks = Array.from(document.querySelectorAll(".side-nav a"));
  const sections = Array.from(document.querySelectorAll(".doc-section"));
  const searchInput = document.querySelector("#globalSearch");
  const searchShell = document.querySelector(".search");
  const noResults = document.querySelector(".no-results");
  const copyStatus = document.querySelector("#copyStatus");
  const sizeControl = document.querySelector("#sizeControl");
  const disabledControl = document.querySelector("#disabledControl");
  const loadingControl = document.querySelector("#loadingControl");
  const componentPreview = document.querySelector("#componentPreview");
  const navGroups = Array.from(document.querySelectorAll(".nav-section"));
  const currentPage = location.pathname.split("/").pop() || "index.html";

  if (navToggle) {
    navToggle.addEventListener("click", () => {
      const isOpen = body.classList.toggle("nav-open");
      body.classList.remove("search-open");
      navToggle.setAttribute("aria-expanded", String(isOpen));
      navToggle.setAttribute("aria-label", isOpen ? "Закрыть меню" : "Открыть меню");
    });
  }

  if (searchShell && searchInput) {
    searchShell.addEventListener("click", () => {
      if (window.matchMedia("(max-width: 920px)").matches) {
        body.classList.add("search-open");
      }
      searchInput.focus();
    });

    searchInput.addEventListener("focus", () => {
      if (window.matchMedia("(max-width: 920px)").matches) {
        body.classList.add("search-open");
      }
    });

    searchInput.addEventListener("blur", () => {
      if (!searchInput.value.trim()) {
        window.setTimeout(() => body.classList.remove("search-open"), 120);
      }
    });
  }

  document.addEventListener("click", (event) => {
    if (!body.classList.contains("nav-open")) return;
    if (!window.matchMedia("(max-width: 920px)").matches) return;
    if (event.target.closest(".sidebar") || event.target.closest(".nav-toggle")) return;

    body.classList.remove("nav-open");
    if (navToggle) {
      navToggle.setAttribute("aria-expanded", "false");
      navToggle.setAttribute("aria-label", "Открыть меню");
    }
  });

  document.addEventListener("keydown", (event) => {
    if (event.key !== "Escape") return;
    body.classList.remove("nav-open", "search-open");
    if (navToggle) {
      navToggle.setAttribute("aria-expanded", "false");
      navToggle.setAttribute("aria-label", "Открыть меню");
    }
    if (searchInput) searchInput.blur();
  });

  navLinks.forEach((link) => {
    const hrefPage = link.getAttribute("href");
    if (hrefPage === currentPage) {
      link.classList.add("active");
      const parentGroup = link.closest(".nav-section");
      if (parentGroup && currentPage !== "index.html") {
        navGroups.forEach((group) => {
          group.open = group === parentGroup;
          group.classList.toggle("is-current", group === parentGroup);
        });
      }
    }

    link.addEventListener("click", () => {
      body.classList.remove("nav-open");
      if (navToggle) navToggle.setAttribute("aria-expanded", "false");
    });
  });

  navGroups.forEach((group) => {
    const trigger = group.querySelector(".nav-section-trigger");
    if (!trigger) return;

    trigger.addEventListener("click", () => {
      setTimeout(() => {
        navGroups.forEach((otherGroup) => {
          if (otherGroup !== group) otherGroup.open = false;
        });
        trigger.setAttribute("aria-expanded", String(group.open));
      }, 0);
    });
  });

  if (sections.length && navLinks.length) {
    const sectionNavLinks = navLinks.filter((link) => link.dataset.section);
    if (sectionNavLinks.length) {
      const observer = new IntersectionObserver(
        (entries) => {
          const visible = entries
            .filter((entry) => entry.isIntersecting)
            .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

          if (visible) {
            sectionNavLinks.forEach((link) => link.classList.toggle("active", link.dataset.section === visible.target.id));
          }
        },
        { rootMargin: "-20% 0px -65% 0px", threshold: [0.1, 0.3, 0.6] }
      );

      sections.forEach((section) => observer.observe(section));
    }
  }

  if (searchInput && noResults && sections.length) {
    searchInput.addEventListener("input", () => {
      const query = searchInput.value.trim().toLowerCase();
      let matches = 0;

      sections.forEach((section) => {
        const haystack = `${section.dataset.title || ""} ${section.textContent}`.toLowerCase();
        const isMatch = !query || haystack.includes(query);
        section.classList.toggle("is-hidden-by-search", !isMatch);
        if (isMatch) matches += 1;
      });

      noResults.hidden = matches > 0;
    });
  }

  document.querySelectorAll(".swatch").forEach((swatch) => {
    swatch.addEventListener("click", async () => {
      const value = swatch.dataset.copy;

      try {
        await navigator.clipboard.writeText(value);
        if (copyStatus) copyStatus.textContent = `${value} скопирован.`;
      } catch (error) {
        if (copyStatus) copyStatus.textContent = `Цвет: ${value}`;
      }
    });
  });

  function updateComponentDemo() {
    if (!componentPreview || !sizeControl || !disabledControl || !loadingControl) return;

    const buttons = componentPreview.querySelectorAll(".demo-button");
    componentPreview.classList.remove("size-small", "size-medium", "size-large");
    componentPreview.classList.add(`size-${sizeControl.value}`);

    buttons.forEach((button) => {
      if (!button.dataset.label) {
        button.dataset.label = button.textContent;
      }

      button.disabled = disabledControl.checked;
      button.classList.toggle("loading", loadingControl.checked);
      button.textContent = loadingControl.checked ? "Загрузка" : button.dataset.label;
    });
  }

  [sizeControl, disabledControl, loadingControl].forEach((control) => {
    if (control) control.addEventListener("change", updateComponentDemo);
  });

  updateComponentDemo();
})();
