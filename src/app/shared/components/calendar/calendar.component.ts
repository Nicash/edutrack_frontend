import { Component } from '@angular/core';
import { NgFor } from '@angular/common';

@Component({
  selector: 'app-calendar',
  standalone: true,
  imports: [NgFor],
  template: `
    <div class="mini-cal">
      <div class="hdr">
        <button (click)="m = m - 1">‹</button>
        <div class="title">{{ months[d.getMonth()] }} {{ d.getFullYear() }}</div>
        <button (click)="m = m + 1">›</button>
      </div>
      <div class="grid">
        <div class="w" *ngFor="let w of ['D','L','M','X','J','V','S']">{{w}}</div>
        <div *ngFor="let n of days" class="cell">{{ n }}</div>
      </div>
    </div>
  `,
  styles: [`
    .mini-cal{width:320px;font-family:inherit}
    .hdr{display:flex;justify-content:space-between;align-items:center;margin-bottom:6px}
    .title{font-weight:600}
    .grid{display:grid;grid-template-columns:repeat(7,1fr);gap:6px}
    .w{font-size:11px;text-align:center;color:#666}
    .cell{height:32px;display:flex;align-items:center;justify-content:center;border-radius:6px}
    button{background:#fff;border:1px solid #e6e6e6;padding:4px 8px;border-radius:6px}
  `]
})
export class CalendarComponent {
  d = new Date();
  months = ['Ene','Feb','Mar','Abr','May','Jun','Jul','Ago','Sep','Oct','Nov','Dic'];

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
}
