const DEFAULT_WIDTH_VALUE = 600;
const DEFAULT_HEIGHT_VALUE = 300;

document.addEventListener("DOMContentLoaded", function () {
  // ID
  const heightSlider = document.getElementById("height-container-slider");
  const widthSlider = document.getElementById("width-container-slider");

  const startColorPicker = document.getElementById("start-color-picker");
  const middleColorPicker = document.getElementById("middle-color-picker");
  const endColorPicker = document.getElementById("end-color-picker");
  const orientationSelect = document.getElementById("orientation-select");
  const tripleColorCheckbox = document.getElementById("triple-color-checkbox");
  const containerDraggableEl = document.getElementById("container-draggable-el");
  const heightValueLabel = document.getElementById("height-value-label");
  const heightContainerValue = document.getElementById("height-container-value");
  const widthValueLabel = document.getElementById("width-value-label");
  const widthContainerValue = document.getElementById("width-container-value");
  const gridCheckbox = document.getElementById("grid-container-id");
  const magnetContainerCheckbox = document.getElementById("magnet-container-id");

  // localStorage & SET
  heightSlider.max = localStorage.getItem("createdOriginOffsetHeight") ? parseInt(loadCommonState("createdOriginOffsetHeight", document.body.offsetHeight)) : document.body.offsetHeight;
  widthSlider.max = localStorage.getItem("createdOriginOffsetWidth") ? parseInt(loadCommonState("createdOriginOffsetWidth", document.body.offsetWidth)) : document.body.offsetWidth;

  if (startColorPicker) startColorPicker.value = loadCommonState("startColor", "#ff7e5f") || "#ff7e5f";
  if (endColorPicker) endColorPicker.value = loadCommonState("endColor", "#feb47b") || "#feb47b";
  if (orientationSelect) orientationSelect.value = loadCommonState("orientation", "to right") || "to right";
  if (tripleColorCheckbox) tripleColorCheckbox.checked = loadCommonState("tripleColorState", "false") === "true";

  // container property values w & h
  if (containerDraggableEl) {
    containerDraggableEl.style.height = `${loadCommonState("containerHeight", `${DEFAULT_HEIGHT_VALUE}`) || `${DEFAULT_HEIGHT_VALUE}`}px`;
    containerDraggableEl.style.width = `${loadCommonState("containerWidth", `${DEFAULT_WIDTH_VALUE}`) || `${DEFAULT_WIDTH_VALUE}`}px`;
  }

  if (heightValueLabel) heightValueLabel.textContent = loadCommonState("containerHeight", `${DEFAULT_HEIGHT_VALUE}px`) || `${DEFAULT_HEIGHT_VALUE}px`;
  heightSlider.value = parseInt(loadCommonState("containerHeight", `${DEFAULT_HEIGHT_VALUE}`)) || DEFAULT_HEIGHT_VALUE;
  if (heightContainerValue && heightSlider) heightContainerValue.value = heightSlider.value;

  if (widthValueLabel) widthValueLabel.textContent = loadCommonState("containerWidth", `${DEFAULT_WIDTH_VALUE}px`) || `${DEFAULT_WIDTH_VALUE}px`;
  widthSlider.value = parseInt(loadCommonState("containerWidth", `${DEFAULT_WIDTH_VALUE}`)) || DEFAULT_WIDTH_VALUE;
  if (widthContainerValue && widthSlider) widthContainerValue.value = widthSlider.value;
  // container property values w & h

  if (middleColorPicker) middleColorPicker.value = loadCommonState("middleColor", "#ffffff") || "#ffffff";
  if (middleColorPicker) middleColorPicker.disabled = loadCommonState("middleColorPickerDisabled", "false") === "true";
  if (middleColorPicker) middleColorPicker.disabled = !tripleColorCheckbox.checked;
  if (gridCheckbox) gridCheckbox.checked = loadCommonState("gridContainerEnabled", "false") == "true" ? true : false;
  if (magnetContainerCheckbox) magnetContainerCheckbox.checked = loadCommonState("magnetContainerEnabled", "false") === "true";
  if (!gridCheckbox.checked && magnetContainerCheckbox) {
    magnetContainerCheckbox.checked = false;
    magnetContainerCheckbox.disabled = true;
  }

  // Call updateColorGradient after loading values
  updateColorGradient();

  if (loadCommonState("menuOpen", "false") === "true") {
    dropdownWindow.toggleMenu({ open: true });
  } else {
    dropdownWindow.toggleMenu({ close: true });
  }
});

