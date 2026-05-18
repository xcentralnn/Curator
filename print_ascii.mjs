import Jimp from 'jimp';

async function main() {
  const image = await Jimp.read('https://raw.githubusercontent.com/xcentralnn/Curator-Draft/main/docs/curator-logo.png');
  image.resize(100, 40); // fits in terminal
  image.greyscale();
  
  const chars = ' .:-=+*#%@';
  let ascii = '';
  
  for (let y = 0; y < image.bitmap.height; y++) {
    for (let x = 0; x < image.bitmap.width; x++) {
      const color = Jimp.intToRGBA(image.getPixelColor(x, y));
      const brightness = color.r; // greyscale
      const charIdx = Math.floor((brightness / 255) * (chars.length - 1));
      ascii += chars[charIdx];
    }
    ascii += '\n';
  }
  console.log(ascii);
}
main();
