import { Component } from '@angular/core';

interface Person {
  orderno: string;
  table: number;
  time: string;
  status: string;
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
        orderno: '20041234',
        table: 4,
        time: '20/04/2023 13:44',
        status: 'cooking',
      },
      {
        orderno: '20044124',
        table: 1,
        time: '20/04/2023 14:21',
        status: 'cooking',

      },
    ];
  }
}