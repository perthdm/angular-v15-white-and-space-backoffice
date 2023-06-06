import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { UserService } from '../services/user.service';
import { NzMessageService } from 'ng-zorro-antd/message';
import { getStorage } from 'src/utils/utils';

@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.scss'],
})
export class LayoutComponent implements OnInit {
  isCollapsed = true;
  isShowModalCheckIn: boolean = false;
  isFullAccess: boolean = false;
  userId: string = '';
  // isWithinRange: boolean = false;
  constructor(
    private router: Router,
    private usService: UserService,
    private message: NzMessageService
  ) {}

  // White & Space location
  // targetLocation = {
  //   latitude: 13.289338,
  //   longitude: 100.931289,
  // };

  ngOnInit() {
    this.fetchCheckInStatus();
    this.fetchUserProfile();
    let currentRole = localStorage.getItem('role');
    if (currentRole === 'owner' || currentRole === 'manager') {
      this.isFullAccess = true;
    }

    // this.getLocation();
    // // Set interval to refresh location every minute (60000 milliseconds)
    // setInterval(() => {
    //   this.getLocation();
    // }, 10000);
  }

  // getLocation(): void {
  //   navigator.geolocation.getCurrentPosition((position) => {
  //     console.log(position);
  //     const distance = this.calculateDistance(
  //       position.coords.latitude,
  //       position.coords.longitude,
  //       this.targetLocation.latitude,
  //       this.targetLocation.longitude
  //     );
  //     this.isWithinRange = distance <= 1;
  //   });
  // }

  fetchCheckInStatus() {
    this.usService.getCheckInStatus().subscribe((res) => {
      if (res) {
        let { check_in } = res;
        if (!check_in) this.isShowModalCheckIn = true;
      } else {
        this.isShowModalCheckIn = true;
      }
    });
  }

  fetchUserProfile() {
    this.usService.getProfile().subscribe((res) => {
      let { name, _id } = res;
      this.userId = _id;
      localStorage.setItem('name', name);
    });
  }

  handleCheckIn() {
    if (this.userId) {
      this.usService.checkIn(this.userId).subscribe(
        (res) => {
          this.isShowModalCheckIn = false;
          Swal.fire('Success', 'คุณได้เช็คอินเข้างานแล้ว', 'success');
        },
        (err) => {
          this.message.create(
            'error',
            `Please try again ${err.error.message}::${err.error.statusCode}`
          );
        }
      );
    }
  }

  logout() {
    console.log('CLEAR');
    localStorage.clear();
    this.router.navigate(['/login']);
  }

  // Calculate distance using Haversine formula
  // calculateDistance(
  //   lat1: number,
  //   lon1: number,
  //   lat2: number,
  //   lon2: number
  // ): number {
  //   const R = 6371; // Radius of the earth in km
  //   const dLat = this.deg2rad(lat2 - lat1);
  //   const dLon = this.deg2rad(lon2 - lon1);
  //   const a =
  //     Math.sin(dLat / 2) * Math.sin(dLat / 2) +
  //     Math.cos(this.deg2rad(lat1)) *
  //       Math.cos(this.deg2rad(lat2)) *
  //       Math.sin(dLon / 2) *
  //       Math.sin(dLon / 2);
  //   const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  //   const d = R * c; // Distance in km
  //   return d;
  // }

  // // Converts numeric degrees to radians
  // deg2rad(deg: number): number {
  //   return deg * (Math.PI / 180);
  // }
}
