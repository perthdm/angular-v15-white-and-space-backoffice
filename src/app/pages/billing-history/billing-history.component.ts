import { Component } from '@angular/core';
import { OrderService } from 'src/app/services/order.service';
import { formatDateTime } from 'src/utils/utils';
import * as moment from 'moment';

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
  paymentGateway: string;
  totalOrder: number;
}

interface IBillDetail {}

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
      console.log(items);

      items.map((dt: IBillList) => {
        let sum = 0;
        let orderSum = 0;
        dt.bills.map((bd: IBill) => {
          sum += bd.price;
          orderSum += bd.items.length;
        });

        dt.totalProfit = sum;
        dt.totalOrder = orderSum;
      });

      this.billList = res.items;
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
}
