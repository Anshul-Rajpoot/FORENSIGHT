(function () {
  const imageUrl = sessionStorage.getItem("generatedImageUrl");
  const gender = sessionStorage.getItem("generatedGender") || "Any";
  const img = document.getElementById("generatedImage");
  const noImage = document.getElementById("noGenerated");
  const searchBtn = document.getElementById("searchBtn");
  const grid = document.getElementById("resultsGrid");
  const status = document.getElementById("resultsStatus");

  if (imageUrl) {
    img.src = imageUrl;
    img.style.display = "block";
    noImage.style.display = "none";
    runSearch();
  }

  searchBtn.addEventListener("click", runSearch);

  async function runSearch() {
    if (!imageUrl) {
      status.textContent = "Generate an image to search.";
      return;
    }
    searchBtn.disabled = true;
    searchBtn.textContent = "Searching...";
    status.textContent = "Searching...";
    grid.innerHTML = "";
    try {
      const file = dataUrlToFile(imageUrl, `generated-${Date.now()}.png`);
      const fd = new FormData();
      fd.append("image", file);
      if (gender && gender !== "Any") fd.append("sex_filter", gender);
      const res = await fetch("/api/upload", { method: "POST", body: fd });
      const data = await res.json();
      if (!res.ok)
        throw new Error(data.error || data.message || `Search failed (HTTP ${res.status})`);
      const matches = (data.matches || []).sort((a, b) => b.score - a.score);
      if (!matches.length) {
        status.textContent = "No matches found.";
        return;
      }
      status.textContent = "";
      grid.innerHTML = matches
        .slice(0, 12)
        .map(
          (m, i) => `
        <div class="${i === 0 ? "resultCardBest" : "resultCard"}">
          ${m.imageURL ? `<div class="imgWrapper"><img class="resultImg" src="${esc(m.imageURL)}" alt="${esc(m.name || "match")}"></div>` : ""}
          <p class="matchLine">Match: ${typeof m.score === "number" ? (m.score * 100).toFixed(1) + "%" : "-"}</p>
          <p class="nameLine">${esc(m.name || "")}</p>
          ${m.age != null ? `<p class="metaLine">Age: ${esc(m.age)}</p>` : ""}
          ${m.sex ? `<p class="metaLine">Sex: ${esc(m.sex)}</p>` : ""}
          ${m.crime ? `<p class="metaLine">Crime: ${esc(m.crime)}</p>` : ""}
          ${m.status ? `<p class="metaLine">Status: ${esc(m.status)}</p>` : ""}
        </div>`,
        )
        .join("");
    } catch (err) {
      status.textContent = err.message || "Server error";
    } finally {
      searchBtn.disabled = false;
      searchBtn.textContent = "Search";
    }
  }

  function dataUrlToFile(dataUrl, filename) {
    const [meta, b64] = dataUrl.split(",");
    const mime = meta.match(/data:(.*);base64/)?.[1] || "image/png";
    const bin = atob(b64);
    const buf = new Uint8Array(bin.length);
    for (let i = 0; i < bin.length; i++) buf[i] = bin.charCodeAt(i);
    return new File([new Blob([buf], { type: mime })], filename, { type: mime });
  }
  function esc(v) {
    return String(v).replace(
      /[&<>'"]/g,
      (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", "'": "&#39;", '"': "&quot;" })[c],
    );
  }
})();
