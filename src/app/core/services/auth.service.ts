import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

export interface User {
  _id: string;
  email: string;
  name: string;
}

export interface LoginResponse {
  message: string;
  data: {
    token: string;
    user: User;
  };
}

export interface RegisterResponse {
  message: string;
  user: User;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private http = inject(HttpClient);
  private base = environment.apiUrl;

  login(email: string, password: string) {
    return this.http.post<LoginResponse>(`${this.base}/auth/login`, { email, password });
  }
  
  register(name: string, email: string, password: string) {
    return this.http.post<RegisterResponse>(`${this.base}/auth/register`, { name, email, password });
  }
  
  isLoggedIn() { 
    return !!localStorage.getItem('edutrack_token'); 
  }
  
  saveToken(t: string) { 
    localStorage.setItem('edutrack_token', t); 
  }
  
  getToken() {
    return localStorage.getItem('edutrack_token');
  }
  
  logout() { 
    localStorage.removeItem('edutrack_token'); 
  }
}
