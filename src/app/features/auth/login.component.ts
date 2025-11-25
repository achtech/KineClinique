import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  username = '';
  password = '';
  error = '';
  forgotMessage = '';

  constructor(private authService: AuthService, private router: Router) {}

  login() {
    if (this.authService.login(this.username, this.password)) {
      this.router.navigate(['/patients']);
    } else {
      this.error = 'Invalid username or password';
    }
  }

  showForgot(event: Event) {
    event.preventDefault();
    this.forgotMessage = 'Please contact your administrator to reset your password.';
  }
}
