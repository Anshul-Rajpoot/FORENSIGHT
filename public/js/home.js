(async function () {
  const frame = document.getElementById("criminalFrame");
  const dots = document.getElementById("criminalDots");
  let criminals = [];
  let activeIndex = 0;

  try {
    const res = await fetch("/api/latest-criminals?limit=10&random=true");
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || "Failed to load");
    criminals = (data.criminals || []).filter((c) => c && c.imageURL);
  } catch (err) {
    frame.innerHTML = `<div class="placeholder">${escapeHtml(err.message || "Backend not reachable")}</div>`;
    return;
  }

  if (!criminals.length) {
    frame.innerHTML = '<div class="placeholder">No data available</div>';
    return;
  }

  function render() {
    const active = criminals[activeIndex];
    frame.innerHTML = `
      <img src="${escapeAttr(active.imageURL)}" alt="${escapeAttr(active.name || "criminal")}" class="imgIn" />
      <div class="overlay"><div class="name">${escapeHtml(active.name || "Unknown")}</div>
      <div class="meta">${active.sex ? "• " + escapeHtml(active.sex) : ""}${active.crime ? " • " + escapeHtml(active.crime) : ""}</div></div>`;
    dots.innerHTML = criminals
      .slice(0, 8)
      .map((_, i) => `<span class="${i === activeIndex ? "dotActive" : "dot"}"></span>`)
      .join("");
  }

  render();
  setInterval(() => {
    const img = frame.querySelector("img");
    if (img) img.className = "imgOut";
    setTimeout(() => {
      activeIndex = (activeIndex + 1) % criminals.length;
      render();
    }, 200);
  }, 3000);

  function escapeHtml(v) {
    return String(v).replace(
      /[&<>'"]/g,
      (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", "'": "&#39;", '"': "&quot;" })[c],
    );
  }
  function escapeAttr(v) {
    return escapeHtml(v);
  }
})();
