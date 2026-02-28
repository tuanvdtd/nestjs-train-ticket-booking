import multer from 'multer';
import * as fs from 'fs';

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    try {
      fs.mkdirSync('uploads');
      cb(null, 'uploads');
    } catch (error) {
      console.log(error.message)
      cb(null, 'uploads');
    }
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9) + '-' + file.originalname
    console.log(uniqueSuffix)
    cb(null, uniqueSuffix);
  }
})

export { storage };
