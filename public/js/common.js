function toggleFullscreen() {
  if (!document.fullscreenElement) document.documentElement.requestFullscreen().catch(() => {});
  else if (document.exitFullscreen) document.exitFullscreen().catch(() => {});
}

(function setupHeaderImageSearch() {
  const input = document.getElementById("headerImageInput");
  if (!input) return;
  input.addEventListener("change", () => {
    const file = input.files && input.files[0];
    input.value = "";
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      sessionStorage.setItem("generatedImageUrl", String(reader.result));
      sessionStorage.setItem("generatedGender", "Any");
      window.location.href = "/results";
    };
    reader.readAsDataURL(file);
  });
})();
