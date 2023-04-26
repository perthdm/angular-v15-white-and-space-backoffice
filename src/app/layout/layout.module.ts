import { NgModule } from '@angular/core';

import { LayoutRoutingModule } from './layout-routing.module';
import { LayoutComponent } from './layout.component';
import { IconsProviderModule } from '../icons-provider.module';
import { NzLayoutModule } from 'ng-zorro-antd/layout';

// === COMPONENT BINDING WITH MODULE === //
// === BINDING FOR USE ANOTHER MODULE === //
import { DashboardComponent } from '../pages/dashboard/dashboard.component';
import { SidebarWrapperComponent } from './sidebar-wrapper/sidebar-wrapper.component';
import { ShopComponent } from '../pages/shop/shop.component';
import { StockComponent } from '../pages/stock/stock.component';
import { SharedModule } from '../shared/shared.module';
import { SettingComponent } from '../pages/setting/setting.component';

import { EmployeeService } from '../services/employee.service';
import { AntdSearchBox } from '../shared/components/searchbox/antd-searchbox.component';
import { ReportComponent } from '../pages/report/report.component';
import { AttendanceComponent } from '../pages/attendance/attendance.component';
import { BillingHistoryComponent } from '../pages/billing-history/billing-history.component';
import { AuthGuardService } from '../services/auth.service';
import { UserComponent } from '../pages/user/user.component';
import { UserService } from '../services/user.service';
import { ProductComponent } from '../pages/menu/product.component';
import { ProductService } from '../services/product.service';
import { StockService } from '../services/stock.service';
import { OrderService } from '../services/order.service';
import { CafeService } from '../services/cafe.service';
import { ReportService } from '../services/report.service';

@NgModule({
  imports: [
    LayoutRoutingModule,
    NzLayoutModule,
    IconsProviderModule,
    SharedModule,
  ],
  declarations: [
    LayoutComponent,
    SidebarWrapperComponent,
    ShopComponent,
    DashboardComponent,
    ReportComponent,
    AttendanceComponent,
    BillingHistoryComponent,
    AntdSearchBox,
    StockComponent,
    UserComponent,
    ProductComponent,
    SettingComponent,
  ],

  providers: [
    AuthGuardService,
    EmployeeService,
    UserService,
    ProductService,
    StockService,
    OrderService,
    CafeService,
    ReportService,
  ],
  bootstrap: [LayoutComponent],
})
export class LayoutModule {}
