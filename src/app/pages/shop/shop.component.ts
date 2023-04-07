import { Component } from '@angular/core';

interface Person {
  key: string;
  name: string;
  prize: number;
  amount: number;
  type: string;
}
@Component({
  selector: 'app-shop',
  templateUrl: './shop.component.html',
  styleUrls: ['./shop.component.scss'],
})

export class ShopComponent {
  radioValue = 'A';
  list = new Array(5);
  isVisible = false;
  constructor() {}
  dataList: Person[] = [];

  showModal(): void {
    this.isVisible = true;
  }

  handleOk(): void {
    console.log('Button ok clicked!');
    this.isVisible = false;
  }

  handleCancel(): void {
    console.log('Button cancel clicked!');
    this.isVisible = false;
  }
  ngOnInit() {
    this.dataList = [
      {
        key: 'PD0001',
        name: 'กระเทียมพริกไทย',
        prize: 200,
        amount: 14,
        type: 'วัตถุดิบ',
      },
      {
        key: 'PD0002',
        name: 'ใบกระเพรา',
        prize: 40,
        amount: 2,
        type: 'วัตถุดิบ',
      },
      {
        key: 'PD0003',
        name: 'น้ำเชื่อม',
        prize: 80,
        amount: 12,
        type: 'วัตถุดิบ',
      },
      {
        key: 'PD0004',
        name: 'หลอด',
        prize: 50,
        amount: 36,
        type: 'ของใช้งาน',
      },
    ];
  }
}