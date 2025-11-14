// ===================================
// CONSTANTES DE MENSAJES
// ===================================
/**
 * Archivo centralizado de mensajes para la aplicación
 * Facilita el mantenimiento y una posible traducción futura
 */

export const MESSAGES = {
  // Mensajes de autenticación
  LOGIN_SUCCESS: '¡Bienvenido a EduTrack - UTN FRVT!',
  LOGIN_ERROR: 'Usuario o contraseña incorrectos',
  LOGOUT_CONFIRM: '¿Estás seguro que querés cerrar sesión?',
  LOGOUT_SUCCESS: '¡Sesión cerrada exitosamente!',
  REGISTER_SUCCESS: '¡Cuenta creada exitosamente! Iniciá sesión',
  REGISTER_ERROR: 'Error al crear la cuenta',
  
  // Mensajes de materias
  SUBJECT_ADDED: '¡Materia agregada exitosamente!',
  SUBJECT_UPDATED: '¡Materia actualizada exitosamente!',
  SUBJECT_DELETED: '¡Materia eliminada exitosamente!',
  SUBJECT_DELETE_CONFIRM: '¿Eliminar esta materia?',
  SUBJECT_EXISTS: 'Ya existe una materia con ese nombre',
  
  // Mensajes de validación
  REQUIRED_FIELDS: 'Por favor completá todos los campos requeridos',
  INVALID_EMAIL: 'Por favor ingresá un email válido',
  INVALID_PASSWORD: 'La contraseña debe tener al menos 6 caracteres',
  
  // Mensajes de error genéricos
  ERROR_LOADING: 'Error al cargar los datos',
  ERROR_SAVING: 'Error al guardar los datos',
  ERROR_NETWORK: 'Error de conexión. Verificá tu conexión a internet',
  ERROR_UNAUTHORIZED: 'Sesión expirada. Por favor iniciá sesión nuevamente',
  ERROR_SERVER: 'Error en el servidor. Intentá nuevamente más tarde',
  
  // Mensajes de estado
  LOADING: 'Cargando...',
  NO_DATA: 'No hay datos para mostrar',
  NO_RESULTS: 'No se encontraron resultados'
};
