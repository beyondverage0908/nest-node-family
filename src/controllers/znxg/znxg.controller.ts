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

@Controller('nest/api/znxg')
export class ZnxgController {
  constructor(
    @Inject(WINSTON_MODULE_NEST_PROVIDER)
    private readonly loggerService: LoggerService,
    private readonly znxgService: ZnxgService,
  ) {}

  @Get('json')
  async getZnxgJson(): Promise<HttpResult<any>> {
    const data01Path = path.join(process.cwd(), `./static/znxg/data01.json`);
    const data02Path = path.join(process.cwd(), `./static/znxg/data02.json`);
    let data01 = null;
    if (fs.existsSync(data01Path)) {
      data01 = fs.readFileSync(data01Path, { encoding: 'utf-8' });
    }
    let data02 = null;
    if (data02) {
      data02 = fs.readFileSync(data02Path, { encoding: 'utf-8' });
    }
    return {
      message: '成功',
      data: {
        data01: JSON.parse(data01),
        data02: JSON.parse(data02),
      },
      success: true,
      code: HttpStatus.OK,
    };
  }
  @Post('/upload/json')
  @UseInterceptors(
    FileFieldsInterceptor([
      { name: 'data01', maxCount: 1 },
      { name: 'data02', maxCount: 1 },
    ]),
  )
  async changeHotData(
    @UploadedFiles() files: { data01?: Express.Multer.File[]; data02?: Express.Multer.File[] },
  ): Promise<HttpResult<string>> {
    const { data01, data02 } = files;
    if (!data01 && !data02) {
      throw new HttpException('文件不能为空，data01.json和data02.json文件至少需要一个', HttpStatus.BAD_REQUEST);
    }

    if (data01 && path.extname(data01[0].originalname) !== '.json') {
      throw new HttpException('data01文件格式错误', HttpStatus.BAD_REQUEST);
    }
    if (data02 && path.extname(data02[0].originalname) !== '.json') {
      throw new HttpException('data02文件格式错误', HttpStatus.BAD_REQUEST);
    }

    if (data01) {
      const data01File = data01[0];
      // 读取文件内容
      const fileContent = data01File.buffer.toString('utf-8');
      try {
        // 将文件内容解析为 JSON 对象
        JSON.parse(fileContent);
      } catch (error) {
        this.loggerService.error(error);
        throw new HttpException('data01内部格式错误', HttpStatus.BAD_REQUEST);
      }
      const writeStream = fs.createWriteStream(path.join(process.cwd(), `./static/znxg/${data01File.originalname}`));
      writeStream.write(fileContent, 'utf-8', (err) => {
        if (err) {
          throw new HttpException('data01文件保存失败，请重试', HttpStatus.BAD_REQUEST);
        }
      });
    }
    if (data02) {
      const data02File = data02[0];
      // 读取文件内容
      const fileContent = data02File.buffer.toString('utf-8');
      try {
        // 将文件内容解析为 JSON 对象
        JSON.parse(fileContent);
      } catch (error) {
        throw new HttpException('data02内部格式错误', HttpStatus.BAD_REQUEST);
      }
      const writeStream = fs.createWriteStream(path.join(process.cwd(), `./static/znxg/${data02File.originalname}`));
      writeStream.write(fileContent, 'utf-8', (err) => {
        if (err) {
          throw new HttpException('data02文件保存失败，请重试', HttpStatus.BAD_REQUEST);
        }
      });
    }
    // 返回响应
    return { code: HttpStatus.OK, message: '保存成功', data: '成功', success: true };
  }
}
