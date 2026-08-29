(function () {
  const form = document.getElementById("enrollForm");
  const fileInput = document.getElementById("criminalImage");
  const preview = document.getElementById("preview");
  const placeholder = document.getElementById("previewPlaceholder");
  const status = document.getElementById("status");
  const statusButtons = document.querySelectorAll(".statusBtn");
  const message = document.getElementById("uploadStatus");
  const submit = document.getElementById("submitBtn");

  fileInput.addEventListener("change", () => {
    const file = fileInput.files[0];
    if (!file) return;
    preview.src = URL.createObjectURL(file);
    preview.style.display = "block";
    placeholder.style.display = "none";
  });

  statusButtons.forEach((btn) =>
    btn.addEventListener("click", () => {
      status.value = btn.dataset.status;
      statusButtons.forEach(
        (b) => (b.className = b === btn ? "activeBtn statusBtn" : "btn statusBtn"),
      );
    }),
  );

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    if (!fileInput.files[0]) {
      message.textContent = "Please select an image.";
      return;
    }
    submit.disabled = true;
    submit.textContent = "Adding...";
    message.textContent = "";
    try {
      const fd = new FormData(form);
      const res = await fetch("/api/enroll", { method: "POST", body: fd });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Upload failed");
      message.textContent = "✅ Criminal Added";
      form.reset();
      status.value = "ARRESTED";
      statusButtons[0].className = "activeBtn statusBtn";
      statusButtons[1].className = "btn statusBtn";
      preview.style.display = "none";
      placeholder.style.display = "block";
    } catch (err) {
      message.textContent = err.message || "Upload failed";
    } finally {
      submit.disabled = false;
      submit.textContent = "➕ Add Criminal";
    }
  });
})();
