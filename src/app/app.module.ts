import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NZ_I18N, th_TH } from 'ng-zorro-antd/i18n';
import { registerLocaleData } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { IconsProviderModule } from './icons-provider.module';
import { LoginComponent } from './pages/login/login.component';
import { SharedModule } from './shared/shared.module';
import { ReactiveFormsModule } from '@angular/forms';
import th from '@angular/common/locales/th';
import { AuthService } from './services/auth.service';
registerLocaleData(th);

@NgModule({
  declarations: [AppComponent, LoginComponent],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    BrowserAnimationsModule,
    IconsProviderModule,
    ReactiveFormsModule,
    SharedModule,
  ],
  providers: [{ provide: NZ_I18N, useValue: th_TH }, AuthService],
  bootstrap: [AppComponent],
})
export class AppModule {}
