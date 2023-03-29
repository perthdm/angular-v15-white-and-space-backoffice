import { Component } from '@angular/core';

interface Person {
  key: string;
  name: string;
  prize: number;
  amount: number;
  type: string;
}

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent {
  dataList: Person[] = [];

  ngOnInit() {
    this.dataList = [
      {
        key: '0001',
        name: 'กระเทียมพริกไทย',
        prize: 200,
        amount: 14,
        type: 'New York No. 1 Lake Park',
      },
      {
        key: '0002',
        name: 'ใบกระเพรา',
        prize: 40,
        amount: 2,
        type: 'London No. 1 Lake Park',
      },
      {
        key: '0003',
        name: 'น้ำเชื่อม',
        prize: 80,
        amount: 12,
        type: 'Sidney No. 1 Lake Park',
      },
      {
        key: '0004',
        name: 'หลอด',
        prize: 50,
        amount: 36,
        type: 'Sidney No. 1 Lake Park',
      },
    ];
  }
}
