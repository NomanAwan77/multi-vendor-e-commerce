const ImageKit = require("@imagekit/nodejs");
const clientImagekit = new ImageKit({
  privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
});

const uploadImage = async (file) => {
  const response = await clientImagekit.files.upload({
    file: file,
    fileName: `${Date.now()}-img`,
    folder: "products",
  });
  return response;
};
module.exports = { uploadImage };
