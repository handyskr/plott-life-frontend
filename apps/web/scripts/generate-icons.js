const fs = require("node:fs");
const sharp = require("sharp");

const sizes = [
  16, 32, 48, 57, 72, 76, 96, 120, 128, 144, 152, 168, 180, 192, 256, 320, 512,
];
const icon = "./public/Logo.png";
const outputDir = "./public";

if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir);
}

(async () => {
  for (const size of sizes) {
    const filename = [16, 32, 48].includes(size) ? "favicon" : "icon";
    await sharp(icon)
      .resize({
        width: size,
        height: size,
      })
      .png({
        quality: 100,
      })
      .toFile(`${outputDir}/${filename}-${size}x${size}.png`);
  }
})();
