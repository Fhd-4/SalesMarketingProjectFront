import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [CommonModule, TranslatePipe],
  template: `
    <footer class="app-footer">
      <div class="footer-container">
        <!-- Copyright Info -->
        <div class="footer-copyright">
          <span>{{ 'FOOTER.COPYRIGHT' | translate }}</span>
          <span class="divider">|</span>
          <span class="year">{{ currentYear }}</span>
        </div>

        <!-- Dynamic Additional Branding -->
        <div class="footer-branding">
          <span class="badge">Smart Invoice v1.0</span>
        </div>

        <!-- WhatsApp Contact -->
        <div class="footer-contact">
          <a [href]="whatsAppLink" target="_blank" class="whatsapp-link" title="{{ 'FOOTER.CONTACT' | translate }}">
            <span class="pulse-ring"></span>
            <!-- SVG WhatsApp Icon -->
            <svg class="whatsapp-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512">
              <path fill="currentColor" d="M380.9 97.1C339 55.1 283.2 32 223.9 32c-122.4 0-222 99.6-222 222 0 39.1 10.2 77.3 29.6 111L32 503l138.2-36.2c32.5 17.7 68.9 27 106.1 27 122.4 0 222-99.6 222-222 0-59.3-25.2-115-67.4-157.2zM223.9 474c-33.1 0-65.6-8.9-93.9-25.7l-6.7-4-82 21.5 21.9-79.9-4.4-7c-18.5-29.4-28.3-63.5-28.3-98.8 0-104.2 84.8-189 189-189 50.5 0 97.9 19.7 133.5 55.3 35.6 35.6 55.3 83 55.3 133.5-.1 104.2-84.9 189-189 189zm101.7-138c-5.6-2.8-32.8-16.2-37.9-18-5.1-1.9-8.8-2.8-12.5 2.8-3.7 5.6-14.3 18-17.6 21.8-3.2 3.7-6.5 4.2-12 1.4-32.6-16.3-54-29.1-75.5-66-5.7-9.8 5.7-9.1 16.3-30.3 1.8-3.7.9-6.9-.5-9.7-1.4-2.8-12.5-30.1-17.1-41.2-4.5-10.8-9.1-9.3-12.5-9.5-3.2-.2-6.9-.2-10.6-.2-3.7 0-9.7 1.4-14.8 6.9-5.1 5.6-19.4 19-19.4 46.3 0 27.3 19.9 53.7 22.6 57.4 2.8 3.7 39.1 59.7 94.8 83.8 35.2 15.2 49 16.5 66.6 13.9 10.7-1.6 32.8-13.4 37.4-26.4 4.6-13 4.6-24.1 3.2-26.4-1.3-2.5-5-3.9-10.5-6.6z"/>
            </svg>
            <span class="contact-text">{{ 'FOOTER.CONTACT' | translate }}</span>
          </a>
        </div>
      </div>
    </footer>
  `,
  styles: [`
    .app-footer {
      background: rgba(15, 23, 42, 0.45);
      backdrop-filter: blur(12px);
      -webkit-backdrop-filter: blur(12px);
      border-top: 1px solid rgba(255, 255, 255, 0.05);
      padding: 20px;
      margin-top: auto;
      z-index: 10;
    }

    .footer-container {
      max-width: 1280px;
      margin: 0 auto;
      display: flex;
      align-items: center;
      justify-content: space-between;
      flex-wrap: wrap;
      gap: 15px;
    }

    .footer-copyright {
      display: flex;
      align-items: center;
      gap: 8px;
      color: #94a3b8;
      font-size: 0.9rem;
      font-weight: 500;
    }

    .divider {
      color: rgba(255, 255, 255, 0.1);
    }

    .year {
      color: #60a5fa;
      font-weight: 600;
    }

    .footer-branding .badge {
      background: rgba(96, 165, 250, 0.08);
      border: 1px solid rgba(96, 165, 250, 0.15);
      color: #60a5fa;
      padding: 4px 10px;
      border-radius: 20px;
      font-size: 0.75rem;
      font-weight: 600;
      letter-spacing: 0.5px;
    }

    .footer-contact {
      display: flex;
      align-items: center;
    }

    .whatsapp-link {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      background: rgba(16, 185, 129, 0.08);
      border: 1px solid rgba(16, 185, 129, 0.2);
      color: #10b981;
      padding: 8px 16px;
      border-radius: 30px;
      text-decoration: none;
      font-size: 0.85rem;
      font-weight: 600;
      transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
      position: relative;
    }

    .whatsapp-link:hover {
      background: #10b981;
      color: #0b0f19;
      box-shadow: 0 0 15px rgba(16, 185, 129, 0.4);
      transform: translateY(-2px);
    }

    .whatsapp-icon {
      width: 16px;
      height: 16px;
      transition: transform 0.3s ease;
    }

    .whatsapp-link:hover .whatsapp-icon {
      transform: rotate(15deg) scale(1.1);
    }

    .pulse-ring {
      content: '';
      position: absolute;
      width: 100%;
      height: 100%;
      border: 1px solid rgba(16, 185, 129, 0.4);
      border-radius: 30px;
      left: 0;
      top: 0;
      animation: pulse 2s infinite;
      pointer-events: none;
    }

    @keyframes pulse {
      0% {
        transform: scale(0.98);
        opacity: 0.8;
      }
      70% {
        transform: scale(1.05);
        opacity: 0;
      }
      100% {
        transform: scale(1.08);
        opacity: 0;
      }
    }

    /* RTL specific layout direction handling */
    [dir="rtl"] .footer-copyright {
      flex-direction: row;
    }
    [dir="ltr"] .footer-copyright {
      flex-direction: row;
    }

    /* Responsive adjustments */
    @media (max-width: 768px) {
      .footer-container {
        flex-direction: column;
        text-align: center;
      }
      .footer-copyright {
        justify-content: center;
      }
    }
  `]
})
export class FooterComponent {
  currentYear = new Date().getFullYear();
  whatsAppLink = 'https://wa.me/966503849722?text=' + encodeURIComponent('السلام عليكم أخي فهد، أرغب في التواصل معك بخصوص نظام إدارة الفواتير الذكي');
}
