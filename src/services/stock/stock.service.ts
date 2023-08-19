import { Injectable } from '@nestjs/common';
import axios from 'axios';
import {
  SH_SZ_LASTDAY_TRUNOVER_URL,
  SH_SZ_REALTIME_TRUNOVER_URL,
  SH_SZ_STOCK_VALUE_URL,
} from '../../config/thirdparty-service';
import SecurityTool from '../../utils/security-tool';

interface DayTurnoverResult {
  version: string;
  result: {
    TREANDS: Record<string, number>[];
    SNAP: Record<string, number>;
  };
  success: boolean;
  message: string;
  code: number;
}
interface LastDayTurnoverResult {
  version: string;
  result: {
    pages: number;
    data: { TRADE_DATE: string; TRADE_TIME: string; SUMTVAL: number }[];
    count: number;
  };
  success: boolean;
  message: string;
  code: number;
}
interface SecurtiyInfoResult {
  rc: number;
  rt: number;
  svr: number;
  lt: number;
  full: number;
  dlmkts: string;
  data: Record<string, any>;
}

@Injectable()
export class StockService {
  // 获取两市成交量
  async getDayTurnover() {
    const httpResult = await axios.request({
      url: SH_SZ_REALTIME_TRUNOVER_URL,
      method: 'get',
      timeout: 5000,
      params: {
        reportName: 'RPT_CUSTOM_BULL_AND_BEAR_WIND_INDICATOR',
        source: 'securities',
        client: 'APP',
      },
    });
    const result = httpResult.data as DayTurnoverResult;
    if (result.success) {
      return result.result.TREANDS;
    }
    return null;
  }
  // 获取两市成交量
  async getLastDayTurnover() {
    const httpResult = await axios.request({
      url: SH_SZ_LASTDAY_TRUNOVER_URL,
      method: 'get',
      timeout: 5000,
      params: {
        reportName: 'RPT_DMSK_WINDVANE_FSHIS',
        columns: 'TRADE_DATE,TRADE_TIME,SUMTVAL',
        sortTypes: 1,
        sortColumns: 'TRADE_TIME',
        source: 'securities',
        client: 'APP',
      },
    });
    const result = httpResult.data as LastDayTurnoverResult;
    if (result.success) {
      return {
        count: result.result.count,
        data: result.result.data,
      };
    }
    return null;
  }
  async getSecurityInfo(securityCode: string) {
    const code = SecurityTool.getConfirmSecurityCode(securityCode);
    const httpResult = await axios.request({
      url: SH_SZ_STOCK_VALUE_URL,
      method: 'get',
      timeout: 5000,
      params: {
        _ts: String(Date.now()),
        ut: '816013edf3fba48759721fd1d7b4e12c',
        fltt: 2,
        fields:
          'f55,f52,f51,f50,f49,f48,f47,f46,f45,f44,f43,f40,f57,f58,f59,f60,f169,f170,f171,f172,f173,f174,f175,f176,f177,f178',
        secid: code,
      },
    });
    const result = httpResult.data as SecurtiyInfoResult;
    if (result.data) {
      // return result.data;
      return {
        value: result.data.f43,
        percent: result.data.f170,
        number: result.data.f169,
        name: result.data.f58,
        code: result.data.f57,
      };
    }
    return null;
  }
}
