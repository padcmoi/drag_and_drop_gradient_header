const DEFAULT_FONT_SIZE = 28;

function saveTextState() {
  const elements = Array.from(document.querySelectorAll("#container-draggable-el span")).map((span) => ({
    text: span.textContent,
    top: span.style.top,
    left: span.style.left,
    color: span.style.color,
    fontSize: span.style.fontSize,
    transform: span.style.transform,
    zIndex: span.style.zIndex,
    fontFamily: span.style.fontFamily,
    fontWeight: span.style.fontWeight,
  }));
  localStorage.setItem("draggableElements", JSON.stringify(elements));
}

function loadTextState() {
  const elements = JSON.parse(localStorage.getItem("draggableElements") || "[]");
  elements.forEach((data) => {
    const span = document.createElement("span");
    span.textContent = data.text;
    span.style.position = "absolute";
    span.style.top = data.top;
    span.style.left = data.left;
    span.style.color = data.color;
    span.style.fontSize = data.fontSize;
    span.style.transform = data.transform;
    span.style.zIndex = data.zIndex;
    span.style.fontFamily = data.fontFamily;
    span.style.fontWeight = data.fontWeight;
    span.draggable = true;
    span.style.display = "inline-block";
    span.classList.add("custom-text");

    loadGoogleFont(data.fontFamily.replace(/['"]/g, ""));

    addEventListeners(span);
    document.getElementById("container-draggable-el").appendChild(span);
  });
}

function displayTextModal() {
  const selectedSpan = document.querySelector("#container-draggable-el span.selected");
  if (selectedSpan) {
    toolWindowForMovingElements.handleButtonFn({
      functionButtonUp: (value) => {
        selectedSpan.style.top = `${parseInt(selectedSpan.style.top, 10) - value}px`;
        saveTextState();
        displayElementCoordinatesXY(selectedSpan);
      },
      functionButtonLeft: (value) => {
        selectedSpan.style.left = `${parseInt(selectedSpan.style.left, 10) - parseInt(value)}px`;
        saveTextState();
        displayElementCoordinatesXY(selectedSpan);
      },
      functionButtonRight: (value) => {
        selectedSpan.style.left = `${parseInt(selectedSpan.style.left, 10) + value}px`;
        saveTextState();
        displayElementCoordinatesXY(selectedSpan);
      },
      functionButtonDown: (value) => {
        selectedSpan.style.top = `${parseInt(selectedSpan.style.top, 10) + value}px`;
        saveTextState();
        displayElementCoordinatesXY(selectedSpan);
      },
    });
    toolWindowForMovingElements.hideContainer(false);
  }
}

function addEventListeners(span) {
  span.addEventListener("dragstart", function (e) {
    e.dataTransfer.setData("text/plain", null);
    const rect = span.getBoundingClientRect();
    e.dataTransfer.setDragImage(span, e.clientX - rect.left, e.clientY - rect.top);
  });

  span.addEventListener("dragend", function (e) {
    const rect = document.getElementById("container-draggable-el").getBoundingClientRect();
    span.style.top = `${e.clientY - rect.top}px`;
    span.style.left = `${e.clientX - rect.left}px`;

    // Magnet enabled
    if (loadCommonState("magnetContainerEnabled", "false") === "true") {
      const roundToNearest20 = (value) => Math.round(value / 20) * 20;
      span.style.top = `${roundToNearest20(e.clientY - rect.top)}px`;
      span.style.left = `${roundToNearest20(e.clientX - rect.left)}px`;
    }

    displayElementCoordinatesXY(span);

    saveTextState();
  });

  span.addEventListener("click", function (e) {
    e.stopPropagation();
    deselectAllDragEl();

    span.classList.add("selected");
    selectMenu("select-text-menu");
    document.getElementById("change-color-message").value = getHexColor(span);
    document.getElementById("change-text-message").value = e.target.innerText;

    const scale = e.deltaY < 0 ? 1.1 : 0.9;
    const currentFontSize = parseFloat(window.getComputedStyle(span).fontSize);
    document.getElementById("height-text-value").textContent = `Taille: ${Math.round(currentFontSize * scale)}px`;
    document.getElementById("height-text-slider").value = Math.round(currentFontSize * scale);

    const transformRotate = span.style.transform.match(/rotate\((-?\d+)deg\)/);
    const rotateValue = transformRotate ? transformRotate[1] : 0;

    document.getElementById("rotate-text-value").textContent = `Rotation: ${rotateValue}°`;
    document.getElementById("rotate-text-slider").value = rotateValue;

    document.getElementById("z-index-text-value").textContent = `Ordre d'affichage: ${span.style.zIndex}`;
    document.getElementById("z-index-text-slider").value = span.style.zIndex;

    document.getElementById("change-font-family").value = span.style.fontFamily.replace(/['"]/g, "");
    document.getElementById("bold-text-level").value = span.style.fontWeight || "normal";

    displayTextModal();
    displayElementCoordinatesXY(span);
  });

  span.addEventListener("wheel", function (e) {
    if (!span.classList.contains("selected")) return;
    e.preventDefault();

    const scale = e.deltaY < 0 ? 1.1 : 0.9;
    const currentFontSize = parseFloat(window.getComputedStyle(span).fontSize);
    span.style.fontSize = `${Math.round(currentFontSize * scale)}px`;
    document.getElementById("height-text-value").textContent = `Taille: ${Math.round(currentFontSize * scale)}px`;
    document.getElementById("height-text-slider").value = Math.round(currentFontSize * scale);
    saveTextState();
  });
}

document.getElementById("add-text-btn").addEventListener("click", function (event) {
  const textSelected = document.getElementById("add-text-message").value;
  if (!textSelected) return event.preventDefault();

  const span = document.createElement("span");
  span.textContent = textSelected;
  span.style.position = "absolute";
  const containerRect = document.getElementById("container-draggable-el").getBoundingClientRect();
  span.style.top = `${containerRect.height / 2}px`;
  span.style.left = `${containerRect.width / 2}px`;
  span.draggable = true;
  span.style.display = "inline-block";
  span.classList.add("custom-text");
  span.style.transform = "translate(-50%, -50%) rotate(0deg)";
  span.style.zIndex = getNextHighestZIndex();

  document.getElementById("height-text-value").textContent = `Taille: ${DEFAULT_FONT_SIZE}px`;
  document.getElementById("height-text-slider").value = DEFAULT_FONT_SIZE;
  document.getElementById("rotate-text-value").textContent = `Rotation: ${0}°`;
  document.getElementById("rotate-text-slider").value = 0;
  document.getElementById("z-index-text-value").textContent = `Ordre d'affichage: ${1}`;
  document.getElementById("z-index-text-slider").value = 1;

  span.classList.add("selected");
  selectMenu("select-text-menu");
  span.style.color = document.getElementById("change-color-message").value;
  document.getElementById("change-text-message").value = textSelected;
  span.style.fontFamily = document.getElementById("change-font-family")?.value ?? "";
  loadGoogleFont(document.getElementById("change-font-family")?.value ?? "");

  span.style.fontWeight = document.getElementById("bold-text-level")?.value ?? "";

  addEventListeners(span);
  document.getElementById("container-draggable-el").appendChild(span);
  saveTextState();

  displayTextModal();
  displayElementCoordinatesXY(span);
});

document.getElementById("change-text-message").addEventListener("input", function () {
  const selectedSpan = document.querySelector("#container-draggable-el span.selected");
  if (selectedSpan) {
    selectedSpan.textContent = this.value;
    saveTextState();
  }
});

document.getElementById("change-color-message").addEventListener("input", function () {
  const selectedSpan = document.querySelector("#container-draggable-el span.selected");
  if (selectedSpan) {
    selectedSpan.style.color = this.value;
    saveTextState();
  }
});

document.getElementById("height-text-slider").addEventListener("input", function () {
  const selectedSpan = document.querySelector("#container-draggable-el span.selected");
  if (selectedSpan) {
    selectedSpan.style.fontSize = `${this.value}px`;
    document.getElementById("height-text-value").textContent = `Taille: ${this.value}px`;
    saveTextState();
  }
});

document.getElementById("rotate-text-slider").addEventListener("input", function () {
  const selectedSpan = document.querySelector("#container-draggable-el span.selected");
  if (selectedSpan) {
    selectedSpan.style.transform = `translate(-50%, -50%) rotate(${this.value}deg)`;
    document.getElementById("rotate-text-value").textContent = `Rotation: ${this.value}°`;
    document.getElementById("rotate-text-slider").value = this.value;
    saveTextState();
  }
});

document.getElementById("z-index-text-slider").addEventListener("input", function () {
  const selectedSpan = document.querySelector("#container-draggable-el span.selected");
  if (selectedSpan) {
    selectedSpan.style.zIndex = this.value;
    document.getElementById("z-index-text-value").textContent = `Ordre d'affichage: ${this.value}`;
    saveTextState();
  }
});

document.getElementById("bold-text-level").addEventListener("input", function () {
  const selectedSpan = document.querySelector("#container-draggable-el span.selected");
  if (selectedSpan) {
    selectedSpan.style.fontWeight = this.value;
    saveTextState();
  }
});

window.addEventListener("load", loadTextState);
