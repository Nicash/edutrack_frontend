import { Component } from '@angular/core';
import { NgFor, NgClass } from '@angular/common';

@Component({
  selector: 'app-calendar',
  standalone: true,
  imports: [NgFor, NgClass],
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.css']
})
export class CalendarComponent {
  d = new Date();
  months = ['Ene','Feb','Mar','Abr','May','Jun','Jul','Ago','Sep','Oct','Nov','Dic'];
  
  // Eventos: feriados (holiday) y mesas de exámenes (exam)
  events: { [key: string]: 'exam' | 'holiday' } = {
    '2025-1-1': 'holiday',    // Año Nuevo
    '2025-2-10': 'holiday',   // Carnaval
    '2025-2-11': 'holiday',   // Carnaval
    '2025-3-24': 'holiday',   // Día de la Memoria
    '2025-4-2': 'holiday',    // Día del Veterano
    '2025-5-1': 'holiday',    // Día del Trabajador
    '2025-5-25': 'holiday',   // Revolución de Mayo
    '2025-6-17': 'holiday',   // Guemes
    '2025-6-20': 'holiday',   // Solsticio (feriado no laborable)
    '2025-7-9': 'holiday',    // Independencia
    '2025-8-17': 'holiday',   // San Martín
    '2025-10-12': 'holiday',  // Diversidad Cultural
    '2025-11-17': 'holiday',  // Soberanía Nacional
    '2025-12-8': 'holiday',   // Inmaculada Concepción
    '2025-12-25': 'holiday',  // Navidad
    // Mesas de exámenes (ejemplos)
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

  get m() { return this.d.getMonth(); }
  set m(v: number) { this.d.setMonth(v); }

  get days() {
    const y = this.d.getFullYear(), m = this.d.getMonth();
    const first = new Date(y, m, 1).getDay();
    const last = new Date(y, m + 1, 0).getDate();
    const out: (number | string)[] = [];
    for (let i = 0; i < first; i++) out.push('');
    for (let i = 1; i <= last; i++) out.push(i);
    while (out.length % 7) out.push('');
    return out;
  }

  getEventClass(day: number | string): string {
    if (typeof day !== 'number') return '';
    const dateKey = `${this.d.getFullYear()}-${this.d.getMonth() + 1}-${day}`;
    return this.events[dateKey] || '';
  }
}
