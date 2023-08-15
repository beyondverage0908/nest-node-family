export default class SecurityTool {
  // 获取正确的证券编码
  public static getConfirmSecurityCode(securityCode: string) {
    if (securityCode.startsWith('6') || securityCode.startsWith('9')) {
      return `1.${securityCode}`;
    }
    if (securityCode.startsWith('3') || securityCode.startsWith('0')) {
      return `0.${securityCode}`;
    }
    return `1.${securityCode}`;
  }
}
