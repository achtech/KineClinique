import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PatientsListComponent } from './features/patients/patients-list.component';
import { AppointmentsListComponent } from './features/appointments/appointments-list.component';
import { SessionsListComponent } from './features/sessions/sessions-list.component';
import { PrescriptionsListComponent } from './features/prescriptions/prescriptions-list.component';
import { StaffListComponent } from './features/staff/staff-list.component';
import { BillingListComponent } from './features/billing/billing-list.component';

const routes: Routes = [
  { path: '', redirectTo: 'patients', pathMatch: 'full' },
  { path: 'patients', component: PatientsListComponent },
  { path: 'appointments', component: AppointmentsListComponent },
  { path: 'sessions', component: SessionsListComponent },
  { path: 'prescriptions', component: PrescriptionsListComponent },
  { path: 'staff', component: StaffListComponent },
  { path: 'billing', component: BillingListComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
