import { Injectable } from '@nestjs/common';

@Injectable()
export class DashboardService {
  topFour() {
    return {
      vN: 23819,
      vTN: 3892189,
      oN: 2819,
      oTN: 38211,
      uN: 391039,
      uTn: 900391,
      pN: 371919,
      pTN: 1203819,
    };
  }

  otherOne() {
    return {
      ld: [0, 80, 250, 139, 189, 300, 0],
      td: [0, 200, 321, 230, 300, 100, 0],
    };
  }

  otherTwo() {
    return {
      ld: [0, 7320, 5000, 5201, 3000, 5492, 0],
      td: [0, 3490, 1890, 4372, 6666, 6000, 0],
    };
  }

  otherThree() {
    return {
      list: [
        { value: 1048, name: 'H5' },
        { value: 735, name: 'PC' },
        { value: 580, name: '小程序' },
        { value: 484, name: 'APP' },
        { value: 300, name: '支付宝' },
      ],
    };
  }

  otherFour() {
    return {
      list: [
        { value: 40, name: '服饰' },
        { value: 38, name: '玩具' },
        { value: 32, name: '虚拟' },
        { value: 26, name: '3C' },
        { value: 22, name: '文具' },
        { value: 18, name: '机械' },
      ],
    };
  }

  otherFive() {
    return {
      ld: [420, 300, 2000, 1200, 2000, 1800],
      td: [500, 1400, 2800, 2600, 2200, 2100],
    };
  }

  otherSix() {
    return {
      list: [120, 200, 150, 80, 70, 110, 130, 90, 200, 130, 140, 89],
    };
  }
}
