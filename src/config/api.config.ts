/**
 * Configuración central de la API.
 *
 * EL BACKEND SPRING BOOT AÚN NO ESTÁ DISPONIBLE PARA REVISIÓN, así que los valores
 * de abajo son los que el propio enunciado del proyecto definió como referencia
 * (POST /api/auth/login con { email, password } -> { token, rol }, PUT /api/movimientos/{id}, etc).
 * En cuanto tengas el backend real a la vista, ajusta SOLO este archivo:
 *
 * 1) API_BASE_URL
 *    - Emulador Android (Android Studio): usa 10.0.2.2 en vez de localhost.
 *      Ej: http://10.0.2.2:8080/api
 *    - Dispositivo físico (Expo Go): usa la IP local de tu PC en la red WiFi
 *      (comando `ipconfig`, busca "Dirección IPv4"). El teléfono y el PC deben
 *      estar en la misma red. Ej: http://192.168.1.100:8080/api
 *    - iOS Simulator (solo Mac): localhost funciona normalmente.
 *
 * 2) ENDPOINTS
 *    - Cambia cada ruta para que coincida EXACTAMENTE con los @RequestMapping /
 *      @GetMapping / @PostMapping reales del backend Spring Boot.
 *
 * 3) Si el backend no expone un endpoint de saldo separado (ENDPOINTS.saldo),
 *    indícamelo: se puede adaptar userService para leerlo de otra respuesta
 *    (por ejemplo dentro de /usuarios/me) sin tocar el resto de la app.
 */

// TODO: reemplazar por la IP local del backend cuando esté disponible.
export const API_BASE_URL = 'http://192.168.1.100:8080/api';

export const ENDPOINTS = {
  login: '/auth/login',
  currentUser: '/usuarios/me',
  balance: '/cuentas/saldo',
  movements: '/movimientos',
  movementById: (id: number | string) => `/movimientos/${id}`,
};

export const REQUEST_TIMEOUT_MS = 10000;
