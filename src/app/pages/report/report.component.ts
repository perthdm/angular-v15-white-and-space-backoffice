import { Component } from '@angular/core';
import { getISOWeek } from 'date-fns';
import * as moment from 'moment';
import { ReportService } from 'src/app/services/report.service';
import { formatDateTime, getStorage } from 'src/utils/utils';

@Component({
  selector: 'app-report',
  templateUrl: './report.component.html',
  styleUrls: ['./report.component.scss'],
})
export class ReportComponent {
  dataList: any = [];
  summaryData: any = { totalProfit: 0, totalBill: 0 };
  dateRange: any = [
    moment().startOf('day').toDate(),
    moment().endOf('day').toDate(),
  ];
  dateFormat = 'dd-MM-YYYY';

  isLoading: boolean = true;
  totalBill: number = 0;
  totalProfit: number = 0;

  isAccess: boolean = getStorage('role') === 'owner' ? true : false;

  constructor(private reportService: ReportService) {}

  ngOnInit() {
    this.fetchReport();
    this.isLoading = false;
  }

  fetchReport = () => {
    let reqConfig: any = {
      start: this.dateRange[0] ? this.dateRange[0] : null,
      end: this.dateRange[1] ? this.dateRange[1] : null,
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

  mapDate(date: string, option: string) {
    return formatDateTime(date, option);
  }
}
