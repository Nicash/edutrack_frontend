# EduTrack – Frontend

![Angular](https://img.shields.io/badge/Angular-19-red?logo=angular)
![Node.js](https://img.shields.io/badge/Backend-Node.js-green?logo=node.js)
![MongoDB](https://img.shields.io/badge/Database-MongoDB-brightgreen?logo=mongodb)
![UTN FRVT](https://img.shields.io/badge/UTN-FRVT-blue)

Frontend del proyecto **EduTrack**, una plataforma colaborativa para estudiantes de **Ingeniería en Sistemas de Información** de la **UTN Facultad Regional Venado Tuerto**.

Este proyecto está desarrollado en **Angular**, siguiendo la base del repositorio **[characters-frontend](https://github.com/utnfrvtdsw/characters-frontend)** utilizado en la materia *Desarrollo de Software*.

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
git clone https://github.com/Nicash/edutrack-frontend.git
cd edutrack-frontend
```

### 2️⃣ Instalar dependencias
```bash
npm install
```

### 3️⃣ Configurar entorno
Editar `src/environments/environment.ts` con la URL del backend:
```ts
export const environment = {
  production: false,
  apiUrl: 'http://localhost:3000'
};
```

### 4️⃣ Ejecutar en modo desarrollo
```bash
ng serve -o
```
> Por defecto, se abrirá en [http://localhost:4200](http://localhost:4200)

---

## 🧱 Estructura del proyecto

```text
src/
 ├── app/
 │   ├── core/            # Servicios, guards, interceptores
 │   ├── features/        # Módulos principales (auth, subjects, etc.)
 │   ├── shared/          # Componentes compartidos
 │   └── app.routes.ts    # Definición de rutas
 ├── environments/
 └── assets/
```

---

## 🔐 Conexión con el backend

El frontend consume la API REST del proyecto [edutrack-backend](https://github.com/Nicash/edutrack), que incluye endpoints como:

| Método | Endpoint | Descripción |
|--------|-----------|-------------|
| `POST` | `/auth/login` | Iniciar sesión |
| `POST` | `/auth/register` | Crear usuario |
| `GET`  | `/subject/getAll` | Listar materias |
| `POST` | `/subject/add` | Agregar materia |
| `PUT`  | `/subject/update/:id` | Editar materia |
| `DELETE` | `/subject/delete` | Eliminar materia |

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

Proyecto académico sin licencia comercial.
