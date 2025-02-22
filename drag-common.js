function deselectAllDragEl() {
  const spans = document.querySelectorAll("#container-draggable-el span");
  spans.forEach(function (span) {
    if (span.classList.contains("selected")) selectMenu("_disable_select_text");
    span.classList.remove("selected");
  });

  const images = document.querySelectorAll("#container-draggable-el img");
  images.forEach(function (img) {
    if (img.classList.contains("selected")) selectMenu("_disable_select_img");
    img.classList.remove("selected");
  });

  selectMenu("_deselectAllDragEl_reset");
}

function getNextHighestZIndex() {
  const allElements = document.querySelectorAll("#container-draggable-el img, #container-draggable-el span");
  let highestZIndex = 0;
  allElements.forEach((element) => {
    const zIndex = parseInt(element.style.zIndex, 10);
    if (zIndex > highestZIndex) {
      highestZIndex = zIndex;
    }
  });
  return highestZIndex + 1;
}

document.getElementById("container-draggable-el").addEventListener("click", () => deselectAllDragEl());

document.addEventListener("keydown", function (e) {
  if (e.key === "Delete" || e.key === "Backspace") {
    const selectedImage = document.querySelector("#container-draggable-el img.selected");
    if (selectedImage) {
      selectedImage.remove();
      saveImgState();
      selectMenu("_keydown");
    }
  }

  if (e.key === "Delete" || e.key === "Backspace") {
    const selectedSpan = document.querySelector("#container-draggable-el span.selected");
    if (selectedSpan) {
      selectedSpan.remove();
      saveTextState();
      selectMenu("_keydown");
    }
  }
});
