import { Component, ElementRef, ViewChild } from '@angular/core';
import * as moment from 'moment';
import { NzMessageService } from 'ng-zorro-antd/message';
import { StockService } from 'src/app/services/stock.service';
import { formatDateTime, getStorage } from 'src/utils/utils';

@Component({
  selector: 'app-check-stock',
  templateUrl: './check-stock.component.html',
  styleUrls: ['./check-stock.component.scss'],
})
export class CheckStockComponent {
  @ViewChild('cartForceFocus') cartForceFocus!: ElementRef;
  scannerBarcodeBond: any;

  dataList: any = [];
  dateRange: any = [
    moment().startOf('day').toDate(),
    moment().endOf('day').toDate(),
  ];
  dateFormat = 'dd-MM-YYYY';
  isLoading: boolean = true;
  isAccess: boolean = getStorage('role') === 'owner' ? true : false;
  currentBarcode: string = '';

  constructor(
    private stockService: StockService,
    private message: NzMessageService
  ) {
    this.scannerBarcodeBond = this.handleBarcodeInput.bind(this);
  }

  ngOnInit() {
    window.addEventListener('keypress', this.scannerBarcodeBond);
    this.fetchCheckStockHistory();
    this.isLoading = false;
  }

  ngAfterViewInit() {
    this.cartForceFocus.nativeElement.focus();
    this.cartForceFocus.nativeElement.hidden = true;
  }

  ngOnDestroy() {
    window.removeEventListener('keypress', this.scannerBarcodeBond);
  }

  handleBarcodeInput(event: KeyboardEvent) {
    const input = event.key;
    console.log(input);

    if (input === 'Enter') {
      this.processBarcode(this.currentBarcode);

      this.currentBarcode = '';
    } else {
      this.currentBarcode += input;
    }
  }

  processBarcode(barcode: string) {
    this.message.create('success', `สแกนแล้ว สแกนอีก สแกนต่อ`);
    if (barcode) {
      this.stockService.checkStockByBarcode(barcode).subscribe(
        (res) => {
          if (res) {
            this.message.create('success', `สแกนแล้ว สแกนอีก สแกนต่อ`);
            this.fetchCheckStockHistory();
          }
        },
        (err) => {
          this.message.create(
            'error',
            `Please try again ${err.error.message}::${err.error.statusCode}`
          );
        }
      );
    }
  }

  fetchCheckStockHistory = () => {
    let reqConfig: any = {
      start: this.dateRange[0] ? this.dateRange[0] : null,
      end: this.dateRange[1] ? this.dateRange[1] : null,
    };

    // this.dataList = [
    //   {
    //     date: '2023-05-04T23:06:57.232Z',
    //     items: [
    //       {
    //         _id: '64543a91ffa4537ff4bf59e2',
    //         product: {
    //           _id: '64543a89ffa4537ff4bf59d1',
    //           product_id: 'B001',
    //           name: 'หมี',
    //           price: 199,
    //           status: true,
    //           product_type: 'bear',
    //           add_on: [],
    //           auto_stock: true,
    //           user_created: '642e901b91385600b360cb87',
    //           user_updated: [
    //             '642e901b91385600b360cb87',
    //             '642e901b91385600b360cb87',
    //           ],
    //           createdAt: '2023-05-04T23:06:49.721Z',
    //           updatedAt: '2023-05-05T10:54:16.127Z',
    //           __v: 1,
    //           stock: '6454c1cf46ae03df68a52f82',
    //         },
    //       },
    //     ],
    //   },
    // ];
    this.stockService.getCheckStockHistory(reqConfig).subscribe(
      (res) => {
        this.dataList = res;
      },
      (err) => {}
    );
  };

  mapDate(date: string, option: string) {
    return formatDateTime(date, option);
  }
}
