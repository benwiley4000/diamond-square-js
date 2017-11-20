const textureCanvas = document.getElementById('texture');
const ctx = textureCanvas.getContext('2d');

const levelInput = document.getElementById('level');
const topLeftHeightInput = document.getElementById('tl');
const topRightHeightInput = document.getElementById('tr');
const bottomLeftHeightInput = document.getElementById('bl');
const bottomRightHeightInput = document.getElementById('br');

levelInput.addEventListener('input', render);
topLeftHeightInput.addEventListener('input', render);
topRightHeightInput.addEventListener('input', render);
bottomLeftHeightInput.addEventListener('input', render);
bottomRightHeightInput.addEventListener('input', render);

function render () {
  const level = levelInput.value;
  const span = 2 ** level + 1;
  textureCanvas.width = span;
  textureCanvas.height = span;

  // compute heights via Diamond Square algorithm
  let maxHeight = 0;
  const heightData = Array(span);
  for (let x = 0; x < span; x++) {
    heightData[x] = Array(span);
    for (let y = 0; y < span; y++) {
      heightData[x][y] = 5 + Math.random() * 10;
      maxHeight = Math.max(maxHeight, heightData[x][y]);
    }
  }

  // convert heights to image data for canvas
  const imageData = ctx.createImageData(span, span);
  const { data } = imageData;
  for (let y = 0; y < span; y++) {
    for (let x = 0; x < span; x++) {
      const brightness = Math.round(heightData[x][y] / maxHeight * 255);
      data[y * span * 4 + x * 4 + 0] = brightness; // r
      data[y * span * 4 + x * 4 + 1] = brightness; // g
      data[y * span * 4 + x * 4 + 2] = brightness; // b
      data[y * span * 4 + x * 4 + 3] = 255;        // a
    }
  }

  ctx.putImageData(imageData, 0, 0);
}

render();
