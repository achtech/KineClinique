import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PatientsListComponent } from './features/patients/patients-list.component';
import { AppointmentsListComponent } from './features/appointments/appointments-list.component';
import { SessionsListComponent } from './features/sessions/sessions-list.component';
import { PrescriptionsListComponent } from './features/prescriptions/prescriptions-list.component';
import { StaffListComponent } from './features/staff/staff-list.component';
import { BillingListComponent } from './features/billing/billing-list.component';
import { TarifsListComponent } from './features/tarifs/tarifs-list.component';
import { AgendaComponent } from './features/agenda/agenda.module';
import { ConfigurationComponent } from './features/configuration/configuration.component';
import { LoginComponent } from './features/auth/login.component';
import { ResetPasswordComponent } from './features/auth/reset-password.component';
import { AuthGuard } from './core/guards/auth.guard';
import { CompanyExpensesListComponent } from './features/company-expenses/company-expenses-list.component';
import { StockListComponent } from './features/stock/stock-list.component';
import { StoreListComponent } from './features/store/store-list.component';

const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'reset-password', component: ResetPasswordComponent },
  { path: '', redirectTo: 'patients', pathMatch: 'full' },
  { path: 'patients', component: PatientsListComponent, canActivate: [AuthGuard] },
  { path: 'appointments', component: AppointmentsListComponent, canActivate: [AuthGuard] },
  { path: 'sessions', component: SessionsListComponent, canActivate: [AuthGuard] },
  { path: 'prescriptions', component: PrescriptionsListComponent, canActivate: [AuthGuard] },
  { path: 'staff', component: StaffListComponent, canActivate: [AuthGuard] },
  { path: 'configuration', component: ConfigurationComponent, canActivate: [AuthGuard] },
  { path: 'billing', component: BillingListComponent, canActivate: [AuthGuard] },
  { path: 'tarifs', component: TarifsListComponent, canActivate: [AuthGuard] },
  { path: 'company-expenses', component: CompanyExpensesListComponent, canActivate: [AuthGuard] },
  { path: 'stock', component: StockListComponent, canActivate: [AuthGuard] },
  { path: 'store', component: StoreListComponent, canActivate: [AuthGuard] },
  { path: 'agenda', component: AgendaComponent, canActivate: [AuthGuard] },
  { path: '**', redirectTo: 'login' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
