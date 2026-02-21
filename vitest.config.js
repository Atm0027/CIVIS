import { defineConfig } from 'vitest/config';

export default defineConfig({
    test: {
        // Usar jsdom para simular el navegador en los tests
        environment: 'jsdom',

        // Carpetas donde buscar los tests
        include: ['tests/frontend/**/*.test.js'],

        // Habilitar globals para no tener que importar describe/it/expect en cada test
        globals: true,
    },
});
