import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SubjectService, Subject } from '../../../core/services/subject.service';
import { Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

interface SubjectWithStatus extends Subject {
  isSubscribed: boolean;
  loading?: boolean;
}

@Component({
  selector: 'app-subscriptions',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatSlideToggleModule,
    MatButtonModule,
    MatIconModule,
    MatSnackBarModule,
    MatProgressSpinnerModule
  ],
  template: `
    <div class="subscriptions-container">
      <!-- Header -->
      <div class="header">
        <button mat-icon-button class="back-button" (click)="goBack()">
          <mat-icon>arrow_back</mat-icon>
        </button>
        <div class="header-content">
          <h1>⚙️ Gestionar Suscripciones</h1>
          <p class="subtitle">Elige las materias que quieres ver en tu panel</p>
        </div>
      </div>

      <!-- Loading -->
      <div *ngIf="loading" class="loading">
        <mat-spinner></mat-spinner>
        <p>Cargando materias...</p>
      </div>

      <!-- Subjects Grid -->
      <div *ngIf="!loading" class="subjects-grid">
        <mat-card *ngFor="let subject of subjects" 
                  class="subject-card"
                  [class.subscribed]="subject.isSubscribed">
          <mat-card-content>
            <div class="subject-info">
              <div class="subject-header">
                <h3>{{ subject.name }}</h3>
                <mat-icon *ngIf="subject.isSubscribed" class="check-icon">check_circle</mat-icon>
              </div>
              <p class="objective">{{ subject.objective }}</p>
              <p class="content">{{ subject.content }}</p>
            </div>
            
            <div class="toggle-section">
              <mat-slide-toggle
                [checked]="subject.isSubscribed"
                (change)="toggleSubscription(subject)"
                [disabled]="subject.loading"
                color="primary">
                {{ subject.isSubscribed ? 'Suscrito' : 'Suscribirse' }}
              </mat-slide-toggle>
            </div>
          </mat-card-content>
        </mat-card>
      </div>

      <!-- Empty State -->
      <div *ngIf="!loading && subjects.length === 0" class="empty-state">
        <mat-icon>school</mat-icon>
        <h2>No hay materias disponibles</h2>
        <p>Aún no se han creado materias en el sistema</p>
      </div>
    </div>
  `,
  styles: [`
    .subscriptions-container {
      max-width: 1200px;
      margin: 0 auto;
      padding: 20px;
    }

    .header {
      display: flex;
      align-items: center;
      gap: 16px;
      margin-bottom: 30px;
    }

    .back-button {
      flex-shrink: 0;
    }

    .header-content {
      flex: 1;
    }

    .header h1 {
      margin: 0;
      font-size: 28px;
      font-weight: 600;
      color: #1a1a1a;
    }

    .subtitle {
      margin: 4px 0 0 0;
      color: #666;
      font-size: 14px;
    }

    .loading {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 16px;
      padding: 60px 20px;
      color: #666;
    }

    .subjects-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
      gap: 20px;
    }

    .subject-card {
      transition: all 0.3s ease;
      border: 2px solid #e0e0e0;
    }

    .subject-card:hover {
      box-shadow: 0 4px 12px rgba(0,0,0,0.1);
      transform: translateY(-2px);
    }

    .subject-card.subscribed {
      border-color: #4CAF50;
      background-color: #f1f8f4;
    }

    mat-card-content {
      padding: 20px !important;
    }

    .subject-info {
      margin-bottom: 16px;
    }

    .subject-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 12px;
    }

    .subject-header h3 {
      margin: 0;
      font-size: 20px;
      font-weight: 600;
      color: #1a1a1a;
    }

    .check-icon {
      color: #4CAF50;
      font-size: 24px;
      width: 24px;
      height: 24px;
    }

    .objective {
      margin: 0 0 8px 0;
      font-size: 14px;
      font-weight: 500;
      color: #333;
    }

    .content {
      margin: 0;
      font-size: 13px;
      color: #666;
      line-height: 1.5;
    }

    .toggle-section {
      display: flex;
      justify-content: flex-end;
      padding-top: 12px;
      border-top: 1px solid #e0e0e0;
    }

    .empty-state {
      text-align: center;
      padding: 60px 20px;
      color: #666;
    }

    .empty-state mat-icon {
      font-size: 64px;
      width: 64px;
      height: 64px;
      color: #ccc;
      margin-bottom: 16px;
    }

    .empty-state h2 {
      margin: 0 0 8px 0;
      font-size: 24px;
      color: #333;
    }

    .empty-state p {
      margin: 0;
      font-size: 14px;
    }

    @media (max-width: 768px) {
      .subjects-grid {
        grid-template-columns: 1fr;
      }
    }
  `]
})
export class SubscriptionsComponent implements OnInit {
  private subjectService = inject(SubjectService);
  private router = inject(Router);
  private snackBar = inject(MatSnackBar);

  subjects: SubjectWithStatus[] = [];
  loading = true;

  ngOnInit() {
    this.loadSubjects();
  }

  loadSubjects() {
    this.loading = true;
    this.subjectService.getAllWithStatus().subscribe({
      next: (response: any) => {
        this.subjects = response.data;
        this.loading = false;
      },
      error: (err: any) => {
        console.error('Error loading subjects:', err);
        this.showMessage('Error al cargar materias', 'error');
        this.loading = false;
      }
    });
  }

  toggleSubscription(subject: SubjectWithStatus) {
    subject.loading = true;
    
    this.subjectService.toggleSubscription(subject._id!, subject.isSubscribed).subscribe({
      next: () => {
        subject.isSubscribed = !subject.isSubscribed;
        subject.loading = false;
        const message = subject.isSubscribed 
          ? `✅ Suscrito a ${subject.name}`
          : `❌ Desuscrito de ${subject.name}`;
        this.showMessage(message, 'success');
      },
      error: (err: any) => {
        console.error('Error toggling subscription:', err);
        subject.loading = false;
        this.showMessage('Error al cambiar suscripción', 'error');
      }
    });
  }

  goBack() {
    this.router.navigate(['/subjects']);
  }

  private showMessage(message: string, type: 'success' | 'error') {
    this.snackBar.open(message, 'Cerrar', {
      duration: 3000,
      horizontalPosition: 'end',
      verticalPosition: 'top',
      panelClass: type === 'success' ? 'success-snackbar' : 'error-snackbar'
    });
  }
}

