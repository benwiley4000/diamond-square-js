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

render();

function render () {
  const level = Number(levelInput.value);
  const span = 2 ** level + 1;
  textureCanvas.width = span;
  textureCanvas.height = span;

  // initialize height data container
  const heightData = Array(span);
  for (let x = 0; x < span; x++) {
    heightData[x] = Array(span);
  }

  // compute heights via Diamond Square algorithm
  heightData[0][0] = Number(topLeftHeightInput.value);
  heightData[span - 1][0] = Number(topRightHeightInput.value);
  heightData[0][span - 1] = Number(bottomLeftHeightInput.value);
  heightData[span - 1][span - 1] = Number(bottomRightHeightInput.value);
  const maxHeight = Math.max(
    heightData[0][0],
    heightData[span - 1][0],
    heightData[0][span - 1],
    heightData[span - 1][span - 1],
    diamondSquare(heightData, level) // performs diamond square algorithm
  );

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

// implementation based on visual description at:
// https://en.wikipedia.org/wiki/Diamond-square_algorithm#Visualization
// NOTE: mutates heightData.
function diamondSquare (heightData, level) {
  let maxHeight = 0;

  if (level < 1) {
    return maxHeight;
  }

  const interval = 2 ** level;
  const half = 2 ** (level - 1);

  // diamond step
  for (let yOffset = 0; yOffset + 1 < heightData.length; yOffset += interval) {
    for (let xOffset = 0; xOffset + 1 < heightData.length; xOffset += interval) {
      heightData[xOffset + half][yOffset + half] = (
        heightData[xOffset + 0][yOffset + 0] +
        heightData[xOffset + half * 2][yOffset + 0] +
        heightData[xOffset + 0][yOffset + half * 2] +
        heightData[xOffset + half * 2][yOffset + half * 2]
      ) / 4 + 0 /* TODO: replace 0 with random number */;

      maxHeight = Math.max(
        maxHeight,
        heightData[xOffset + half][yOffset + half]
      );
    }
  }

  // square step
  for (let yOffset = 0; yOffset + 1 < heightData.length; yOffset += interval) {
    for (let xOffset = 0; xOffset + 1 < heightData.length; xOffset += interval) {
      const noTopCorner = yOffset <= 0;
      heightData[xOffset + half][yOffset + 0] = (
        (noTopCorner ? 0 : heightData[xOffset + half][yOffset - half]) +
        heightData[xOffset + half][yOffset + half] +
        heightData[xOffset + 0][yOffset + 0] +
        heightData[xOffset + half * 2][yOffset + 0]
      ) / (noTopCorner ? 3 : 4) + 0 /* TODO: replace 0 with random number */;
      const noBottomCorner = yOffset + half * 2 + 1 >= heightData.length;
      heightData[xOffset + half][yOffset + half * 2] = (
        heightData[xOffset + half][yOffset + half] +
        (noBottomCorner ? 0 : heightData[xOffset + half][yOffset + half * 3]) +
        heightData[xOffset + 0][yOffset + half * 2] +
        heightData[xOffset + half * 2][yOffset + half * 2]
      ) / (noBottomCorner ? 3 : 4) + 0 /* TODO: replace 0 with random number */;
      const noLeftCorner = xOffset <= 0;
      heightData[xOffset + 0][yOffset + half] = (
        heightData[xOffset + 0][yOffset + 0] +
        heightData[xOffset + 0][yOffset + half * 2] +
        (noLeftCorner ? 0 : heightData[xOffset - half][yOffset + half]) +
        heightData[xOffset + half][yOffset + half]
      ) / (noLeftCorner ? 3 : 4) + 0 /* TODO: replace 0 with random number */;
      const noRightCorner = xOffset + half * 2 + 1 >= heightData.length;
      heightData[xOffset + half * 2][yOffset + half] = (
        heightData[xOffset + half * 2][yOffset + 0] +
        heightData[xOffset + half * 2][yOffset + half * 2] +
        heightData[xOffset + half][yOffset + half] +
        (noRightCorner ? 0 : heightData[xOffset + half * 3][yOffset + half])
      ) / (noRightCorner ? 3 : 4) + 0 /* TODO: replace 0 with random number */;

      maxHeight = Math.max(
        maxHeight,
        heightData[xOffset + half][yOffset + half],
        heightData[xOffset + half][yOffset + 0],
        heightData[xOffset + half][yOffset + half * 2],
        heightData[xOffset + 0][yOffset + half],
        heightData[xOffset + half * 2][yOffset + half]
      );
    }
  }

  return Math.max(maxHeight, diamondSquare(heightData, level - 1));
}
