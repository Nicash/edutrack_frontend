export const environment = {
  production: false,
  apiUrl: (window as any)["env"]?.apiUrl || 'http://localhost:3001' // URL del backend
};
