import { NgModule } from '@angular/core';

// === COMPONENT BINDING WITH MODULE === //
// === BINDING FOR USE ANOTHER MODULE === //

// ==== MODULE ==== //
import { SharedModule } from '../shared/shared.module';
import { IconsProviderModule } from '../icons-provider.module';
import { NzLayoutModule } from 'ng-zorro-antd/layout';
import { LayoutRoutingModule } from './layout-routing.module';

// ==== PAGE ==== //
import { ShopComponent } from '../pages/shop/shop.component';
import { DashboardComponent } from '../pages/dashboard/dashboard.component';
import { ReportComponent } from '../pages/report/report.component';
import { AttendanceComponent } from '../pages/attendance/attendance.component';
import { BillingHistoryComponent } from '../pages/billing-history/billing-history.component';
import { UserComponent } from '../pages/user/user.component';
import { ProductComponent } from '../pages/menu/product.component';
import { NotFoundComponent } from '../pages/not-found/not-found.component';
import { PayComponent } from '../pages/pay/pay.component';
import { SettingComponent } from '../pages/setting/setting.component';

// ==== COMPONENT ==== //
import { LayoutComponent } from './layout.component';
import { AntdSearchBox } from '../shared/components/searchbox/antd-searchbox.component';
import { SidebarWrapperComponent } from './sidebar-wrapper/sidebar-wrapper.component';

// ==== SERVICE ==== //
import { AuthGuardService } from '../services/auth.service';
import { UserService } from '../services/user.service';
import { EmployeeService } from '../services/employee.service';
import { ProductService } from '../services/product.service';
import { OrderService } from '../services/order.service';
import { CafeService } from '../services/cafe.service';
import { ReportService } from '../services/report.service';
import { ProfileComponent } from '../pages/profile/profile.component';

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
    UserComponent,
    ProductComponent,
    SettingComponent,
    NotFoundComponent,
    PayComponent,
    ProfileComponent,
  ],

  providers: [
    AuthGuardService,
    EmployeeService,
    UserService,
    ProductService,
    OrderService,
    CafeService,
    ReportService,
  ],
  bootstrap: [LayoutComponent],
})
export class LayoutModule {}
