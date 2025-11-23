import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { PrescriptionService } from '../../core/services/prescription.service';
import { PrescriptionDialogDialogComponent } from './prescription-dialog.component';

@Component({
  selector: 'app-prescriptions-list',
  templateUrl: './prescriptions-list.component.html',
  styleUrls: ['./prescriptions-list.component.scss']
})
export class PrescriptionsListComponent implements OnInit {
  displayedColumns: string[] = ['id', 'info', 'actions'];
  dataSource: any[] = [];

  constructor(private service: PrescriptionService, private dialog: MatDialog){}

  ngOnInit(){ this.service.list().subscribe(d => this.dataSource = d); }

  openCreate(){ this.dialog.open(PrescriptionDialogDialogComponent, { width: '420px', data: { mode: 'create' } }); }

  openEdit(item: any){ this.dialog.open(PrescriptionDialogDialogComponent, { width: '420px', data: { mode: 'edit', item } }); }

  delete(item: any){ if(confirm('Supprimer ?')) this.service.delete(item.id).subscribe(); }
}
