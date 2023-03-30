import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from '../pages/dashboard/dashboard.component';
import { PermissionComponent } from '../pages/permission/permission.component';
import { ReceiptHistoryComponent } from '../pages/receipt-history/receipt-history.component';
import { SettingComponent } from '../pages/setting/setting.component';
import { StaffComponent } from '../pages/staff/staff.component';
import { StockComponent } from '../pages/stock/stock.component';
import { LayoutComponent } from './layout.component';

const routes: Routes = [
  {
    path: '',
    component: LayoutComponent,
    children: [
      {
        path: 'dashboard',
        component: DashboardComponent,
      },
      {
        path: 'staff',
        component: StaffComponent,
      },
      {
        path: 'permission',
        component: PermissionComponent,
      },
      {
        path: 'stock',
        component: StockComponent,
      },
      {
        path: 'receipt-history',
        component: ReceiptHistoryComponent,
      },
      {
        path: 'setting',
        component: SettingComponent,
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class LayoutRoutingModule {}
