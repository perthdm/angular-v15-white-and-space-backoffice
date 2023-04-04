import { Component } from '@angular/core';

interface Permission {
  id: string;
  nameTh: string;
  nameEn: string;
  createdAt: string;
  updatedAt: string;
}

@Component({
  selector: 'app-permission',
  templateUrl: './permission.component.html',
  styleUrls: ['./permission.component.scss'],
})
export class PermissionComponent {
  permissionList: Permission[] = [
    {
      id: '001',
      nameTh: 'ผู้จัดการร้าน',
      nameEn: 'Owner',
      createdAt: '02/12/2555',
      updatedAt: '02/12/2555',
    },
    {
      id: '002',
      nameTh: 'พนักงานเสิร์ฟ',
      nameEn: 'Waiter',
      createdAt: '02/12/2555',
      updatedAt: '02/12/2555',
    },
    {
      id: '003',
      nameTh: 'พ่อครัว',
      nameEn: 'Chef',
      createdAt: '02/12/2555',
      updatedAt: '02/12/2555',
    },
  ];
}
