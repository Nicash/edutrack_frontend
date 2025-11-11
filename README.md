# EduTrack – Frontend

![Angular](https://img.shields.io/badge/Angular-Standalone-blue?logo=angular)
![Node.js](https://img.shields.io/badge/Backend-Node.js-green?logo=node.js)
![MongoDB](https://img.shields.io/badge/Database-MongoDB-brightgreen?logo=mongodb)
![UTN FRVT](https://img.shields.io/badge/UTN-FRVT-blue)

Frontend del proyecto **EduTrack**, una interfaz web para gestionar materias y actividades académicas (desarrollada para la UTN - Facultad Regional Venado Tuerto).

El frontend está construido con **Angular (standalone components)** y se integra con el backend disponible en el repositorio `Nicash/edutrack`.

---

## 📚 Descripción

EduTrack permite a los estudiantes:
- Registrarse e iniciar sesión.  
- Gestionar sus materias (agregar, editar o eliminar).  
- Consultar fechas de parciales y entregas.   
- Recibir notificaciones académicas.

El sistema se comunica con el backend disponible en [Nicash/edutrack](https://github.com/Nicash/edutrack).

---

## 🧩 Tecnologías utilizadas

- **Angular 19** (standalone components, routing, signals)
- **Node.js + Express** (API backend)
- **MongoDB + Mongoose** (base de datos)
- **JWT Auth** (autenticación)
- **Docker Compose** (para el entorno completo)
- **TypeScript**

---

## ⚙️ Instalación y ejecución

### 1️⃣ Clonar el repositorio
```bash
git clone https://github.com/Nicash/edutrack_frontend.git
cd edutrack_frontend
```

### 2️⃣ Instalar dependencias
```bash
npm install
```

### 3️⃣ Configurar entorno
Editar `src/environments/environment.ts` con la URL del backend (por defecto el backend corre en el puerto 3001):
```ts
export const environment = {
  production: false,
  apiUrl: 'http://localhost:3001'
};
```

### 4️⃣ Ejecutar en modo desarrollo
En PowerShell (Windows):
```powershell
npm install
npm run start
# o bien
ng serve -o
```
> Por defecto se abrirá en http://localhost:4200

Notas:
- El backend de desarrollo corre normalmente en `http://localhost:3001`.
- El token JWT se guarda en localStorage con la clave `edutrack_token`. El interceptor HTTP añade `Authorization: Bearer <token>` a las peticiones protegidas.
- El logo utilizado por la app está en `public/logo.png`.

---

## 🧱 Estructura del proyecto (resumen)

```text
src/
 ├── app/
 │   ├── core/            # Servicios, guards, interceptores
 │   ├── features/        # Componentes/funcionalidades (auth, subjects, etc.)
 │   └── app.routes.ts    # Definición de rutas
 ├── environments/
 └── public/              # archivos públicos (logo, favicon)
```

---

## 🔐 Conexión con el backend

El frontend consume la API REST del proyecto [edutrack-backend](https://github.com/Nicash/edutrack). Endpoints principales:

| Método | Endpoint | Descripción |
|--------|-----------|-------------|
| `POST` | `/auth/login` | Iniciar sesión (respuesta: { message, data: { token, user } }) |
| `POST` | `/auth/register` | Crear usuario |
| `GET`  | `/subject/getAll` | Listar materias |
| `POST` | `/subject/add` | Agregar materia (body: { name, objective, content }) |
| `PUT`  | `/subject/update/:id` | Editar materia |
| `DELETE` | `/subject/delete` | Eliminar materia (params: name) |

Detalles importantes:
- El frontend espera que el token JWT llegue en `res.data.token` tras el login y lo guarda en `localStorage` con la clave `edutrack_token`.
- Rutas protegidas usan `authGuard`; las páginas públicas (login/register) usan `publicGuard` para evitar re-login si ya estás autenticado.

---

## 🧑‍💻 Autores

**Nicolás Chaves** – [@Nicash](https://github.com/Nicash)  
**Marcos Gómez** – [@marcos04774](https://github.com/marcos04774)  

Proyecto académico desarrollado en el marco de las asignaturas:
- **Desarrollo de Software**
- **Seminario Integrador**
  
**UTN – Facultad Regional Venado Tuerto**

---

## 📄 Licencia

Proyecto académico (sin licencia comercial especificada).
