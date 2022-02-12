const multer = require('multer'); // middleware
const cloudinary = require('cloudinary').v2; // almacenamiento en la nube
const CloudinaryStorage = require('multer-storage-cloudinary').CloudinaryStorage; // conecta los dos anteriores


// Configurar cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_KEY,
  api_secret: process.env.CLOUDINARY_SECRET
})

const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: 'ironhack/multer-example',
    allowed_formats: ['jpg', 'png'],  
  }
})

module.exports = multer({ storage })