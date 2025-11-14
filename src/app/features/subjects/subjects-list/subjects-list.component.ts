import { Component, inject, signal, computed } from '@angular/core';
import { SubjectService, Subject } from '../../../core/services/subject.service';
import { FormsModule } from '@angular/forms';
import { NgFor, NgIf } from '@angular/common';
import { CalendarComponent } from '../../../shared/components/calendar/calendar.component';

@Component({
  selector: 'app-subjects-list',
  standalone: true,
  imports: [NgFor, NgIf, FormsModule, CalendarComponent],
  templateUrl: './subjects-list.component.html',
  styleUrls: ['./subjects-list.component.css']
})
export class SubjectsListComponent {
  private api = inject(SubjectService);
  all = signal<Subject[]>([]);

  query = '';

  newName = '';
  newObjective = '';
  newContent = '';

  filtered = computed(() => {
    const k = this.query.toLowerCase();
    return this.all().filter(s => s.name.toLowerCase().includes(k));
  });

  constructor() {
    this.reload();
  }

  reload() {
    this.api.list().subscribe({
      next: (v) => {
        console.log('Materias cargadas:', v);
        this.all.set(v);
      },
      error: (err) => {
        console.error('Error al cargar materias:', err);
        alert('Error al cargar materias. Verificá la consola (F12)');
      }
    });
  }

  add() {
    if (!this.newName.trim()) {
      alert('El nombre de la materia no puede estar vacío');
      return;
    }
    if (!this.newObjective.trim()) {
      alert('El objetivo no puede estar vacío');
      return;
    }
    if (!this.newContent.trim()) {
      alert('El contenido no puede estar vacío');
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
    
    this.api.add(newSubject)
      .subscribe({
        next: (subject) => {
          console.log('✅ Materia agregada exitosamente:', subject);
          alert('¡Materia agregada exitosamente!');
          this.newName = '';
          this.newObjective = '';
          this.newContent = '';
          this.reload();
        },
        error: (err) => {
          console.error('❌ Error completo:', err);
          console.error('Error status:', err.status);
          console.error('Error body:', err.error);
          
          let message = 'Error desconocido';
          if (err.status === 400) {
            message = err.error?.error || 'La materia ya existe o faltan campos';
          } else if (err.status === 401) {
            message = 'No autorizado - Iniciá sesión nuevamente';
          }
          
          alert(`No se pudo agregar la materia: ${message}`);
        }
      });
  }

  edit(s: Subject) {
    const name = prompt('Nuevo nombre', s.name);
    if (!name) return;
    console.log('Editando materia:', s._id, name);
    this.api.update(s._id!, { ...s, name }).subscribe({
      next: () => {
        console.log('Materia editada exitosamente');
        alert('¡Materia editada!');
        this.reload();
      },
      error: (err) => {
        console.error('Error al editar:', err);
        alert(`Error al editar: ${err.error?.message || err.message}`);
      }
    });
  }

  remove(s: Subject) {
    if (confirm(`¿Eliminar ${s.name}?`)) {
      console.log('Eliminando materia:', s.name);
      this.api.remove(s.name).subscribe({
        next: () => {
          console.log('Materia eliminada exitosamente');
          alert('¡Materia eliminada!');
          this.reload();
        },
        error: (err) => {
          console.error('Error al eliminar:', err);
          alert(`Error al eliminar: ${err.error?.message || err.message}`);
        }
      });
    }
  }
}
