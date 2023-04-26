import { Component } from '@angular/core';
import { getISOWeek } from 'date-fns';
import * as moment from 'moment';
import { ReportService } from 'src/app/services/report.service';

@Component({
  selector: 'app-report',
  templateUrl: './report.component.html',
  styleUrls: ['./report.component.scss'],
})
export class ReportComponent {
  dataList: any = [];
  summaryData: any = { totalProfit: 0, totalBill: 0 };
  date = [new Date(), new Date()];

  isLoading: boolean = true;
  totalBill: number = 0;
  totalProfit: number = 0;

  constructor(private reportService: ReportService) {}

  ngOnInit() {
    // for (let i = 0; i < 11; i++) {
    //   const randomNumber = Math.floor(Math.random() * 100);
    //   const randomBoolean = Math.random() < 0.5;
    //   const randomObject = {
    //     id: i + 1,
    //     date: `${i + 1}/4/2566`,
    //     bill: randomNumber,
    //     profit: randomNumber * 1024,
    //     assignee: randomBoolean ? 'Jessica Lawrence' : 'Nicrorus Jeff',
    //   };
    //   this.totalBill += randomNumber;
    //   this.totalProfit += randomNumber * 1024;
    //   this.dataList.push(randomObject);
    // }

    this.fetchReport();
    this.isLoading = false;
  }

  fetchReport = () => {
    let reqConfig: any = {
      start: this.date[0] ? moment(this.date[0]).startOf('month') : null,
      end: this.date[1] ? moment(this.date[1]).endOf('month') : null,
    };

    this.reportService.getMonthlyReport(reqConfig).subscribe(
      (res) => {
        let { items, summary } = res;
        this.dataList = items;
        this.summaryData = summary;
      },
      (err) => {}
    );
  };

  onChange(result: Date[]): void {
    console.log('onChange: ', result);
  }

  getWeek(result: Date[]): void {
    console.log('week: ', result.map(getISOWeek));
  }
}
