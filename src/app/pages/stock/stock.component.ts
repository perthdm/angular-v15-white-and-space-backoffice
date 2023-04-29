import { Component } from '@angular/core';
import { StockService } from 'src/app/services/stock.service';
import { formatDateTime } from 'src/utils/utils';
import { NzMessageService } from 'ng-zorro-antd/message';
import { STOCK_TYPE } from 'src/utils/constatnt';

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
  importTrxList: any = [];
  stockData: any = {};
  stockType = 'inventory';
  isEdit: boolean = false;

  // == MODAL CTL ==
  isShowModal: boolean = false;
  isShowModalStockDetail: boolean = false;

  // == IMPROT ITEM ==
  importList: any = [];

  // == PAGINATION ==
  page: number = 1;
  pageLimit: number = 10;
  query: string = '';
  total: number = 10;

  // == SUB PAGINATION ==
  pageDt: number = 1;
  totalDt: number = 10;

  constructor(
    private stockService: StockService,
    private message: NzMessageService
  ) {}

  ngOnInit() {
    this.fetchStock();
  }

  fetchStock() {
    let reqData = {
      page: this.page,
      limit: this.pageLimit,
      query: this.query,
    };

    this.stockService.getAllStock(reqData).subscribe((res) => {
      let { total, items } = res;
      this.stockList = items;
      this.total = total;
    });
  }

  fetchLot() {
    let reqData = {
      page: this.page,
      limit: this.pageLimit,
      type: this.stockType,
    };

    this.stockService.getAllLotByType(reqData).subscribe((res) => {
      let { total, items } = res;
      this.importTrxList = items;
      this.total = total;
    });
  }

  showModal(): void {
    this.isShowModal = true;
    if (
      this.stockType === STOCK_TYPE.IMPORT ||
      this.stockType === STOCK_TYPE.EXPORT
    ) {
      this.importList.push({ stock_id: null, amount: null });
      this.page = 1;
      this.pageLimit = 1000;
      this.fetchStock();
    }
  }

  closeModal(): void {
    this.isEdit = false;
    this.isShowModal = false;
    this.resetData();
  }

  addImportItem() {
    this.importList = [
      ...this.importList,
      {
        stock_id: null,
        amount: null,
      },
    ];
  }

  removeImportItem(index: number) {
    let nextList = [...this.importList];
    this.importList = nextList.filter((_, idx) => index !== idx);
  }

  handleChangeGroup() {
    this.page = 1;
    this.pageLimit = 10;
    this.total = 0;

    if (this.stockType === STOCK_TYPE.INVENTORY) {
      this.fetchStock();
    } else {
      this.fetchLot();
    }
  }

  resetData = () => {
    this.stockData = {};
    this.importList = [];
  };

  onChangePageLimit(nextLimit: number) {
    this.pageLimit = nextLimit;
    this.fetchStock();
  }

  getTagDetail(type: string) {
    switch (type) {
      case 'in':
        return { title: 'นำเข้า', color: 'blue' };
      case 'out':
        return { title: 'นำออก', color: 'volcano' };
      case 'order':
        return { title: 'ออเดอร์', color: 'magenta' };
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
    this.isShowModal = true;
    this.isEdit = true;
  }

  handleSubmitData() {
    if (this.stockType === STOCK_TYPE.INVENTORY) {
      this.stockService.addNewStock(this.stockData).subscribe(
        (res) => {
          this.message.create('success', `เพิ่มสต๊อกสินค้าสำเร็จ`);
          this.fetchStock();
          this.closeModal();
        },
        (err) => {
          this.message.create(
            'error',
            `Please try again ${err.error.message}::${err.error.statusCode}`
          );
        }
      );
    } else if (this.stockType === STOCK_TYPE.IMPORT) {
      let reqData = [...this.importList].filter(
        (item) => item.stock_id && item.amount
      );

      this.stockService.importItem(reqData).subscribe(
        (res) => {
          this.message.create('success', `เพิ่มสินค้าเข้าสต็อกสำเร็จ`);
          this.fetchLot();
          this.closeModal();
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

  getNameModal() {
    switch (this.stockType) {
      case STOCK_TYPE.INVENTORY:
        return 'เพิ่ม';
      case STOCK_TYPE.IMPORT:
        return 'นำเข้า';
      default:
        return 'นำออก';
    }
  }

  isNotSelected(value: any): boolean {
    return (
      this.importList
        .map((object: any) => object.stock_id)
        .indexOf(value._id) === -1
    );
  }

  closeModalDetail() {
    this.isShowModalStockDetail = false;
    this.importList = [];
  }

  handleCheckStock(event: any, current: any) {
    event.stopPropagation();
    console.log(current);
    this.stockService.getStockDetailById(current?._id).subscribe(
      (res) => {
        this.isShowModalStockDetail = true;
        console.log(res);
        let { items, total } = res;
        this.importList = items;
        this.totalDt = total;
      },
      (err) =>
        this.message.create(
          'error',
          `Please try again ${err.error.message}::${err.error.statusCode}`
        )
    );
  }

  handleChangePage() {
    if (this.stockType === 'inventory') {
      this.fetchStock();
    } else {
      this.fetchLot();
    }
  }
}
