(function () {
  const body = document.body;
  const searchToggle = document.querySelector(".search-toggle");
  const searchPanel = document.querySelector(".search-panel");
  const searchClose = document.querySelector(".search-close");
  const searchInput = document.querySelector("#globalSearch");
  const copyStatus = document.querySelector("#copyStatus");

  const siteSearchIndex = [
    {
      title: "Главная",
      section: "approach",
      url: "index.html",
      text: "дизайн-система продуктов ИДМ-ПЛЮС бренд визуальный язык типографика палитра материалы коммуникации"
    },
    {
      title: "Визуальный язык",
      section: "Дизайнеру",
      url: "visual-language.html",
      text: "визуальный язык принципы композиция сетка белое пространство акцент"
    },
    {
      title: "Типографика",
      section: "Дизайнеру",
      url: "typography.html",
      text: "типографика шрифт Montserrat Roboto иерархия правила набора"
    },
    {
      title: "Палитра",
      section: "Дизайнеру",
      url: "colors.html",
      text: "палитра цвета #00BFF3 #9BA2A7 #FFFFFF доступность семантика"
    },
    {
      title: "Бренд",
      section: "Менеджеру",
      url: "brand.html",
      text: "бренд ИДМ-ПЛЮС логотип коммуникации материалы"
    },
    {
      title: "Скачать логотипы",
      section: "Менеджеру",
      url: "logos.html",
      text: "логотипы скачать svg png pdf бренд материалы"
    },
    {
      title: "Скачать иконки",
      section: "Менеджеру",
      url: "download-icons.html",
      text: "иконки скачать svg png интерфейс презентации"
    }
  ];

  function normalize(value) {
    return value.toLowerCase().replace(/ё/g, "е").trim();
  }

  function ensureSearchResults() {
    if (!searchPanel || !searchInput) return null;
    let results = searchPanel.querySelector(".search-results");
    if (!results) {
      results = document.createElement("div");
      results.className = "search-results";
      results.hidden = true;
      results.setAttribute("role", "listbox");
      results.setAttribute("aria-label", "Результаты поиска");
      searchInput.insertAdjacentElement("afterend", results);
    }
    return results;
  }

  const searchResults = ensureSearchResults();

  function openSearch() {
    if (!searchPanel || !searchInput) return;
    body.classList.add("search-open", "no-scroll");
    searchPanel.setAttribute("aria-hidden", "false");
    window.setTimeout(() => searchInput.focus(), 30);
  }

  function closeSearch() {
    if (!searchPanel) return;
    body.classList.remove("search-open", "no-scroll");
    searchPanel.setAttribute("aria-hidden", "true");
    if (searchResults) {
      searchResults.hidden = true;
      searchResults.innerHTML = "";
    }
    if (searchInput) searchInput.value = "";
  }

  function renderSearchResults() {
    if (!searchInput || !searchResults) return;
    const tokens = normalize(searchInput.value).split(/\s+/).filter(Boolean);

    if (!tokens.length) {
      searchResults.hidden = true;
      searchResults.innerHTML = "";
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
  }

  if (searchToggle) searchToggle.addEventListener("click", openSearch);
  if (searchClose) searchClose.addEventListener("click", closeSearch);
  if (searchInput) {
    searchInput.addEventListener("input", renderSearchResults);
    searchInput.addEventListener("keydown", (event) => {
      if (event.key === "Enter" && searchResults) {
        const firstResult = searchResults.querySelector("a");
        if (firstResult) window.location.href = firstResult.getAttribute("href");
      }
      if (event.key === "Escape") closeSearch();
    });
  }

  document.addEventListener("keydown", (event) => {
    if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "k") {
      event.preventDefault();
      openSearch();
      return;
    }
    if (event.key === "Escape") closeSearch();
  });

  if (searchPanel) {
    searchPanel.addEventListener("click", (event) => {
      if (event.target === searchPanel) closeSearch();
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

  document.querySelectorAll("[data-copy]").forEach((item) => {
    item.addEventListener("click", async () => {
      const value = item.dataset.copy;
      if (!value) return;
      try {
        await navigator.clipboard.writeText(value);
        item.setAttribute("aria-label", `${value} скопирован`);
        item.classList.add("is-copied");
        window.setTimeout(() => item.classList.remove("is-copied"), 1400);
      } catch (error) {
        item.setAttribute("aria-label", value);
        item.classList.add("is-copied");
        window.setTimeout(() => item.classList.remove("is-copied"), 1400);
      }
    });
  });

  document.querySelectorAll(".tabs-line").forEach((tabs) => {
    tabs.addEventListener("click", (event) => {
      const button = event.target.closest("button");
      if (!button) return;

      tabs.querySelectorAll("button").forEach((item) => item.classList.remove("active"));
      button.classList.add("active");

      const logoFilter = button.dataset.filter;
      if (logoFilter) {
        document.querySelectorAll(".logo-card[data-variant]").forEach((card) => {
          card.hidden = logoFilter !== "all" && card.dataset.variant !== logoFilter;
        });
      }

      const iconFilter = button.dataset.iconFilter;
      if (iconFilter) {
        document.querySelectorAll(".icon-catalog [data-category]").forEach((icon) => {
          icon.hidden = iconFilter !== "all" && icon.dataset.category !== iconFilter;
        });
      }
    });
  });
})();