document.addEventListener("DropdownWindowMenuStatus", (event) => {
  console.log("Dropdown window menu status changed:", event.detail.menuOpen);
  saveCommonState("menuOpen", event.detail.menuOpen);
});

// Save and load functions
function saveCommonState(key, value) {
  localStorage.setItem(key, value);
}

function loadCommonState(key, defaultValue) {
  return localStorage.getItem(key) || defaultValue;
}

// Menu
function selectMenu(menuId) {
  switch (menuId) {
    case "default-menu":
      menuManager.showMenu(menuId);
      break;
    case "add-text-menu":
      document.getElementById("add-text-message").value = "";
      menuManager.showMenu(menuId);
      break;
    case "select-text-menu":
      menuManager.showMenu(menuId);
      break;
    case "select-image-menu":
      menuManager.showMenu(menuId);
      break;
    default:
      menuManager.showMenu();
  }
}

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
  saveCommonState("middleColorPickerDisabled", middleColorPicker.disabled);
  updateColorGradient();
}

function toggleGridContainer() {
  const gridCheckbox = document.getElementById("grid-container-id");
  const magnetCheckbox = document.getElementById("magnet-container-id");
  if (magnetCheckbox) {
    magnetCheckbox.disabled = gridCheckbox.checked ? false : true;
    if (!gridCheckbox.checked) {
      magnetCheckbox.checked = false;
      saveCommonState("magnetContainerEnabled", magnetCheckbox.checked);
    }
  }

  saveCommonState("gridContainerEnabled", gridCheckbox.checked);
  updateColorGradient();
}
function toggleMagnetContainer() {
  const magnetCheckbox = document.getElementById("magnet-container-id");
  if (magnetCheckbox.disabled) return;

  saveCommonState("magnetContainerEnabled", magnetCheckbox.checked);
  updateColorGradient();
}

function setImageAsBackground() {
  if (loadCommonState("backgroundImage", null)) return;

  const selectedImage = document.querySelector("#container-draggable-el img.selected");
  const container = document.getElementById("container-draggable-el");

  if (selectedImage && selectedImage.src && container) {
    saveCommonState("backgroundImage", selectedImage.src);

    // remove draggable image
    toolWindowForMovingElements.hideContainer();
    selectedImage.remove();
    saveImgState();
    selectMenu("_convertImgToBackgroundImg");
  }

  updateColorGradient();
}

function convertBackgroundAsElement() {
  const backgroundImage = loadCommonState("backgroundImage", null);
  if (backgroundImage) {
    const img = new Image();
    img.src = backgroundImage;
    img.onload = () => {
      const containerRect = document.getElementById("container-draggable-el").getBoundingClientRect();

      const createdImg = createImageFromData({
        src: img.src,
        top: `${containerRect.height / 2}px`,
        left: `${containerRect.width / 2}px`,
        width: `${START_WIDTH}px`,
        rotation: 0,
        zIndex: getNextHighestZIndex(),
      });
      document.getElementById("container-draggable-el").appendChild(createdImg);

      saveImgState();
      deselectAllDragEl();
      createdImg.classList.add("selected");
      selectMenu("select-image-menu");
      displayImageModal();

      localStorage.removeItem("backgroundImage");
      updateColorGradient();
    };
  }
}

// Change gradient colors & orientation
function updateColorGradient() {
  const startColor = document.getElementById("start-color-picker").value;
  const middleColor = document.getElementById("middle-color-picker").value;
  const endColor = document.getElementById("end-color-picker").value;
  const state = document.getElementById("triple-color-checkbox").checked;
  const orientation = document.getElementById("orientation-select").value;

  const gradient = state ? `linear-gradient(${orientation}, ${startColor}, ${middleColor}, ${endColor})` : `linear-gradient(${orientation}, ${startColor}, ${endColor})`;
  const container = document.getElementById("container-draggable-el");

  const backgroundImage = loadCommonState("backgroundImage", null);

  if (backgroundImage) {
    const img = new Image();
    img.src = backgroundImage;
    img.onload = () => backgroundContainer(container, gradient, backgroundImage);
    img.onerror = () => backgroundContainer(container, gradient, null);
  } else {
    backgroundContainer(container, gradient, null);
  }

  // Save to localStorage
  saveCommonState("startColor", startColor);
  saveCommonState("middleColor", middleColor);
  saveCommonState("endColor", endColor);
  saveCommonState("orientation", orientation);
  saveCommonState("tripleColorState", state);
}

