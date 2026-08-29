(async function () {
  const params = new URLSearchParams(window.location.search);
  const name = (params.get("name") || "").trim();
  const sex = (params.get("sex") || "").trim();
  const nameEl = document.getElementById("searchName");
  const sexEl = document.getElementById("searchSex");
  const status = document.getElementById("membersStatus");
  const grid = document.getElementById("membersGrid");

  nameEl.textContent = name || "-";
  if (sex) {
    sexEl.textContent = sex;
    sexEl.style.display = "inline-block";
  }
  if (!name) {
    status.textContent = "Type a name in the header search.";
    return;
  }

  try {
    const url = new URL("/api/members", window.location.origin);
    url.searchParams.set("name", name);
    if (sex) url.searchParams.set("sex", sex);
    const res = await fetch(url);
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || `Search failed (HTTP ${res.status})`);
    const members = Array.isArray(data.members) ? data.members : [];
    if (!members.length) {
      status.textContent = "No members found.";
      return;
    }
    status.textContent = "";
    grid.innerHTML = members
      .map(
        (m) => `
      <div class="cardItem">
        ${m.imageURL ? `<img class="img" src="${esc(m.imageURL)}" alt="${esc(m.name || "member")}">` : ""}
        <div class="name">${esc(m.name || "")}</div>
        ${m.age != null ? `<div class="meta">Age: ${esc(m.age)}</div>` : ""}
        ${m.sex ? `<div class="meta">Sex: ${esc(m.sex)}</div>` : ""}
        ${m.crime ? `<div class="meta">Crime: ${esc(m.crime)}</div>` : ""}
        ${m.status ? `<div class="meta">Status: ${esc(m.status)}</div>` : ""}
      </div>`,
      )
      .join("");
  } catch (err) {
    status.textContent = err.message || "Server error";
  }

  function esc(v) {
    return String(v).replace(
      /[&<>'"]/g,
      (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", "'": "&#39;", '"': "&quot;" })[c],
    );
  }
})();
