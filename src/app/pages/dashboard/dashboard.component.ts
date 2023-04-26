import { NgIfContext } from '@angular/common';
import { Component, ElementRef, TemplateRef, ViewChild } from '@angular/core';
import { IProduct } from 'src/app/model/product.model';
import { ReportService } from 'src/app/services/report.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent {
  dataList: IProduct[] = [];

  emptyRef?: ElementRef<HTMLElement>;

  cardData: any = {
    dailyProfit: 0,
    dailyBill: 0,
    weeklyProfit: 0,
  };

  // === PAGINATION === //
  page: number = 1;
  pageLimit: number = 10;
  total: number = 0;

  constructor(private reportService: ReportService) {}

  ngOnInit() {
    // this.dataList = [
    //   {
    //     key: 'PD0001',
    //     name: 'กระเทียมพริกไทย',
    //     prize: 200,
    //     amount: 14,
    //     type: 'วัตถุดิบ',
    //   },
    //   {
    //     key: 'PD0002',
    //     name: 'ใบกระเพรา',
    //     prize: 40,
    //     amount: 2,
    //     type: 'วัตถุดิบ',
    //   },
    //   {
    //     key: 'PD0003',
    //     name: 'น้ำเชื่อม',
    //     prize: 80,
    //     amount: 12,
    //     type: 'วัตถุดิบ',
    //   },
    //   {
    //     key: 'PD0004',
    //     name: 'หลอด',
    //     prize: 50,
    //     amount: 36,
    //     type: 'ของใช้งาน',
    //   },
    // ];
    this.fetchDashboardData();
  }

  fetchDashboardData() {
    let pageConfig = {
      page: this.page,
      limit: this.pageLimit,
    };
    this.reportService.getOverviewReport(pageConfig).subscribe(
      (res) => {
        let { daily_profit, order_total, product_min, weekly_profit } = res;
        this.cardData = {
          dailyProfit: daily_profit,
          dailyBill: order_total,
          weeklyProfit: weekly_profit,
        };

        this.dataList = product_min;
      },
      (err) => {}
    );
  }
}