function backgroundContainer(container, gradient, setBackgroundImage = null) {
  let backgroundImage = gradient;
  if (setBackgroundImage) {
    backgroundImage = `url(${setBackgroundImage})`;
    container.style.backgroundPosition = "center";
    document.getElementById("set-display-background-on").classList.remove("d-none");
    document.getElementById("set-display-background-off").classList.add("d-none");
    document.getElementById("define-image-as-background").disabled = true;
  } else {
    document.getElementById("set-display-background-on").classList.add("d-none");
    document.getElementById("set-display-background-off").classList.remove("d-none");
    document.getElementById("define-image-as-background").disabled = false;
  }

  if (loadCommonState("gridContainerEnabled", "false") == "true") {
    container.style.backgroundImage = `linear-gradient(to right, #000 1px, transparent 0),
                                     linear-gradient(to bottom, #000 1px, transparent 0),
                                     ${backgroundImage}`;
    container.style.backgroundSize = "20px 20px, 20px 20px, cover";
  } else {
    container.style.backgroundImage = backgroundImage;
    container.style.backgroundSize = "cover";
  }
}

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

const heightSlider = document.getElementById("height-container-slider");
const heightValueLabel = document.getElementById("height-container-value");
const originOffsetHeight = localStorage.getItem("createdOriginOffsetHeight") ? parseInt(loadCommonState("createdOriginOffsetHeight", document.body.offsetHeight)) : document.body.offsetHeight;

const widthSlider = document.getElementById("width-container-slider");
const widthValueLabel = document.getElementById("width-container-value");
const originOffsetWidth = localStorage.getItem("createdOriginOffsetWidth") ? parseInt(loadCommonState("createdOriginOffsetWidth", document.body.offsetWidth)) : document.body.offsetWidth;

// Change rectangle height
function onUpdateHeightContainer(input) {
  if (input.value == "") return;
  const minHeight = parseInt(heightSlider.min);
  if (isNaN(minHeight) || isNaN(parseInt(input.value)) || input.value < minHeight) input.value = minHeight;
  if (input.value > originOffsetHeight) input.value = originOffsetHeight;

  // Will be removed in a future version
  // const height = calculateHeightInPixels(input.value);

  const height = input.value;

  switch (input.type) {
    case "number":
      heightSlider.value = height;
      break;
    case "range":
      heightValueLabel.value = height;
      break;
    default:
      throw new Error("Invalid input type");
  }

  document.getElementById("container-draggable-el").style.height = height + "px";

  // Save to localStorage
  saveCommonState("containerHeight", height);
}

// Change rectangle width
function onUpdateWidthContainer(input) {
  if (input.value == "") return;
  const minWidth = parseInt(widthSlider.min);
  if (isNaN(minWidth) || isNaN(parseInt(input.value)) || input.value < minWidth) input.value = minWidth;
  if (input.value > originOffsetWidth) input.value = originOffsetWidth;

  // Will be removed in a future version
  // const width = calculateWidthInPixels(input.value);

  const width = input.value;

  switch (input.type) {
    case "number":
      widthSlider.value = width;
      break;
    case "range":
      widthValueLabel.value = width;
      break;
    default:
      throw new Error("Invalid input type");
  }

  document.getElementById("container-draggable-el").style.width = width + "px";

  // Save to localStorage
  saveCommonState("containerWidth", width);
}

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

  if (file.type.startsWith("image/")) {
    const reader = new FileReader();
    reader.onloadend = () => displayFilePreview(reader);

    if (file) reader.readAsDataURL(file);
  }
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
  const selectedElement = document.querySelector(".selected");
  if (!selectedElement) {
    const items = event.clipboardData.items;
    for (let i = 0; i < items.length; i++) {
      if (items[i].kind === "file") {
        const file = items[i].getAsFile();

        if (file.type.startsWith("image/")) {
          const fileInput = document.getElementById("file-input-id");
          const dataTransfer = new DataTransfer();
          dataTransfer.items.add(file);
          fileInput.files = dataTransfer.files;

          addImage(event);
        }

        break;
      }
    }
  }
});

// Applies a braking effect to the rotation of a slider.
const rotationBrakeEnabled = { text: true, img: true };

