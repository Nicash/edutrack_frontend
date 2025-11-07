import { Component, inject, signal, computed } from '@angular/core';
import { SubjectService, Subject } from '../../../core/services/subject.service';
import { FormsModule } from '@angular/forms';
import { NgFor, NgIf } from '@angular/common';

@Component({
  selector: 'app-subjects-list',
  standalone: true,
  imports: [NgFor, NgIf, FormsModule],
  template: `
  <section class="wrap">
    <header class="toolbar">
      <h1 class="title">📚 Mis Materias</h1>
      <div class="toolbar-actions">
        <div class="search-box">
          <span class="search-icon">🔍</span>
          <input [(ngModel)]="query" placeholder="Buscar materias..." class="search-input"/>
        </div>
        <button (click)="reload()" class="btn btn-secondary">
          <span class="icon">🔄</span> Actualizar
        </button>
      </div>
    </header>

    <div class="empty-state" *ngIf="filtered().length === 0 && query === ''">
      <div class="empty-icon">📖</div>
      <h3>No hay materias todavía</h3>
      <p>Comienza agregando tu primera materia abajo</p>
    </div>

    <div class="empty-state" *ngIf="filtered().length === 0 && query !== ''">
      <div class="empty-icon">🔎</div>
      <h3>No se encontraron resultados</h3>
      <p>Intenta con otro término de búsqueda</p>
    </div>

    <ul class="grid" *ngIf="filtered().length > 0">
      <li *ngFor="let s of filtered()" class="card">
        <div class="card-header">
          <h3 class="card-title">{{ s.name }}</h3>
        </div>
        <div class="card-content">
          <p class="objective"><strong>📋 Objetivo:</strong> {{ s.objective }}</p>
          <p class="content"><strong>📝 Contenido:</strong> {{ s.content }}</p>
        </div>
        <div class="card-actions">
          <button (click)="edit(s)" class="btn btn-edit">
            <span class="icon">✏️</span> Editar
          </button>
          <button (click)="remove(s)" class="btn btn-delete">
            <span class="icon">🗑️</span> Eliminar
          </button>
        </div>
      </li>
    </ul>

    <footer class="add-section">
      <h3 class="add-title">➕ Agregar Nueva Materia</h3>
      <div class="add-form">
        <input 
          [(ngModel)]="newName" 
          placeholder="Nombre de la materia *" 
          class="input-text"
        />
        <textarea
          [(ngModel)]="newObjective"
          placeholder="Objetivo *"
          class="input-textarea"
          rows="2"
        ></textarea>
        <textarea
          [(ngModel)]="newContent"
          placeholder="Contenido *"
          class="input-textarea"
          rows="3"
        ></textarea>
        <button (click)="add()" class="btn btn-primary btn-full">
          <span class="icon">➕</span> Agregar Materia
        </button>
      </div>
    </footer>
  </section>
  `,
  styles: [`
    * { box-sizing: border-box; }
    
    .wrap { 
      max-width: 1200px; 
      margin: 0 auto; 
      padding: 2rem;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
    }

    /* Header */
    .toolbar { 
      margin-bottom: 2rem;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      padding: 2rem;
      border-radius: 16px;
      box-shadow: 0 10px 30px rgba(102, 126, 234, 0.3);
    }

    .title { 
      color: white;
      margin: 0 0 1.5rem 0;
      font-size: 2rem;
      font-weight: 700;
      text-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }

    .toolbar-actions {
      display: flex;
      gap: 1rem;
      align-items: center;
      flex-wrap: wrap;
    }

    /* Search */
    .search-box {
      flex: 1;
      min-width: 300px;
      position: relative;
      display: flex;
      align-items: center;
    }

    .search-icon {
      position: absolute;
      left: 1rem;
      font-size: 1.2rem;
      pointer-events: none;
    }

    .search-input {
      width: 100%;
      padding: 0.875rem 1rem 0.875rem 3rem;
      border: none;
      border-radius: 12px;
      font-size: 1rem;
      background: white;
      box-shadow: 0 2px 8px rgba(0,0,0,0.1);
      transition: all 0.3s ease;
    }

    .search-input:focus {
      outline: none;
      box-shadow: 0 4px 12px rgba(0,0,0,0.15);
      transform: translateY(-1px);
    }

    /* Buttons */
    .btn {
      padding: 0.875rem 1.5rem;
      border: none;
      border-radius: 12px;
      font-size: 0.95rem;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.3s ease;
      display: inline-flex;
      align-items: center;
      gap: 0.5rem;
      white-space: nowrap;
    }

    .btn:hover {
      transform: translateY(-2px);
      box-shadow: 0 6px 16px rgba(0,0,0,0.2);
    }

    .btn:active {
      transform: translateY(0);
    }

    .btn-primary {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
    }

    .btn-secondary {
      background: white;
      color: #667eea;
    }

    .btn-edit {
      background: #f0f4ff;
      color: #4c6ef5;
      padding: 0.5rem 1rem;
      font-size: 0.875rem;
    }

    .btn-edit:hover {
      background: #4c6ef5;
      color: white;
    }

    .btn-delete {
      background: #fff0f0;
      color: #e03131;
      padding: 0.5rem 1rem;
      font-size: 0.875rem;
    }

    .btn-delete:hover {
      background: #e03131;
      color: white;
    }

    .icon {
      font-size: 1.1rem;
    }

    /* Empty State */
    .empty-state {
      text-align: center;
      padding: 4rem 2rem;
      color: #868e96;
    }

    .empty-icon {
      font-size: 4rem;
      margin-bottom: 1rem;
      opacity: 0.5;
    }

    .empty-state h3 {
      margin: 0 0 0.5rem 0;
      font-size: 1.5rem;
      color: #495057;
    }

    .empty-state p {
      margin: 0;
      font-size: 1rem;
    }

    /* Grid */
    .grid { 
      display: grid; 
      grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); 
      gap: 1.5rem; 
      padding: 0; 
      list-style: none;
      margin: 0 0 2rem 0;
    }

    .card { 
      background: white;
      border: 1px solid #e9ecef;
      border-radius: 16px;
      padding: 1.5rem;
      transition: all 0.3s ease;
      box-shadow: 0 2px 8px rgba(0,0,0,0.05);
    }

    .card:hover {
      transform: translateY(-4px);
      box-shadow: 0 8px 24px rgba(0,0,0,0.12);
      border-color: #667eea;
    }

    .card-header {
      margin-bottom: 1rem;
    }

    .card-title { 
      margin: 0 0 0.5rem 0;
      font-size: 1.25rem;
      color: #212529;
      font-weight: 600;
    }

    .card-content {
      margin: 1rem 0;
      color: #495057;
      font-size: 0.95rem;
      line-height: 1.6;
    }

    .card-content p {
      margin: 0.5rem 0;
      display: flex;
      gap: 0.5rem;
    }

    .card-content strong {
      color: #2d3748;
      white-space: nowrap;
    }

    .objective, .content {
      word-break: break-word;
    }

    .card-actions {
      display: flex;
      gap: 0.5rem;
      margin-top: 1rem;
    }

    /* Add Section */
    .add-section {
      background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
      padding: 2rem;
      border-radius: 16px;
      box-shadow: 0 4px 12px rgba(0,0,0,0.05);
    }

    .add-title {
      margin: 0 0 1.5rem 0;
      font-size: 1.5rem;
      color: #495057;
      font-weight: 700;
    }

    .add-form {
      display: flex;
      gap: 1rem;
      flex-wrap: wrap;
    }

    .input-text {
      flex: 1;
      min-width: 250px;
      padding: 0.875rem 1rem;
      border: 2px solid #dee2e6;
      border-radius: 12px;
      font-size: 1rem;
      transition: all 0.3s ease;
    }

    .input-text:focus {
      outline: none;
      border-color: #667eea;
      box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
    }

    .input-number {
      width: 150px;
      padding: 0.875rem 1rem;
      border: 2px solid #dee2e6;
      border-radius: 12px;
      font-size: 1rem;
      transition: all 0.3s ease;
    }

    .input-number:focus {
      outline: none;
      border-color: #667eea;
      box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
    }

    .input-textarea {
      width: 100%;
      padding: 0.875rem 1rem;
      border: 2px solid #dee2e6;
      border-radius: 12px;
      font-size: 1rem;
      font-family: inherit;
      resize: vertical;
      transition: all 0.3s ease;
    }

    .input-textarea:focus {
      outline: none;
      border-color: #667eea;
      box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
    }

    .btn-full {
      width: 100%;
    }

    /* Responsive */
    @media (max-width: 768px) {
      .wrap {
        padding: 1rem;
      }

      .toolbar {
        padding: 1.5rem;
      }

      .title {
        font-size: 1.5rem;
      }

      .toolbar-actions {
        flex-direction: column;
        width: 100%;
      }

      .search-box {
        width: 100%;
      }

      .grid {
        grid-template-columns: 1fr;
      }

      .add-form {
        flex-direction: column;
      }

      .input-text,
      .input-number {
        width: 100%;
      }
    }
  `]
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
