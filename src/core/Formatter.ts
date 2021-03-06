import xss from 'xss';

export class Formatter {
  static formInput(input: string) {
    if (input) {
      // 去除換行
      input = input.replace(/\r\n|\n/g, '');
      // 去除空格
      input = input.replace(/\s+/g, '');
      // 避免sql攻擊，將特殊符號取代
      input = escape(input);
      // 避免xss攻擊，避免植入惡意的script程式碼
      input = xss(input);
    }

    return input;
  }

  // 左邊補0
  static paddingLeftZero(str: string, lenght: number): string {
    if (str.length >= lenght)
      return str;
    else
      return this.paddingLeftZero('0' + str, lenght);
  }
}