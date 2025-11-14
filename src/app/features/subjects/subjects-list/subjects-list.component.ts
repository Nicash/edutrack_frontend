import { Component, inject, signal, computed } from '@angular/core';
import { SubjectService, Subject } from '../../../core/services/subject.service';
import { FormsModule } from '@angular/forms';
import { NgFor, NgIf } from '@angular/common';
import { CalendarComponent } from '../../../shared/components/calendar/calendar.component';
import { MESSAGES } from '../../../constants/messages';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatChipsModule } from '@angular/material/chips';

@Component({
  selector: 'app-subjects-list',
  standalone: true,
  imports: [
    NgFor, 
    NgIf, 
    FormsModule, 
    CalendarComponent,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatDialogModule,
    MatProgressBarModule,
    MatChipsModule
  ],
  templateUrl: './subjects-list.component.html',
  styleUrls: ['./subjects-list.component.css']
})
export class SubjectsListComponent {
  private api = inject(SubjectService);
  private snackBar = inject(MatSnackBar);
  private dialog = inject(MatDialog);
  all = signal<Subject[]>([]);

  // Indicadores de carga
  loading = false;
  loadingAdd = false;

  query = signal('');

  newName = '';
  newObjective = '';
  newContent = '';

  filtered = computed(() => {
    const k = this.query().toLowerCase();
    return this.all().filter(s => s.name.toLowerCase().includes(k));
  });

  constructor() {
    this.reload();
  }

  reload() {
    this.loading = true;
    this.api.list().subscribe({
      next: (v) => {
        console.log('Materias cargadas:', v);
        this.all.set(v);
        this.loading = false;
      },
      error: (err) => {
        console.error('Error al cargar materias:', err);
        this.loading = false;
        
        let message = MESSAGES.ERROR_LOADING;
        
        if (err.status === 401) {
          message = MESSAGES.ERROR_UNAUTHORIZED;
        } else if (err.status === 0) {
          message = MESSAGES.ERROR_NETWORK;
        } else if (err.status >= 500) {
          message = MESSAGES.ERROR_SERVER;
        }
        
        alert(message);
      }
    });
  }

  add() {
    // Validaciones
    if (!this.newName.trim()) {
      this.snackBar.open('El nombre de la materia no puede estar vacío', 'Cerrar', {
        duration: 3000,
        horizontalPosition: 'center',
        verticalPosition: 'top'
      });
      return;
    }
    if (!this.newObjective.trim()) {
      this.snackBar.open('El objetivo no puede estar vacío', 'Cerrar', {
        duration: 3000,
        horizontalPosition: 'center',
        verticalPosition: 'top'
      });
      return;
    }
    if (!this.newContent.trim()) {
      this.snackBar.open('El contenido no puede estar vacío', 'Cerrar', {
        duration: 3000,
        horizontalPosition: 'center',
        verticalPosition: 'top'
      });
      return;
    }
    
    const token = localStorage.getItem('edutrack_token');
    console.log('🔐 Estado del token:', token ? 'Token existe' : '⚠️ NO HAY TOKEN');
    
    const newSubject: Subject = {
      name: this.newName.trim(),
      objective: this.newObjective.trim(),
      content: this.newContent.trim()
    };
    
    console.log('Agregando materia:', newSubject);
    
    // Activar indicador de carga
    this.loadingAdd = true;
    
    this.api.add(newSubject)
      .subscribe({
        next: (subject) => {
          console.log('✅ Materia agregada exitosamente:', subject);
          this.loadingAdd = false;
          
          this.snackBar.open(MESSAGES.SUBJECT_ADDED, 'Cerrar', {
            duration: 3000,
            horizontalPosition: 'center',
            verticalPosition: 'top'
          });
          
          // Limpiar formulario
          this.newName = '';
          this.newObjective = '';
          this.newContent = '';
          
          this.reload();
        },
        error: (err) => {
          console.error('❌ Error completo:', err);
          console.error('Error status:', err.status);
          console.error('Error body:', err.error);
          this.loadingAdd = false;
          
          let message = MESSAGES.ERROR_SAVING;
          
          if (err.status === 400) {
            message = err.error?.error || MESSAGES.SUBJECT_EXISTS;
          } else if (err.status === 401) {
            message = MESSAGES.ERROR_UNAUTHORIZED;
          } else if (err.status === 0) {
            message = MESSAGES.ERROR_NETWORK;
          } else if (err.status >= 500) {
            message = MESSAGES.ERROR_SERVER;
          }
          
          alert(`No se pudo agregar la materia: ${message}`);
        }
      });
  }

  edit(s: Subject) {
    const name = prompt('Nuevo nombre', s.name);
    if (!name || name.trim() === '') return;
    
    if (name.trim() === s.name) {
      this.snackBar.open('El nombre es el mismo', 'Cerrar', {
        duration: 3000,
        horizontalPosition: 'center',
        verticalPosition: 'top'
      });
      return;
    }
    
    console.log('Editando materia:', s._id, name);
    
    this.api.update(s._id!, { ...s, name: name.trim() }).subscribe({
      next: () => {
        console.log('Materia editada exitosamente');
        this.snackBar.open(MESSAGES.SUBJECT_UPDATED, 'Cerrar', {
          duration: 3000,
          horizontalPosition: 'center',
          verticalPosition: 'top'
        });
        this.reload();
      },
      error: (err) => {
        console.error('Error al editar:', err);
        
        let message = MESSAGES.ERROR_SAVING;
        
        if (err.status === 401) {
          message = MESSAGES.ERROR_UNAUTHORIZED;
        } else if (err.status === 404) {
          message = 'Materia no encontrada';
        } else if (err.status === 0) {
          message = MESSAGES.ERROR_NETWORK;
        } else if (err.status >= 500) {
          message = MESSAGES.ERROR_SERVER;
        } else if (err.error?.message) {
          message = err.error.message;
        }
        
        alert(`Error al editar: ${message}`);
      }
    });
  }

  remove(s: Subject) {
    if (confirm(`${MESSAGES.SUBJECT_DELETE_CONFIRM}\n\n"${s.name}"`)) {
      console.log('Eliminando materia:', s.name);
      
      this.api.remove(s.name).subscribe({
        next: () => {
          console.log('Materia eliminada exitosamente');
          this.snackBar.open(MESSAGES.SUBJECT_DELETED, 'Cerrar', {
            duration: 3000,
            horizontalPosition: 'center',
            verticalPosition: 'top'
          });
          this.reload();
        },
        error: (err) => {
          console.error('Error al eliminar:', err);
          
          let message = MESSAGES.ERROR_SAVING;
          
          if (err.status === 401) {
            message = MESSAGES.ERROR_UNAUTHORIZED;
          } else if (err.status === 404) {
            message = 'Materia no encontrada';
          } else if (err.status === 0) {
            message = MESSAGES.ERROR_NETWORK;
          } else if (err.status >= 500) {
            message = MESSAGES.ERROR_SERVER;
          } else if (err.error?.message) {
            message = err.error.message;
          }
          
          alert(`Error al eliminar: ${message}`);
        }
      });
    }
  }
}
