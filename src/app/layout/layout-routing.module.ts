import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from '../pages/dashboard/dashboard.component';
import { SettingComponent } from '../pages/setting/setting.component';
import { StockComponent } from '../pages/stock/stock.component';
import { ShopComponent } from '../pages/shop/shop.component';
import { LayoutComponent } from './layout.component';
import { ReportComponent } from '../pages/report/report.component';
import { BillingHistoryComponent } from '../pages/billing-history/billing-history.component';
import { AttendanceComponent } from '../pages/attendance/attendance.component';
import { AuthGuardService } from '../services/auth.service';
import { UserComponent } from '../pages/user/user.component';
import { ProductComponent } from '../pages/menu/product.component';
import { AuthRoleService } from '../services/auth-role.service';
import { NotFoundComponent } from '../pages/not-found/not-found.component';

const routes: Routes = [
  {
    path: '',
    component: LayoutComponent,
    canActivate: [AuthGuardService],
    children: [
      {
        path: 'shop',
        component: ShopComponent,
      },
      {
        path: 'dashboard',
        component: DashboardComponent,
        canActivate: [AuthRoleService],
        data: {
          roles: ['owner', 'manager'],
        },
      },
      {
        path: 'report',
        component: ReportComponent,
        canActivate: [AuthRoleService],
        data: {
          roles: ['owner', 'manager'],
        },
      },
      {
        path: 'billing-history',
        component: BillingHistoryComponent,
      },
      {
        path: 'attendance',
        component: AttendanceComponent,
      },
      {
        path: 'user',
        component: UserComponent,
        canActivate: [AuthRoleService],
        data: {
          roles: ['owner', 'manager'],
        },
      },
      {
        path: 'product',
        component: ProductComponent,
        // canActivate: [AuthRoleService],
        // data: {
        //   roles: ['owner', 'manager'],
        // },
      },
      {
        path: 'stock',
        component: StockComponent,
        canActivate: [AuthRoleService],
        data: {
          roles: ['owner', 'manager'],
        },
      },

      {
        path: 'setting',
        component: SettingComponent,
        canActivate: [AuthRoleService],
        data: {
          roles: ['owner', 'manager'],
        },
      },
      { path: '**', component: NotFoundComponent },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  providers: [AuthRoleService],
})
export class LayoutRoutingModule {}
