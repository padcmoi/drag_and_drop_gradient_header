# Drag and Drop Gradient Header

Welcome to the Gradient Header Creation project! This project was built from scratch and allows you to create banners with beautiful gradients by adding images and text with Google fonts.

About 1806 Google fonts, it is usually recommended to retrieve the fonts through the Google API `https://www.googleapis.com/webfonts/v1/webfonts?key=`, but this script does not have a backend and it is not secure to leave the API key visible. If you wish to provide it dynamically through a backend, please modify the `common.js` script.

## Why was this project created?

This project was created out of a personal need to design a LinkedIn banner with a gradient background. Initially, the goal was simple: create a gradient background and add images using Paint software. However, due to the difficulty of creating gradients with Paint on Windows 11, I decided to use HTML/CSS3 to achieve my gradient background to export to Paint. As I progressed, I had ideas that I transformed into features such as drag-and-drop and the use of Google fonts, turning the project into a complete tool for creating visually appealing banners.

Initially, my goal was not to add so many features to this project; otherwise, I would have used React or Vue to simplify by creating reusable components.

With each new idea, I added features while leveraging my JS knowledge to implement them. Except for Canvas, I did not use any external libraries. My experience with drag-and-drop was gained while working at the company Vtest.

This project is open-source and I share it.

## Features

- **Drag and Drop**: Implemented using the HTML5 Drag and Drop API, allowing the movement and positioning of image or text elements.
- **Gradient Header**: A visually appealing header with a gradient background.
- **Banner Creation**: Create downloadable image banners with text using all fonts provided by Google.
- **Canvas**: Utilized for downloading the created banners.

## Getting Started

### Prerequisites

The only prerequisites are HTML, VanillaJS, and CSS3, so you just need to run `index.html` on any browser or on an Apache2/Nginx server.

### Installation

No installation necessary.

## Project Structure

The project directory is structured as follows:

- `common.js`: Contains common utility functions used across the project.
- `drag-common.js`: Handles common drag and drop functionality.
- `drag-image.js`: Manages the drag and drop operations for images.
- `drag-text.js`: Manages the drag and drop operations for text.
- `google-fonts.json`: JSON file containing Google Fonts data.
- `index.html`: The main HTML file to run the project.

## Contributing

Contributions are welcome! Please open an issue or submit a pull request.

## Demo

You can check out a live demo of the project deployed on Netlify [See DEMO](https://famous-tarsier-f19f46.netlify.app/).

## Versioning

This project uses [Semantic Versioning](https://semver.org/) and follows the [Gitflow Workflow](https://www.atlassian.com/git/tutorials/comparing-workflows/gitflow-workflow). 

### Semantic Versioning

Given a version number `MAJOR.MINOR.PATCH`, increment the:

- `MAJOR` version when you make incompatible API changes,
- `MINOR` version when you add functionality in a backwards-compatible manner, and
- `PATCH` version when you make backwards-compatible bug fixes.

### Gitflow Workflow

This project uses the Gitflow Workflow. For more information, visit the [Gitflow Workflow](https://www.atlassian.com/git/tutorials/comparing-workflows/gitflow-workflow) page.

## License

This project is licensed under the [MIT License](LICENSE.md).

## Contact

For any questions or feedback, please contact [contact@julienjean.ovh](mailto:contact@julienjean.ovh).
