import { Injectable } from '@angular/core';

//Define el tipo de nota que maneja el servicio
export interface Note {
  id: string;
  userId: string;
  title: string;
  body: string;
  createdAt: string;
  updatedAt: string;
}

//@Injectable indica a Angular que este servicio puede ser inyectado en componentes u otros servicios
//providedIn: 'root' significa que se crea una sola instancia del servicio (disponible en toda la app)
@Injectable({ providedIn: 'root' })
export class NotesService {
  private key = 'edutrack_notes_v1'; //clave bajo la que guardamos el JSON en localStorage

  //Lee las notas del localStorage. Si no existen, devuelve un arreglo vacio
  private all(): Note[] { //Array de objetos note
    const raw = localStorage.getItem(this.key); //String con el JSON guardado
    return raw ? JSON.parse(raw) : []; //JSON.parse convierte un string en formato JSON a un objeto real
  }

  //Guarda el array de notas en formato JSON en el localStorage
  private save(notes: Note[]) { //Array de objetos note
    localStorage.setItem(this.key, JSON.stringify(notes));
    //Convierte el array Note[] en texto JSON, porque localStorage solo guarda strings
  }

  //Metodos publicos (Create, Read, Update, Delete) 
  //Devuelve todas las notas del usuario. Simplemente reenvia la llamada al metodo all()
  getAll(userId: string): Note[] {
    return this.all() //Llama al metodo all(), que devuelve TODAS las notas del localStorage
      .filter(n => n.userId === userId) //Filtra solo las notas que pertenecen al usuario indicado
      //n es cada elemento del array durante la iteracion.
      .sort((a, b) => b.updatedAt.localeCompare(a.updatedAt)); //Ordena las notas de mas recientes a mas antiguas
      //a y b son objetos Note
      //localeCompare compara cadenas de texto segun updatedAt
  }

  //Nota: all() es privado y devuelve todas las notas de todos los usuarios
  //getAll(userId) es público y devuelve solo las notas de un usuario

  //Busca una nota especifica por su id.
  getById(id: string): Note | undefined { //undefined si no encuentra la nota
    return this.all().find(n => n.id === id);
  }

  //Crea una nueva nota y la guarda en el localStorage
  //payload es un objeto que contiene los datos que el usuario puede proveer para crear la nota
  //Omite id, createdAt y updatedAt
  create(payload: Omit<Note, 'id' | 'createdAt' | 'updatedAt'>): Note {
    const now = new Date().toISOString(); //Genera la fecha y hora actual como string (createdAt y updateAt)
    const note: Note = {
        ...payload, //Copia userId, title, body
        id: this.id(), //Genera un ID unico
        createdAt: now, // Fecha de creación
        updatedAt: now }; // Fecha de ultima actualización
    const notes = this.all(); //Obtiene todas las notas existentes del localStorage
    notes.push(note); //Agrega la nueva nota al array de notas existente
    this.save(notes); //Guarda el array actualizado de notas en localStorage
    return note;
  }

  //Nota: El spread operator (...) expande un objeto o array en sus elementos individuales.
  //En objetos significa: copiar todas las propiedades del objeto en un nuevo objeto.

  //Actualiza una nota existente con los datos nuevos pasados por el patch
  //Omite id, userId y createdAt porque son inmutables
  //Partial<> significa que no es necesario enviar todos los campos, solo los que se quieran actualizar
  update(id: string, patch: Partial<Omit<Note, 'id' | 'userId' | 'createdAt'>>) {
    const notes = this.all();
    const i = notes.findIndex(n => n.id === id); //Busca el índice de la nota con el id dado
    //findIndex devuelve el indice del primer elemento que cumple la condición, -1 si no existe
    if (i === -1) throw new Error('Nota no encontrada');
    notes[i] = { 
        ...notes[i], //Copia todos los campos de la nota original
        ...patch, //Reemplaza los campos que se pasaron en patch
        updatedAt: new Date().toISOString()}; //Se actualiza a la fecha/hora actual
    this.save(notes);
    return notes[i];
  }

  //Borra una nota por su id
  delete(id: string) {
    const notes = this.all().filter(n => n.id !== id); //Crea un nuevo array que excluye la nota con ese id
    this.save(notes); //Guarda el nuevo array de notas en localStorage
  }

  private id() {
    return Math.random().toString(36).slice(2, 9); //Genera un ID unico simple para las notas nuevas
    //Math.random() devuelve un numero decimal aleatorio entre 0 y 1
    //.toString(36) convierte el numero a base 36 (usa 0-9 y a-z).
    //.slice(2, 9) toma los caracteres desde la posición 2 hasta la 9.
  }
}
