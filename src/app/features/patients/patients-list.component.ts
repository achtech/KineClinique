import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { Router } from '@angular/router';
import { PatientService } from '../../core/services/patient.service';
import { TranslationService } from '../../core/services/translation.service';

@Component({
  selector: 'app-patients-list',
  templateUrl: './patients-list.component.html',
  styleUrls: ['./patients-list.component.scss']
})
export class PatientsListComponent implements OnInit, AfterViewInit {
  // show only the first 8 columns + actions as requested
  displayedColumns: string[] = ['id', 'cin', 'firstName', 'lastName', 'dob', 'phone', 'email', 'insuranceType', 'actions'];
  dataSource = new MatTableDataSource<any>([]);
  globalFilter: string = '';
  columnFilters: Record<string, string> = {};
  columnPlaceholders: Record<string, string> = {
    id: 'patients.columns.id',
    cin: 'patients.columns.cin',
    firstName: 'patients.columns.firstName',
    lastName: 'patients.columns.lastName',
    dob: 'patients.columns.dob',
    phone: 'patients.columns.phone',
    email: 'patients.columns.email',
    insuranceType: 'patients.columns.insuranceType',
    createdAt: 'patients.columns.createdAt'
  };
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private service: PatientService,
    private dialog: MatDialog,
    private translation: TranslationService,
    private router: Router
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

  // Open dialog at a fixed, centered width so it doesn't appear pinned to the bottom
  // and add an explicit top position and panelClass as robust fallbacks.
  openCreate(){
    this.dialog.open(null, {
      width: '900px',
      maxWidth: '900px',
      position: { top: '10vh' },
      panelClass: 'patient-dialog-panel',
      data: { mode: 'create' }
    });
  }

  openEdit(item: any){
    this.dialog.open(null, {
      width: '900px',
      maxWidth: '900px',
      position: { top: '10vh' },
      panelClass: 'patient-dialog-panel',
      data: { mode: 'edit', item }
    });
  }

  // Redirect to the new patient details page
  openDetails(item: any){
    this.router.navigate(['patients/details', item.id]);
  }

  delete(item: any){
    const message = this.translation.translate('common.confirmDelete');
    if(confirm(message)) this.service.delete(item.id).subscribe();
  }
}
