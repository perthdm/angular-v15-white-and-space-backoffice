import { NgIfContext } from '@angular/common';
import { Component, ElementRef, TemplateRef, ViewChild } from '@angular/core';
import { IProduct } from 'src/app/model/product.model';
import { ReportService } from 'src/app/services/report.service';
import { Chart, registerables } from 'chart.js';
Chart.register(...registerables);

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
    this.fetchDashboardData();
    this.RenderChart();
  }

  RenderChart() {
    const myChart = new Chart('barchart', {
      type: 'line',
      data: {
        labels: [
          'วันที่1',
          'วันที่2',
          'วันที่3',
          'วันที่4',
          'วันที่5',
          'วันที่6',
          'วันที่7',
        ],
        datasets: [
          {
            label: 'ยอด 7 วัน',
            data: [7995, 2144, 9974, 6974, 1402, 2456, 1111],
            backgroundColor: ['rgba(54,162,235,0.9)'],
            borderColor: ['rgba(54,162,235,0.9)'],
            borderWidth: 5,
            tension:0.2,
          },
        ],
      },
      options: {
        scales: {
          y: {
            beginAtZero: true,
          },
        },
      },
    });
  }

  fetchDashboardData() {
    let pageConfig = {
      page: this.page,
      limit: this.pageLimit,
    };
    this.reportService.getOverviewReport(pageConfig).subscribe(
      (res) => {
        let {
          daily_profit,
          order_total,
          stock_min,
          weekly_profit,
          cash_drawer,
          cash_profit,
        } = res;
        this.cardData = {
          dailyProfit: daily_profit,
          dailyBill: order_total,
          weeklyProfit: weekly_profit,
          cashDrawer: cash_drawer,
          cashProfit: cash_profit,
          cashTransfer: daily_profit - cash_profit,
          cashDrawerLast: cash_drawer + cash_profit,
          cashGoal:100000,
        };
        this.dataList = stock_min.items;
      },
      (err) => {}
    );
  }
}
