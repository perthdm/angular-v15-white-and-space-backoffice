import { Component } from '@angular/core';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzUploadChangeParam, NzUploadFile } from 'ng-zorro-antd/upload';
import { IProduct } from 'src/app/model/product.model';
import { ProductService } from 'src/app/services/product.service';
import { formatDateTime } from 'src/utils/utils';

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.scss'],
})
export class ProductComponent {
  munuList: any = [];

  isLoading: boolean = true;
  isEdit: boolean = false;
  isVisible: boolean = false;

  page: number = 1;
  pageLimit: number = 10;
  total: number = 10;
  productType = '';
  query: string = '';

  productData: any = {};
  productDataType: string = '';

  fileList: NzUploadFile[] = [];

  constructor(
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
      type: this.productType,
      query: this.query,
    };

    console.log(reqData);
    this.productService.getAllProduct(reqData).subscribe(
      (res) => {
        let { total, page, last_page, items } = res;
        this.munuList = items;
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
    this.isVisible = true;
  }

  resetData = () => {
    this.productData = {};
    this.productDataType = '';
  };

  handleOk(): void {
    if (!this.isEdit) {
      let reqData = {
        product_id: this.productData.product_id,
        name: this.productData.name,
        product_type: this.productDataType,
        description: '',
        price: this.productData.price,
        add_on_id: [],
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
    this.isVisible = false;
  }

  handleCancel(): void {
    this.resetData();
    this.isVisible = false;
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
    this.productDataType = current.product_type;
    this.isVisible = true;
    this.isEdit = true;
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

  mapDate(date: string) {
    return formatDateTime(date);
  }

  beforeUpload = (file: NzUploadFile): boolean => {
    this.fileList = [...this.fileList, file];
    return false;
  };
}
