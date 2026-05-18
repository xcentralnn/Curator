import * as Jimp from 'jimp';

async function main() {
  const image = await Jimp.Jimp.read('https://raw.githubusercontent.com/xcentralnn/Curator-Draft/main/docs/curator-logo.png');
  image.resize({w: 120, h: 40}); 
  image.greyscale();
  
  const chars = ' .:-=+*#%@';
  let ascii = '';
  
  for (let y = 0; y < image.bitmap.height; y++) {
    for (let x = 0; x < image.bitmap.width; x++) {
      const color = Jimp.intToRGBA(image.getPixelColor(x, y));
      const brightness = Math.floor((color.r + color.g + color.b) / 3);
      const charIdx = Math.floor((brightness / 255) * (chars.length - 1));
      ascii += chars[charIdx];
    }
    ascii += '\n';
  }
  console.log(ascii);
}
main();
