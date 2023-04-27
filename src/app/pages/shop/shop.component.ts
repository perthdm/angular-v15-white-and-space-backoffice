import { Component } from '@angular/core';
import { OrderService } from 'src/app/services/order.service';
import { ProductService } from 'src/app/services/product.service';
import { NzMessageService } from 'ng-zorro-antd/message';
import Swal from 'sweetalert2';
import { CART_ACTION, PAYMENT_TYPE } from 'src/utils/constatnt';

interface Order {
  orderno: string;
  table: number;
  time: string;
  status: string;
}

@Component({
  selector: 'app-shop',
  templateUrl: './shop.component.html',
  styleUrls: ['./shop.component.scss'],
})
export class ShopComponent {
  productList: any = [];
  productListPreview: any = [];
  cart: any = [];
  totalPrice: number = 0;
  categoryType = '';
  query: string = '';
  userFullName: any = 'White And Space';
  userRole: any = '';

  constructor(
    private productService: ProductService,
    private orderService: OrderService,
    private message: NzMessageService
  ) {}

  ngOnInit() {
    this.fetchProduct();
    this.userFullName = localStorage.getItem('name');
    this.userRole = localStorage.getItem('role');
  }

  fetchProduct() {
    let pageConfig = {
      page: 1,
      limit: 100,
      type: this.categoryType,
      query: this.query,
    };
    this.productService.getAllProduct(pageConfig).subscribe(
      (res) => {
        let { items } = res;
        this.productList = items;
        this.productListPreview = items;
      },
      (err) => {}
    );
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

  updateCart(item: any, type: string) {
    const existingItem = this.cart.find(
      (current: any) => current._id === item._id
    );

    if (type === CART_ACTION.ADD) {
      if (existingItem) {
        existingItem.amount++;
        existingItem.totalPrice += item.price;
      } else {
        const newItem = {
          _id: item._id,
          name: item.name,
          amount: 1,
          price: item.price,
          product_type: item.product_type,
          totalPrice: item.price,
        };
        this.cart.push(newItem);
      }

      this.totalPrice += item.price;
    } else if (type == CART_ACTION.DEL) {
      if (existingItem) {
        if (existingItem.amount >= 1) {
          existingItem.amount--;
          existingItem.totalPrice -= item.price;

          if (existingItem.amount === 0) {
            this.cart = this.cart.filter(
              (current: any) => current._id !== item._id
            );
          }
        }

        this.totalPrice -= item.price;
      }
    }
  }

  // showModal(): void {
  //   this.isVisible = true;
  // }

  // handleOk(): void {
  //   console.log('Button ok clicked!');
  //   this.isVisible = false;
  // }

  // handleCancel(): void {
  //   console.log('Button cancel clicked!');
  //   this.isVisible = false;
  // }

  filterByType() {
    let nextList = [...this.productList];
    if (this.categoryType !== '') {
      nextList = nextList.filter((i) => i.product_type === this.categoryType);
    }

    this.productListPreview = nextList;
  }

  handleClearOrder() {
    this.cart = [];
    this.totalPrice = 0;
  }

  handleConfirmOrder(paymentType: string) {
    let b: any = [];
    this.cart.map((item: any) => {
      b.push({ product_id: item._id, amount: item.amount });
    });

    Swal.fire({
      title: 'คำเตือน!',
      text: 'กรุณาตรวจสอบ "รายการสินค้า" ก่อนทำรายการต่อไป',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'ยืนยันออเดอร์',
      cancelButtonText: 'ยกเลิก',
    }).then((result) => {
      if (result.value) {
        if (paymentType === PAYMENT_TYPE.CASH) {
          this.orderService.checkOutCashOrder(b).subscribe(
            (res) => {
              Swal.fire(
                'ทำรายการสำเร็จ !',
                'กรุณาตรวจสอบยอดเงินที่ได้รับ',
                'success'
              );
              this.handleClearOrder();
            },
            (err) => {}
          );
        } else if (paymentType === PAYMENT_TYPE.MOBILE_BANKING) {
          this.orderService.checkOutBankingOrder(b).subscribe(
            (res) => {
              Swal.fire(
                'ทำรายการสำเร็จ !',
                'กรุณาตรวจสอบยอดเงินที่ได้รับ',
                'success'
              );
              this.handleClearOrder();
            },
            (err) => {}
          );
        }
      }
    });
  }
}
