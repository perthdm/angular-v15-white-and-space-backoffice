import { Component } from '@angular/core';
import { OrderService } from 'src/app/services/order.service';
import { formatDateTime } from 'src/utils/utils';
import * as moment from 'moment';
import { PAYMENT_TYPE } from 'src/utils/constatnt';

interface IBillList {
  date: string;
  bills: IBill[];
  totalProfit: number;
  totalBill: number;
  totalOrder: number;
}

interface IBill {
  order_id: string;
  items: IBillDetail[];
  price: number;
  status: string;
  createdAt: string;
  user_created: any;
  payment: string;
  amount: number;
}

interface IBillDetail {
  add_on: any;
  amount: number;
  auto_stock: boolean;
  createdAt: string;
  description: string;
  name: string;
  price: number;
  product_id: string;
  product_type: ProductType;
  status: boolean;
  stock: boolean;
}

enum ProductType {
  FOOD = 'food',
  DESERT = 'desert',
  BEVERAGE = 'beverage',
  ETC = 'etc',
}

@Component({
  selector: 'app-billing-history',
  templateUrl: './billing-history.component.html',
  styleUrls: ['./billing-history.component.scss'],
})
export class BillingHistoryComponent {
  billList: IBillList[] = [];
  currentBill: any = {};
  isLoading: boolean = true;
  isShow: boolean = false;

  // === PAGINATION === //
  date = [new Date(), new Date()];
  dateFormat = 'dd-MM-YYYY';

  constructor(private orderService: OrderService) {}

  ngOnInit() {
    this.fetchBill();
    this.isLoading = false;
  }

  fetchBill() {
    let reqConfig: any = {
      start: this.date[0] ? moment(this.date[0]).startOf('day') : null,
      end: this.date[1] ? moment(this.date[1]).endOf('day') : null,
    };
    this.orderService.getAllBill(reqConfig).subscribe((res) => {
      let { items } = res;
      // console.log(items);

      items.map((dt: IBillList) => {
        let sum = 0;

        dt.bills.map((bd: IBill) => {
          sum += bd.price;
        });
        dt.totalProfit = sum;
      });

      console.log(items);

      this.billList = items;
    });
  }

  onChange(result: Date[]): void {
    console.log('onChange: ', result);
  }

  handleShowBillDetail(bill: IBill) {
    this.isShow = true;
    this.currentBill = bill;
    console.log(this.currentBill);
  }

  handleCancel(): void {
    console.log('Button cancel clicked!');
    this.isShow = false;
  }

  getStatusDetail(type: string) {
    switch (type) {
      case 'close':
        return { title: 'Close', color: '#f50' };
      default:
        return { title: 'Open', color: '#87d068' };
    }
  }

  getPaymentsDetail(type: string) {
    switch (type) {
      case PAYMENT_TYPE.CASH:
        return { title: 'Cash', color: 'green' };
      case PAYMENT_TYPE.MOBILE_BANKING:
        return { title: 'Mobile Banking', color: 'blue' };
      default:
        return { title: 'Unknown', color: 'default' };
    }
  }

  mapDate(date: string, option?: string) {
    return formatDateTime(date, option);
  }
}