function applyRotationBrakeEffect(slider, assign) {
  if (!rotationBrakeEnabled[assign]) return;

  const brakePoints = [0, 45, 90, -45, -90];
  const closestPoint = brakePoints.reduce((prev, curr) => (Math.abs(curr - slider.value) < Math.abs(prev - slider.value) ? curr : prev));

  if (Math.abs(slider.value - closestPoint) < 10) {
    slider.value = closestPoint;
    slider.dispatchEvent(new Event("change"));
  }
}

function lockRotationBrakeEffect(btn, assign) {
  rotationBrakeEnabled[assign] = !rotationBrakeEnabled[assign];
  btn.classList.toggle("btn-danger", rotationBrakeEnabled[assign]);
  btn.classList.toggle("btn-success", !rotationBrakeEnabled[assign]);
}

// handle google fonts
const GOOGLE_FONT_FAMILIES = [{ family: "", category: "", selected: false, disabled: true }];

document.addEventListener("DOMContentLoaded", async function () {
  try {
    // or you can use the Google API, requires an apiKey
    // today, I have retrieved 1806 fonts
    // https://www.googleapis.com/webfonts/v1/webfonts?key=
    const response = await fetch("./google-fonts.json");
    const data = await response.json();
    data.forEach((font) => {
      GOOGLE_FONT_FAMILIES.push({
        ...font,
        selected: font.family == "Permanent Marker" ? true : false,
        disabled: false,
      });
    });
  } catch (error) {
    console.error("Error loading Google Fonts:", error);
  }

  console.info("google fonts loaded: ", GOOGLE_FONT_FAMILIES.length - 1);

  const fontSelect = document.getElementById("change-font-family");

  GOOGLE_FONT_FAMILIES.forEach((font) => {
    const option = document.createElement("option");
    option.value = font.family;
    option.textContent = font.family;
    if (font.selected) option.selected = true;
    if (font.disabled) option.disabled = true;

    fontSelect.appendChild(option);
  });
});

function changeGoogleFontFamily(selectElement) {
  const selectedSpan = document.querySelector("#container-draggable-el span.selected");
  if (selectedSpan) {
    selectedSpan.style.fontFamily = selectElement.value;
    saveTextState();
    loadGoogleFont(selectElement.value);
  }
}

function loadGoogleFont(fontName) {
  const linkId = `google-font-family-id-${fontName.replace(/ /g, "-")}`;
  if (!document.getElementById(linkId)) {
    const newLink = document.createElement("link");
    newLink.id = linkId;
    newLink.rel = "stylesheet";
    newLink.href = `https://fonts.googleapis.com/css2?family=${fontName.replace(/ /g, "+")}&display=swap`;
    document.head.appendChild(newLink);
  }

  // remove unused fonts ...
  const usedFonts = [];
  usedFonts.push(fontName.replace(/['"]/g, ""));
  document.querySelectorAll("#container-draggable-el span").forEach((span) => {
    const font = span.style.fontFamily.replace(/['"]/g, "");
    if (!usedFonts.includes(font)) usedFonts.push(font);
  });

  document.querySelectorAll('link[id^="google-font-family-id-"]').forEach((link) => {
    const fontName = link.id.replace("google-font-family-id-", "").replace(/-/g, " ");
    if (!usedFonts.includes(fontName)) link.remove();
  });
}

// save, load and reset data
function clearLocalStorage() {
  localStorage.clear();

  location.reload();
}
function saveLocalStorage() {
  const data = {};
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    data[key] = localStorage.getItem(key);
  }
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "header_gradient_app_data.json";
  a.click();
  URL.revokeObjectURL(url);
}

function loadLocalStorage() {
  const input = document.createElement("input");
  input.type = "file";
  input.accept = "application/json";
  input.onchange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const data = JSON.parse(e.target.result);
          for (const key in data) {
            localStorage.setItem(key, data[key]);
          }
          alert("Le localStorage a été chargé.");
          location.reload();
        } catch (error) {
          alert("Erreur lors du chargement du fichier JSON.");
        }
      };
      reader.readAsText(file);
    }
  };
  input.click();
}

// Load localstore serverfiles
fetch("./saves/manifest.json")
  .then((response) => {
    if (!response.ok) throw new Error("Network response was not ok");
    return response.json();
  })
  .then((files) => {
    const select = document.getElementById("local-storage-serverfiles");
    files.forEach((file) => {
      const option = document.createElement("option");
      option.value = file;
      option.textContent = file;
      select.appendChild(option);
    });
  })
  .catch((error) => console.error("There was a problem with the fetch operation:", error));

