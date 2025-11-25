import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PatientsListComponent } from './features/patients/patients-list.component';
import { AppointmentsListComponent } from './features/appointments/appointments-list.component';
import { SessionsListComponent } from './features/sessions/sessions-list.component';
import { PrescriptionsListComponent } from './features/prescriptions/prescriptions-list.component';
import { StaffListComponent } from './features/staff/staff-list.component';
import { BillingListComponent } from './features/billing/billing-list.component';
import { LoginComponent } from './features/auth/login.component';
import { ResetPasswordComponent } from './features/auth/reset-password.component';
import { AuthGuard } from './core/guards/auth.guard';

const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'reset-password', component: ResetPasswordComponent },
  { path: '', redirectTo: 'patients', pathMatch: 'full' },
  { path: 'patients', component: PatientsListComponent, canActivate: [AuthGuard] },
  { path: 'appointments', component: AppointmentsListComponent, canActivate: [AuthGuard] },
  { path: 'sessions', component: SessionsListComponent, canActivate: [AuthGuard] },
  { path: 'prescriptions', component: PrescriptionsListComponent, canActivate: [AuthGuard] },
  { path: 'staff', component: StaffListComponent, canActivate: [AuthGuard] },
  { path: 'billing', component: BillingListComponent, canActivate: [AuthGuard] },
  { path: '**', redirectTo: 'login' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
