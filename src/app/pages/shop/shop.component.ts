import { Component, Output, EventEmitter } from '@angular/core';
import { OrderService } from 'src/app/services/order.service';
import { ProductService } from 'src/app/services/product.service';
import { NzMessageService } from 'ng-zorro-antd/message';
import Swal from 'sweetalert2';
import { CART_ACTION, PAYMENT_TYPE } from 'src/utils/constatnt';
import { getStorage } from 'src/utils/utils';
import { StockService } from 'src/app/services/stock.service';

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
  categoryCount: any = {};
  currentBarcode: string = '';
  isShowModal: boolean = false;
  constructor(
    private productService: ProductService,
    private orderService: OrderService,
    private stockService: StockService,
    private message: NzMessageService
  ) {}
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

  onDigitClick(digitValue: string) {
    if (digitValue == '100' || digitValue == '500' || digitValue == '1000') {
      this.sumValue = parseInt(digitValue);
      this.value = this.value + this.sumValue;
    } else {
      this.currentValue = digitValue;
      this.value = parseInt(this.value + this.currentValue);
    }
  }
  onEqualClick(){
    this.value = this.totalPrice 
  }

  onClearClick() {
    this.currentValue = '';
    this.value = 0;
  }
  onBackspaceClick() {
    this.currentValue = this.currentValue.slice(0, -1);
    if (isNaN(parseInt(this.currentValue))) {
      this.currentValue = '0';
    }
    this.value = parseInt(this.currentValue);
  }
  ngOnInit() {
    this.fetchProduct();
    window.addEventListener('keypress', this.handleBarcodeInput.bind(this));
  }

  throwErrorMessage(message: string) {
    this.message.create('error', `กรุณาลองอีกครั้ง ** ${message} **`);
  }

  handleBarcodeInput(event: KeyboardEvent) {
    const input = event.key;

    if (input === 'Enter') {
      this.processBarcode(this.currentBarcode);

      this.currentBarcode = '';
    } else {
      this.currentBarcode += input;
    }
  }

  processBarcode(barcode: string) {
    if (barcode) {
      this.stockService.searchTagId(barcode).subscribe(
        (res) => {
          if (res) {
            res['tagId'] = barcode;
            this.updateCart(res, 'add');
            this.message.create(
              'success',
              `เพื่ม "${res.name}" ลงตระกร้าสำเร็จ`
            );
          }
        },
        (err) => {
          this.throwErrorMessage(
            `Please try again ${err.error.message}::${err.error.statusCode}`
          );
        }
      );
    }
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
        let { items, summary } = res;
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

        let next = items.filter((item: any) => item.status);

        this.categoryCount = nextSum;
        this.productList = next;
        this.productListPreview = next;
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
        if (item.auto_stock) {
          if (!existingItem.tagList.includes(item.tagId)) {
            existingItem.tagList = [...existingItem.tagList, item.tagId];
          } else {
            this.message.create('warning', 'สินค้าชิ้นนี้อยู่ในตระกร้าแล้ว');
          }
        }
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

        if (item?.auto_stock) {
          newItem['tagList'] = [item?.tagId];
        }
        this.cart.push(newItem);
      }

      this.totalPrice += item.price;
    } else if (type == CART_ACTION.DEL) {
      console.log(existingItem);

      if (existingItem) {
        if (existingItem.amount >= 1) {
          existingItem.amount--;
          existingItem.totalPrice -= item.price;

          if (existingItem.amount === 0) {
            this.cart = this.cart.filter(
              (current: any) => current._id !== item._id
            );
          }

          if (item.auto_stock) {
            existingItem.tagList.pop();
          }
        }
        this.totalPrice -= item.price;
      }
    }
  }

  handleOk(): void {
    let customer_change = this.value - this.totalPrice 
    if(customer_change >= 0){
      this.orderService.checkOutCashOrder(this.stashItem).subscribe(
        (res) => {
          Swal.fire(
            'ทำรายการสำเร็จ !',
            `ทอน ${customer_change} บาท`,
            'success'
          );
          this.handleClearOrder();
        },
        (err) => {}
      );
      this.isShowModal = false;
    }else{
      Swal.fire(
        'ทำรายการไม่สำเร็จ !',
        `กรุณาตรวจสอบจำนวนเงิน`,
        'warning'
      );
    }
  }

  handleCancel(): void {
    this.isShowModal = false;
    this.stashItem = [];
    this.value = 0;
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
