import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { BillingService } from '../../core/services/billing.service';
import { BillingDialogDialogComponent } from './billing-dialog.component';

@Component({
  selector: 'app-billing-list',
  templateUrl: './billing-list.component.html',
  styleUrls: ['./billing-list.component.scss']
})
export class BillingListComponent implements OnInit {
  displayedColumns: string[] = ['id', 'info', 'actions'];
  dataSource: any[] = [];

  constructor(private service: BillingService, private dialog: MatDialog){}

  ngOnInit(){ this.service.list().subscribe(d => this.dataSource = d); }

  openCreate(){ this.dialog.open(BillingDialogDialogComponent, { width: '420px', data: { mode: 'create' } }); }

  openEdit(item: any){ this.dialog.open(BillingDialogDialogComponent, { width: '420px', data: { mode: 'edit', item } }); }

  delete(item: any){ if(confirm('Supprimer ?')) this.service.delete(item.id).subscribe(); }
}
