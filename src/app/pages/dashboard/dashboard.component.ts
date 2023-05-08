import { NgIfContext } from '@angular/common';
import { Component, ElementRef, TemplateRef, ViewChild } from '@angular/core';
import { IProduct } from 'src/app/model/product.model';
import { ReportService } from 'src/app/services/report.service';
import { Chart, registerables } from 'chart.js';
import { formatDateTime } from 'src/utils/utils';
import { CafeService } from 'src/app/services/cafe.service';
import { NzMessageService } from 'ng-zorro-antd/message';
import { Observable } from 'rxjs';
Chart.register(...registerables);

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent {
  dataList: any[] = [];
  dateList: any = [];
  inputValue: any = '';
  emptyRef?: ElementRef<HTMLElement>;

  cardData: any = {
    dailyProfit: 0,
    dailyBill: 0,
    weeklyProfit: 0,
  };
  isGoal: boolean = false;
  isVisible: boolean = false;

  // === PAGINATION === //
  page: number = 1;
  pageLimit: number = 10;
  total: number = 0;

  constructor(
    private reportService: ReportService,
    private cafeService: CafeService,
    private message: NzMessageService
  ) {}

  ngOnInit() {
    this.fetchDashboardData();
  }

  fetchDashboardData() {
    let pageConfig = {
      page: this.page,
      limit: this.pageLimit,
    };
    this.reportService.getOverviewReport(pageConfig).subscribe((res) => {
      let {
        daily_profit, // [DAILY] : PROFIT
        monthly_profit, // [MONTHLY] : PROFIT
        weekly_profit, // [WEEKLY] : PROFIT
        order_total, // [DAILY] : BILL COUNT
        cash_drawer, // [DAILY] : START WITH CASH
        cash_profit, // [DAILY] : CASH PROFIT
        report_weekly, // [WEEKLY] : GRAPHS
        goal, // GOAL,
        daily_percent, // COMPARE WITH YESTERDAY
        product_ranking,
      } = res;
      goal = goal > 0 ? goal : 100000;

      this.cardData = {
        dailyProfit: daily_profit.toLocaleString(),
        weeklyProfit: weekly_profit,
        monthlyProfit: monthly_profit.toLocaleString(),
        dailyBillCount: order_total.toLocaleString(),
        startWithCash: cash_drawer.toLocaleString(),
        cashTransfer: daily_profit - cash_profit,
        currentCashDrawer: (cash_drawer + cash_profit).toLocaleString(),
        targetGoal: goal.toLocaleString(),
        goalProgress: ((monthly_profit * 100) / goal).toFixed(2),
        compareWithYesterDay: daily_percent,
      };
      
      this.dataList = product_ranking.items;

      let tempDate: any = [];
      let sumData: any = [];
      report_weekly.map((item: any) => {
        tempDate.push(formatDateTime(item.date, 'onlyDate'));
        sumData.push(item.profit);
      });

      this.RenderChart(tempDate, sumData);
    });
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
  }

  handleOk(): void {
    let reqData: any = {};

    let response: Observable<any>;

    if (this.isGoal) {
      reqData['goal'] = +this.inputValue;

      response = this.cafeService.updateCafe(reqData);
    } else {
      reqData['cash_drawer'] = +this.inputValue;
      response = this.cafeService.updateCashDrawer(reqData['cash_drawer']);
    }

    response.subscribe(
      () => {
        this.message.create('success', `ทำรายการสำเร็จ`);
        this.handleCloseModal();
        this.fetchDashboardData();
      },
      (err) => {
        this.message.create(
          'error',
          `Please try again ${err.error.message}::${err.error.statusCode}`
        );
      }
    );
  }

  handleCloseModal(): void {
    this.isVisible = false;
    this.resetData();
  }

  resetData() {
    this.inputValue = null;
    this.isGoal = false;
  }
}
