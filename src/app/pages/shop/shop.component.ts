import { Component } from '@angular/core';
import { IProduct } from 'src/app/model/product.model';
import { ProductService } from 'src/app/services/product.service';

interface Order {
  orderno: string;
  table: number;
  time: string;
  status: string;
}

const CART = {
  ADD: 'add',
  DEL: 'del',
};

@Component({
  selector: 'app-shop',
  templateUrl: './shop.component.html',
  styleUrls: ['./shop.component.scss'],
})
export class ShopComponent {
  mockupList: Order[] = [
    {
      orderno: '20041234',
      table: 4,
      time: '20/04/2023 13:44',
      status: 'cooking',
    },
    {
      orderno: '20044124',
      table: 1,
      time: '20/04/2023 14:21',
      status: 'cooking',
    },
  ];
  productList: any = [];
  cart: any = [];
  totalPrice: number = 0;

  categoryType = '';
  query: string = '';
  isVisible = false;

  constructor(private productService: ProductService) {}

  ngOnInit() {
    this.fetchProduct();
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
        console.log(items);
        this.productList = items;
      },
      (err) => {}
    );
  }

  getTagDetail(type: string) {
    switch (type) {
      case 'food':
        return { title: 'อาหาร', color: 'blue' };
      case 'desert':
        return { title: 'ของหวาน', color: 'magenta' };
      case 'beverage':
        return { title: 'เครื่องดื่ม', color: 'volcano' };
      default:
        return { title: 'สินค้า', color: 'purple' };
    }
  }

  updateCart(item: any, type: string) {
    const existingItem = this.cart.find(
      (current: any) => current._id === item._id
    );

    if (type === CART.ADD) {
      if (existingItem) {
        existingItem.amount++;
        existingItem.totalPrice += item.price;
      } else {
        const newItem = {
          _id: item._id,
          name: item.name,
          amount: 1,
          price: item.price,
          totalPrice: item.price,
        };
        this.cart.push(newItem);
      }

      this.totalPrice += item.price;
    } else if (type == CART.DEL) {
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

  showModal(): void {
    this.isVisible = true;
  }

  handleOk(): void {
    console.log('Button ok clicked!');
    this.isVisible = false;
  }

  handleCancel(): void {
    console.log('Button cancel clicked!');
    this.isVisible = false;
  }
}
