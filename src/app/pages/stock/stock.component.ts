import { Component } from '@angular/core';
import { StockService } from 'src/app/services/stock.service';
import { formatDateTime } from 'src/utils/utils';
import { NzMessageService } from 'ng-zorro-antd/message';

// interface Stock {
//   id: string;
//   name: string;
//   amount: string;
//   unit: string;
//   updateat: string;
// }
@Component({
  selector: 'app-stock',
  templateUrl: './stock.component.html',
  styleUrls: ['./stock.component.scss'],
})
export class StockComponent {
  stockList: any = [];
  stockData: any = {};
  stockDataType: string = '';
  isEdit: boolean = false;
  isVisible: boolean = false;
  isLoading: boolean = true;
  total: number = 10;
  page: number = 1;
  pageLimit: number = 10;
  dataCount: number = 10;
  radioValue = 'all';
  productType = '';
  query: string = '';

  constructor(
    private stockService: StockService,
    private message: NzMessageService
  ) {}

  ngOnInit() {
    this.fetchStock();
  }

  showModal(): void {
    this.isVisible = true;
  }

  resetData = () => {
    this.stockData = {};
    this.stockDataType = '';
  };


  onChangePageLimit(nextLimit: number) {
    this.pageLimit = nextLimit;
    this.fetchStock();
  }

  getTagDetail(type: string) {
    switch (type) {
      case 'in':
        return { title: 'นำเข้า', color: 'green' };
      case 'out':
        return { title: 'นำออก', color: 'volcano' };
      default:
        return { title: '-', color: 'red' };
    }
  }

  onChangeData(e: any) {
    let { name, value } = e.target;
    if (name === 'price') value = +value;
    this.stockData = {
      ...this.stockData,
      [name]: value,
    };
  }

  mapDate(date: string) {
    return formatDateTime(date);
  }

  editStock(current: any) {
    this.stockData = current;
    this.stockDataType = current.product_type;
    this.isVisible = true;
    this.isEdit = true;
  }

  fetchStock() {
    let reqData = {
      page: this.page,
      limit: this.pageLimit,
      type: this.productType,
      query: this.query,
    };

    console.log(reqData);
    this.stockService.getAllStock(reqData).subscribe(
      (res) => {
        let { total, page, last_page, items } = res;
        this.stockList = items;
        this.total = total;
        this.isLoading = false;
      },
      (err) => {}
    );
  }
}
