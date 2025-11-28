import { Component, inject, OnInit, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NotesService, Note } from '../../../core/services/notes.service';
import { AuthService } from '../../../core/services/auth.service';

//Decorador del componente
@Component({
  selector: 'app-notes', //Nombre de la etiqueta HTML para usar el componente
  standalone: true, //El componente no necesita estar en un modulo
  imports: [CommonModule, FormsModule], //Importa los modulos necesarios directamente
  templateUrl: './notes.component.html', //Archivo HTML
  styleUrls: ['./notes.component.css'] //Archivos CSS
})

export class NotesComponent implements OnInit {
  //Se inyectan los servicios usando inject().
  private notesService = inject(NotesService);
  private auth = inject(AuthService);

  @Output() close = new EventEmitter<void>(); //@Output() permite que el componente hijo envie un evento al padre
  //Crea un evento llamado close

  closePanel() {
    this.close.emit(); //Cuando se ejecuta este metodo, el hijo dispara el evento close
  }

  notes: Note[] = []; //Array donde se almacenan las notas a mostrar
  newNote = ''; //Valores enlazados con inputs para crear/editar una nota
  newTitle = '';
  editingId: string | null = null; //Si es null estamos creando; si tiene id estamos editando esa nota
  userId = ''; //id del usuario actual; se carga en ngOnInit

  //ngOnInit() se ejecuta cuando Angular inicializa el componente
  ngOnInit(): void {
    const user = this.auth.getUser(); //Llama al metodo getUser() del servicio de autenticación (auth)
    //Se espera que getUser() retorne la informacion del usuario actualmente logueado
    this.userId = user?._id ?? 'anon'; //Si user existe, toma user._id, si no existe devuelve undefined sin tirar error
    this.load(); //Carga las notas
  }

  //Carga datos que necesita el componente (notas)
  load() {
    this.notes = this.notesService.getAll(this.userId);
  }

  //Guarda y/o actualiza notas
  save() {
    //this.newNote es la propiedad del componente donde el usuario escribe la nota
    const body = this.newNote?.trim(); //.trim() elimina espacios al inicio y al final (?. evita errores si newNote es null o undefined)
    const title = this.newTitle || 'Nota'; //Construye el titulo de la nota
    //si no hay titulo, toma 'Nota' como titulo
    if (!body) return; //Si la nota esta vacia (body false), no hace nada. Evita crear notas vacias
    if (this.editingId) { //Si editingId existe estamos editando una nota existente
      this.notesService.update(this.editingId, { title, body }); //Llama al metodo update del servicio de notas para modificar la nota
      this.editingId = null; //Luego resetea editingId a null para salir del modo edicion
    } else {
      this.notesService.create({ userId: this.userId, title, body }); //Si editingId no existe estamos creando una nota nueva
    }
    this.newNote = ''; //Limpia los campos de entrada del formulario despues de guardar.
    this.newTitle = '';
    this.load(); //Vuelve a cargar la lista de notas para reflejar la nota nueva o modificada en la interfaz.
  }

  //Elimina una nota por su id
  remove(id: string) {
    this.notesService.delete(id);
    this.load();
  }

  //Prepara el formulario para editar una nota existente
  open(n: Note) { //n es un objeto Note que representa la nota que se quiere editar
    this.editingId = n.id; //Guarda el ID de la nota que se va a editar
    this.newTitle = n.title; //Copia el titulo de la nota al campo de entrada newTitle del formulario
    this.newNote = n.body; //Copia el cuerpo de la nota al campo de texto newNote del formulario
  }
}
