import { Component } from '@angular/core';
import { getISOWeek } from 'date-fns';

@Component({
  selector: 'app-report',
  templateUrl: './report.component.html',
  styleUrls: ['./report.component.scss'],
})
export class ReportComponent {
  dataList: any = [];
  date = null;
  isLoading: boolean = true;
  totalBill: number = 0;
  totalProfit: number = 0;

  ngOnInit() {
    for (let i = 0; i < 11; i++) {
      const randomNumber = Math.floor(Math.random() * 100);
      const randomBoolean = Math.random() < 0.5;
      const randomObject = {
        id: i + 1,
        date: `${i + 1}/4/2566`,
        bill: randomNumber,
        profit: randomNumber * 1024,
        assignee: randomBoolean ? "Jessica Lawrence" : "Nicrorus Jeff",
      };
      this.totalBill += randomNumber;
      this.totalProfit += randomNumber * 1024;
      this.dataList.push(randomObject);
    }
    this.isLoading = false;
  }

  onChange(result: Date[]): void {
    console.log('onChange: ', result);
  }

  getWeek(result: Date[]): void {
    console.log('week: ', result.map(getISOWeek));
  }
}
