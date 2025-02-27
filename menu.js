const menuManager = {
  init() {
    this.appMenu = document.getElementById("app-menu");
    this.sections = this.appMenu.querySelectorAll(":scope > section");

    this.sections.forEach((section) => {
      // section.style.transform = `translateY(100%)`;
      section.style.display = "none";
    });
    return this;
  },

  showMenu(menuId) {
    if (!this.sections) return this;

    this.sections.forEach((section, index) => {
      if (section.id === menuId) {
        section.style.removeProperty("display");
      } else if (!menuId && index == 0) {
        section.style.removeProperty("display");
      } else {
        section.style.display = "none";
      }
    });
    return this;
  },
};

// Init menu container
const dropdownWindow = new ComponentDropdownWindow(document.getElementById("app-menu"), {
  defaultOpen: true,
  windowHeight: 400,
  menuLabel: "MENU",
  emoji: true,
  backgroundColor: "transparent",
});

// elements in the menu container
menuManager.init();
menuManager.showMenu();

function updateMenuChildMinHeight() {
  const menuContainer = document.querySelector(".menu-container");
  if (menuContainer) {
    const newMinHeight = menuContainer.clientHeight - 21;
    const menuChildren = document.querySelectorAll(".menu-child");
    menuChildren.forEach((child) => {
      child.style.minHeight = `${newMinHeight}px`;
    });
  }
}
window.addEventListener("resize", updateMenuChildMinHeight);
window.addEventListener("load", updateMenuChildMinHeight);
