// Menu
const toggleMenu = () => document.getElementById("menu").classList.toggle("open");
toggleMenu();

function selectMenu(menuId) {
  ["default-menu", "add-text-menu", "select-text-menu", "select-image-menu"].forEach((id) => document.getElementById(id).classList.add("d-none"));

  switch (menuId) {
    case "default-menu":
      document.getElementById(menuId).classList.remove("d-none");
      break;
    case "add-text-menu":
      document.getElementById("add-text-message").value = "";
      document.getElementById(menuId).classList.remove("d-none");
      break;
    case "select-text-menu":
      document.getElementById(menuId).classList.remove("d-none");
      break;
    case "select-image-menu":
      document.getElementById(menuId).classList.remove("d-none");
      break;
    default:
      document.getElementById("default-menu").classList.remove("d-none");
  }
}
// Menu

function getHexColor(element) {
  const rgb = window.getComputedStyle(element).color;
  const rgbValues = rgb.match(/\d+/g);
  const hex = rgbValues
    .map((value) => {
      const hexValue = parseInt(value).toString(16);
      return hexValue.length === 1 ? "0" + hexValue : hexValue;
    })
    .join("");
  return `#${hex}`;
}

function toggleMiddleColorPicker() {
  const middleColorPicker = document.getElementById("middle-color-picker");
  middleColorPicker.disabled = !middleColorPicker.disabled;
  updateColorGradient();
}

// Change gradient colors & orientation
function updateColorGradient() {
  const startColor = document.getElementById("start-color-picker").value;
  const middleColor = document.getElementById("middle-color-picker").value;
  const endColor = document.getElementById("end-color-picker").value;
  const state = document.getElementById("triple-color-checkbox").checked;
  const orientation = document.getElementById("orientation-select").value;

  const gradient = state ? `linear-gradient(${orientation}, ${startColor}, ${middleColor}, ${endColor})` : `linear-gradient(${orientation}, ${startColor}, ${endColor})`;
  document.getElementById("container-draggable-el").style.background = gradient;
}
updateColorGradient();

document.getElementById("middle-color-picker").addEventListener("input", function () {
  updateColorGradient();
});
document.getElementById("start-color-picker").addEventListener("input", function () {
  updateColorGradient();
});
document.getElementById("end-color-picker").addEventListener("input", function () {
  updateColorGradient();
});
document.getElementById("orientation-select").addEventListener("change", function () {
  updateColorGradient();
});

// Change rectangle height
const heightSlider = document.getElementById("height-container-slider");
const heightValueLabel = document.getElementById("height-container-value");
const maxHeight = window.innerHeight;
window.addEventListener("resize", function () {
  heightSlider.max = window.innerHeight;
});
heightSlider.max = window.innerHeight;
heightSlider.addEventListener("input", function () {
  const height = this.value + "px";
  document.getElementById("container-draggable-el").style.height = height;
  heightValueLabel.textContent = height;
});

// Download
document.getElementById("download-btn").addEventListener("click", function () {
  html2canvas(document.getElementById("container-draggable-el")).then(function (canvas) {
    var link = document.createElement("a");
    link.href = canvas.toDataURL("image/png");
    const filename = "todo"; // TODO
    const dateTime = new Date()
      .toLocaleString()
      .replace(/[/,:\s]/g, "_")
      .replace(/__/g, "_");
    link.download = `${filename}_${dateTime}.png`;
    link.click();
  });
});

// Upload file with prerender & paste file
function displayFilePreview(reader) {
  document.getElementById("file-queue-empty").classList.add("d-none");
  document.getElementById("file-queue-filled").classList.remove("d-none");

  const preview = document.getElementById("file-preview-id");
  preview.src = reader.result;
  preview.style.display = "block";
}

function previewFile() {
  const file = document.getElementById("file-input-id").files[0];
  const reader = new FileReader();
  reader.onloadend = () => displayFilePreview(reader);

  if (file) reader.readAsDataURL(file);
}

function cancelFilePreview() {
  document.getElementById("file-queue-empty").classList.remove("d-none");
  document.getElementById("file-queue-filled").classList.add("d-none");

  const preview = document.getElementById("file-preview-id");
  preview.src = "";
  preview.style.display = "none";
  document.getElementById("file-input-id").value = "";
}

document.addEventListener("paste", (event) => {
  const items = event.clipboardData.items;
  for (let i = 0; i < items.length; i++) {
    if (items[i].kind === "file") {
      const file = items[i].getAsFile();
      const fileInput = document.getElementById("file-input-id");
      const dataTransfer = new DataTransfer();
      dataTransfer.items.add(file);
      fileInput.files = dataTransfer.files;

      const reader = new FileReader();
      reader.onload = (e) => displayFilePreview(e.target);

      reader.readAsDataURL(file);
      break;
    }
  }
});

// Applies a braking effect to the rotation of a slider.
let rotationBrakeEnabled = true;
function applyRotationBrakeEffect(slider) {
  if (!rotationBrakeEnabled) return;

  const brakePoints = [0, 45, 90, -45, -90];
  brakePoints.forEach((point) => {
    if (Math.abs(slider.value - point) < 10) {
      slider.value = point;
    }
  });
  slider.dispatchEvent(new Event("change"));
}

function lockRotationBrakeEffect(label) {
  const lockIcon = label.querySelector(".lock-icon");
  const unlockIcon = label.querySelector(".unlock-icon");

  if (rotationBrakeEnabled) {
    rotationBrakeEnabled = false;
    lockIcon.style.display = "none";
    unlockIcon.style.display = "inline";
  } else {
    rotationBrakeEnabled = true;
    lockIcon.style.display = "inline";
    unlockIcon.style.display = "none";
  }
}
