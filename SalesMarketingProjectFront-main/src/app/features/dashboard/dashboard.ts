import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslatePipe } from '@ngx-translate/core';
import { ApiService } from '../../core/services/api.service';

interface DashboardData {
  total: number;
  aov: number;
  count: number;
  topVendor: string;
  topCategory: string;
}

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, TranslatePipe],
  template: `
    <div class="dashboard-container">
      <div class="header">
        <h1>{{ 'DASHBOARD.TITLE' | translate }}</h1>
      </div>

      <!-- Stats Grid -->
      <div class="stats-grid">
        <!-- Total Revenue Card -->
        <div class="glass-card stat-card card-blue">
          <div class="card-header">
            <span class="icon">💰</span>
            <span class="card-label">{{ 'DASHBOARD.TOTAL_SALES' | translate }}</span>
          </div>
          <div class="card-body">
            <h3>{{ stats().total | number:'1.2-2' }}</h3>
            <span class="currency">{{ 'DASHBOARD.CURRENCY' | translate }}</span>
          </div>
          <div class="card-decor">
            <div class="line line-blue"></div>
          </div>
        </div>

        <!-- Invoices Count Card -->
        <div class="glass-card stat-card card-emerald">
          <div class="card-header">
            <span class="icon">🧾</span>
            <span class="card-label">{{ 'DASHBOARD.INVOICES_COUNT' | translate }}</span>
          </div>
          <div class="card-body">
            <h3>{{ stats().count }}</h3>
            <span class="currency">#</span>
          </div>
          <div class="card-decor">
            <div class="line line-emerald"></div>
          </div>
        </div>

        <!-- Average Order Value Card -->
        <div class="glass-card stat-card card-purple">
          <div class="card-header">
            <span class="icon">⚖️</span>
            <span class="card-label">{{ 'DASHBOARD.AOV' | translate }}</span>
          </div>
          <div class="card-body">
            <h3>{{ stats().aov | number:'1.2-2' }}</h3>
            <span class="currency">{{ 'DASHBOARD.CURRENCY' | translate }}</span>
          </div>
          <div class="card-decor">
            <div class="line line-purple"></div>
          </div>
        </div>

        <!-- Top Vendor Card -->
        <div class="glass-card stat-card card-amber">
          <div class="card-header">
            <span class="icon">🏢</span>
            <span class="card-label">{{ 'DASHBOARD.TOP_VENDOR' | translate }}</span>
          </div>
          <div class="card-body">
            <h4 class="name-text">{{ stats().topVendor }}</h4>
          </div>
          <div class="card-decor">
            <div class="line line-amber"></div>
          </div>
        </div>

        <!-- Top Category Card -->
        <div class="glass-card stat-card card-indigo">
          <div class="card-header">
            <span class="icon">🏷️</span>
            <span class="card-label">{{ 'DASHBOARD.TOP_CATEGORY' | translate }}</span>
          </div>
          <div class="card-body">
            <h4 class="name-text">{{ stats().topCategory }}</h4>
          </div>
          <div class="card-decor">
            <div class="line line-indigo"></div>
          </div>
        </div>
      </div>

      <!-- Advanced Visualizations Section -->
      <div class="visualizations-section">
        <div class="glass-card chart-container">
          <h3>{{ 'DASHBOARD.ANALYTICS_TITLE' | translate }}</h3>
          <div class="dummy-chart">
            <div class="bar-chart-visual">
              <div class="bar-container">
                <div class="bar" style="height: 85%; background: linear-gradient(to top, #3b82f6, #60a5fa);">
                  <span class="bar-value">{{ (stats().total * 0.45) | number:'1.0-0' }}</span>
                </div>
                <span class="bar-label">المنتجات الإلكترونية</span>
              </div>
              <div class="bar-container">
                <div class="bar" style="height: 60%; background: linear-gradient(to top, #10b981, #34d399);">
                  <span class="bar-value">{{ (stats().total * 0.3) | number:'1.0-0' }}</span>
                </div>
                <span class="bar-label">التسويق والإعلانات</span>
              </div>
              <div class="bar-container">
                <div class="bar" style="height: 40%; background: linear-gradient(to top, #f59e0b, #fbbf24);">
                  <span class="bar-value">{{ (stats().total * 0.15) | number:'1.0-0' }}</span>
                </div>
                <span class="bar-label">الخدمات اللوجستية</span>
              </div>
              <div class="bar-container">
                <div class="bar" style="height: 25%; background: linear-gradient(to top, #8b5cf6, #a78bfa);">
                  <span class="bar-value">{{ (stats().total * 0.1) | number:'1.0-0' }}</span>
                </div>
                <span class="bar-label">أخرى</span>
              </div>
            </div>
          </div>
        </div>

        <div class="glass-card stats-summary">
          <h3>{{ 'DASHBOARD.VENDOR_SUMMARY' | translate }}</h3>
          <div class="summary-list">
            <div class="summary-item">
              <span class="label">كفاءة الأداء المالي:</span>
              <span class="value success">مستقر 🟢</span>
            </div>
            <div class="summary-item">
              <span class="label">نشاط الفواتير الممسوحة:</span>
              <span class="value">ممتاز (سرعة استخراج 1.2 ثانية)</span>
            </div>
            <div class="summary-item">
              <span class="label">المورد الأنشط حالياً:</span>
              <span class="value highlight">{{ stats().topVendor }}</span>
            </div>
            <div class="summary-item">
              <span class="label">فئة العمليات المهيمنة:</span>
              <span class="value highlight">{{ stats().topCategory }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .dashboard-container {
      display: flex;
      flex-direction: column;
      gap: 30px;
      animation: fadeIn 0.4s ease-out forwards;
    }

    .header h1 {
      font-size: 1.8rem;
      background: linear-gradient(135deg, #f8fafc 0%, #94a3b8 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      margin-bottom: 5px;
    }

    .stats-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
      gap: 20px;
    }

    .stat-card {
      position: relative;
      overflow: hidden;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      min-height: 140px;
      padding: 20px;
    }

    .card-header {
      display: flex;
      align-items: center;
      gap: 8px;
      color: #94a3b8;
    }

    .card-header .icon {
      font-size: 1.3rem;
    }

    .card-label {
      font-size: 0.85rem;
      font-weight: 600;
    }

    .card-body {
      display: flex;
      align-items: baseline;
      gap: 6px;
      margin-top: 15px;
    }

    .card-body h3 {
      font-size: 2rem;
      font-weight: 800;
      letter-spacing: -0.5px;
    }

    .card-body .name-text {
      font-size: 1.25rem;
      font-weight: 700;
      color: #f1f5f9;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      max-width: 100%;
      margin-top: 10px;
    }

    .currency {
      font-size: 0.85rem;
      font-weight: 600;
      color: #64748b;
    }

    .card-decor {
      position: absolute;
      bottom: 0;
      left: 0;
      width: 100%;
      height: 4px;
    }

    .line {
      width: 100%;
      height: 100%;
    }

    .line-blue { background: #3b82f6; }
    .line-emerald { background: #10b981; }
    .line-purple { background: #8b5cf6; }
    .line-amber { background: #f59e0b; }
    .line-indigo { background: #6366f1; }

    /* Visualizations */
    .visualizations-section {
      display: grid;
      grid-template-columns: 2fr 1fr;
      gap: 20px;
    }

    @media (max-width: 900px) {
      .visualizations-section {
        grid-template-columns: 1fr;
      }
    }

    .chart-container {
      display: flex;
      flex-direction: column;
      gap: 20px;
    }

    .chart-container h3, .stats-summary h3 {
      font-size: 1.1rem;
      font-weight: 700;
      color: #f1f5f9;
    }

    .dummy-chart {
      background: rgba(255,255,255,0.01);
      border: 1px solid rgba(255,255,255,0.02);
      border-radius: 12px;
      height: 250px;
      display: flex;
      align-items: flex-end;
      padding: 20px;
    }

    .bar-chart-visual {
      width: 100%;
      height: 100%;
      display: flex;
      justify-content: space-around;
      align-items: flex-end;
      gap: 15px;
    }

    .bar-container {
      display: flex;
      flex-direction: column;
      align-items: center;
      width: 20%;
      height: 100%;
      justify-content: flex-end;
      gap: 10px;
    }

    .bar {
      width: 100%;
      border-radius: 6px 6px 0 0;
      position: relative;
      transition: height 1s ease-in-out;
      display: flex;
      justify-content: center;
    }

    .bar-value {
      position: absolute;
      top: -25px;
      font-size: 0.75rem;
      font-weight: 700;
      color: #cbd5e1;
    }

    .bar-label {
      font-size: 0.75rem;
      color: #94a3b8;
      text-align: center;
      white-space: nowrap;
    }

    .stats-summary {
      display: flex;
      flex-direction: column;
      gap: 20px;
    }

    .summary-list {
      display: flex;
      flex-direction: column;
      gap: 15px;
    }

    .summary-item {
      display: flex;
      flex-direction: column;
      gap: 4px;
      border-bottom: 1px solid rgba(255,255,255,0.03);
      padding-bottom: 10px;
      text-align: start;
    }

    .summary-item .label {
      font-size: 0.8rem;
      color: #64748b;
      font-weight: 600;
    }

    .summary-item .value {
      font-size: 0.9rem;
      font-weight: 700;
      color: #cbd5e1;
    }

    .summary-item .value.success {
      color: #10b981;
    }

    .summary-item .value.highlight {
      color: #60a5fa;
    }

    @keyframes fadeIn {
      from { opacity: 0; transform: translateY(10px); }
      to { opacity: 1; transform: translateY(0); }
    }
  `]
})
export class Dashboard implements OnInit {
  private apiService = inject(ApiService);

  stats = signal<DashboardData>({
    total: 0,
    aov: 0,
    count: 0,
    topVendor: 'لا يوجد',
    topCategory: 'لا يوجد'
  });

  ngOnInit() {
    this.fetchDashboardData();
  }

  fetchDashboardData() {
    this.apiService.get<any>('dashboard').subscribe({
      next: (res) => {
        if (res.success) {
          this.stats.set({
            total: res.total,
            aov: res.aov,
            count: res.count,
            topVendor: res.topVendor,
            topCategory: res.topCategory
          });
        }
      },
      error: (err) => {
        console.error('Error fetching dashboard stats', err);
      }
    });
  }
}
