const START_WIDTH = 80;

function addImage(event) {
  const fileInput = document.getElementById("file-input-id");
  const file = fileInput.files[0];
  if (!file) return event.preventDefault();

  cancelFilePreview();

  const reader = new FileReader();
  reader.onload = function (e) {
    const img = document.createElement("img");
    img.src = e.target.result;
    img.style.position = "absolute";
    img.style.top = "50%";
    img.style.left = "50%";
    img.style.transform = "translate(-50%, -50%)";
    img.draggable = true;
    img.style.width = `${START_WIDTH}px`;
    img.dataset.rotation = 0;
    img.style.zIndex = getNextHighestZIndex();

    img.addEventListener("dragstart", function (e) {
      e.dataTransfer.setData("text/plain", null);
      const rect = img.getBoundingClientRect();
      e.dataTransfer.setDragImage(img, e.clientX - rect.left, e.clientY - rect.top);
    });

    img.addEventListener("dragend", function (e) {
      const rect = document.getElementById("container-draggable-el").getBoundingClientRect();
      img.style.top = `${e.clientY - rect.top}px`;
      img.style.left = `${e.clientX - rect.left}px`;
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

    document.getElementById("container-draggable-el").appendChild(img);
    saveImgState();

    deselectAllDragEl();
    img.classList.add("selected");
    selectMenu("select-image-menu");
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
    state.forEach((data) => {
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

      img.addEventListener("dragstart", function (e) {
        e.dataTransfer.setData("text/plain", null);
        const rect = img.getBoundingClientRect();
        e.dataTransfer.setDragImage(img, e.clientX - rect.left, e.clientY - rect.top);
      });

      img.addEventListener("dragend", function (e) {
        const rect = document.getElementById("container-draggable-el").getBoundingClientRect();
        img.style.top = `${e.clientY - rect.top}px`;
        img.style.left = `${e.clientX - rect.left}px`;
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

      document.getElementById("container-draggable-el").appendChild(img);
    });
  }
}

// Load state on page load
window.addEventListener("load", loadImgState);
