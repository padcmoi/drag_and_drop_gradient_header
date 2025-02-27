const START_WIDTH = 80;

function displayImageModal() {
  const selectedImg = document.querySelector("#container-draggable-el img.selected");
  if (selectedImg) {
    toolWindowForMovingElements.handleButtonFn({
      functionButtonUp: (value) => {
        selectedImg.style.top = `${parseInt(selectedImg.style.top, 10) - value}px`;
        saveImgState();
        displayElementCoordinatesXY(selectedImg);
      },
      functionButtonLeft: (value) => {
        selectedImg.style.left = `${parseInt(selectedImg.style.left, 10) - value}px`;
        saveImgState();
        displayElementCoordinatesXY(selectedImg);
      },
      functionButtonRight: (value) => {
        selectedImg.style.left = `${parseInt(selectedImg.style.left, 10) + value}px`;
        saveImgState();
        displayElementCoordinatesXY(selectedImg);
      },
      functionButtonDown: (value) => {
        selectedImg.style.top = `${parseInt(selectedImg.style.top, 10) + value}px`;
        saveImgState();
        displayElementCoordinatesXY(selectedImg);
      },
    });
    toolWindowForMovingElements.hideContainer(false);
  }
}

function addImage(event) {
  const fileInput = document.getElementById("file-input-id");
  const file = fileInput.files[0];
  if (!file) return event.preventDefault();

  cancelFilePreview();

  const reader = new FileReader();
  reader.onload = function (e) {
    const containerRect = document.getElementById("container-draggable-el").getBoundingClientRect();
    const img = createImageFromData({
      src: e.target.result,
      top: `${containerRect.height / 2}px`,
      left: `${containerRect.width / 2}px`,
      width: `${START_WIDTH}px`,
      rotation: 0,
      zIndex: getNextHighestZIndex(),
    });

    document.getElementById("container-draggable-el").appendChild(img);

    saveImgState();

    deselectAllDragEl();
    img.classList.add("selected");
    selectMenu("select-image-menu");
    displayImageModal();
    displayElementCoordinatesXY(img);
  };

  reader.readAsDataURL(file);
}

document.getElementById("add-image-btn").addEventListener("click", addImage);

// Event listeners for sliders
document.getElementById("size-image-slider").addEventListener("input", function (e) {
  const selectedImg = document.querySelector(".selected");
  if (selectedImg) {
    selectedImg.style.width = `${e.target.value}px`;
    document.getElementById("size-image-value").innerText = `Size: ${e.target.value}px`;
    saveImgState();
  }
});

// rotate image
document.getElementById("rotate-image-slider").addEventListener("input", function (e) {
  const selectedImg = document.querySelector(".selected");
  if (selectedImg) {
    selectedImg.dataset.rotation = e.target.value;
    selectedImg.style.transform = `translate(-50%, -50%) rotate(${e.target.value}deg)`;
    document.getElementById("rotate-image-value").innerText = `Rotation: ${e.target.value}°`;
    saveImgState();
  }
});

// z-index
document.getElementById("z-index-image-slider").addEventListener("input", function (e) {
  const selectedImg = document.querySelector(".selected");
  if (selectedImg) {
    selectedImg.style.zIndex = e.target.value;
    document.getElementById("z-index-image-value").innerText = `Ordre d'affichage: ${e.target.value}`;
    saveImgState();
  }
});

function saveImgState() {
  const images = document.querySelectorAll("#container-draggable-el img");
  const state = Array.from(images).map((img) => ({
    src: img.src,
    top: img.style.top,
    left: img.style.left,
    width: img.style.width,
    rotation: img.dataset.rotation,
    zIndex: img.style.zIndex,
  }));
  localStorage.setItem("imageState", JSON.stringify(state));
}

function loadImgState() {
  const state = JSON.parse(localStorage.getItem("imageState"));
  if (state) {
    state.forEach((data) => document.getElementById("container-draggable-el").appendChild(createImageFromData(data)));
  }
}

function createImageFromData(data) {
  const img = document.createElement("img");
  img.src = data.src;
  img.style.position = "absolute";
  img.style.top = data.top;
  img.style.left = data.left;
  img.style.width = data.width;
  img.dataset.rotation = data.rotation;
  img.style.zIndex = data.zIndex;
  img.style.transform = `translate(-50%, -50%) rotate(${data.rotation}deg)`;
  img.draggable = true;

  let deltaX, deltaY;

  img.addEventListener("dragstart", function (e) {
    e.dataTransfer.setData("text/plain", null);
    const rect = img.getBoundingClientRect();
    e.dataTransfer.setDragImage(img, e.clientX - rect.left, e.clientY - rect.top);

    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    deltaX = e.clientX - centerX;
    deltaY = e.clientY - centerY;
  });

  img.addEventListener("dragend", function (e) {
    const rect = document.getElementById("container-draggable-el").getBoundingClientRect();
    img.style.top = `${e.clientY - rect.top - deltaY}px`;
    img.style.left = `${e.clientX - rect.left - deltaX}px`;

    // Magnet enabled
    if (loadCommonState("magnetContainerEnabled", "false") === "true") {
      const roundToNearest20 = (value) => Math.round(value / 20) * 20;
      img.style.top = `${roundToNearest20(e.clientY - rect.top - deltaY)}px`;
      img.style.left = `${roundToNearest20(e.clientX - rect.left - deltaX)}px`;
    }

    displayElementCoordinatesXY(img);

    saveImgState();
  });

  img.addEventListener("click", function (e) {
    e.stopPropagation();
    deselectAllDragEl();
    img.classList.add("selected");
    selectMenu("select-image-menu");

    // Update sliders to match the selected image
    const sizeSlider = document.getElementById("size-image-slider");
    const rotateSlider = document.getElementById("rotate-image-slider");
    const zIndexSlider = document.getElementById("z-index-image-slider");
    sizeSlider.value = parseFloat(img.style.width);
    rotateSlider.value = img.dataset.rotation;
    zIndexSlider.value = img.style.zIndex;
    document.getElementById("size-image-value").innerText = `Size: ${sizeSlider.value}px`;
    document.getElementById("rotate-image-value").innerText = `Rotation: ${rotateSlider.value}°`;
    document.getElementById("z-index-image-value").innerText = `Ordre d'affichage: ${zIndexSlider.value}`;

    displayImageModal();
    displayElementCoordinatesXY(img);
  });

  img.addEventListener("wheel", function (e) {
    if (!img.classList.contains("selected")) return;
    e.preventDefault();
    const scale = e.deltaY < 0 ? 1.1 : 0.9;
    const currentWidth = parseFloat(img.style.width);
    img.style.width = `${currentWidth * scale}px`;
    document.getElementById("size-image-slider").value = parseFloat(img.style.width);
    document.getElementById("size-image-value").innerText = `Size: ${Math.round(parseFloat(img.style.width))}px`;
    saveImgState();
  });

  return img;
}

// Load state on page load
window.addEventListener("load", loadImgState);
