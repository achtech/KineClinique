import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { BillingService } from '../../core/services/billing.service';
import { BillingDialogDialogComponent } from './billing-dialog.component';

@Component({
  selector: 'app-billing-list',
  templateUrl: './billing-list.component.html',
  styleUrls: ['./billing-list.component.scss']
})
export class BillingListComponent implements OnInit {
  displayedColumns: string[] = ['id', 'patientId', 'amount', 'date', 'status', 'notes', 'actions'];
  dataSource = new MatTableDataSource<any>([]);
  globalFilter: string = '';
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(private service: BillingService, private dialog: MatDialog){}
  ngOnInit(){
    this.service.list().subscribe(d => {
      this.dataSource.data = d;
    });
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    this.paginator.pageSize = 10;
    this.dataSource.filterPredicate = (data: any, filter: string) => {
      if (!filter) return true;
      const search = filter.trim().toLowerCase();
      return this.displayedColumns.some(col => {
        if (col === 'actions') return false;
        return (data[col] || '').toString().toLowerCase().includes(search);
      });
    };
    this.dataSource.sortData = (data, sort) => {
      if (!sort.active || sort.direction === '') {
        return data;
      }
      return data.slice().sort((a, b) => {
        const valueA = (a[sort.active] || '').toString().toLowerCase();
        const valueB = (b[sort.active] || '').toString().toLowerCase();
        return (valueA < valueB ? -1 : 1) * (sort.direction === 'asc' ? 1 : -1);
      });
    };
  }

  applyGlobalFilter(event: Event) {
    const value = (event.target as HTMLInputElement).value;
    this.globalFilter = value;
    this.dataSource.filter = value.trim().toLowerCase();
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  openCreate(){ this.dialog.open(BillingDialogDialogComponent, { width: '420px', data: { mode: 'create' } }); }

  openEdit(item: any){ this.dialog.open(BillingDialogDialogComponent, { width: '420px', data: { mode: 'edit', item } }); }

  delete(item: any){ if(confirm('Supprimer ?')) this.service.delete(item.id).subscribe(); }
}
