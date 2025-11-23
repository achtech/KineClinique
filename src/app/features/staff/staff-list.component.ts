import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { StaffService } from '../../core/services/staff.service';
import { StaffDialogDialogComponent } from './staff-dialog.component';

@Component({
  selector: 'app-staff-list',
  templateUrl: './staff-list.component.html',
  styleUrls: ['./staff-list.component.scss']
})
export class StaffListComponent implements OnInit {
  displayedColumns: string[] = ['id', 'info', 'actions'];
  dataSource: any[] = [];

  constructor(private service: StaffService, private dialog: MatDialog){}

  ngOnInit(){ this.service.list().subscribe(d => this.dataSource = d); }

  openCreate(){ this.dialog.open(StaffDialogDialogComponent, { width: '420px', data: { mode: 'create' } }); }

  openEdit(item: any){ this.dialog.open(StaffDialogDialogComponent, { width: '420px', data: { mode: 'edit', item } }); }

  delete(item: any){ if(confirm('Supprimer ?')) this.service.delete(item.id).subscribe(); }
}
