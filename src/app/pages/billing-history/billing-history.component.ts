import { Component } from '@angular/core';
import { OrderService } from 'src/app/services/order.service';
import { formatDateTime, getDefaultValue, getStorage } from 'src/utils/utils';
import * as moment from 'moment';
import { PAYMENT_TYPE } from 'src/utils/constatnt';
import Swal from 'sweetalert2';
import { NzMessageService } from 'ng-zorro-antd/message';
import { ActivatedRoute } from '@angular/router';
interface IBillList {
  date: string;
  bills: IBill[];
  totalProfit: number;
  totalBill: number;
  totalOrder: number;
  totalDiscount: number;
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
  discount: number;
}

interface IBillDetail {
  add_on: any;
  amount: number;
  createdAt: string;
  description: string;
  name: string;
  price: number;
  product_id: string;
  product_type: ProductType;
  status: boolean;
}

enum ProductType {
  FOOD = 'food',
  DESERT = 'desert',
  BEVERAGE = 'beverage',
  BEAR = 'bear',
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
  isAccess: boolean = getStorage('role') === 'owner' ? true : false;

  // === PAGINATION === //
  dateRange: any = [
    moment().startOf('day').toDate(),
    moment().endOf('day').toDate(),
  ];
  dateFormat = 'dd-MM-YYYY';

  constructor(
    private orderService: OrderService,
    private message: NzMessageService,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    let dateParam = this.route.snapshot.paramMap.get('date');
    this.fetchBill(dateParam);
  }

  fetchBill(dateParam?: any) {
    if (dateParam) {
      this.dateRange = [
        moment(dateParam).startOf('day').toDate(),
        moment(dateParam).startOf('day').toDate(),
      ];
    }

    let reqConfig: any = {
      start: this.dateRange[0] ? this.dateRange[0] : null,
      end: this.dateRange[1] ? this.dateRange[1] : null,
    };

    this.orderService.getAllBill(reqConfig).subscribe((res) => {
      let { items } = res;
      this.billList = items;
      this.isLoading = false;
    });
  }

  handleShowBillDetail(bill: IBill) {
    this.isShow = true;
    this.currentBill = bill;
  }

  handleCancel(): void {
    this.isShow = false;
  }

  getStatusDetail(type: string) {
    switch (type) {
      case 'close':
        return { title: 'Close', color: 'volcano' };
      case 'cancel':
        return { title: 'Void', color: 'purple' };
      default:
        return { title: 'Waiting', color: 'gold' };
    }
  }

  getPaymentsDetail(type: string) {
    switch (type) {
      case PAYMENT_TYPE.CASH:
        return { title: 'Cash', color: '#eaab36' };
      case PAYMENT_TYPE.MOBILE_BANKING:
        return { title: 'Mobile Banking', color: '#1890ff' };
      default:
        return { title: 'EDC / ATM', color: '#04AA6D' };
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

  handlePrintBill(event: any, bill: string) {
    event.stopPropagation();

    Swal.fire({
      title: 'พิมพ์ใบเสร็จ',
      text: 'คุณต้องการที่จะพิมพ์ใบเสร็จรายการนี้ใช่หรือไม่ ?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'พิมพ์',
      cancelButtonText: 'ยกเลิก',
    }).then((result) => {
      if (result.value) {
        this.orderService.printBill(bill).subscribe(
          () => {
            this.message.create('success', `พิมพ์ใบเสร็จสำเร็จ`);
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
}
