import { Component, ElementRef, ViewChild } from '@angular/core';
import { OrderService } from 'src/app/services/order.service';
import { ProductService } from 'src/app/services/product.service';
import { NzMessageService } from 'ng-zorro-antd/message';
import Swal from 'sweetalert2';
import { CART_ACTION, PAYMENT_TYPE } from 'src/utils/constatnt';
import { getStorage } from 'src/utils/utils';

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
  @ViewChild('cartForceFocus') cartForceFocus!: ElementRef;

  scannerBarcodeBond: any;
  productList: any = [];
  productListPreview: any = [];
  cart: any = [];
  totalPrice: number = 0;
  discountValue: number = 0;
  lastPrice: number = 0;
  radioValue = 'price';
  categoryType = '';
  query: string = '';
  userFullName: any = 'White And Space';
  userRole: any = '';
  categoryCount: any = {};
  currentBarcode: string = '';
  isShowModal: boolean = false;
  isDiscount: boolean = false;
  sumValue = 0;
  value = 0;
  stashItem: any = [];
  currentValue = '';
  digits = [
    { value: '1', text: '1' },
    { value: '2', text: '2' },
    { value: '3', text: '3' },
    { value: '4', text: '4' },
    { value: '5', text: '5' },
    { value: '6', text: '6' },
    { value: '7', text: '7' },
    { value: '8', text: '8' },
    { value: '9', text: '9' },
  ];

  constructor(
    private productService: ProductService,
    private orderService: OrderService,
    private message: NzMessageService
  ) {}

  ngOnInit() {
    window.addEventListener('keypress', this.scannerBarcodeBond);
    this.fetchProductActive();
  }

  handleOpendiscount() {
    this.isDiscount = true;
    this.isShowModal = true;
  }
  ngAfterViewInit() {
    this.cartForceFocus.nativeElement.focus();
    this.cartForceFocus.nativeElement.hidden = true;
  }

  ngOnDestroy() {
    window.removeEventListener('keypress', this.scannerBarcodeBond);
  }

  throwErrorMessage(message: string) {
    this.message.create('error', `กรุณาลองอีกครั้ง ** ${message} **`);
  }
  discountType() {
    this.discountValue = 0;
    this.value = 0;
    this.lastPrice = this.totalPrice;
  }

  fetchProductActive() {
    this.productService.getProductActive().subscribe(
      (res) => {
        let { items, summary } = res;
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

        this.categoryCount = nextSum;
        this.productList = items;
        this.productListPreview = items;
        this.userFullName = getStorage('name');
        this.userRole = getStorage('role');
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
      case 'bear':
        return { title: 'หมี', color: 'orange' };
      case 'set':
        return { title: 'เซ็ต', color: 'green' };
      default:
        return { title: 'อื่นๆ', color: 'purple' };
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
        const newItem: any = {
          _id: item._id,
          name: item.name,
          amount: 1,
          price: item.price,
          product_type: item.product_type,
          totalPrice: item.price,
          image: item.image,
        };

        this.cart.push(newItem);
      }

      this.totalPrice += item.price;
      this.lastPrice =
        this.radioValue == 'price'
          ? this.totalPrice - this.discountValue
          : this.totalPrice - (this.totalPrice * this.discountValue) / 100;
    } else if (type == CART_ACTION.DEL) {
      if (existingItem) {
        if (existingItem.amount >= 1) {
          existingItem.amount--;
          existingItem.totalPrice -= item.price;
        }

        if (existingItem.amount === 0) {
          this.cart = this.cart.filter(
            (current: any) => current._id !== item._id
          );
        }

        this.totalPrice -= item.price;
        this.lastPrice =
          this.radioValue == 'price'
            ? this.totalPrice - this.discountValue
            : this.totalPrice - (this.totalPrice * this.discountValue) / 100;
      }
    }
  }

  handleDiscountOk(): any {
    if ((this.isDiscount = true)) {
      this.discountValue = this.value;
      if (this.radioValue == 'price') {
        if (this.totalPrice - this.discountValue < 0) {
          this.discountValue = 0;
          return this.message.create(
            'warning',
            'กรุณาตรวจสอบส่วนลดเนื่องจาก ลดคาส่วนลดมากกว่าจำนวนราคาทั้งหมด'
          );
        } else {
          this.lastPrice = this.totalPrice - this.discountValue;
        }
      } else {
        if (this.discountValue > 100) {
          this.discountValue = 100;
        }
        this.lastPrice =
          this.totalPrice - (this.totalPrice * this.discountValue) / 100;
      }
    }
    this.isShowModal = false;
    this.isDiscount = false;
  }

  handleOk(): void {
    let customer_change = this.value - this.lastPrice;
    if (customer_change >= 0) {
      this.orderService
        .checkOutOrder(
          this.stashItem,
          'cash',
          this.value,
          this.radioValue,
          this.discountValue
        )
        .subscribe(
          (res) => {
            Swal.fire(
              'ทำรายการสำเร็จ !',
              `ทอน ${customer_change} บาท`,
              'success'
            );
            this.handleClearOrder();
          },
          (err) => {
            this.throwErrorMessage(`${err.error.message}`);
          }
        );
      this.isShowModal = false;
    } else {
      this.message.create('warning', 'กรุณาตรวจสอบจำนวนเงินที่รับ');
    }
  }

  handleCancel(): void {
    this.isShowModal = false;
    this.stashItem = [];
    this.value = 0;
    this.isDiscount = false;
    this.discountValue = 0;
    this.lastPrice = this.totalPrice;
  }

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
    this.stashItem = [];
    this.value = 0;
    this.discountValue = 0;
    this.lastPrice = 0;
  }

  handleConfirmOrder(paymentType: string) {
    let b: any = [];
    this.cart.map((item: any) => {
      if (item.tagList && item.tagList.length > 0) {
        b.push({
          product_id: item._id,
          amount: item.amount,
          tracking_list: item.tagList,
        });
      } else {
        b.push({ product_id: item._id, amount: item.amount });
      }
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
          this.isShowModal = true;
          this.value = 0;
          this.stashItem = b;
          // this.orderService.checkOutCashOrder(b).subscribe(
          //   (res) => {
          //     Swal.fire(
          //       'ทำรายการสำเร็จ !',
          //       'กรุณาตรวจสอบยอดเงินที่ได้รับ',
          //       'success'
          //     );
          //     this.handleClearOrder();
          //   },
          //   (err) => {}
          // );
        } else if (paymentType === PAYMENT_TYPE.MOBILE_BANKING) {
          this.orderService
            .checkOutOrder(
              b,
              'banking',
              this.value,
              this.radioValue,
              this.discountValue
            )
            .subscribe(
              (res) => {
                Swal.fire(
                  'ทำรายการสำเร็จ !',
                  'กรุณาตรวจสอบยอดเงินที่ได้รับ',
                  'success'
                );
                this.handleClearOrder();
              },
              (err) => {
                this.throwErrorMessage(`${err.error.message}`);
              }
            );
        }
      }
    });
  }

  onDigitClick(digitValue: string) {
    if (digitValue == '100' || digitValue == '500' || digitValue == '1000') {
      this.sumValue = parseInt(digitValue);
      this.value = this.value + this.sumValue;
    } else {
      this.currentValue = digitValue;
      this.value = parseInt(this.value + this.currentValue);
    }
  }
  onEqualClick() {
    if (this.lastPrice == 0) {
      this.lastPrice = this.totalPrice;
    }
    this.value = this.lastPrice;
  }

  onClearClick() {
    this.currentValue = '';
    this.value = 0;
  }

  onBackspaceClick() {
    let nextVal = this.value.toString();
    nextVal = nextVal.substring(0, nextVal.length - 1);
    this.value = +nextVal;
  }
}
