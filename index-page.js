(() => {
  const links = Array.from(document.querySelectorAll(".section-nav a[href^='#']"));
  const sections = links
    .map((link) => document.querySelector(link.getAttribute("href")))
    .filter(Boolean);

  if (sections.length === 0) {
    return;
  }

  const linksById = new Map(
    links.map((link) => [link.getAttribute("href").slice(1), link])
  );

  const setCurrent = (id) => {
    links.forEach((link) => link.removeAttribute("aria-current"));
    const current = linksById.get(id);
    if (current) {
      current.setAttribute("aria-current", "location");
    }
  };

  let updatePending = false;

  const updateCurrentSection = () => {
    const anchorLine = 200;
    const current = sections.reduce((active, section) => {
      return section.getBoundingClientRect().top <= anchorLine ? section : active;
    }, sections[0]);

    setCurrent(current.id);
    updatePending = false;
  };

  links.forEach((link) => {
    link.addEventListener("click", () => {
      setCurrent(link.getAttribute("href").slice(1));
    });
  });

  window.addEventListener(
    "scroll",
    () => {
      if (!updatePending) {
        updatePending = true;
        window.requestAnimationFrame(updateCurrentSection);
      }
    },
    { passive: true }
  );

  updateCurrentSection();
})();
