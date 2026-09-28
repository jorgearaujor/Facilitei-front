(() => {
  let savedTheme = null;
  try {
    savedTheme = localStorage.getItem("facilitei-theme");
  } catch {
    // O tema do sistema continua disponível quando o armazenamento é bloqueado.
  }

  const theme = savedTheme === "light" || savedTheme === "dark"
    ? savedTheme
    : window.matchMedia("(prefers-color-scheme: light)").matches
      ? "light"
      : "dark";

  document.documentElement.dataset.theme = theme;
  document.querySelector('meta[name="theme-color"]')?.setAttribute(
    "content",
    theme === "light" ? "#F7F4EC" : "#0D1D1A",
  );
})();
