import { Component, inject, effect } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { CommonModule } from '@angular/common';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-main-layout',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive, CommonModule, TranslatePipe],
  template: `
    <div class="main-layout" [dir]="currentDir">
      <!-- Navbar -->
      <nav class="navbar">
        <div class="nav-container">
          <div class="brand">
            <span class="logo-icon">📊</span>
            <span class="brand-name">{{ 'AUTH.TITLE' | translate }}</span>
          </div>

          <!-- Nav Links -->
          <div class="nav-links">
            <a *ngIf="isAdmin" routerLink="/dashboard" routerLinkActive="active" class="nav-link">
              <span class="link-icon">📈</span>
              <span>{{ 'NAV.DASHBOARD' | translate }}</span>
            </a>
            <a routerLink="/sales/add" routerLinkActive="active" class="nav-link">
              <span class="link-icon">📥</span>
              <span>{{ 'NAV.ADD_INVOICE' | translate }}</span>
            </a>
            <a *ngIf="isAdmin" routerLink="/sales/logs" routerLinkActive="active" class="nav-link">
              <span class="link-icon">📑</span>
              <span>{{ 'NAV.LOGS' | translate }}</span>
            </a>
          </div>

          <!-- Right side items (Lang, User, Logout) -->
          <div class="nav-actions">
            <!-- Language Switcher -->
            <button (click)="toggleLanguage()" class="lang-btn">
              🌐 {{ 'NAV.LANG_SWITCH' | translate }}
            </button>

            <!-- User Info -->
            <div class="user-badge" *ngIf="currentUser()">
              <div class="avatar">{{ currentUser()?.username?.substring(0, 1)?.toUpperCase() }}</div>
              <div class="user-details">
                <span class="username">{{ currentUser()?.username }}</span>
                <span class="role">{{ currentUser()?.role === 'admin' ? ('AUTH.ADMIN' | translate) : ('AUTH.ENTRY' | translate) }}</span>
              </div>
            </div>

            <!-- Logout -->
            <button (click)="logout()" class="logout-btn" title="{{ 'NAV.LOGOUT' | translate }}">
              🚪
            </button>
          </div>
        </div>
      </nav>

      <!-- Main Content -->
      <main class="content-area">
        <router-outlet></router-outlet>
      </main>
    </div>
  `,
  styles: [`
    .main-layout {
      min-height: 100vh;
      background-color: #0b0f19;
      color: #f1f5f9;
      font-family: 'Outfit', 'Cairo', sans-serif;
      display: flex;
      flex-direction: column;
    }

    .navbar {
      background: rgba(15, 23, 42, 0.6);
      backdrop-filter: blur(12px);
      -webkit-backdrop-filter: blur(12px);
      border-bottom: 1px solid rgba(255, 255, 255, 0.05);
      position: sticky;
      top: 0;
      z-index: 100;
      padding: 0 20px;
    }

    .nav-container {
      max-width: 1280px;
      height: 70px;
      margin: 0 auto;
      display: flex;
      align-items: center;
      justify-content: space-between;
    }

    .brand {
      display: flex;
      align-items: center;
      gap: 10px;
    }

    .logo-icon {
      font-size: 1.5rem;
    }

    .brand-name {
      font-weight: 700;
      font-size: 1.1rem;
      letter-spacing: -0.5px;
      background: linear-gradient(135deg, #60a5fa 0%, #34d399 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }

    .nav-links {
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .nav-link {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 10px 16px;
      color: #94a3b8;
      text-decoration: none;
      font-size: 0.95rem;
      font-weight: 500;
      border-radius: 8px;
      transition: all 0.3s ease;
    }

    .nav-link:hover {
      color: #f1f5f9;
      background: rgba(255, 255, 255, 0.03);
    }

    .nav-link.active {
      color: #60a5fa;
      background: rgba(96, 165, 250, 0.08);
      font-weight: 600;
    }

    .nav-actions {
      display: flex;
      align-items: center;
      gap: 15px;
    }

    .lang-btn {
      background: rgba(255, 255, 255, 0.05);
      border: 1px solid rgba(255, 255, 255, 0.08);
      color: #cbd5e1;
      padding: 8px 12px;
      border-radius: 8px;
      cursor: pointer;
      font-size: 0.85rem;
      font-weight: 500;
      transition: all 0.2s ease;
    }

    .lang-btn:hover {
      background: rgba(255, 255, 255, 0.1);
      color: #f8fafc;
    }

    .user-badge {
      display: flex;
      align-items: center;
      gap: 10px;
      padding: 6px 12px;
      background: rgba(255, 255, 255, 0.02);
      border: 1px solid rgba(255, 255, 255, 0.05);
      border-radius: 12px;
    }

    .avatar {
      width: 32px;
      height: 32px;
      border-radius: 50%;
      background: linear-gradient(135deg, #3b82f6 0%, #10b981 100%);
      color: white;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: 700;
      font-size: 0.9rem;
    }

    .user-details {
      display: flex;
      flex-direction: column;
      text-align: initial;
    }

    .username {
      font-size: 0.85rem;
      font-weight: 600;
      color: #f1f5f9;
      line-height: 1.2;
    }

    .role {
      font-size: 0.7rem;
      color: #64748b;
    }

    .logout-btn {
      background: rgba(239, 68, 68, 0.1);
      border: 1px solid rgba(239, 68, 68, 0.15);
      color: #ef4444;
      padding: 8px 10px;
      border-radius: 8px;
      cursor: pointer;
      font-size: 1.1rem;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: all 0.2s ease;
    }

    .logout-btn:hover {
      background: rgba(239, 68, 68, 0.2);
    }

    .content-area {
      flex: 1;
      max-width: 1280px;
      width: 100%;
      margin: 0 auto;
      padding: 30px 20px;
      box-sizing: border-box;
    }

    /* RTL specific adjustment */
    [dir="rtl"] .user-details {
      text-align: right;
    }
    [dir="ltr"] .user-details {
      text-align: left;
    }
  `]
})
export class MainLayout {
  private translate = inject(TranslateService);
  private authService = inject(AuthService);

  currentUser = this.authService.currentUser;
  currentDir = 'rtl'; // Default to RTL for Arabic

  constructor() {
    this.translate.use('ar');
    this.updateDirection('ar');
  }

  get isAdmin(): boolean {
    return this.authService.getUserRole() === 'admin';
  }

  toggleLanguage() {
    const current = this.translate.currentLang();
    const nextLang = current === 'ar' ? 'en' : 'ar';
    this.translate.use(nextLang);
    this.updateDirection(nextLang);
  }

  private updateDirection(lang: string) {
    this.currentDir = lang === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.dir = this.currentDir;
    document.documentElement.lang = lang;
  }

  logout() {
    this.authService.logout();
  }
}
