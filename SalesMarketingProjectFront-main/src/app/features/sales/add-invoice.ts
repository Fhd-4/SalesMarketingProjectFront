import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TranslatePipe } from '@ngx-translate/core';
import { ApiService } from '../../core/services/api.service';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

interface ScannedInvoice {
  vendor: string;
  invNo: string;
  amount: number;
  category: string;
  date: string;
  time: string;
}

@Component({
  selector: 'app-add-invoice',
  standalone: true,
  imports: [CommonModule, FormsModule, TranslatePipe],
  template: `
    <div class="add-invoice-container">
      <div class="header">
        <h1>{{ 'ADD.TITLE' | translate }}</h1>
      </div>

      <!-- Toast Alert Notifications -->
      <div *ngIf="alertMessage()" class="alert-popup" [ngClass]="alertType() === 'success' ? 'alert-success' : 'alert-error'">
        <span>{{ alertMessage() }}</span>
      </div>

      <div class="workspace-grid">
        <!-- Upload & Scan Card -->
        <div class="glass-card upload-card">
          <!-- Image Uploader -->
          <div 
            class="drag-drop-area"
            [class.dragover]="isDragOver"
            (dragover)="onDragOver($event)"
            (dragleave)="onDragLeave()"
            (drop)="onDrop($event)"
            (click)="fileInput.click()"
          >
            <input 
              type="file" 
              #fileInput 
              style="display: none" 
              (change)="onFileSelected($event)" 
              accept="image/*"
            />
            
            <div class="upload-prompt" *ngIf="!imagePreviewUrl">
              <span class="icon">📷</span>
              <p>{{ 'ADD.UPLOAD_DRAG' | translate }}</p>
            </div>

            <div class="preview-container" *ngIf="imagePreviewUrl">
              <img [src]="imagePreviewUrl" alt="Invoice Preview" class="img-preview" />
            </div>
          </div>

          <!-- Actions -->
          <div class="upload-actions" *ngIf="selectedFile">
            <button 
              (click)="startScan()" 
              [disabled]="scanning" 
              class="btn btn-success w-full"
            >
              <span *ngIf="scanning" class="spinner"></span>
              <span *ngIf="!scanning">🔍 {{ 'ADD.SCAN_BTN' | translate }}</span>
            </button>
            
            <button 
              (click)="clearUploader()" 
              [disabled]="scanning" 
              class="btn btn-secondary w-full"
            >
              {{ 'ADD.CLEAR_BTN' | translate }}
            </button>
          </div>
        </div>

        <!-- Details Form Card -->
        <div class="glass-card form-card">
          <h3>{{ 'ADD.FORM_TITLE' | translate }}</h3>

          <form (ngSubmit)="saveInvoice()" #invoiceForm="ngForm" class="invoice-form">
            <div class="form-row">
              <div class="form-group">
                <label class="form-label">{{ 'ADD.VENDOR' | translate }}</label>
                <input 
                  type="text" 
                  name="vendor" 
                  [(ngModel)]="invoiceData.vendor" 
                  required 
                  class="form-input" 
                />
              </div>

              <div class="form-group">
                <label class="form-label">{{ 'ADD.INV_NO' | translate }}</label>
                <input 
                  type="text" 
                  name="invNo" 
                  [(ngModel)]="invoiceData.invNo" 
                  class="form-input" 
                />
              </div>
            </div>

            <div class="form-row">
              <div class="form-group">
                <label class="form-label">{{ 'ADD.AMOUNT' | translate }}</label>
                <div class="input-with-suffix">
                  <input 
                    type="number" 
                    name="amount" 
                    [(ngModel)]="invoiceData.amount" 
                    required 
                    min="0"
                    step="0.01"
                    class="form-input" 
                  />
                  <span class="suffix">{{ 'COMMON.SAR' | translate }}</span>
                </div>
              </div>

              <div class="form-group">
                <label class="form-label">{{ 'ADD.CATEGORY' | translate }}</label>
                <select name="category" [(ngModel)]="invoiceData.category" class="form-select">
                  <option value="المنتجات الإلكترونية">المنتجات الإلكترونية</option>
                  <option value="التسويق والإعلانات">التسويق والإعلانات</option>
                  <option value="الخدمات اللوجستية">الخدمات اللوجستية</option>
                  <option value="مشتريات عامة">مشتريات عامة</option>
                  <option value="أخرى">أخرى</option>
                </select>
              </div>
            </div>

            <div class="form-row">
              <div class="form-group">
                <label class="form-label">{{ 'ADD.DATE' | translate }}</label>
                <input 
                  type="date" 
                  name="date" 
                  [(ngModel)]="invoiceData.date" 
                  required 
                  class="form-input" 
                />
              </div>

              <div class="form-group">
                <label class="form-label">{{ 'ADD.TIME' | translate }}</label>
                <input 
                  type="time" 
                  name="time" 
                  [(ngModel)]="invoiceData.time" 
                  required 
                  class="form-input" 
                />
              </div>
            </div>

            <button 
              type="submit" 
              [disabled]="saving || invoiceForm.invalid" 
              class="btn btn-primary w-full save-btn"
            >
              <span *ngIf="saving" class="spinner"></span>
              <span *ngIf="!saving">💾 {{ 'ADD.SAVE_BTN' | translate }}</span>
            </button>
          </form>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .add-invoice-container {
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
    }

    .workspace-grid {
      display: grid;
      grid-template-columns: 1.2fr 1.8fr;
      gap: 24px;
    }

    @media (max-width: 900px) {
      .workspace-grid {
        grid-template-columns: 1fr;
      }
    }

    .upload-card {
      display: flex;
      flex-direction: column;
      gap: 20px;
      justify-content: space-between;
      min-height: 400px;
    }

    .drag-drop-area {
      flex: 1;
      border: 2px dashed rgba(255, 255, 255, 0.1);
      border-radius: 12px;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      background: rgba(255, 255, 255, 0.01);
      transition: all 0.3s ease;
      min-height: 250px;
      padding: 15px;
    }

    .drag-drop-area:hover, .drag-drop-area.dragover {
      border-color: #3b82f6;
      background: rgba(59, 130, 246, 0.03);
    }

    .upload-prompt {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 12px;
      color: #94a3b8;
      text-align: center;
    }

    .upload-prompt .icon {
      font-size: 2.5rem;
      opacity: 0.7;
    }

    .upload-prompt p {
      font-size: 0.85rem;
      max-width: 200px;
    }

    .preview-container {
      width: 100%;
      height: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .img-preview {
      max-width: 100%;
      max-height: 280px;
      border-radius: 8px;
      object-fit: contain;
      box-shadow: 0 4px 20px rgba(0,0,0,0.3);
    }

    .upload-actions {
      display: flex;
      flex-direction: column;
      gap: 10px;
    }

    .form-card {
      display: flex;
      flex-direction: column;
      gap: 20px;
      text-align: start;
    }

    .form-card h3 {
      font-size: 1.1rem;
      font-weight: 700;
      color: #f1f5f9;
      border-bottom: 1px solid rgba(255, 255, 255, 0.05);
      padding-bottom: 15px;
    }

    .invoice-form {
      display: flex;
      flex-direction: column;
      gap: 15px;
    }

    .form-row {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 15px;
    }

    @media (max-width: 500px) {
      .form-row {
        grid-template-columns: 1fr;
      }
    }

    .input-with-suffix {
      display: flex;
      position: relative;
      align-items: center;
    }

    .input-with-suffix .suffix {
      position: absolute;
      right: 15px;
      font-size: 0.8rem;
      font-weight: 600;
      color: #64748b;
    }

    [dir="rtl"] .input-with-suffix .suffix {
      right: auto;
      left: 15px;
    }

    .save-btn {
      margin-top: 15px;
      height: 48px;
    }

    .w-full { width: 100%; }

    @keyframes fadeIn {
      from { opacity: 0; transform: translateY(10px); }
      to { opacity: 1; transform: translateY(0); }
    }
  `]
})
export class AddInvoice {
  private apiService = inject(ApiService);
  private http = inject(HttpClient);

