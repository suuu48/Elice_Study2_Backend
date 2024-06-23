import { Request, Response, NextFunction } from 'express';
import { AppError } from '../utils/errorHandler';
import multer from 'multer';
import fs from 'fs';

if (!fs.existsSync('public')) {
  fs.mkdirSync('public');
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'public/');
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});

const upload = multer({ storage: storage });

const processImage = (req: Request, res: Response, next: NextFunction) => {
  upload.single('post_img')(req, res, (error) => {
    try {
      next();
    } catch (error) {
      console.log(error);
      next(new AppError(400, '[ 이미지 업로드 에러 ] 업로드 실패'));
    }
  });
};

export default processImage;
