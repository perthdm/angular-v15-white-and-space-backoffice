import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { NzMessageService } from 'ng-zorro-antd/message';
import jwt_decode from 'jwt-decode';

interface JwtPayload {
  exp: number;
  iat: number;
  role: string;
  sub: string;
  username: string;
}

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  loginForm!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private authService: AuthService,
    private message: NzMessageService
  ) {}

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required],
    });
  }

  onSubmit(): void {
    let { valid, value } = this.loginForm;
    if (valid) {
      this.authService.signIn(value).subscribe(
        (res) => {
          let { access_token } = res;
          const payload: JwtPayload = jwt_decode(access_token);
          if (payload) {
            localStorage.setItem('username', payload.username);
            localStorage.setItem('token', access_token);
            localStorage.setItem('role', payload.role);
            this.router.navigate(['/shop']);
          }
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
}
