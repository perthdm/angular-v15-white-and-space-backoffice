import { Component } from '@angular/core';

interface Stock {
  id: string;
  name: string;
  amount: string;
  unit: string;
  updateat: string;
}
@Component({
  selector: 'app-stock',
  templateUrl: './stock.component.html',
  styleUrls: ['./stock.component.scss'],
})
export class StockComponent {
  stockData = {} as any;
  isVisible: boolean = false;
  stockList: Stock[] = [
    {
      id: '001',
      name: 'น้ำตาล',
      amount: '10',
      unit: 'กิโลกรัม',
      updateat: '22/04/2023',
    },
  ];

  page: number = 1;
  pageLimit: number = 10;
  dataCount: number = 10;
  radioValue = 'all';

  ngOnInit() {
    this.fetchProduct();
  }

  showModal(): void {
    this.isVisible = true;
  }

  fetchProduct() {
    let reqData = {
      page: this.page,
      limit: this.pageLimit,
      type: this.radioValue,
    };

    console.log(reqData);
  }
}
