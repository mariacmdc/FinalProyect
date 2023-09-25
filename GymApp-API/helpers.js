const sharp = require('sharp');
const path = require('path');
const fs = require('fs').promises;
const { v4: uuidv4 } = require('uuid');

const generateError = (message, status) => {
  const error = new Error(message);
  error.httpStatus = status;
  return error;
};

const uploadsPath = path.join(__dirname, 'uploads');

const processAndSavingImg = async (imageData, maxWidth = 300) => {
  await fs.mkdir(uploadsPath, { recursive: true });

  const processedImage = sharp(imageData);
  const { width, format } = await processedImage.metadata();

  if (width > maxWidth) {
    processedImage.resize(maxWidth);
  }

  const imageName = `${uuidv4()}.${format}`;
  const imagePath = path.join(uploadsPath, imageName);
  await processedImage.toFile(imagePath);

  return imageName;
};

module.exports = {
  generateError,
  processAndSavingImg,
};
