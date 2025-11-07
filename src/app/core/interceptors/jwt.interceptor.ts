import { HttpInterceptorFn } from '@angular/common/http';

export const jwtInterceptor: HttpInterceptorFn = (req, next) => {
  const token = localStorage.getItem('edutrack_token');
  console.log('🔑 Token en localStorage:', token ? 'Sí existe' : 'No existe');
  
  if (token) {
    const clonedReq = req.clone({ 
      setHeaders: { Authorization: `Bearer ${token}` } 
    });
    console.log('📤 Request con token:', clonedReq.url);
    return next(clonedReq);
  }
  
  console.log('📤 Request sin token:', req.url);
  return next(req);
};
