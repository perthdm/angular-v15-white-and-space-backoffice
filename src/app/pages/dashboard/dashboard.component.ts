import { NgIfContext } from '@angular/common';
import { Component, ElementRef, TemplateRef, ViewChild } from '@angular/core';
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

  emptyRef?: ElementRef<HTMLElement>;

  ngOnInit() {
    this.dataList = [
      {
        key: 'PD0001',
        name: 'กระเทียมพริกไทย',
        prize: 200,
        amount: 14,
        type: 'วัตถุดิบ',
      },
      {
        key: 'PD0002',
        name: 'ใบกระเพรา',
        prize: 40,
        amount: 2,
        type: 'วัตถุดิบ',
      },
      {
        key: 'PD0003',
        name: 'น้ำเชื่อม',
        prize: 80,
        amount: 12,
        type: 'วัตถุดิบ',
      },
      {
        key: 'PD0004',
        name: 'หลอด',
        prize: 50,
        amount: 36,
        type: 'ของใช้งาน',
      },
    ];
  }
}
