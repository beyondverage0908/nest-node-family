import DongdongPushDto from '@/dtos/dongdong/DongDongPushDto';
import { Controller, HttpStatus, Post, Headers, Body, UseInterceptors } from '@nestjs/common';
import { AnyFilesInterceptor } from '@nestjs/platform-express';
import axios from 'axios';
import * as FormData from 'form-data';

@Controller('/nest/api/dongdong')
export class DongdongController {
  @Post('sendmessage')
  @UseInterceptors(AnyFilesInterceptor())
  /**
   * 转发咚咚消息推送
   */
  async sendMessage(@Headers() headers, @Body() dongdongMessageDto: DongdongPushDto) {
    const token = headers['token'];
    const account = headers['account'];

    if (!token || !account) {
      return {
        code: HttpStatus.BAD_REQUEST,
        success: false,
        message: 'token和account不能为空',
        data: null,
      };
    }
    try {
      const formData = new FormData();
      Object.keys(dongdongMessageDto).forEach((key) => {
        formData.append(key, dongdongMessageDto[key]);
      });
      const result = await axios.request({
        method: 'POST',
        url: 'https://dongdong-api.eastmoney.com/oa-chat-api/api/msg/send',
        headers: { token, account },
        data: formData,
      });
      console.log(result.data);
      return result.data;
    } catch (error) {
      return {
        code: HttpStatus.SERVICE_UNAVAILABLE,
        success: false,
        message: `服务器异常:${error.message}`,
        data: null,
      };
    }
  }
}
