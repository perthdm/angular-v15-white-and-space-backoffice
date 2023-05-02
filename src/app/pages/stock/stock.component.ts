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
  stockAllList: any = [];
  importTrxList: any = [];
  stockData: any = {};
  stockType = 'inventory';
  isEdit: boolean = false;

  // == MODAL CTL ==
  isShowModal: boolean = false;
  isShowModalStockDetail: boolean = false;
  isShowModalImport: boolean = false;
  isShowModalExport: boolean = false;

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

  fetchStock(directPage?: number | any, directLimit?: number | any) {
    let reqData = {
      page: directPage | this.page,
      limit: directLimit | this.pageLimit,
      query: this.query,
    };

    this.stockService.getAllStock(reqData).subscribe((res) => {
      let { total, items } = res;
      if (directLimit && directPage) {
        this.stockAllList = items;
      } else {
        this.stockList = items;
        this.total = total;
      }
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

  showModal(modalName?: any): void {
    if (!modalName) {
      this.isShowModal = true;
    } else if (modalName === 'import') {
      this.importList.push({ stock_id: null, amount: null });
      this.fetchStock(1, 1000);
      this.isShowModalImport = true;
    }
  }

  handleSetExport(event: any, current: any) {
    event.stopPropagation();
    this.handleCheckStock(current?._id);
    this.isShowModalExport = true;
  }

  closeModal(): void {
    this.isEdit = false;
    this.isShowModal = false;
    this.resetData();
  }

  closeModalImport(): void {
    this.isShowModalImport = false;
    this.resetData();
  }

  closeModalExport(): void {
    this.isShowModalExport = false;
    this.resetData();
  }

  closeModalDetail() {
    this.isShowModalStockDetail = false;
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
    this.stockAllList = [];
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
    // === ADD ===
    if (!this.isEdit) {
      this.stockService.addNewStock(this.stockData).subscribe(
        (res) => {
          this.message.create('success', `เพิ่มสต๊อกสินค้าสำเร็จ`);
          this.fetchStock();
          this.closeModal();
        },
        (err) => {
          this.throwErrorMessage(
            `${err.error.message}::${err.error.statusCode}`
          );
        }
      );
    } else {
      // === UPDATE ===
      let reqData = {
        stock_id: this.stockData._id,
        name: this.stockData.name,
        info: this.stockData.info,
      };

      this.stockService.updateStock(reqData).subscribe(
        (res) => {
          this.message.create('success', `แก้ไขสินค้าในสต็อกสำเร็จ`);
          this.fetchStock();
          this.closeModal();
        },
        (err) => {
          this.throwErrorMessage(
            `${err.error.message}::${err.error.statusCode}`
          );
        }
      );
    }
  }

  handleSubmitImport() {
    let reqData = [...this.importList].filter(
      (item) => item.stock_id && item.amount
    );

    this.stockService.importItem(reqData).subscribe(
      (res) => {
        this.message.create('success', `เพิ่มสินค้าเข้าสต็อกสำเร็จ`);
        this.fetchStock();
        this.closeModalImport();
      },
      (err) =>
        this.throwErrorMessage(`${err.error.message}::${err.error.statusCode}`)
    );
  }

  handleSubmitExport() {
    let reqData = {
      lot_id: this.stockData.lot_id,
      amount: this.stockData.amount,
      info: this.stockData.info,
    };
    this.stockService.exportItem(reqData).subscribe(
      (res) => {
        this.message.create('success', `นำสินค้าออกจากสต็อกสำเร็จ`);
        this.fetchStock();
        this.closeModalExport();
      },
      (err) =>
        this.throwErrorMessage(`${err.error.message}::${err.error.statusCode}`)
    );
  }

  isNotSelected(value: any): boolean {
    return (
      this.importList
        .map((object: any) => object.stock_id)
        .indexOf(value._id) === -1
    );
  }

  showModalStockDetail(event: any, current: any) {
    event.stopPropagation();
    this.handleCheckStock(current?._id);
    this.isShowModalStockDetail = true;
  }

  handleCheckStock(stockId: any) {
    this.stockService.getStockDetailById(stockId).subscribe(
      (res) => {
        let { items, total } = res;
        this.importList = items;
        this.totalDt = total;
      },
      (err) =>
        this.throwErrorMessage(`${err.error.message}::${err.error.statusCode}`)
    );
  }

  handleChangePage() {
    if (this.stockType === 'inventory') {
      this.fetchStock();
    } else {
      this.fetchLot();
    }
  }

  throwErrorMessage(message: string) {
    this.message.create('error', `Please try again ${message}`);
  }

  printBarcode(data: any) {
    console.log(data);

    this.stockService.printBarcodeByLotId(data._id).subscribe(
      () => {
        this.message.create('success', `สั่งพิมพ์บาร์โค้ดสำเร็จ`);
      },
      (err) =>
        this.throwErrorMessage(`${err.error.message}::${err.error.statusCode}`)
    );
  }
}
