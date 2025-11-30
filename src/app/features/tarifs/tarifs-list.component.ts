import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { TarifsService } from '../../core/services/tarifs.service';
import { TarifsDialogComponent } from './tarifs-dialog.component';
import { TranslationService } from '../../core/services/translation.service';
import { ConfirmDialogComponent } from '../../shared/confirm-dialog.component';

@Component({
  selector: 'app-tarifs-list',
  templateUrl: './tarifs-list.component.html',
  styleUrls: ['./tarifs-list.component.scss']
})
export class TarifsListComponent implements OnInit, AfterViewInit {
  displayedColumns: string[] = ['id', 'type', 'prestation', 'montant', 'place', 'actions'];
  dataSource = new MatTableDataSource<any>([]);
  globalFilter: string = '';
  columnFilters: Record<string, string> = {};
  columnPlaceholders: Record<string, string> = {
    id: 'tarifs.columns.id',
    type: 'tarifs.columns.type',
    prestation: 'tarifs.columns.prestation',
    montant: 'tarifs.columns.montant',
    place: 'tarifs.columns.place'
  };
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private service: TarifsService,
    private dialog: MatDialog,
    private translation: TranslationService
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

  openCreate(){ this.dialog.open(TarifsDialogComponent, { width: '420px', data: { mode: 'create' } }); }

  openEdit(item: any){ this.dialog.open(TarifsDialogComponent, { width: '420px', data: { mode: 'edit', item } }); }

  delete(item: any){
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
