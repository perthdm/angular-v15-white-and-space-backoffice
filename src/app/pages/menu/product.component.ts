import { Component } from '@angular/core';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzUploadChangeParam, NzUploadFile } from 'ng-zorro-antd/upload';
import { IProduct } from 'src/app/model/product.model';
import { ProductService } from 'src/app/services/product.service';
import { StockService } from 'src/app/services/stock.service';
import { formatDateTime } from 'src/utils/utils';

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.scss'],
})
export class ProductComponent {
  menuList: any = [];
  switchValue = false;
  isLoading: boolean = true;
  isEdit: boolean = false;
  isStock: boolean = false;
  isVisible: boolean = false;
  isVisibleStockMnm: boolean = false;

  page: number = 1;
  pageLimit: number = 10;
  total: number = 0;
  categoryType = '';
  query: string = '';

  productData: any = {};
  productDataType: string = '';
  productCount: any = {};

  fileList: NzUploadFile[] = [];

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
          etc: 0,
        };
        summary.map((i: any) => {
          nextSum[i.product_type] = i.count;
          nextSum['total'] += i.count;
        });

        this.productCount = nextSum;
        this.menuList = items;
        this.total = total;
        this.isLoading = false;
      },
      (err) => {}
    );
  }

  onChangePageLimit(nextLimit: number) {
    this.pageLimit = nextLimit;
    this.fetchProduct();
  }

  showModal(): void {
    this.isEdit = false;
    this.isVisible = true;
  }

  resetData = () => {
    this.productData = {};
    this.productDataType = '';
  };

  handleDelete(current: any, event: MouseEvent) {
    event.stopPropagation();
    this.productData = current;
    this.productService.deleteProduct(this.productData?._id).subscribe(
      (res) => {
        this.fetchProduct();
        this.resetData();
        this.message.create('success', 'ลบสินค้าสำเร็จ');
        return;
      },
      (err) => {
        this.message.create(
          'error',
          `Please try again ${err.error.message}::${err.error.statusCode}`
        );
      }
    );
  }

  handleOk(): void {
    if (this.isStock) {
      let reqData = {
        product_id: this.productData._id,
        type: this.productDataType,
        amount: Number(this.productData.amount),
      };
      this.stockService.updateStock(reqData).subscribe(
        (res) => {
          this.fetchProduct();
          this.resetData();
          this.message.create('success', `แก้ไขสต็อคสำเร็จ`);
        },
        (err) => {
          this.message.create(
            'error',
            `Please try again ${err.error.message}::${err.error.statusCode}`
          );
        }
      );
    } else {
      if (!this.isEdit) {
        let reqData = {
          product_id: this.productData.product_id,
          name: this.productData.name,
          product_type: this.productDataType,
          description: '',
          price: this.productData.price,
          add_on_id: [],
          auto_stock: this.productData.auto_stock,
        };

        this.productService.addProduct(reqData).subscribe(
          (res) => {
            this.fetchProduct();
            this.resetData();
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
        let reqData = {
          id: this.productData._id,
          name: this.productData.name,
          product_type: this.productDataType,
          price: this.productData.price,
          product_id: this.productData.product_id,
          auto_stock: this.productData.auto_stock,
        };
        this.productService.updateProduct(reqData).subscribe(
          (res) => {
            this.fetchProduct();
            this.resetData();
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
    }
    this.isVisible = false;
    this.isVisibleStockMnm = false;
  }

  handleCancel(): void {
    this.resetData();
    this.isVisible = false;
    this.isVisibleStockMnm = false;
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
    this.isEdit = true;
    this.productData = current;
    this.productDataType = current.product_type;
    this.isVisible = true;
  }

  editStock(current: any, event: MouseEvent) {
    event.stopPropagation();
    this.productData = current;
    this.productDataType = current.product_type;
    this.isVisibleStockMnm = true;
    this.isStock = true;
  }

  getTagDetail(type: string) {
    switch (type) {
      case 'food':
        return { title: 'อาหาร', color: 'volcano' };
      case 'desert':
        return { title: 'ของหวาน', color: 'magenta' };
      case 'beverage':
        return { title: 'เครื่องดื่ม', color: 'geekblue' };
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

  beforeUpload = (file: NzUploadFile): boolean => {
    this.fileList = [...this.fileList, file];
    return false;
  };
}
