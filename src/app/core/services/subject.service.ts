import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

export interface Subject { 
  _id?: string; 
  name: string; 
  objective: string;
  content: string;
  createdAt?: string;
  updatedAt?: string;
}

@Injectable({ providedIn: 'root' })
export class SubjectService {
  private http = inject(HttpClient);
  private base = environment.apiUrl;

  list() { return this.http.get<Subject[]>(`${this.base}/subject/getAll`); }
  getByName(name: string) { return this.http.get<Subject>(`${this.base}/subject/get`, { params: { name } }); }
  add(s: Subject) { return this.http.post<Subject>(`${this.base}/subject/add`, s); }
  update(id: string, s: Subject) { return this.http.put<Subject>(`${this.base}/subject/update/${id}`, s); }
  remove(name: string) { return this.http.delete(`${this.base}/subject/delete`, { params: { name } }); }
}
