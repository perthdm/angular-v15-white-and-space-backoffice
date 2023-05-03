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
  dateList: any = [];
  inputData: any = {};
  emptyRef?: ElementRef<HTMLElement>;

  cardData: any = {
    dailyProfit: 0,
    dailyBill: 0,
    weeklyProfit: 0,
  };
  isGoal: boolean = false;
  isVisible = false;
  // === PAGINATION === //
  page: number = 1;
  pageLimit: number = 10;
  total: number = 0;

  constructor(private reportService: ReportService) {}

  ngOnInit() {
    this.fetchDashboardData();
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
          report_weekly,
        } = res;
        this.cardData = {
          dailyProfit: daily_profit,
          dailyBill: order_total,
          weeklyProfit: weekly_profit,
          cashDrawer: cash_drawer,
          cashProfit: cash_profit,
          cashTransfer: daily_profit - cash_profit,
          cashDrawerLast: cash_drawer + cash_profit,
          cashGoal: 100000,
        };

        this.dataList = stock_min.items;
        let tempDate: any = [];
        let sumData: any = [];
        report_weekly.map((item: any) => {
          tempDate.push(item.date);
          sumData.push(item.profit);
        });

        this.RenderChart(tempDate, sumData);
      },
      (err) => {}
    );
  }

  RenderChart(tempDate: any, sumData: any) {
    const myChart = new Chart('barchart', {
      type: 'line',
      data: {
        labels: tempDate,
        datasets: [
          {
            label: 'ยอด 7 วัน',
            data: sumData,
            backgroundColor: ['rgba(54,162,235,0.9)'],
            borderColor: ['rgba(54,162,235,0.9)'],
            borderWidth: 5,
            tension: 0.2,
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
  showModalGoal(): void {
    this.isVisible = true;
    this.isGoal = true;
  }
  showModalMoney(): void {
    this.isVisible = true;
    this.isGoal = false;
  }

  handleOk(): void {
    console.log('Button ok clicked!');
    this.isVisible = false;
  }

  handleCancel(): void {
    console.log('Button cancel clicked!');
    this.isVisible = false;
  }
  onChangeData(e: any) {
    let { name, value } = e.target;
    this.inputData = {
      ...this.inputData,
      [name]: value,
    };
  }
}
