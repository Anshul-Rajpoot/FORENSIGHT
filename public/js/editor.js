(function () {
  const CANVAS_W = 350,
    CANVAS_H = 440;
  const canvas = document.getElementById("faceCanvas");
  const ctx = canvas.getContext("2d");
  const elements = [];
  let selectedId = null;
  let drag = null;
  let resize = null;
  let toastId = 0;

  const LAYER_PRIORITY = {
    face: 0,
    hair: 1,
    "left ear": 2,
    "right ear": 2,
    eyebrows: 3,
    eyes: 4,
    nose: 5,
    moustache: 6,
    lips: 7,
    beard: 8,
  };
  const ASSET_CATALOGUE = [
    { folder: "face", count: 10, label: "Face", type: "face" },
    { folder: "eyes", count: 12, label: "Eyes", type: "eyes" },
    { folder: "eyebrows", count: 12, label: "Eyebrows", type: "eyebrows" },
    { folder: "nose", count: 12, label: "Nose", type: "nose" },
    { folder: "lips", count: 12, label: "Lips", type: "lips" },
    { folder: "hair", count: 12, label: "Hair", type: "hair" },
    { folder: "moustache", count: 6, label: "Moustache", type: "moustache" },
    { folder: "beard", count: 12, label: "Beard", type: "beard" },
    { folder: "left_ears", count: 4, label: "Left Ear", type: "left ear" },
    { folder: "right_ears", count: 4, label: "Right Ear", type: "right ear" },
  ];
  const typeByFolder = Object.fromEntries(ASSET_CATALOGUE.map((x) => [x.folder, x.type]));

  class CanvasElement {
    constructor(img, type) {
      this.img = img;
      this.type = type;
      this.x = CANVAS_W / 2 - img.width / 4;
      this.y = CANVAS_H / 2 - img.height / 4;
      this.width = img.width * 0.5;
      this.height = img.height * 0.5;
      this.rotation = 0;
      this.id = Date.now() + Math.random();
    }
    isInside(x, y) {
      return x > this.x && x < this.x + this.width && y > this.y && y < this.y + this.height;
    }
    handles() {
      const { x, y, width: w, height: h } = this;
      return [
        [x, y, "nw", "nw-resize"],
        [x + w / 2, y, "n", "n-resize"],
        [x + w, y, "ne", "ne-resize"],
        [x + w, y + h / 2, "e", "e-resize"],
        [x + w, y + h, "se", "se-resize"],
        [x + w / 2, y + h, "s", "s-resize"],
        [x, y + h, "sw", "sw-resize"],
        [x, y + h / 2, "w", "w-resize"],
      ].map(([x, y, type, cursor]) => ({ x, y, type, cursor }));
    }
    hitHandle(mx, my) {
      return (
        this.handles().find((h) => mx > h.x - 6 && mx < h.x + 6 && my > h.y - 6 && my < h.y + 6) ||
        null
      );
    }
    resizeWith(handle, dx, dy) {
      const sw = resize.startW,
        sh = resize.startH,
        sx = resize.startX,
        sy = resize.startY,
        min = 20;
      switch (handle) {
        case "se":
          this.width = Math.max(min, sw + dx);
          this.height = Math.max(min, sh + dy);
          break;
        case "nw":
          this.width = Math.max(min, sw - dx);
          this.height = Math.max(min, sh - dy);
          this.x = sx + dx;
          this.y = sy + dy;
          break;
        case "ne":
          this.width = Math.max(min, sw + dx);
          this.height = Math.max(min, sh - dy);
          this.y = sy + dy;
          break;
        case "sw":
          this.width = Math.max(min, sw - dx);
          this.height = Math.max(min, sh + dy);
          this.x = sx + dx;
          break;
        case "n":
          this.height = Math.max(min, sh - dy);
          this.y = sy + dy;
          break;
        case "s":
          this.height = Math.max(min, sh + dy);
          break;
        case "e":
          this.width = Math.max(min, sw + dx);
          break;
        case "w":
          this.width = Math.max(min, sw - dx);
          this.x = sx + dx;
          break;
      }
    }
    draw(selected) {
      ctx.save();
      ctx.translate(this.x + this.width / 2, this.y + this.height / 2);
      ctx.rotate(this.rotation);
      ctx.drawImage(this.img, -this.width / 2, -this.height / 2, this.width, this.height);
      ctx.restore();
      if (selected) {
        ctx.save();
        ctx.strokeStyle = "#6c63ff";
        ctx.lineWidth = 2;
        ctx.setLineDash([5, 5]);
        ctx.strokeRect(this.x, this.y, this.width, this.height);
        ctx.restore();
        this.handles().forEach((h) => {
          ctx.fillStyle = "white";
          ctx.strokeStyle = "#6c63ff";
          ctx.lineWidth = 2;
          ctx.setLineDash([]);
          ctx.beginPath();
          ctx.rect(h.x - 4, h.y - 4, 8, 8);
          ctx.fill();
          ctx.stroke();
        });
      }
    }
  }

  function showToast(message, type = "info") {
    const el = document.createElement("div");
    el.className = "toast-message " + type;
    el.textContent = message;
    el.style.background =
      type === "success" ? "#4caf50" : type === "warning" ? "#ff9800" : "#2196f3";
    document.getElementById("toastContainer").appendChild(el);
    const id = ++toastId;
    setTimeout(() => el.remove(), 2500);
    return id;
  }
  function redraw() {
    ctx.clearRect(0, 0, CANVAS_W, CANVAS_H);
    elements.forEach((e) => e.draw(e.id === selectedId));
    renderLayers();
  }
  function getPos(e) {
    const r = canvas.getBoundingClientRect();
    return {
      x: ((e.clientX - r.left) * canvas.width) / r.width,
      y: ((e.clientY - r.top) * canvas.height) / r.height,
    };
  }
  function smartPosition(el) {
    const face = elements.find((e) => e.type === "face");
    if (!face || el.type === "face") return;
    const fw = face.width,
      fh = face.height,
      fx = face.x,
      fy = face.y,
      cx = fx + fw / 2,
      map = {
        eyebrows: [cx - el.img.width * 0.25, fy + fh * 0.25],
        eyes: [cx - el.img.width * 0.25, fy + fh * 0.35],
        nose: [cx - el.img.width * 0.25, fy + fh * 0.48],
        moustache: [cx - el.img.width * 0.25, fy + fh * 0.6],
        lips: [cx - el.img.width * 0.25, fy + fh * 0.7],
        beard: [cx - el.img.width * 0.35, fy + fh * 0.8],
        hair: [cx - el.img.width * 0.5, fy - el.img.height * 0.35],
        "left ear": [fx - el.img.width * 0.3, fy + fh * 0.4],
        "right ear": [fx + fw - el.img.width * 0.7, fy + fh * 0.4],
      };
    if (map[el.type]) {
      el.x = map[el.type][0];
      el.y = map[el.type][1];
    }
  }

  function addAsset(src) {
    const img = new Image();
    img.onload = () => {
      const folder = src.split("/").slice(-2, -1)[0],
        type = typeByFolder[folder] || "element";
      if (type !== "left ear" && type !== "right ear") {
        for (let i = elements.length - 1; i >= 0; i--)
          if (elements[i].type === type) elements.splice(i, 1);
      }
      const el = new CanvasElement(img, type);
      smartPosition(el);
      const p = LAYER_PRIORITY[type] ?? 100;
      let idx = elements.findIndex((x) => (LAYER_PRIORITY[x.type] ?? 100) > p);
      if (idx < 0) elements.push(el);
      else elements.splice(idx, 0, el);
      selectedId = el.id;
      redraw();
      showToast("Added!", "success");
    };
    img.onerror = () => showToast("Failed to load asset", "warning");
    img.src = src;
  }

  function buildAssets() {
    const root = document.getElementById("assetList");
    ASSET_CATALOGUE.forEach((cat) => {
      const sec = document.createElement("section");
      sec.className = "section";
      sec.innerHTML = `<h4 class="subheading">${cat.label}</h4><div class="grid asset-panel-grid"></div>`;
      const grid = sec.querySelector(".grid");
      for (let i = 1; i <= cat.count; i++) {
        const n = String(i).padStart(2, "0"),
          src = `/assets/${cat.folder}/${n}.png`,
          im = document.createElement("img");
        im.src = src;
        im.alt = cat.label;
        im.className = "assetThumb";
        im.loading = "lazy";
        im.onclick = () => addAsset(src);
        im.onerror = () => im.remove();
        grid.appendChild(im);
      }
      root.appendChild(sec);
    });
  }
  function renderLayers() {
    const list = document.getElementById("layerList"),
      empty = document.getElementById("layerEmpty");
    list.innerHTML = "";
    empty.style.display = elements.length ? "none" : "block";
    [...elements].reverse().forEach((el) => {
      const item = document.createElement("div");
      item.className = "layerItem" + (el.id === selectedId ? " active" : "");
      item.onclick = () => {
        selectedId = el.id;
        redraw();
      };
      const img = document.createElement("img");
      img.src = el.img.src;
      img.className = "preview";
      const span = document.createElement("span");
      span.className = "layerLabel";
      span.textContent = labelFor(el.type);
      item.append(img, span);
      list.appendChild(item);
    });
  }
  function labelFor(type) {
    return (
      {
        face: "Face",
        eyes: "Eyes",
        eyebrows: "Eyebrows",
        nose: "Nose",
        lips: "Lips",
        hair: "Hair",
        beard: "Beard",
        moustache: "Moustache",
        "left ear": "Left Ear",
        "right ear": "Right Ear",
      }[type] || type
    );
  }
  function selected() {
    return elements.find((e) => e.id === selectedId) || null;
  }
  function deleteSelected() {
    if (!selectedId) {
      showToast("No element selected", "warning");
      return;
    }
    const i = elements.findIndex((e) => e.id === selectedId);
    if (i >= 0) elements.splice(i, 1);
    selectedId = null;
    redraw();
    showToast("Element deleted", "success");
  }
  function moveLayer(dir) {
    const i = elements.findIndex((e) => e.id === selectedId);
    if (i < 0) return;
    const j = i + dir;
    if (j < 0 || j >= elements.length) {
      showToast(dir > 0 ? "Already on top" : "Already at bottom", "info");
      return;
    }
    [elements[i], elements[j]] = [elements[j], elements[i]];
    redraw();
    showToast(dir > 0 ? "Layer moved up" : "Layer moved down", "info");
  }
  function download() {
    if (!elements.length) {
      showToast("Add some elements first!", "warning");
      return;
    }
    const a = document.createElement("a");
    a.download = `face-${Date.now()}.png`;
    a.href = canvas.toDataURL("image/png");
    a.click();
    showToast("Image downloaded!", "success");
  }
  function generate() {
    if (!elements.length) {
      showToast("Add some elements first!", "warning");
      return;
    }
    const gender = document.getElementById("gender").value;
    if (!gender) {
      showToast("Please select a gender.", "warning");
      return;
    }
    const url = canvas.toDataURL("image/png");
    sessionStorage.setItem("generatedImageUrl", url);
    sessionStorage.setItem("generatedGender", gender);
    window.location.href = "/results";
  }

  canvas.addEventListener("mousedown", (e) => {
    const p = getPos(e),
      sel = selected();
    if (sel) {
      const h = sel.hitHandle(p.x, p.y);
      if (h) {
        resize = {
          handle: h.type,
          startX: p.x,
          startY: p.y,
          startW: sel.width,
          startH: sel.height,
          startElementX: sel.x,
          startElementY: sel.y,
        };
        canvas.style.cursor = h.cursor;
        return;
      }
    }
    for (let i = elements.length - 1; i >= 0; i--) {
      if (elements[i].isInside(p.x, p.y)) {
        selectedId = elements[i].id;
        drag = { offsetX: p.x - elements[i].x, offsetY: p.y - elements[i].y };
        redraw();
        return;
      }
    }
    selectedId = null;
    redraw();
  });
  canvas.addEventListener("mousemove", (e) => {
    const p = getPos(e),
      sel = selected();
    if (sel) {
      const h = sel.hitHandle(p.x, p.y);
      canvas.style.cursor = h ? h.cursor : drag || resize ? "move" : "default";
    }
    if (!sel) return;
    if (drag) {
      sel.x = p.x - drag.offsetX;
      sel.y = p.y - drag.offsetY;
      redraw();
    }
    if (resize) {
      sel.resizeWith(resize.handle, p.x - resize.startX, p.y - resize.startY);
      redraw();
    }
  });
  window.addEventListener("mouseup", () => {
    drag = null;
    resize = null;
    canvas.style.cursor = "default";
  });
  window.addEventListener("keydown", (e) => {
    if (!selectedId) return;
    if (["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight", "Delete", "Backspace"].includes(e.key))
      e.preventDefault();
    const el = selected();
    if (e.key === "Delete" || e.key === "Backspace") deleteSelected();
    else if (e.key === "ArrowUp") {
      if (e.shiftKey) moveLayer(1);
      else {
        el.y -= 5;
        redraw();
      }
    } else if (e.key === "ArrowDown") {
      if (e.shiftKey) moveLayer(-1);
      else {
        el.y += 5;
        redraw();
      }
    } else if (e.key === "ArrowLeft") {
      el.x -= 5;
      redraw();
    } else if (e.key === "ArrowRight") {
      el.x += 5;
      redraw();
    }
  });

  document.getElementById("deleteBtn").onclick = deleteSelected;
  document.getElementById("upBtn").onclick = () => moveLayer(1);
  document.getElementById("downBtn").onclick = () => moveLayer(-1);
  document.getElementById("downloadBtn").onclick = download;
  document.getElementById("generateBtn").onclick = generate;
  document.getElementById("gender").value = sessionStorage.getItem("generatedGender") || "";
  document.getElementById("gender").onchange = (e) =>
    sessionStorage.setItem("generatedGender", e.target.value);
  buildAssets();
  redraw();
  showToast("Welcome to FORENSIGHT! 🎨", "info");
})();
