import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { SessionService } from '../../core/services/session.service';
import { SessionDialogDialogComponent } from './session-dialog.component';

@Component({
  selector: 'app-sessions-list',
  templateUrl: './sessions-list.component.html',
  styleUrls: ['./sessions-list.component.scss']
})
export class SessionsListComponent implements OnInit {
  displayedColumns: string[] = ['id', 'info', 'actions'];
  dataSource: any[] = [];

  constructor(private service: SessionService, private dialog: MatDialog){}

  ngOnInit(){ this.service.list().subscribe(d => this.dataSource = d); }

  openCreate(){ this.dialog.open(SessionDialogDialogComponent, { width: '420px', data: { mode: 'create' } }); }

  openEdit(item: any){ this.dialog.open(SessionDialogDialogComponent, { width: '420px', data: { mode: 'edit', item } }); }

  delete(item: any){ if(confirm('Supprimer ?')) this.service.delete(item.id).subscribe(); }
}
