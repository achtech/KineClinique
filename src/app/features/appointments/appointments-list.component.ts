import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { AppointmentService } from '../../core/services/appointment.service';
import { AppointmentDialogDialogComponent } from './appointment-dialog.component';

@Component({
  selector: 'app-appointments-list',
  templateUrl: './appointments-list.component.html',
  styleUrls: ['./appointments-list.component.scss']
})
export class AppointmentsListComponent implements OnInit {
  displayedColumns: string[] = ['id', 'info', 'actions'];
  dataSource: any[] = [];

  constructor(private service: AppointmentService, private dialog: MatDialog){}

  ngOnInit(){ this.service.list().subscribe(d => this.dataSource = d); }

  openCreate(){ this.dialog.open(AppointmentDialogDialogComponent, { width: '420px', data: { mode: 'create' } }); }

  openEdit(item: any){ this.dialog.open(AppointmentDialogDialogComponent, { width: '420px', data: { mode: 'edit', item } }); }

  delete(item: any){ if(confirm('Supprimer ?')) this.service.delete(item.id).subscribe(); }
}
