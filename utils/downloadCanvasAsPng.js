function downloadCanvasAsPNG($canvas, filename) {
  // Get the canvas element using its ID
  var canvas = $canvas;
  if (!canvas) {
    throw new Error('Canvas not found');
  }

  // Create a data URL for the canvas image
  var dataURL = canvas.toDataURL('image/png');

  // Create a temporary anchor element and trigger a download
  var downloadLink = document.createElement('a');
  downloadLink.href = dataURL;
  downloadLink.download = filename;

  // Append the link to the body, click it, and then remove it
  document.body.appendChild(downloadLink);
  downloadLink.click();
  document.body.removeChild(downloadLink);
}
