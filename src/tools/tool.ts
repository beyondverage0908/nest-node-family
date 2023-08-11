/**
 * 字符串数组交集
 * @param arr1
 * @param arr2
 * @returns
 */
export function findIntersection(arr1: string[], arr2: string[]) {
  return arr1.filter((item) => arr2.includes(item));
}
/**
 * 替换文本中的所有空格
 * @param inputString
 * @returns
 */
export function removeAllSpace(inputString: string) {
  const outputString = inputString.replace(/\s/g, '');
  return outputString;
}
/**
 * 获取域名
 * @param urlString
 * @returns
 */
export function getDomainFromUrl(urlString) {
  try {
    // 解析 URL 字符串
    const parsedUrl = new URL(urlString);
    // 获取域名部分（不包含协议和路径）
    return parsedUrl.hostname;
  } catch (error) {
    throw error;
  }
}
/**
 * 获取一个链接的顶级域名
 * @param urlString
 * @returns
 */
export function getTopDomainFromUrl(urlString) {
  try {
    // 解析 URL 字符串
    const parsedUrl = new URL(urlString);
    // 获取域名部分（不包含协议和路径）
    const hostname = parsedUrl.hostname;
    const hostnameParts = hostname.split('.');
    if (hostnameParts.length >= 2) {
      return hostnameParts.slice(-2).join('.');
    }
    return hostname;
  } catch (error) {
    throw error;
  }
}
/**
 * 获取url的origin
 * @param urlString
 * @returns
 */
export function getOriginFromUrl(urlString) {
  try {
    // 解析 URL 字符串
    const parsedUrl = new URL(urlString);
    // 获取域名部分（不包含协议和路径）
    return parsedUrl.origin;
  } catch (error) {
    throw error;
  }
}
