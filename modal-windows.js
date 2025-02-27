class ToolWindowForMovingElements {
  constructor(parentElement) {
    this.parentElement = parentElement;
    this.interval = { info: null, onClick: null };

    this.isDragging = false;
    this.offsetX = 0;
    this.offsetY = 0;
    this.functionButtonUp = (v) => console.log("empty ", v);
    this.functionButtonLeft = (v) => console.log("empty ", v);
    this.functionButtonRight = (v) => console.log("empty ", v);
    this.functionButtonDown = (v) => console.log("empty ", v);

    this.createElements();
    this.addEventListeners();
    this.hideContainer();
  }

  tempInformation(info = "", delay) {
    clearTimeout(this.interval.info);
    this.bottomInformations.textContent = `${info}`;
    this.interval.info = setTimeout(() => (this.bottomInformations.textContent = ""), isNaN(delay) ? 5000 : parseInt(delay));
  }

  hideContainer(status = true) {
    this.container.style.display = status ? "none" : "block";
  }

  handleButtonFn({ functionButtonUp, functionButtonLeft, functionButtonRight, functionButtonDown }) {
    if (functionButtonUp) {
      this.functionButtonUp = (value) => {
        this.tempInformation(`Haut avec ${value}px`);
        functionButtonUp(value);
      };
    }
    if (functionButtonLeft) {
      this.functionButtonLeft = (value) => {
        this.tempInformation(`Gauche avec ${value}px`);
        functionButtonLeft(value);
      };
    }
    if (functionButtonRight) {
      this.functionButtonRight = (value) => {
        this.tempInformation(`Droite avec ${value}px`);
        functionButtonRight(value);
      };
    }
    if (functionButtonDown) {
      this.functionButtonDown = (value) => {
        this.tempInformation(`Bas avec ${value}px`);
        functionButtonDown(value);
      };
    }
  }

  createElements() {
    // Make HTML Elements
    this.container = document.createElement("div");
    this.container.id = "window-move-elements-container";
    this.container.style.position = "absolute";
    this.container.style.zIndex = "9999";
    this.container.style.borderRadius = "10px";
    this.container.style.top = "20px";
    this.container.style.right = "20px";
    this.container.style.width = "200px";
    this.container.style.height = "270px";
    this.container.style.backgroundColor = "rgb(0, 0, 0)";
    this.container.style.border = "1px solid #ffffff";

    this.header = document.createElement("div");
    this.header.id = "window-move-elements-header";
    this.header.style.backgroundColor = "rgb(255, 255, 255)";
    this.header.style.color = "rgb(0, 0, 0)";
    this.header.style.fontWeight = "bold";
    this.header.style.borderTopLeftRadius = "10px";
    this.header.style.borderTopRightRadius = "10px";
    this.header.style.padding = "10px";
    this.header.style.borderBottom = "1px solid #ffffff";
    this.header.style.cursor = "move";
    this.header.style.textAlign = "center";
    this.header.textContent = "Déplaçable".toUpperCase();

    this.content = document.createElement("div");
    this.content.style.backgroundColor = "rgb(0, 0, 0)";
    this.content.style.borderBottomLeftRadius = "10px";
    this.content.style.borderBottomRightRadius = "10px";
    this.content.style.padding = "10px";

    this.grid = document.createElement("div");
    this.grid.style.display = "grid";
    this.grid.style.gridTemplateRows = "repeat(3, 50px)";
    this.grid.style.gridTemplateColumns = "repeat(3, 50px)";
    this.grid.style.gap = "10px";

    this.bottomInformations = document.createElement("div");
    this.bottomInformations.style.position = "absolute";
    this.bottomInformations.style.color = "rgb(0, 255, 0)";
    this.bottomInformations.style.fontSize = "16px";
    this.bottomInformations.style.padding = "20px 0";
    this.bottomInformations.textContent = "Alignement Text/Image";

    this.createButtons();

    this.content.appendChild(this.grid);
    this.content.appendChild(this.bottomInformations);
    this.container.appendChild(this.header);
    this.container.appendChild(this.content);

    this.parentElement.appendChild(this.container);
  }

  createButtons() {
    this.inputRange = this.createInputRange("2", "2");
    this.buttonUp = this.createButton("⬆️", "1", "2", () => this.functionButtonUp(parseInt(this.inputRange.value)));
    this.buttonLeft = this.createButton("⬅️", "2", "1", () => this.functionButtonLeft(parseInt(this.inputRange.value)));
    this.buttonRight = this.createButton("➡️", "2", "3", () => this.functionButtonRight(parseInt(this.inputRange.value)));
    this.buttonDown = this.createButton("⬇️", "3", "2", () => this.functionButtonDown(parseInt(this.inputRange.value)));

    this.grid.appendChild(this.buttonUp);
    this.grid.appendChild(this.buttonLeft);
    this.grid.appendChild(this.inputRange);
    this.grid.appendChild(this.buttonRight);
    this.grid.appendChild(this.buttonDown);
  }

  createButton(text, gridRow, gridColumn, onClick) {
    const button = document.createElement("button");
    button.textContent = text;
    button.style.gridRow = gridRow;
    button.style.gridColumn = gridColumn;
    button.style.backgroundColor = "#000";
    button.style.border = "none";
    button.style.margin = 0;
    button.style.padding = 0;
    button.style.fontSize = "3em";
    button.style.cursor = "pointer";
    button.style.transition = "all 0.3s ease";
    button.onmouseover = () => {
      button.style.filter = "sepia(1)";
      button.style.transform = "scale(1.1)";
    };
    button.onmouseout = () => {
      button.style.filter = "sepia(0)";
      button.style.transform = "scale(1)";
    };
    button.onmousedown = () => {
      clearInterval(this.interval.onClick);
      onClick();
      this.interval.onClick = setInterval(() => onClick(), 100);
    };
    button.onmouseup = () => clearInterval(this.interval.onClick);
    return button;
  }

  createInputRange(gridRow, gridColumn) {
    const inputRange = document.createElement("input");
    inputRange.type = "range";
    inputRange.min = "1";
    inputRange.max = "10";
    inputRange.value = "1";
    inputRange.style.gridRow = gridRow;
    inputRange.style.gridColumn = gridColumn;
    inputRange.style.backgroundColor = "#6200ea";
    inputRange.style.borderRadius = "5px";
    inputRange.style.cursor = "pointer";
    const savedValue = localStorage.getItem("toolWindowForMovingElementsContainerInputRangeValue");
    if (savedValue) inputRange.value = savedValue;

    return inputRange;
  }

  addEventListeners() {
    this.header.addEventListener("mousedown", (e) => {
      this.isDragging = true;
      this.offsetX = e.clientX - this.container.getBoundingClientRect().left;
      this.offsetY = e.clientY - this.container.getBoundingClientRect().top;
    });

    this.inputRange.addEventListener("input", () => {
      this.tempInformation(`interval de ${this.inputRange.value}px`);

      localStorage.setItem("toolWindowForMovingElementsContainerInputRangeValue", this.inputRange.value);
    });

    document.addEventListener("mousemove", (e) => {
      if (this.isDragging) {
        this.container.style.left = `${e.clientX - this.offsetX}px`;
        this.container.style.top = `${e.clientY - this.offsetY}px`;
      }
    });

    document.addEventListener("mouseup", () => {
      this.isDragging = false;
    });

    document.addEventListener("displayContainer", (e) => {
      this.container.style.display = e.detail ? "none" : "block";
    });
  }
}
