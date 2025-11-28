import { Component } from '@angular/core';
import { NgFor, NgClass } from '@angular/common';

@Component({
  selector: 'app-calendar', //Etiqueta html para usar el componente
  standalone: true, //El componente no necesita estar en un modulo
  imports: [NgFor, NgClass], //Importa los modulos necesarios directamente
  templateUrl: './calendar.component.html', //Archivo HTML
  styleUrls: ['./calendar.component.css'] //Archivos CSS
})

export class CalendarComponent {

  currentDay = new Date(); //Fecha actual

  months = [
  'Enero',
  'Febrero',
  'Marzo',
  'Abril',
  'Mayo',
  'Junio',
  'Julio',
  'Agosto',
  'Septiembre',
  'Octubre',
  'Noviembre',
  'Diciembre']; //Meses del año en un array
  
  //Eventos: feriados y mesas de examenes
  events: { [key: string]: 'exam' | 'holiday' } = {

    //Feriados
    '2025-1-1': 'holiday',  
    '2025-2-10': 'holiday',  
    '2025-2-11': 'holiday',
    '2025-3-24': 'holiday',  
    '2025-4-2': 'holiday', 
    '2025-5-1': 'holiday',  
    '2025-5-25': 'holiday',  
    '2025-6-17': 'holiday',  
    '2025-6-20': 'holiday',   
    '2025-7-9': 'holiday',    
    '2025-8-17': 'holiday',   
    '2025-10-12': 'holiday',  
    '2025-11-17': 'holiday',  
    '2025-12-8': 'holiday',   
    '2025-12-25': 'holiday',  
    
    //Mesas de examenes
    '2025-11-18': 'exam',
    '2025-11-19': 'exam',
    '2025-11-20': 'exam',
    '2025-11-28': 'exam',
    '2025-12-1': 'exam',
    '2025-12-2': 'exam',
    '2025-12-3': 'exam',
    '2025-12-4': 'exam',
    '2025-12-5': 'exam',
    '2025-12-15': 'exam',
    '2025-12-16': 'exam',
    '2025-12-17': 'exam',
    '2025-12-18': 'exam',
    '2025-12-19': 'exam',
  };

  get m() { return this.currentDay.getMonth(); } //Permite leer el mes actual

  set m(v: number) { this.currentDay.setMonth(v); } //Permite cambiar el mes

  //days() genera los dias visibles en el calendario
  get days() {

    const y = this.currentDay.getFullYear(); //Año
    const m = this.currentDay.getMonth(); //Mes
    const first = new Date(y, m, 1).getDay(); //Dia de la semana que empieza el mes
    const last = new Date(y, m + 1, 0).getDate(); //Calcula cuantos dias tiene el mes
    const out: (number | string)[] = []; //Array para el calendario
    for (let i = 0; i < first; i++) out.push(''); //Celdas vacias antes del primer dia del mes
    for (let i = 1; i <= last; i++) out.push(i); //Celdas con los dias del mes
    while (out.length % 7) out.push(''); //Completa las filas en multiplos de 7 (semanas)
    return out; //Retorna el array calendario
  }

  //Determina la clase CSS para cada dia
  getEventClass(day: number | string): string { 

    if (typeof day !== 'number') return ''; //Ignora las celdas vacias
    const dateKey = `${this.currentDay.getFullYear()}-${this.currentDay.getMonth() + 1}-${day}`; //Clave del evento
    return this.events[dateKey] || ''; //Busca en el diccionario de eventos
    //si existe retorna la clase CSS, sino devuelve una cadena vacia
  }
}
