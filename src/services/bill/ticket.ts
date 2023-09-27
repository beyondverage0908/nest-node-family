// http://111.229.62.79/bill/wechat?shopName=%E8%80%81%E4%B9%A1%E9%B8%A1%E8%92%B8%E8%8F%9C%E9%A6%86&shopTime=2022-03-12%18:35:34&shopAddress=%E9%9B%A8%E8%8A%B1%E5%AE%A2%E5%8E%8512%E5%8F%B7&money=35

// http://111.229.62.79/bill/?shopName=%E8%80%81%E4%B9%A1%E9%B8%A1%E8%92%B8%E8%8F%9C%E9%A6%86&shopTime=2022-03-12%18:35:34&shopAddress=%E9%9B%A8%E8%8A%B1%E5%AE%A2%E5%8E%8512%E5%8F%B7&money=35

import dateTool from './date';

type TicketType = {
  shopName?: string;
  shopTime?: string;
  shopAddress?: string;
  money?: string;
};

// 商品页面
export const TICKET_SHOP_URL = 'https://h5apptest.dongcaibaoxian.com/bill/';
// 微信付款页
export const TICKET_WECHAT_URL =
  'https://h5apptest.dongcaibaoxian.com/bill/wechat';

// 生成一个大于35，小于44的金额
function getMoney() {
  return 35 + (Date.now() % 5);
}

const shopNames = [
  '蒸菜馆',
  '芝根芝底披萨',
  '小碗蒸菜',
  '小菜园新徽菜',
  '东北饺子馆',
  '湘菜馆 私房菜',
  '金陵后厨',
];
const shopAddresses = [
  '雨花客厅店13号',
  '雨花客厅店19号',
  '雨花客厅店23号',
  '雨花客厅店45号',
  '雨花客厅店67号',
  '雨花客厅店58号',
];

/**
 * 生成地址
 * @param shop
 * @returns
 */
export const generateShopUrl = (shop: TicketType) => {
  const shopName = shop.shopName || shopNames[Date.now() % shopNames.length];
  const shopAddress =
    shop.shopAddress || shopAddresses[Date.now() % shopAddresses.length];
  const money = shop.money ? shop.money : getMoney();
  return `${TICKET_SHOP_URL}?shopName=${shopName}&shopTime=${shop.shopTime}&shopAddress=${shopAddress}&money=${money}`;
};

/**
 * 生成微信地址
 * @param shop
 * @returns
 */
export const generateWechatUrl = (shop: TicketType) => {
  const shopName = shop.shopName || shopNames[Date.now() % shopNames.length];
  const shopAddress =
    shop.shopAddress || shopAddresses[Date.now() % shopAddresses.length];
  const money = shop.money ? shop.money : getMoney();
  return `${TICKET_WECHAT_URL}?shopName=${shopName}&shopTime=${shop.shopTime}&shopAddress=${shopAddress}&money=${money}`;
};

// 生成两个范围之间的数
function getRandomArbitrary(min: number, max: number) {
  return Math.ceil(Math.random() * (max - min) + min);
}
// 获取指定的时间
export function formatDate(dateString: string): string {
  const hour = getRandomArbitrary(18, 20);
  const minute = getRandomArbitrary(0, 59);
  const second = getRandomArbitrary(0, 59);
  return `${dateTool.format(dateString)} ${hour}:${
    minute < 10 ? '0' + minute : minute
  }:${second < 10 ? '0' + second : second}`;
}