  selectedFile: File | null = null;
  imagePreviewUrl: string | ArrayBuffer | null = null;
  isDragOver = false;
  scanning = false;
  saving = false;

  alertMessage = signal<string | null>(null);
  alertType = signal<'success' | 'error'>('success');

  invoiceData: ScannedInvoice = {
    vendor: '',
    invNo: '',
    amount: 0,
    category: 'أخرى',
    date: new Date().toISOString().split('T')[0],
    time: new Date().toTimeString().split(' ')[0].substring(0, 5)
  };

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.handleFile(file);
    }
  }

  onDragOver(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();
    this.isDragOver = true;
  }

  onDragLeave() {
    this.isDragOver = false;
  }

  onDrop(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();
    this.isDragOver = false;
    
    if (event.dataTransfer?.files && event.dataTransfer.files.length > 0) {
      const file = event.dataTransfer.files[0];
      if (file.type.startsWith('image/')) {
        this.handleFile(file);
      } else {
        this.showAlert('الرجاء اختيار صورة صالحة فقط', 'error');
      }
    }
  }

  private handleFile(file: File) {
    this.selectedFile = file;
    
    const reader = new FileReader();
    reader.onload = () => {
      this.imagePreviewUrl = reader.result;
    };
    reader.readAsDataURL(file);
  }

  clearUploader() {
    this.selectedFile = null;
    this.imagePreviewUrl = null;
    this.scanning = false;
  }

  startScan() {
    if (!this.selectedFile) return;

    this.scanning = true;
    this.showAlert('ADD.SCANNING', 'success');

    const formData = new FormData();
    formData.append('file', this.selectedFile);

    // Send file to C# OCR scan endpoint
    this.http.post<any>(`${environment.apiUrl}/scan`, formData).subscribe({
      next: (res) => {
        this.scanning = false;
        if (res.success) {
          this.invoiceData.vendor = res.vendor;
          this.invoiceData.invNo = res.invNo;
          this.invoiceData.amount = res.amount;
          this.invoiceData.category = res.category || 'أخرى';
          this.invoiceData.date = res.date;
          this.invoiceData.time = res.time;
          
          this.showAlert('تم تحليل الفاتورة واستخراج البيانات بنجاح!', 'success');
        } else {
          this.showAlert(res.message || 'فشل المسح التلقائي للفاتورة', 'error');
        }
      },
      error: (err) => {
        this.scanning = false;
        const msg = err.error?.message || 'حدث خطأ في الخادم أثناء تحليل الصورة';
        this.showAlert(msg, 'error');
      }
    });
  }

  saveInvoice() {
    if (!this.invoiceData.vendor || this.invoiceData.amount < 0) return;

    this.saving = true;
    this.apiService.post<any>('sales/save', this.invoiceData).subscribe({
      next: (res) => {
        this.saving = false;
        if (res.success) {
          this.showAlert('ADD.SAVE_SUCCESS', 'success');
          // Clear form and uploader on successful save
          this.clearUploader();
          this.resetForm();
        } else {
          this.showAlert(res.message || 'فشل في حفظ الفاتورة', 'error');
        }
      },
      error: (err) => {
        this.saving = false;
        const msg = err.error?.message || 'خطأ أثناء الاتصال بالخادم لحفظ الفاتورة';
        this.showAlert(msg, 'error');
      }
    });
  }

  private resetForm() {
    this.invoiceData = {
      vendor: '',
      invNo: '',
      amount: 0,
      category: 'أخرى',
      date: new Date().toISOString().split('T')[0],
      time: new Date().toTimeString().split(' ')[0].substring(0, 5)
    };
  }

  private showAlert(messageKey: string, type: 'success' | 'error') {
    this.alertMessage.set(messageKey.includes('.') ? 'جاري العمل...' : messageKey);
    this.alertType.set(type);
    setTimeout(() => this.alertMessage.set(null), 3000);
  }
}
