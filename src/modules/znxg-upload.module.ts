// json-upload.module.ts
import { Module } from '@nestjs/common';
import { MulterModule } from '@nestjs/platform-express';
import { ZnxgController } from '../controllers/znxg/znxg.controller';
import { ZnxgService } from '../services/znxg/znxg.service';
import * as multer from 'multer';

@Module({
  imports: [
    MulterModule.register({
      limits: {
        fileSize: Infinity,
      },
      // JSON 文件上传的特定配置
      // dest: './static/znxg',
      storage: multer.diskStorage({
        destination: './static/znxg',
        filename: (req, file, cb) => {
          console.log(1);
          cb(null, file.originalname); // 保持原始文件名
        },
      }),
      fileFilter: (req, file, cb) => {
        console.log(2);
        // JSON 文件验证逻辑
        if (file.mimetype === 'application/json') {
          cb(null, true);
        } else {
          cb(new Error('不合法的文件格式'), false);
        }
      },
    }),
  ],
  controllers: [ZnxgController],
  providers: [ZnxgService],
})
export class ZnxgUploadModule {}
