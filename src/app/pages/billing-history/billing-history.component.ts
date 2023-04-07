import { Component } from '@angular/core';
import { formatDateTime } from 'src/utils/utils';

interface Bill {
  date: string;
  bills: BillDetail[];
  totalProfit: number;
  totalBill: number;
}

interface BillDetail {
  billId: string;
  totalOrder: number;
  totalPrice: number;
  createdAt: string;
  status: string;
  paymentGateway: string;
}

// interface Menu {
//   name: string;
//   unitPrice: string;
// }

@Component({
  selector: 'app-billing-history',
  templateUrl: './billing-history.component.html',
  styleUrls: ['./billing-history.component.scss'],
})
export class BillingHistoryComponent {
  billList: Bill[] = [];
  date = null;
  isLoading: boolean = true;

  ngOnInit() {
    this.billList = [
      {
        date: formatDateTime('2020-04-03', 'onlyDate'),
        bills: [
          {
            billId: 'PD007',
            totalOrder: 23,
            totalPrice: 1023,
            createdAt: formatDateTime(),
            status: 'success',
            paymentGateway: 'Mobile Banking',
          },
          {
            billId: 'PD006',
            totalOrder: 23,
            totalPrice: 1023,
            createdAt: formatDateTime(),
            status: 'success',
            paymentGateway: 'Mobile Banking',
          },
          {
            billId: 'PD005',
            totalOrder: 23,
            totalPrice: 1023,
            createdAt: formatDateTime(),
            status: 'success',
            paymentGateway: 'Mobile Banking',
          },
        ],
        totalProfit: 3069,
        totalBill: 69,
      },
      {
        date: formatDateTime('2020-04-02', 'onlyDate'),
        bills: [
          {
            billId: 'PD004',
            totalOrder: 23,
            totalPrice: 1023,
            createdAt: formatDateTime(),
            status: 'success',
            paymentGateway: 'Mobile Banking',
          },
          {
            billId: 'PD003',
            totalOrder: 23,
            totalPrice: 1023,
            createdAt: formatDateTime(),
            status: 'success',
            paymentGateway: 'Mobile Banking',
          },
        ],
        totalProfit: 2046,
        totalBill: 46,
      },
      {
        date: formatDateTime('2020-04-01', 'onlyDate'),
        bills: [
          {
            billId: 'PD002',
            totalOrder: 23,
            totalPrice: 1023,
            createdAt: formatDateTime(),
            status: 'success',
            paymentGateway: 'Mobile Banking',
          },
          {
            billId: 'PD001',
            totalOrder: 23,
            totalPrice: 1023,
            createdAt: formatDateTime(),
            status: 'success',
            paymentGateway: 'Mobile Banking',
          },
        ],
        totalProfit: 2046,
        totalBill: 46,
      },
    ];

    this.isLoading = false;
  }

  onChange(result: Date[]): void {
    console.log('onChange: ', result);
  }
}
