import { Component } from '@angular/core';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzUploadChangeParam, NzUploadFile } from 'ng-zorro-antd/upload';
import { IProduct } from 'src/app/model/product.model';
import { ProductService } from 'src/app/services/product.service';
import { StockService } from 'src/app/services/stock.service';
import { formatDateTime, getStorage } from 'src/utils/utils';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.scss'],
})
export class ProductComponent {
  producList: any = [];
  stockList: any = [];
  productData: any = {};
  productCount: any = {};

  // == MODAL CTL ==
  isShowModal: boolean = false;

  // == PAGINATION ==
  page: number = 1;
  pageLimit: number = 10;
  total: number = 0;
  query: string = '';

  // == TAB CTL ==
  categoryType = '';

  // == ETC ==
  isLoading: boolean = true;
  isEdit: boolean = false;
  pdTypeSelected: string = '';
  switchValue = false;
  fileList: NzUploadFile[] | any = [];
  avatarUrl?: string;
  productStatus = false;

  isAccess = getStorage('role') === 'owner' ? true : false;

  constructor(
    private stockService: StockService,
    private productService: ProductService,
    private message: NzMessageService
  ) {}

  ngOnInit() {
    this.fetchProduct();
  }

  fetchProduct() {
    let reqData = {
      page: this.page,
      limit: this.pageLimit,
      type: this.categoryType,
      query: this.query,
    };
    this.productService.getAllProduct(reqData).subscribe(
      (res) => {
        let { total, items, summary } = res;
        let nextSum: any = {
          total: 0,
          food: 0,
          desert: 0,
          beverage: 0,
          bear: 0,
          etc: 0,
        };
        summary.map((i: any) => {
          nextSum[i.product_type] = i.count;
          nextSum['total'] += i.count;
        });

        this.productCount = nextSum;
        this.producList = items;
        this.total = total;
        this.isLoading = false;
      },
      (err) => {}
    );
  }

  fetchStockUnBinding() {
    this.stockService.getAllStockUnBinding().subscribe((res) => {
      this.stockList = res;
    });
  }

  onChangePageLimit(nextLimit: number) {
    this.pageLimit = nextLimit;
    this.fetchProduct();
  }

  showModal(): void {
    this.fetchStockUnBinding();
    this.isShowModal = true;
  }

  resetData = () => {
    this.productData = {};
    this.pdTypeSelected = '';
    this.switchValue = false;
    this.fileList = [];
  };

  async handleCloseModal() {
    this.isShowModal = false;
    this.isEdit = false;
    this.resetData();
  }

  // handleDelete(current: any, event: MouseEvent) {
  //   event.stopPropagation();
  //   this.productData = current;
  //   this.productService.deleteProduct(this.productData?._id).subscribe(
  //     (res) => {
  //       this.fetchProduct();
  //       this.resetData();
  //       this.message.create('success', 'ลบสินค้าสำเร็จ');
  //       return;
  //     },
  //     (err) => {
  //       this.message.create(
  //         'error',
  //         `Please try again ${err.error.message}::${err.error.statusCode}`
  //       );
  //     }
  //   );
  // }

  handleOk(): void {
    if (!this.isEdit) {
      let reqData: any = {
        product_id: this.productData.product_id,
        name: this.productData.name,
        product_type: this.pdTypeSelected,
        price: this.productData.price,
        add_on_id: JSON.stringify([]),
      };

      if (this.switchValue && this.productData.stock_id) {
        reqData['stock_id'] = this.productData.stock_id;
        reqData['auto_stock'] = true;
      } else {
        reqData['auto_stock'] = false;
      }

      let data = new FormData();
      Object.entries(reqData).forEach((item: any) => {
        const [key, value] = item;
        data.append(key, value);
      });

      if (this.fileList[0]) {
        data.append('file', this.fileList[0]);
      }

      this.productService.addProduct(data).subscribe(
        (res) => {
          this.fetchProduct();
          this.handleCloseModal();
          this.message.create('success', `เพิ่มสินค้าใหม่สำเร็จ`);
        },
        (err) => {
          this.message.create(
            'error',
            `Please try again ${err.error.message}::${err.error.statusCode}`
          );
        }
      );
    } else {
      let reqData: any = {
        id: this.productData._id,
        name: this.productData.name,
        product_type: this.pdTypeSelected,
        price: this.productData.price,
        add_on_id: JSON.stringify([]),
      };

      if (this.switchValue && this.productData.stock_id) {
        reqData['stock_id'] = this.productData.stock_id;
        reqData['auto_stock'] = true;
      } else {
        reqData['auto_stock'] = false;
      }

      let data = new FormData();
      Object.entries(reqData).forEach((item: any) => {
        const [key, value] = item;
        data.append(key, value);
      });

      if (this.fileList[0]) {
        data.append('file', this.fileList[0]);
      }

      this.productService.updateProduct(data).subscribe(
        (res) => {
          this.fetchProduct();
          this.handleCloseModal();
          this.message.create('success', `แก้ไขสินค้าสำเร็จ`);
        },
        (err) => {
          this.message.create(
            'error',
            `Please try again ${err.error.message}::${err.error.statusCode}`
          );
        }
      );
    }
    this.isShowModal = false;
  }

  onChangeData(e: any) {
    let { name, value } = e.target;
    if (name === 'price') value = +value;
    this.productData = {
      ...this.productData,
      [name]: value,
    };
  }

  editProduct(current: any) {
    this.productData = current;

    this.pdTypeSelected = current.product_type;
    this.switchValue = current.auto_stock;

    if (this.productData?.stock?._id) {
      this.productData['stock_id'] = this.productData?.stock?._id;
    }
    this.isEdit = true;
    this.showModal();
  }

  getTagDetail(type: string) {
    switch (type) {
      case 'food':
        return { title: 'อาหาร', color: 'volcano' };
      case 'desert':
        return { title: 'ของหวาน', color: 'magenta' };
      case 'beverage':
        return { title: 'เครื่องดื่ม', color: 'geekblue' };
      case 'bear':
        return { title: 'หมี', color: 'orange' };
      default:
        return { title: 'สินค้า', color: 'purple' };
    }
  }

  getTagStockDetail(type: boolean) {
    switch (type) {
      case true:
        return { title: 'เปิดใช้งาน', color: 'green' };
      case false:
        return { title: 'ปิดใช้งาน', color: 'volcano' };
      default:
        return { title: '-', color: 'purple' };
    }
  }

  mapDate(date: string) {
    return formatDateTime(date);
  }

  getBase64 = (file: File): Promise<string | ArrayBuffer | null> =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });

  beforeUpload = (file: NzUploadFile): boolean => {
    this.fileList = [...this.fileList, file];
    return false;
  };

  changeStatus(event: any, data: any) {
    event.stopPropagation();
    Swal.fire({
      title: 'เปลี่ยนสถานะ!',
      text: 'คุณต้องการเปลี่ยนสถานะสินค้าชิ้นนี้หรือไม่ ?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'ยืนยัน',
      cancelButtonText: 'ยกเลิก',
    }).then((result) => {
      if (result.value) {
        this.productService.updateStatusProduct(data._id).subscribe(
          (res) => {
            this.message.create('success', `เปลี่ยนสถานะสำเร็จ`);
            this.fetchProduct();
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

  getOutputSearch(searchText: any) {
    console.log(searchText);
    this.query = searchText;
    this.fetchProduct();
    // Perform a search based on the value of searchText
  }
}
