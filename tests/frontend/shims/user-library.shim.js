/**
 * Shim: hace que el archivo browser de user-library.js sea importable por Vitest.
 * El archivo original no tiene `export` para no romper los scripts clásicos del navegador.
 */

// Ejecutar el archivo en contexto de jsdom (provee window)
import '../../../public/js/user-library.js';

// Re-exportar el global que el archivo inyecta en window
export const UserLibrary = globalThis.UserLibrary ?? globalThis.window?.UserLibrary;
