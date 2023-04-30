import { Component } from '@angular/core';
import { OrderService } from 'src/app/services/order.service';
import { formatDateTime } from 'src/utils/utils';
import * as moment from 'moment';
import { PAYMENT_TYPE } from 'src/utils/constatnt';
import Swal from 'sweetalert2';
import { NzMessageService } from 'ng-zorro-antd/message';

interface IBillList {
  date: string;
  bills: IBill[];
  totalProfit: number;
  totalBill: number;
  totalOrder: number;
}

interface IBill {
  _id: string;
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
  dateRange: any = [
    moment().startOf('day').toDate(),
    moment().endOf('day').toDate(),
  ];
  dateFormat = 'dd-MM-YYYY';

  constructor(
    private orderService: OrderService,
    private message: NzMessageService
  ) {}

  ngOnInit() {
    this.fetchBill();
    this.isLoading = false;
  }

  fetchBill() {
    let reqConfig: any = {
      start: this.dateRange[0] ? this.dateRange[0] : null,
      end: this.dateRange[1] ? this.dateRange[1] : null,
    };
    console.log(reqConfig);

    this.orderService.getAllBill(reqConfig).subscribe((res) => {
      let { items } = res;
      if (items.length > 0) {
        items.map((dt: IBillList) => {
          let sum = 0;

          dt.bills.map((bd: IBill) => {
            sum += bd.price;
          });
          dt.totalProfit = sum;
        });

        console.log(items);
      }
      this.billList = items;
    });
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
        return { title: 'Close', color: 'magenta' };
      case 'cancel':
        return { title: 'Cancel', color: 'volcano' };
      default:
        return { title: 'Waiting', color: 'gold' };
    }
  }

  getPaymentsDetail(type: string) {
    switch (type) {
      case PAYMENT_TYPE.CASH:
        return { title: 'Cash', color: '#04AA6D' };
      case PAYMENT_TYPE.MOBILE_BANKING:
        return { title: 'Mobile Banking', color: '#1890ff' };
      default:
        return { title: 'Unknown', color: 'default' };
    }
  }

  cancelOrder(event: any, id: string) {
    event.stopPropagation();

    Swal.fire({
      title: 'ยกเลิกบิล!',
      text: 'คุณต้องการที่จะยกเลิกบิลรายการนี้ใช่หรือไม่ ?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'ยืนยันออเดอร์',
      cancelButtonText: 'ยกเลิก',
    }).then((result) => {
      if (result.value) {
        this.orderService.cancelOrder(id).subscribe(
          (res) => {
            console.log(res);
            this.message.create('success', `ยกเลิกบิลสำเร็จ`);
            this.fetchBill();
          },
          (err) =>
            this.message.create(
              'error',
              `Please try again ${err.error.message}::${err.error.statusCode}`
            )
        );
      }
    });
  }

  mapDate(date: string, option?: string) {
    return formatDateTime(date, option);
  }
}