function loadSelectedLocalStorageFile(select) {
  const fileName = select.value;
  if (fileName && !(localStorage.getItem("imageState") || localStorage.getItem("draggableElements"))) {
    loadLocalStorageFromFile(`${fileName}`);
  } else if (localStorage.getItem("imageState") || localStorage.getItem("draggableElements")) {
    console.log("confirm ?");

    const confirmation = confirm("Il y a des travaux en cours. Voulez-vous vraiment charger un nouveau fichier ?");
    if (confirmation) {
      loadLocalStorageFromFile(`${fileName}`);
    }
  }

  document.getElementById("local-storage-serverfiles").value = "";
}

function loadLocalStorageFromFile(filePath) {
  fetch(filePath)
    .then((response) => response.json())
    .then((data) => {
      for (const key in data) {
        localStorage.setItem(key, data[key]);
      }

      location.reload();
    })
    .catch((error) => console.error("Erreur lors du chargement du fichier JSON:", error));
}

// Preset workspace

// Load workspace presets into the select element
fetch("./workspace.presets.json")
  .then((response) => response.json())
  .then((presets) => {
    const selectPresetWorkspace = document.getElementById("select-preset-workspace-id");
    if (selectPresetWorkspace) {
      presets.forEach((preset) => {
        const option = document.createElement("option");
        option.value = preset.key;
        option.textContent = preset.name;
        selectPresetWorkspace.appendChild(option);
      });
    }
  })
  .catch((error) => console.error("Error loading workspace presets:", error));

function applyWorkspacePreset() {
  const selectPresetWorkspace = document.getElementById("select-preset-workspace-id");
  if (!selectPresetWorkspace || !selectPresetWorkspace.value) return;

  const selectedValue = selectPresetWorkspace.value;
  selectPresetWorkspace.value = "";

  fetch("./workspace.presets.json")
    .then((response) => response.json())
    .then((presets) => {
      const preset = presets.find((p) => p.key === selectedValue);
      if (preset) {
        const content = preset.content;

        if (content.containerHeight) {
          document.getElementById("container-draggable-el").style.height = content.containerHeight + "px";
          heightSlider.value = content.containerHeight;
          heightValueLabel.value = content.containerHeight;
          saveCommonState("containerHeight", content.containerHeight);
        }
        if (content.containerWidth) {
          document.getElementById("container-draggable-el").style.width = content.containerWidth + "px";
          widthSlider.value = content.containerWidth;
          widthValueLabel.value = content.containerWidth;
          saveCommonState("containerWidth", content.containerWidth);
        }
        if (content.startColor) {
          document.getElementById("start-color-picker").value = content.startColor;
          saveCommonState("startColor", content.startColor);
        }
        if (content.middleColor) {
          document.getElementById("middle-color-picker").value = content.middleColor;
          saveCommonState("middleColor", content.middleColor);
        }
        if (content.endColor) {
          document.getElementById("end-color-picker").value = content.endColor;
          saveCommonState("endColor", content.endColor);
        }
        if (content.orientation) {
          document.getElementById("orientation-select").value = content.orientation;
          saveCommonState("orientation", content.orientation);
        }
        if (content.tripleColorState) {
          document.getElementById("triple-color-checkbox").checked = content.tripleColorState === "true";
          saveCommonState("tripleColorState", content.tripleColorState);
        }
        if (content.middleColorPickerDisabled) {
          document.getElementById("middle-color-picker").disabled = content.middleColorPickerDisabled === "true";
          saveCommonState("middleColorPickerDisabled", content.middleColorPickerDisabled);
        }
        if (content.gridContainerEnabled) {
          document.getElementById("grid-container-id").checked = content.gridContainerEnabled === "true";
          saveCommonState("gridContainerEnabled", content.gridContainerEnabled);
        }
        if (content.magnetContainerEnabled) {
          document.getElementById("magnet-container-id").checked = content.magnetContainerEnabled === "true";
          saveCommonState("magnetContainerEnabled", content.magnetContainerEnabled);
        }
        if (content.menuOpen) {
          if (content.menuOpen === "true") {
            dropdownWindow.toggleMenu({ open: true });
          } else {
            dropdownWindow.toggleMenu({ close: true });
          }
          saveCommonState("menuOpen", content.menuOpen);
        }
        updateColorGradient();

        location.reload();
      }
    })
    .catch((error) => console.error("Error loading workspace presets:", error));

  console.log(selectPresetWorkspace.value);
}
