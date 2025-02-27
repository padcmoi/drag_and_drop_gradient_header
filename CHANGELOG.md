# Changelog

All notable changes to this project will be documented in this file.

## [v0.1.0]

### Added
- Added a dropdown menu
- Background adjustment with color gradient on 2 or 3 levels with color palette
- Adjustment of the container size horizontally and vertically
- Banner download with canvas library
- Implementation of Drag and Drop API allowing the movement of text and images
- Implementation of all available Google fonts and automatic import/removal of fonts based on user choices
- All changes made are saved in localStorage
- Added 3 buttons for loading, saving work in an exportable JSON file
- Created Changelog, Readme, License, and initialized the project on GitHub as public
- Add Gitflow

### Changed

### Fixed

### Removed

## [v1.0.0]

### Added
- Added a visual grid that can be disabled for element positioning
- Added `cursor-pointer` class to make elements clickable
- Added a background with a very tight grid to stay within the grid theme
- Added a drag n drop modal allowing precise movement of text or images
- Converted an image element to a background image, with the ability to revert the background image back to an element
- Added a feature to load remote saves or server files
- Added an option to snap elements to the visual grid for better alignment
- Added a CSS stylesheet to enhance the visual appearance of HTML elements
- Added responsiveness to the menu for better display on different screen sizes
- Added display of coordinates for elements when using drag and drop or arrow keys
- Added display of X, Y coordinates for elements when they are selected or moved
- Added `cursor-crosshair` style to the workspace
- Improved the precision of drag and drop by calculating the delta of the initial mouse position
- The dropdown menu is now in a fixed position to follow workspaces that exceed the final screen size
- Added customization for the horizontal scrollbar
- Added manual numeric selection for X and Y values in the workspace, changed to free value also
- Added a system of presets allowing users to save and load predefined configurations for the workspace and elements

### Changed
- Refactored `createImageFromData` to be a reusable function with a return of the created image element
- Increased the height of the menu
- Added fieldset for each element with a caption
- Removed the effects of the work container that provided an unpleasant effect on loading
- The workspace is configured in `px`, the first container retains the maximum height and width values
- Replaced the old menu with a new, more functional menu with better rendering
- Replaced the method of how elements are clicked in the modal-windows component, added the ability to hold to move elements
- Refactored the coordinate display functionality into a reusable component for showing X, Y coordinates of elements
- Moved the grid checkbox to a more accessible location
- Moved the add text button to a more prominent position
- Updated the `DropdownWindow` component with the addition of an event trigger for the menu open/close button

### Fixed
- Fixed various issues where percentages (%) were used instead of pixels (px)
- Fixed issue where disabled checkboxes did not have a `cursor-pointer` style in CSS
- Fixed issues on workspace with `%` and `vh` units that didnt adapt well to different screens by changing them to `px`
- Fixed menu display issues
- Fixed errors with the locked or unlocked button for rotation

### Removed
