class ComponentDropdownWindow {
  constructor(childrenHTML, { defaultOpen = false, windowHeight = 200, menuLabel = "☰ Toggle MENU", backgroundColor = "#444444" } = {}) {
    this.childrenHTML = childrenHTML;
    this.menuOpen = defaultOpen;
    this.windowHeight = windowHeight;
    this.menuLabel = menuLabel;
    this.backgroundColor = backgroundColor;

    this.createStyles();
    this.createContainerElement();
    this.createButtonElement();

    this.toggleMenu();
  }

  createStyles() {
    this.styles = document.createElement("style");
    this.styles.innerHTML = `
            .menu-container {
              position: absolute;
              bottom: 0;
              width: 100%;
              background-color: ${this.backgroundColor};
              overflow: hidden;
              overflow-y: auto;
              transition: height 0.3s;
              height: 0;
            }

            .menu-container::-webkit-scrollbar {
              width: 8px;
            }

            .menu-container::-webkit-scrollbar-track {
              background: #f1f1f1;
            }

            .menu-container::-webkit-scrollbar-thumb {
              background: #007bff;
              border-radius: 4px;
            }

            .menu-container::-webkit-scrollbar-thumb:hover {
              background: #0056b3;
            }

            .menu-toggle-button {
              position: absolute;
              right: 2em;
              transition: bottom 0.3s, background-color 0.3s;
              bottom: 0;
              cursor: pointer;
              background-color: #007bff;
              color: white;
              border: none;
              padding: 0.5em 1em;
              border-radius: 4px;
            }

            .menu-toggle-button:hover {
              background-color: #0056b3;
            }
          `;

    document.head.appendChild(this.styles);
  }

  createContainerElement() {
    this.menuContainer = document.createElement("div");
    this.menuContainer.className = "menu-container";
    this.menuContainer.appendChild(this.childrenHTML);
    document.body.appendChild(this.menuContainer);
  }

  createButtonElement() {
    this.menuToggleButton = document.createElement("button");
    this.menuToggleButton.className = "menu-toggle-button";
    this.menuToggleButton.innerText = `${this.menuLabel}`;
    this.menuToggleButton.onclick = this.toggleMenu.bind(this);
    document.body.appendChild(this.menuToggleButton);
  }

  toggleMenu({ open, close } = {}) {
    this.menuOpen = open ? true : close ? false : this.menuOpen;

    if (this.menuOpen) {
      this.menuContainer.style.height = `${this.windowHeight}px`;
      this.menuToggleButton.style.bottom = `${this.windowHeight}px`;
    } else {
      this.menuContainer.style.height = 0;
      this.menuToggleButton.style.bottom = 0;
    }

    this.menuOpen = !this.menuOpen;

    const event = new CustomEvent("DropdownWindowMenuStatus", {
      detail: { menuOpen: !this.menuOpen },
    });
    document.dispatchEvent(event);
  }
}
