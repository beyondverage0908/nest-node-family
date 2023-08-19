import type { Dayjs } from 'dayjs';
import * as dayjs from 'dayjs';

type DateType = string | Dayjs | Date | number;

const SUNDAY = 0; // 周日
const SATURDAY = 6; // 周六

class DateTool {
  /**
   * 格式化 YYYY-MM-DD
   * @param date
   * @returns
   */
  public format(date?: DateType) {
    // 需要构建一个新的日期对象，在centeos系统中，如果在定时任务中仅仅调用dayjs()，他的日期对象是会被复用的，导致长期都是一个历史日期，只要在reload程序后才会读取到最新的日期
    const fdate = date || new Date();
    return dayjs(fdate).format('YYYY-MM-DD');
  }
  /**
   * 格式化 YYYY-MM-DD HH:mm:ss
   * @param date
   * @returns
   */
  public fullFormat(date?: DateType) {
    const fdate = date || new Date();
    return dayjs(fdate).format('YYYY-MM-DD HH:mm:ss');
  }
  /**
   * 根据其实时间和结束时间获取时间范围输入，生成[YYYY-MM-DD, YYYY-MM-DD, YYYY-MM-DD]
   * @param startDate
   * @param endDate
   * @returns [YYYY-MM-DD, YYYY-MM-DD, YYYY-MM-DD]
   */
  public range(startDate: string, endDate: string) {
    if (!startDate || !endDate) return [];
    const diff = dayjs(endDate).diff(startDate, 'day');
    const range = Array.from({ length: diff }, (_, i) => {
      return dayjs(startDate).add(i, 'day').format('YYYY-MM-DD');
    });
    return [...range, endDate];
  }
  /**
   * 获取最近几个交易日的时间
   * @param lastDays
   */
  public recentRange(lastDays: number): string[] {
    let days = lastDays;
    let subday = 0;
    const daterange: string[] = [];
    while (true) {
      if (days <= 0) {
        break;
      }
      const day = dayjs().subtract(subday, 'day');
      const weekNumber = day.day();
      if ([SATURDAY, SUNDAY].includes(weekNumber)) {
        subday += 1;
        continue;
      } else {
        daterange.push(this.format(day));
        days -= 1;
        subday += 1;
      }
    }
    return daterange;
  }
}

export default new DateTool();
