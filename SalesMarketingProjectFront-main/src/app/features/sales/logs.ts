import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TranslatePipe } from '@ngx-translate/core';
import { ApiService } from '../../core/services/api.service';

interface SaleRecord {
  id: number;
  vendor: string;
  invNo: string;
  amount: number;
  category: string;
  date: string;
  time: string;
}

@Component({
  selector: 'app-logs',
  standalone: true,
  imports: [CommonModule, FormsModule, TranslatePipe],
  template: `
    <div class="logs-container">
      <div class="header">
        <h1>{{ 'LOGS.TITLE' | translate }}</h1>
      </div>

      <!-- Toast Alert Notifications -->
      <div *ngIf="alertMessage()" class="alert-popup" [ngClass]="alertType() === 'success' ? 'alert-success' : 'alert-error'">
        <span>{{ alertMessage() }}</span>
      </div>

      <!-- Search & Filters Toolbar -->
      <div class="glass-card toolbar">
        <div class="search-box">
          <span class="search-icon">🔍</span>
          <input 
            type="text" 
            [(ngModel)]="searchQuery" 
            (input)="onSearchChange()"
            placeholder="{{ 'LOGS.SEARCH_PLACEHOLDER' | translate }}" 
            class="form-input search-input" 
          />
        </div>

        <div class="filter-actions">
          <div class="filter-tabs">
            <button 
              (click)="setFilter('all')" 
              [class.active]="activeFilter === 'all'" 
              class="filter-tab"
            >
              {{ 'LOGS.FILTER_ALL' | translate }}
            </button>
            <button 
              (click)="setFilter('today')" 
              [class.active]="activeFilter === 'today'" 
              class="filter-tab"
            >
              {{ 'LOGS.FILTER_TODAY' | translate }}
            </button>
          </div>

          <button (click)="exportExcel()" class="btn btn-secondary export-btn">
            📥 {{ 'LOGS.EXPORT_CSV' | translate }}
          </button>
        </div>
      </div>

      <!-- Table Section -->
      <div class="glass-card table-card">
        <div class="table-responsive">
          <table class="logs-table">
            <thead>
              <tr>
                <th>#</th>
                <th>{{ 'LOGS.COL_DATE' | translate }}</th>
                <th>{{ 'LOGS.COL_TIME' | translate }}</th>
                <th>{{ 'LOGS.COL_VENDOR' | translate }}</th>
                <th>{{ 'LOGS.COL_CATEGORY' | translate }}</th>
                <th>{{ 'LOGS.COL_AMOUNT' | translate }}</th>
                <th>{{ 'LOGS.COL_INV_NO' | translate }}</th>
                <th>{{ 'LOGS.COL_ACTIONS' | translate }}</th>
              </tr>
            </thead>
            <tbody>
              <tr *ngFor="let record of records(); let idx = index" class="table-row">
                <td>{{ idx + 1 }}</td>
                <td class="date-cell">{{ record.date }}</td>
                <td class="time-cell">{{ record.time }}</td>
                <td class="vendor-cell">{{ record.vendor }}</td>
                <td>
                  <span class="category-tag">{{ record.category }}</span>
                </td>
                <td class="amount-cell">{{ record.amount | number:'1.2-2' }} <small>{{ 'DASHBOARD.CURRENCY' | translate }}</small></td>
                <td class="ref-cell">{{ record.invNo }}</td>
                <td>
                  <button (click)="deleteRecord(record.id)" class="btn btn-danger btn-sm">
                    🗑️ {{ 'LOGS.DELETE_BTN' | translate }}
                  </button>
                </td>
              </tr>

              <!-- No Data State -->
              <tr *ngIf="records().length === 0">
                <td colspan="8" class="no-data-cell">
                  <div class="no-data">
                    <span class="icon">📭</span>
                    <p>{{ 'LOGS.NO_DATA' | translate }}</p>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .logs-container {
      display: flex;
      flex-direction: column;
      gap: 25px;
      animation: fadeIn 0.4s ease-out forwards;
    }

    .header h1 {
      font-size: 1.8rem;
      background: linear-gradient(135deg, #f8fafc 0%, #94a3b8 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }

    .toolbar {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 20px;
      flex-wrap: wrap;
      padding: 15px 20px;
    }

    .search-box {
      flex: 1;
      min-width: 250px;
      position: relative;
      display: flex;
      align-items: center;
    }

    .search-icon {
      position: absolute;
      left: 15px;
      color: #64748b;
    }

    [dir="rtl"] .search-icon {
      left: auto;
      right: 15px;
    }

    .search-input {
      padding-left: 45px;
    }

    [dir="rtl"] .search-input {
      padding-left: 16px;
      padding-right: 45px;
    }

    .filter-actions {
      display: flex;
      align-items: center;
      gap: 15px;
      flex-wrap: wrap;
    }

    .filter-tabs {
      display: flex;
      background: rgba(255,255,255,0.03);
      border: 1px solid rgba(255,255,255,0.05);
      border-radius: 10px;
      padding: 4px;
    }

    .filter-tab {
      background: transparent;
      border: none;
      color: #94a3b8;
      padding: 8px 16px;
      border-radius: 8px;
      font-family: inherit;
      font-size: 0.85rem;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.2s ease;
    }

    .filter-tab:hover {
      color: #f1f5f9;
    }

    .filter-tab.active {
      background: rgba(59, 130, 246, 0.1);
      color: #60a5fa;
    }

    .export-btn {
      height: 38px;
      padding: 0 16px;
      font-size: 0.85rem;
    }

    /* Table Styling */
    .table-card {
      padding: 0;
      overflow: hidden;
    }

    .table-responsive {
      overflow-x: auto;
      width: 100%;
    }

    .logs-table {
      width: 100%;
      border-collapse: collapse;
      text-align: start;
    }

    .logs-table th {
      background: rgba(255,255,255,0.01);
      border-bottom: 1px solid rgba(255,255,255,0.05);
      color: #94a3b8;
      font-size: 0.85rem;
      font-weight: 700;
      padding: 16px 20px;
      text-transform: uppercase;
    }

    .logs-table td {
      padding: 16px 20px;
      font-size: 0.9rem;
      border-bottom: 1px solid rgba(255, 255, 255, 0.03);
      color: #cbd5e1;
    }

    .table-row {
      transition: background-color 0.2s ease;
    }

    .table-row:hover {
      background-color: rgba(255, 255, 255, 0.01);
    }

    .date-cell, .time-cell {
      font-family: 'Outfit', sans-serif;
      font-size: 0.85rem;
    }

    .vendor-cell {
      font-weight: 600;
      color: #f1f5f9;
    }

    .category-tag {
      background: rgba(99, 102, 241, 0.1);
      border: 1px solid rgba(99, 102, 241, 0.2);
      color: #a5b4fc;
      padding: 4px 8px;
      border-radius: 6px;
      font-size: 0.75rem;
      font-weight: 600;
    }

    .amount-cell {
      font-family: 'Outfit', sans-serif;
      font-weight: 700;
      color: #10b981;
    }

    .amount-cell small {
      font-weight: 400;
      font-family: inherit;
    }

    .ref-cell {
      font-family: 'Outfit', sans-serif;
      font-size: 0.8rem;
      color: #64748b;
    }

    .btn-sm {
      padding: 6px 12px;
      font-size: 0.75rem;
      border-radius: 6px;
    }

    .no-data-cell {
      padding: 50px !important;
      text-align: center;
    }

    .no-data {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 12px;
      color: #64748b;
    }

    .no-data .icon {
      font-size: 2.5rem;
    }

    .no-data p {
      font-size: 0.9rem;
      font-weight: 600;
    }

    @keyframes fadeIn {
      from { opacity: 0; transform: translateY(10px); }
      to { opacity: 1; transform: translateY(0); }
    }
  `]
})
export class Logs implements OnInit {
  private apiService = inject(ApiService);

