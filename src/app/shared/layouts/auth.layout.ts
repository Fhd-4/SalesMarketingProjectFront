import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-auth-layout',
  standalone: true,
  imports: [RouterOutlet],
  template: `
    <div class="auth-layout">
      <div class="background-decorations">
        <div class="circle circle-1"></div>
        <div class="circle circle-2"></div>
      </div>
      <div class="auth-content">
        <router-outlet></router-outlet>
      </div>
    </div>
  `,
  styles: [`
    .auth-layout {
      position: relative;
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      background-color: #0b0f19;
      font-family: 'Outfit', 'Inter', sans-serif;
      overflow: hidden;
      padding: 20px;
    }

    .background-decorations {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      z-index: 1;
    }

    .circle {
      position: absolute;
      border-radius: 50%;
      filter: blur(100px);
      opacity: 0.25;
    }

    .circle-1 {
      top: -10%;
      right: -10%;
      width: 500px;
      height: 500px;
      background: radial-gradient(circle, #3b82f6 0%, transparent 70%);
    }

    .circle-2 {
      bottom: -10%;
      left: -10%;
      width: 600px;
      height: 600px;
      background: radial-gradient(circle, #10b981 0%, transparent 70%);
    }

    .auth-content {
      position: relative;
      z-index: 2;
      width: 100%;
      max-width: 480px;
    }
  `]
})
export class AuthLayout { }
