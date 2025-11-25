import { Component } from '@angular/core';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.scss']
})
export class ResetPasswordComponent {
  email = '';
  message = '';

  resetPassword() {
    // In a real app, you would send a reset email here.
    this.message = 'If this were a real app, a password reset link would be sent to your email.';
  }
}