  records = signal<SaleRecord[]>([]);
  searchQuery = '';
  activeFilter = 'all'; // 'all' or 'today'
  searchTimeout: any;

  alertMessage = signal<string | null>(null);
  alertType = signal<'success' | 'error'>('success');

  ngOnInit() {
    this.fetchLogs();
  }

  onSearchChange() {
    if (this.searchTimeout) {
      clearTimeout(this.searchTimeout);
    }
    this.searchTimeout = setTimeout(() => {
      this.fetchLogs();
    }, 300);
  }

  setFilter(filter: string) {
    this.activeFilter = filter;
    this.fetchLogs();
  }

  fetchLogs() {
    this.apiService.get<SaleRecord[]>('sales/logs', {
      search: this.searchQuery,
      filter: this.activeFilter
    }).subscribe({
      next: (data) => {
        this.records.set(data);
      },
      error: (err) => {
        console.error('Error fetching logs', err);
        const msg = err.error?.message || 'فشل تحميل سجلات الفواتير';
        this.showAlert(msg, 'error');
      }
    });
  }

  deleteRecord(id: number) {
    const check = confirm('هل أنت متأكد من رغبتك في حذف هذا السجل بشكل نهائي؟');
    if (!check) return;

    this.apiService.delete<any>(`sales/delete/${id}`).subscribe({
      next: (res) => {
        if (res.success) {
          this.showAlert('تم حذف الفاتورة بنجاح!', 'success');
          this.fetchLogs();
        } else {
          this.showAlert(res.message || 'حدث خطأ أثناء حذف الفاتورة', 'error');
        }
      },
      error: (err) => {
        const msg = err.error?.message || 'خطأ أثناء الاتصال بالخادم لحذف الفاتورة';
        this.showAlert(msg, 'error');
      }
    });
  }

  exportExcel() {
    this.apiService.downloadFile('sales/export_csv', {
      search: this.searchQuery,
      filter: this.activeFilter
    }).subscribe({
      next: (blob) => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `report_${new Date().toISOString().split('T')[0]}.csv`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
        
        this.showAlert('تم تصدير ملف Excel بنجاح!', 'success');
      },
      error: (err) => {
        console.error('Error exporting file', err);
        this.showAlert('حدث خطأ أثناء تصدير الملف', 'error');
      }
    });
  }

  private showAlert(message: string, type: 'success' | 'error') {
    this.alertMessage.set(message);
    this.alertType.set(type);
    setTimeout(() => this.alertMessage.set(null), 3000);
  }
}
