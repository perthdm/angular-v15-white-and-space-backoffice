import { Component } from '@angular/core';
import { NzMessageService } from 'ng-zorro-antd/message';
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

  page: number = 1;
  pageLimit: number = 10;
  total: number = 10;
  productType = 'all';
  query: string = '';

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
        items.map((us: IProduct) => {
          us.createdAt = formatDateTime(us.createdAt);
          us.updatedAt = formatDateTime(us.updatedAt);
        });

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
}
