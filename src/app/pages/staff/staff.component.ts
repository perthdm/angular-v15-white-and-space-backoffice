import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { Staff } from 'src/app/model/staff.model';
import { StaffService } from 'src/app/services/staff.service';

@Component({
  selector: 'app-staff',
  templateUrl: './staff.component.html',
  styleUrls: ['./staff.component.scss'],
})
export class StaffComponent {
  dataList: Staff[] | any;
  constructor(private http: HttpClient, private staffService: StaffService) {}

  ngOnInit() {
    this.staffService.getStaff().subscribe(
      (res) => {
        let { info, results } = res;
        let next = [...results, ...results, ...results];
        this.dataList = next;
      },
      (err) => {
        console.log(err);
      }
    );
  }
}
