(function () {
  const body = document.body;
  const navToggle = document.querySelector(".nav-toggle");
  const navLinks = Array.from(document.querySelectorAll(".side-nav a"));
  const sections = Array.from(document.querySelectorAll(".doc-section"));
  const searchInput = document.querySelector("#globalSearch");
  const searchShell = document.querySelector(".search");
  const noResults = document.querySelector(".no-results");
  const copyStatus = document.querySelector("#copyStatus");
  const navGroups = Array.from(document.querySelectorAll(".nav-section"));
  const currentPage = location.pathname.split("/").pop() || "index.html";

  const siteSearchIndex = [
    {
      title: "Главная",
      section: "approach",
      url: "index.html",
      text: "дизайн-система продуктов ИДМ-ПЛЮС бренд визуальный язык типографика палитра материалы для коммуникаций"
    },
    {
      title: "Визуальный язык",
      section: "Дизайнеру",
      url: "visual-language.html",
      text: "визуальный язык ИДМ-ПЛЮС принципы композиция рабочее поле голубой акцент технологичность"
    },
    {
      title: "Типографика",
      section: "Дизайнеру",
      url: "typography.html",
      text: "типографика ИДМ-ПЛЮС Montserrat Roboto Roboto Condensed иерархия правила набора текст"
    },
    {
      title: "Палитра",
      section: "Дизайнеру",
      url: "colors.html",
      text: "палитра ИДМ-ПЛЮС цвета #00BFF3 #9BA2A7 #FFFFFF cyan gray white"
    },
    {
      title: "Бренд",
      section: "Менеджеру",
      url: "brand.html",
      text: "бренд ИДМ-ПЛЮС электронный брендбук позиционирование тон коммуникации логотип материалы"
    },
    {
      title: "Скачать логотипы",
      section: "Менеджеру",
      url: "logos.html",
      text: "логотипы ИДМ-ПЛЮС скачать SVG PNG PDF бренд материалы правила"
    },
    {
      title: "Скачать иконки",
      section: "Менеджеру",
      url: "download-icons.html",
      text: "иконки ИДМ-ПЛЮС скачать SVG PNG интерфейс презентации схемы документы"
    },
    {
      title: "Обновления",
      section: "История",
      url: "changelog.html",
      text: "обновления история версий approach новые материалы дизайн-система ИДМ-ПЛЮС"
    }
  ];

  if (navToggle) {
    navToggle.addEventListener("click", () => {
      const isOpen = body.classList.toggle("nav-open");
      body.classList.remove("search-open");
      navToggle.setAttribute("aria-expanded", String(isOpen));
      navToggle.setAttribute("aria-label", isOpen ? "Закрыть меню" : "Открыть меню");
    });
  }

  if (searchShell && searchInput) {
    const searchResults = document.createElement("div");
    searchResults.className = "search-results";
    searchResults.hidden = true;
    searchResults.setAttribute("role", "listbox");
    searchResults.setAttribute("aria-label", "Результаты поиска");
    searchShell.insertAdjacentElement("afterend", searchResults);

    const normalize = (value) => value.toLowerCase().replace(/ё/g, "е").trim();

    const closeSearchResults = () => {
      searchResults.hidden = true;
      searchResults.innerHTML = "";
    };

    const renderSearchResults = () => {
      const query = normalize(searchInput.value);
      const tokens = query.split(/\s+/).filter(Boolean);

      if (!tokens.length) {
        closeSearchResults();
        return;
      }

      const matches = siteSearchIndex
        .map((item) => {
          const haystack = normalize(`${item.title} ${item.section} ${item.text}`);
          const score = tokens.reduce((sum, token) => sum + (haystack.includes(token) ? 1 : 0), 0);
          return { ...item, score };
        })
        .filter((item) => item.score > 0)
        .sort((a, b) => b.score - a.score || a.title.localeCompare(b.title, "ru"))
        .slice(0, 6);

      searchResults.innerHTML = matches.length
        ? matches
            .map(
              (item) => `
                <a class="search-result" href="${item.url}" role="option">
                  <span>${item.section}</span>
                  <strong>${item.title}</strong>
                </a>
              `
            )
            .join("")
        : `<div class="search-result empty"><span>Ничего не найдено</span><strong>Попробуйте другой запрос</strong></div>`;

      searchResults.hidden = false;
    };

    searchShell.addEventListener("click", () => {
      if (window.matchMedia("(max-width: 920px)").matches) {
        body.classList.add("search-open");
      }
      searchInput.focus();
      renderSearchResults();
    });

    searchInput.addEventListener("focus", () => {
      if (window.matchMedia("(max-width: 920px)").matches) {
        body.classList.add("search-open");
      }
      renderSearchResults();
    });

    searchInput.addEventListener("blur", () => {
      if (!searchInput.value.trim()) {
        window.setTimeout(() => body.classList.remove("search-open"), 120);
      }
    });

    searchInput.addEventListener("input", renderSearchResults);

    searchInput.addEventListener("keydown", (event) => {
      if (event.key === "Enter") {
        const firstResult = searchResults.querySelector("a");
        if (firstResult) {
          window.location.href = firstResult.getAttribute("href");
        }
      }

      if (event.key === "Escape") {
        closeSearchResults();
      }
    });

    document.addEventListener("click", (event) => {
      if (event.target.closest(".search") || event.target.closest(".search-results")) return;
      closeSearchResults();
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

    trigger.setAttribute("aria-expanded", String(group.open));
    trigger.addEventListener("click", () => {
      setTimeout(() => {
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
})();
