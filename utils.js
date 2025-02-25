/**
 * Calculates the percentage between two values.
 *
 * @param {number|string} current - The current value.
 * @param {number|string} max - The maximum value.
 * @returns {number} The percentage of the current value relative to the maximum value.
 */
function calculatePercentageBetweenValues(current, max) {
  if (parseInt(current) === 0) return 0;

  return parseInt((parseInt(max) / parseInt(current)) * 100);
}

/**
 * Calculates the height in pixels based on a given pixel value and the original offset height of the document body.
 *
 * @param {number} [currentPixel=150] - The pixel value to calculate the height for.
 * @returns {number} The calculated height in pixels.
 */
function calculateHeightInPixels(currentPixel = 150) {
  if (!localStorage.getItem("createdOriginOffsetHeight")) localStorage.setItem("createdOriginOffsetHeight", document.body.offsetHeight);
  const containerHeight = parseInt(loadCommonState("createdOriginOffsetHeight", document.body.offsetHeight));

  const percent = calculatePercentageBetweenValues(containerHeight, currentPixel);

  return parseInt((containerHeight * percent) / 100);
}

/**
 * Calculates the width in pixels based on a given pixel value and the original offset width of the document body.
 *
 * @param {number} [currentPixel=150] - The pixel value to calculate the width for.
 * @returns {number} The calculated width in pixels.
 */
function calculateWidthInPixels(currentPixel = 150) {
  if (!localStorage.getItem("createdOriginOffsetWidth")) localStorage.setItem("createdOriginOffsetWidth", document.body.offsetWidth);
  const containerWidth = parseInt(loadCommonState("createdOriginOffsetWidth", document.body.offsetWidth));

  const percent = calculatePercentageBetweenValues(containerWidth, currentPixel);

  return parseInt((containerWidth * percent) / 100);
}

/**
 * Calculates the height as a percentage of the original offset height of the document body.
 *
 * @param {number} [pixels=300] - The pixel value to calculate the percentage for.
 * @returns {number} The calculated height as a percentage.
 */
function calculateHeightToPercentage(pixels = 300) {
  if (!localStorage.getItem("createdOriginOffsetHeight")) {
    localStorage.setItem("createdOriginOffsetHeight", document.body.offsetHeight);
  }
  const containerHeight = parseInt(loadCommonState("createdOriginOffsetHeight", document.body.offsetHeight));
  return parseInt((parseInt(pixels) / containerHeight) * 100);
}

/**
 * Calculates the width as a percentage of the original offset width of the document body.
 *
 * @param {number} [pixels=300] - The pixel value to calculate the percentage for.
 * @returns {number} The calculated width as a percentage.
 */
function calculateWidthToPercentage(pixels = 300) {
  if (!localStorage.getItem("createdOriginOffsetWidth")) {
    localStorage.setItem("createdOriginOffsetWidth", document.body.offsetWidth);
  }
  const containerWidth = parseInt(loadCommonState("createdOriginOffsetWidth", document.body.offsetWidth));
  return parseInt((parseInt(pixels) / containerWidth) * 100);
}
