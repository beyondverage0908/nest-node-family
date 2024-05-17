import {
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Inject,
  LoggerService,
  Post,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { ZnxgService } from '../../services/znxg/znxg.service';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import * as path from 'path';
import { HttpResult } from '@/index';
import * as fs from 'fs';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import * as extractzip from 'extract-zip';

@Controller('nest/api/znxg')
export class ZnxgController {
  constructor(
    @Inject(WINSTON_MODULE_NEST_PROVIDER)
    private readonly loggerService: LoggerService,
    private readonly znxgService: ZnxgService,
  ) {}

  @Get('json')
  async getZnxgJson(): Promise<HttpResult<any>> {
    try {
      const dir = path.join(process.cwd(), `./static/znxg`);
      const files = fs.readdirSync(dir);
      // 过滤出json文件
      const jsonFiles = files.filter((file) => path.extname(file) === '.json');

      // 并行读取所有json文件的内容
      const fileContents = await Promise.all(
        jsonFiles.map((file) => {
          const content = fs.readFileSync(path.join(dir, file), { encoding: 'utf-8' });
          return JSON.parse(content);
        }),
      );

      // 构建以文件名为 key，内容为 value 的对象
      const result = jsonFiles.reduce((acc, file, index) => {
        const fileNameWithoutExtension = path.basename(file, '.json');
        acc[fileNameWithoutExtension] = fileContents[index];
        return acc;
      }, {});

      return {
        message: '成功',
        data: result,
        success: true,
        code: HttpStatus.OK,
      };
    } catch (error) {
      throw new HttpException('获取数据失败', HttpStatus.BAD_REQUEST);
    }
  }
  @Post('/upload/json')
  @UseInterceptors(
    FileFieldsInterceptor([
      // { name: 'data01', maxCount: 1 },
      // { name: 'data02', maxCount: 1 },
      { name: 'data', maxCount: 1 },
    ]),
  )
  async changeHotData(
    @UploadedFiles()
    files: {
      // data01?: Express.Multer.File[];
      // data02?: Express.Multer.File[];
      data: Express.Multer.File[];
    },
  ): Promise<HttpResult<string>> {
    const { data } = files;
    if (!data) {
      throw new HttpException('上传的文件不能为空', HttpStatus.BAD_REQUEST);
    }
    const file = data[0];
    await this.dealZip(file);

    // const { data01, data02, data } = files;
    // if (!data01 && !data02) {
    //   throw new HttpException('文件不能为空，data01.json和data02.json文件至少需要一个', HttpStatus.BAD_REQUEST);
    // }

    // if (data01 && path.extname(data01[0].originalname) !== '.json') {
    //   throw new HttpException('data01文件格式错误', HttpStatus.BAD_REQUEST);
    // }
    // if (data02 && path.extname(data02[0].originalname) !== '.json') {
    //   throw new HttpException('data02文件格式错误', HttpStatus.BAD_REQUEST);
    // }

    // if (data01) {
    //   const data01File = data01[0];
    //   // 读取文件内容
    //   const fileContent = data01File.buffer.toString('utf-8');
    //   try {
    //     // 将文件内容解析为 JSON 对象
    //     JSON.parse(fileContent);
    //   } catch (error) {
    //     this.loggerService.error(error);
    //     throw new HttpException('data01内部格式错误', HttpStatus.BAD_REQUEST);
    //   }
    //   const writeStream = fs.createWriteStream(path.join(process.cwd(), `./static/znxg/${data01File.originalname}`));
    //   writeStream.write(fileContent, 'utf-8', (err) => {
    //     if (err) {
    //       throw new HttpException('data01文件保存失败，请重试', HttpStatus.BAD_REQUEST);
    //     }
    //   });
    // }
    // if (data02) {
    //   const data02File = data02[0];
    //   // 读取文件内容
    //   const fileContent = data02File.buffer.toString('utf-8');
    //   try {
    //     // 将文件内容解析为 JSON 对象
    //     JSON.parse(fileContent);
    //   } catch (error) {
    //     throw new HttpException('data02内部格式错误', HttpStatus.BAD_REQUEST);
    //   }
    //   const writeStream = fs.createWriteStream(path.join(process.cwd(), `./static/znxg/${data02File.originalname}`));
    //   writeStream.write(fileContent, 'utf-8', (err) => {
    //     if (err) {
    //       throw new HttpException('data02文件保存失败，请重试', HttpStatus.BAD_REQUEST);
    //     }
    //   });
    // }
    // 返回响应
    return { code: HttpStatus.OK, message: '保存成功', data: '成功', success: true };
  }
  async dealZip(file: Express.Multer.File) {
    try {
      const tempDir = path.join(process.cwd(), `./static/znxg`);
      const tempPath = path.join(tempDir, `${file.fieldname}.zip`);
      this.loggerService.log(`上传上来的文件：${tempPath}`);
      fs.writeFileSync(tempPath, file.buffer);

      await extractzip(tempPath, { dir: tempDir });
      this.loggerService.log(`解压上传上来的文件成功：${tempPath}`);
      // 删除文件
      fs.unlinkSync(tempPath);
    } catch (error) {
      this.loggerService.error(error.message);
      throw new HttpException(`文件存储或解压失败: ${error.message}`, HttpStatus.BAD_REQUEST);
    }
  }
}
