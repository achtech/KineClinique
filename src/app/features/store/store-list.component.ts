import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { StoreService } from '../../core/services/store.service';
import { StoreDialogComponent } from './store-dialog.component';
import { ConfirmDialogComponent } from '../../shared/confirm-dialog.component';
import { StoreItem } from '../../core/models/store.model';

@Component({
  selector: 'app-store-list',
  templateUrl: './store-list.component.html',
  styleUrls: ['./store-list.component.scss']
})
export class StoreListComponent implements OnInit, AfterViewInit {
  displayedColumns: string[] = ['productId', 'dateOperation', 'quantity', 'prixVente', 'comment', 'actions'];
  dataSource = new MatTableDataSource<StoreItem>([]);
  globalFilter: string = '';
  columnFilters: Record<string, string> = {};
  columnPlaceholders: Record<string, string> = {
    productId: 'store.columns.productId',
    dateOperation: 'store.columns.dateOperation',
    quantity: 'store.columns.quantity',
    prixVente: 'store.columns.prixVente',
    comment: 'store.columns.comment'
  };
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private service: StoreService,
    private dialog: MatDialog
  ){}

  ngOnInit(){
    this.service.list().subscribe(d => {
      this.dataSource.data = d;
      this.refreshFilters(false);
    });
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    this.paginator.pageSize = 10;
    this.dataSource.filterPredicate = (data: any) => {
      return this.matchesGlobalFilter(data) && this.matchesColumnFilters(data);
    };
    this.dataSource.sortData = (data, sort) => {
      if (!sort.active || sort.direction === '') {
        return data;
      }
      return data.slice().sort((a, b) => {
        const valueA = this.getNormalizedValue(a, sort.active);
        const valueB = this.getNormalizedValue(b, sort.active);
        return (valueA < valueB ? -1 : 1) * (sort.direction === 'asc' ? 1 : -1);
      });
    };
    this.refreshFilters(false);
  }

  applyGlobalFilter(event: Event) {
    this.globalFilter = (event.target as HTMLInputElement).value || '';
    this.refreshFilters();
  }

  applyColumnFilter(column: string, event: Event) {
    const value = (event.target as HTMLInputElement).value || '';
    if (value.trim()) {
      this.columnFilters = { ...this.columnFilters, [column]: value };
    } else {
      const { [column]: removed, ...rest } = this.columnFilters;
      this.columnFilters = rest;
    }
    this.refreshFilters();
  }

  private refreshFilters(resetPaginator: boolean = true) {
    this.dataSource.filter = `${Date.now()}`;
    if (resetPaginator && this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  private matchesGlobalFilter(data: any): boolean {
    const search = this.globalFilter.trim().toLowerCase();
    if (!search) {
      return true;
    }
    return this.displayedColumns.some(col => {
      if (col === 'actions') {
        return false;
      }
      return this.getNormalizedValue(data, col).includes(search);
    });
  }

  private matchesColumnFilters(data: any): boolean {
    return Object.entries(this.columnFilters).every(([column, value]) => {
      const search = (value || '').trim().toLowerCase();
      if (!search) {
        return true;
      }
      return this.getNormalizedValue(data, column).includes(search);
    });
  }

  private getNormalizedValue(row: any, column: string): string {
    const value = row?.[column];
    if (Array.isArray(value)) {
      return value.join(', ').toLowerCase();
    }
    return value != null ? value.toString().toLowerCase() : '';
  }

  openCreate(){ this.dialog.open(StoreDialogComponent, { width: '420px', data: { mode: 'create' } }); }

  openEdit(item: StoreItem){ this.dialog.open(StoreDialogComponent, { width: '420px', data: { mode: 'edit', item } }); }

  delete(item: StoreItem){
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '350px',
      data: { message: 'common.confirmDelete' }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.service.delete(item.id).subscribe();
      }
    });
  }
}
