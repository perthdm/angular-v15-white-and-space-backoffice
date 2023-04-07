import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from '../pages/dashboard/dashboard.component';
import { PermissionComponent } from '../pages/permission/permission.component';
import { SettingComponent } from '../pages/setting/setting.component';
import { StaffComponent } from '../pages/staff/staff.component';
import { StockComponent } from '../pages/stock/stock.component';
import { ShopComponent } from '../pages/shop/shop.component';
import { LayoutComponent } from './layout.component';
import { ReportComponent } from '../pages/report/report.component';
import { BillingHistoryComponent } from '../pages/billing-history/billing-history.component';
import { TimeStampComponent } from '../pages/time-stamp/time-stamp.component';

const routes: Routes = [
  {
    path: '',
    component: LayoutComponent,
    children: [
      {
        path: 'shop',
        component: ShopComponent,
      },
      {
        path: 'dashboard',
        component: DashboardComponent,
      },
      {
        path: 'report',
        component: ReportComponent,
      },
      {
        path: 'billing-history',
        component: BillingHistoryComponent,
      },
      {
        path: 'time-stamp',
        component: TimeStampComponent,
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
