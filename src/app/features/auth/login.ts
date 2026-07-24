import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';
import { ApiService } from '../../core/services/api.service';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, TranslatePipe],
  template: `
    <div class="auth-card glass-card">
      <div class="header">
        <h2>{{ 'AUTH.TITLE' | translate }}</h2>
        <p>{{ 'AUTH.SUBTITLE' | translate }}</p>
      </div>

      <!-- Toast Alert Notifications -->
      <div *ngIf="alertMessage()" class="alert-popup" [ngClass]="alertType() === 'success' ? 'alert-success' : 'alert-error'">
        <span>{{ alertMessage() }}</span>
      </div>

      <form (ngSubmit)="onSubmit()" #loginForm="ngForm">
        <div class="form-group">
          <label class="form-label">{{ 'AUTH.USERNAME' | translate }}</label>
          <input 
            type="text" 
            name="username" 
            [(ngModel)]="username" 
            required 
            #uInput="ngModel"
            class="form-input" 
            placeholder="admin / user"
          />
          <span *ngIf="loginForm.submitted && uInput.invalid" class="validation-error">
            {{ 'AUTH.USERNAME_REQ' | translate }}
          </span>
        </div>

        <div class="form-group">
          <label class="form-label">{{ 'AUTH.PASSWORD' | translate }}</label>
          <input 
            type="password" 
            name="password" 
            [(ngModel)]="password" 
            required 
            #pInput="ngModel"
            class="form-input" 
            placeholder="••••"
          />
          <span *ngIf="loginForm.submitted && pInput.invalid" class="validation-error">
            {{ 'AUTH.PASSWORD_REQ' | translate }}
          </span>
        </div>

        <button type="submit" [disabled]="loading" class="btn btn-primary w-full submit-btn">
          <span *ngIf="loading" class="spinner"></span>
          <span *ngIf="!loading">{{ 'AUTH.LOGIN_BTN' | translate }}</span>
        </button>
      </form>

      <div class="footer">
        <a routerLink="/auth/register" class="toggle-link">{{ 'AUTH.NO_ACCOUNT' | translate }}</a>
      </div>
    </div>
  `,
  styles: [`
    .auth-card {
      width: 100%;
      text-align: center;
      animation: fadeIn 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards;
    }

    .header {
      margin-bottom: 30px;
    }

    .header h2 {
      font-size: 1.6rem;
      background: linear-gradient(135deg, #3b82f6 0%, #10b981 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      margin-bottom: 8px;
    }

    .header p {
      font-size: 0.85rem;
      color: #94a3b8;
    }

    .w-full {
      width: 100%;
    }

    .submit-btn {
      margin-top: 10px;
      height: 48px;
    }

    .validation-error {
      color: #ef4444;
      font-size: 0.75rem;
      font-weight: 600;
      text-align: start;
    }

    .footer {
      margin-top: 25px;
      border-top: 1px solid rgba(255, 255, 255, 0.05);
      padding-top: 20px;
    }

    .toggle-link {
      color: #94a3b8;
      font-size: 0.85rem;
      text-decoration: none;
      transition: color 0.2s ease;
      cursor: pointer;
    }

    .toggle-link:hover {
      color: #60a5fa;
    }

    @keyframes fadeIn {
      from {
        opacity: 0;
        transform: translateY(15px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }
  `]
})
export class Login {
  private apiService = inject(ApiService);
  private authService = inject(AuthService);
  private router = inject(Router);

  username = '';
  password = '';
  loading = false;

  alertMessage = signal<string | null>(null);
  alertType = signal<'success' | 'error'>('success');

  onSubmit() {
    if (!this.username || !this.password) return;

    this.loading = true;
    this.apiService.post<any>('auth/login', {
      username: this.username,
      password: this.password
    }).subscribe({
      next: (res) => {
        this.loading = false;
        if (res.success) {
          this.authService.saveSession(res.token, res.role, res.username);
          this.showAlert(res.message || 'تم تسجيل الدخول بنجاح!', 'success');
          
          setTimeout(() => {
            if (res.role === 'admin') {
              this.router.navigate(['/dashboard']);
            } else {
              this.router.navigate(['/sales/add']);
            }
          }, 800);
        } else {
          this.showAlert(res.message || 'حدث خطأ غير متوقع', 'error');
        }
      },
      error: (err) => {
        this.loading = false;
        const msg = err.error?.message || 'اسم المستخدم أو كلمة المرور غير صحيحة';
        this.showAlert(msg, 'error');
      }
    });
  }

  private showAlert(message: string, type: 'success' | 'error') {
    this.alertMessage.set(message);
    this.alertType.set(type);
    setTimeout(() => this.alertMessage.set(null), 3000);
  }
}
