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

### Changed
- Refactored `createImageFromData` to be a reusable function with a return of the created image element
- Increased the height of the menu
- Added fieldset for each element with a caption
- Removed the effects of the work container that provided an unpleasant effect on loading

### Fixed
- Fixed various issues where percentages (%) were used instead of pixels (px)
- Fixed issue where disabled checkboxes did not have a `cursor-pointer` style in CSS

### Removed
