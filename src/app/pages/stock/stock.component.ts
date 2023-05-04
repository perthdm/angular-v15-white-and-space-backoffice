import { Component } from '@angular/core';
import { StockService } from 'src/app/services/stock.service';
import { formatDateTime } from 'src/utils/utils';
import { NzMessageService } from 'ng-zorro-antd/message';
import { STOCK_TYPE } from 'src/utils/constatnt';
import { TransferChange, TransferItem } from 'ng-zorro-antd/transfer';

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
  lotTrxList: any = [];
  stockData: any = {};
  stockType = 'inventory';
  isEdit: boolean = false;

  // == MODAL CTL ==
  isShowModal: boolean = false;
  isShowModalStockDetail: boolean = false;
  isShowModalImport: boolean = false;
  isShowModalExport: boolean = false;
  isShowModalExportDetail: boolean = false;

  // == IMPROT ITEM ==
  importList: any = [];

  // === EXPORT ITEM LIST ===
  trackingList: any = [];
  exportItemSelected: any = [];

  $asTransferItems = (data: unknown): TransferItem[] => data as TransferItem[];

  // == PAGINATION ==
  page: number = 1;
  pageLimit: number = 10;
  query: string = '';
  total: number = 10;

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

      this.lotTrxList = items;
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

  closeModalExportDetail() {
    this.isShowModalExportDetail = false;
    this.exportItemSelected = [];
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
    this.resetData();
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
    this.trackingList = [];
    this.lotTrxList = [];
    this.exportItemSelected = [];
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
        return { title: 'นำออก', color: 'magenta' };
      case 'order':
        return { title: 'ออเดอร์', color: 'purple' };
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
    let reqData: any = {
      lot_id: this.stockData.lot_id,
      info: this.stockData.info,
    };

    if (this.exportItemSelected.length > 0) {
      reqData['tracking_list'] = this.exportItemSelected;
    } else {
      const existingItem = this.importList.find(
        (current: any) => current._id === this.stockData.lot_id
      );

      if (this.stockData.amount > existingItem?.amount) {
        return this.throwErrorMessage(`*จำนวนของสินค้าที่จะนำออกไม่เพียงพอ*`);
      }
      reqData['amount'] = this.stockData.amount;
    }

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

  showModalExportDetail(event: any, current: any) {
    event.stopPropagation();
    this.exportItemSelected = current?.tracking;
    this.isShowModalExportDetail = true;
  }

  handleCheckStock(stockId: any) {
    this.stockService.getStockDetailById(stockId).subscribe(
      (res) => {
        let { items } = res;
        this.importList = items;
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

  handleRenderTracking(event: any) {
    this.trackingList = [];
    this.exportItemSelected = [];
    console.log(this.importList);

    let temp = this.importList.map((obj: any) => Object.assign({}, obj));
    const existingItem = temp.find((current: any) => current._id === event);

    if (existingItem && existingItem?.tracking.length != 0) {
      console.log(existingItem?.tracking);
      this.trackingList = existingItem?.tracking;
      // existingItem?.tracking.map((item: any) => {
      //   this.trackingList.push({ key: item, title: item });
      // });
    }
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

  // select(ret: {}): void {
  //   console.log('nzSelectChange', ret);
  // }

  // change(ret: {}): void {
  //   console.log('nzChange', ret);
  // }
}
