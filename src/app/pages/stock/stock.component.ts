import { Component } from '@angular/core';

interface Stock {
  id: string;
  name: string;
  sku: string;
  price: string;
  amount: string;
  category: string;
  
}
@Component({
  selector: 'app-stock',
  templateUrl: './stock.component.html',
  styleUrls: ['./stock.component.scss']
})
export class StockComponent {
  radioValue = 'A';
  currentPage: number = 1;
  pageLimit: number = 10;
  dataCount: number = 10;
  stockList: Stock[] = [
    {
      id: '001',
      name: 'ชานมไข่มุก',
      category: 'น้ำหวาน',
      sku: '-',
      price: '25',
      amount: '99',
    }
  ];
}
