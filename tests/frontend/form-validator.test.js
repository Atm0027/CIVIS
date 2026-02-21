import { describe, it, expect, beforeEach } from 'vitest';
import { FormValidator } from '../../public/js/form-validator.js';

// ===== HELPERS =====
const { _validators: v } = FormValidator;

/** Crea un formulario HTML mínimo con los campos dados */
function buildForm(fields) {
    document.body.innerHTML = '';
    const form = document.createElement('form');
    fields.forEach(({ id, value = '', type = 'text' }) => {
        const group = document.createElement('div');
        group.className = 'form-group';
        const input = document.createElement('input');
        input.id = id;
        input.type = type;
        input.value = value;
        const hint = document.createElement('span');
        hint.className = 'field-hint';
        group.appendChild(input);
        group.appendChild(hint);
        form.appendChild(group);
    });
    document.body.appendChild(form);
    return form;
}

// ===== TESTS DE VALIDADORES PUROS (sin DOM) =====
describe('FormValidator._validators — reglas puras', () => {

    // --- required ---
    describe('required', () => {
        it('devuelve error si el valor está vacío', () => {
            expect(v.required('')).toBeTruthy();
            expect(v.required('   ')).toBeTruthy();
        });
        it('devuelve null si el valor tiene contenido', () => {
            expect(v.required('hola')).toBeNull();
        });
    });

    // --- minLength ---
    describe('minLength', () => {
        it('devuelve error si el valor no está vacío y es menor que el mínimo', () => {
            expect(v.minLength('ab', {}, 3)).toBeTruthy();
        });
        it('devuelve null si cumple la longitud mínima', () => {
            expect(v.minLength('abc', {}, 3)).toBeNull();
            expect(v.minLength('abcd', {}, 3)).toBeNull();
        });
        it('devuelve null si el valor está vacío (required se encarga de eso)', () => {
            expect(v.minLength('', {}, 3)).toBeNull();
        });
    });

    // --- isEmail ---
    describe('isEmail', () => {
        it('devuelve error para emails mal formados', () => {
            expect(v.isEmail('noesun_email')).toBeTruthy();
            expect(v.isEmail('sin@dominio')).toBeTruthy();
            expect(v.isEmail('@sinlocal.com')).toBeTruthy();
        });
        it('devuelve null para emails válidos', () => {
            expect(v.isEmail('usuario@ejemplo.com')).toBeNull();
            expect(v.isEmail('u+tag@sub.dominio.es')).toBeNull();
        });
        it('devuelve null si el valor está vacío', () => {
            expect(v.isEmail('')).toBeNull();
        });
    });

    // --- pattern ---
    describe('pattern', () => {
        it('devuelve el mensaje de error si el patrón no coincide', () => {
            const result = v.pattern('abc123', {}, /^[0-9]{8}[A-Za-z]$/, 'DNI inválido');
            expect(result).toBe('DNI inválido');
        });
        it('devuelve null si el patrón coincide', () => {
            expect(v.pattern('12345678A', {}, /^[0-9]{8}[A-Za-z]$/, 'DNI inválido')).toBeNull();
        });
        it('devuelve null si el valor está vacío', () => {
            expect(v.pattern('', {}, /^[0-9]{8}[A-Za-z]$/, 'DNI inválido')).toBeNull();
        });
    });

    // --- matchField ---
    describe('matchField', () => {
        it('devuelve error si los valores no coinciden', () => {
            const result = v.matchField('abc', { password: 'xyz' }, 'password', 'No coinciden');
            expect(result).toBe('No coinciden');
        });
        it('devuelve null si los valores coinciden', () => {
            expect(v.matchField('secret', { password: 'secret' }, 'password', 'No coinciden')).toBeNull();
        });
        it('devuelve null si el campo de confirmación está vacío', () => {
            expect(v.matchField('', { password: 'secret' }, 'password', 'No coinciden')).toBeNull();
        });
    });
});

// ===== TESTS CON DOM (jsdom) =====
describe('FormValidator — integración con DOM', () => {

    beforeEach(() => {
        document.body.innerHTML = '';
    });

    // --- isValid ---
    describe('FormValidator.isValid()', () => {

        it('devuelve true cuando todos los campos obligatorios son válidos', () => {
            const form = buildForm([
                { id: 'username', value: 'juanito' },
                { id: 'email', value: 'juan@ejemplo.com' },
                { id: 'password', value: 'secret123' },
            ]);
            const rules = {
                username: { minLength: 3 },
                email: { isEmail: true },
                password: { minLength: 6 },
            };
            expect(FormValidator.isValid(form, rules)).toBe(true);
        });

        it('devuelve false cuando hay campos con errores', () => {
            const form = buildForm([
                { id: 'username', value: 'ab' },     // muy corto
                { id: 'email', value: 'malmail' }, // inválido
                { id: 'password', value: '123' },    // muy corta
            ]);
            const rules = {
                username: { minLength: 3 },
                email: { isEmail: true },
                password: { minLength: 6 },
            };
            expect(FormValidator.isValid(form, rules)).toBe(false);
        });

        it('añade la clase input-invalid a los campos con error', () => {
            const form = buildForm([{ id: 'username', value: 'ab' }]);
            FormValidator.isValid(form, { username: { minLength: 3 } });
            expect(form.querySelector('#username').classList.contains('input-invalid')).toBe(true);
        });

        it('añade la clase input-valid a los campos correctos', () => {
            const form = buildForm([{ id: 'username', value: 'juanito' }]);
            FormValidator.isValid(form, { username: { minLength: 3 } });
            expect(form.querySelector('#username').classList.contains('input-valid')).toBe(true);
        });

        it('campos opcionales vacíos no causan error', () => {
            const form = buildForm([
                { id: 'username', value: 'juanito' },
                { id: 'dni', value: '' },        // opcional y vacío
            ]);
            const rules = {
                username: { minLength: 3 },
                dni: { pattern: /^[0-9]{8}[A-Za-z]$/, patternMsg: 'DNI inválido', optional: true },
            };
            expect(FormValidator.isValid(form, rules)).toBe(true);
        });

        it('campos opcionales con valor incorrecto sí causan error', () => {
            const form = buildForm([
                { id: 'username', value: 'juanito' },
                { id: 'dni', value: 'INVALIDO' }, // opcional pero mal formado
            ]);
            const rules = {
                username: { minLength: 3 },
                dni: { pattern: /^[0-9]{8}[A-Za-z]$/, patternMsg: 'DNI inválido', optional: true },
            };
            expect(FormValidator.isValid(form, rules)).toBe(false);
        });
    });

    // --- init() + eventos ---
    describe('FormValidator.init() — eventos blur e input', () => {

        it('el campo queda en estado neutro antes de ser tocado', () => {
            const form = buildForm([{ id: 'username', value: '' }]);
            FormValidator.init(form, { username: { minLength: 3 } });
            const input = form.querySelector('#username');
            expect(input.classList.contains('input-invalid')).toBe(false);
            expect(input.classList.contains('input-valid')).toBe(false);
        });

        it('tras blur con valor inválido añade input-invalid', () => {
            const form = buildForm([{ id: 'username', value: 'ab' }]);
            FormValidator.init(form, { username: { minLength: 3 } });
            const input = form.querySelector('#username');
            input.dispatchEvent(new Event('blur'));
            expect(input.classList.contains('input-invalid')).toBe(true);
        });

        it('tras blur con valor válido añade input-valid', () => {
            const form = buildForm([{ id: 'username', value: 'juan' }]);
            FormValidator.init(form, { username: { minLength: 3 } });
            const input = form.querySelector('#username');
            input.dispatchEvent(new Event('blur'));
            expect(input.classList.contains('input-valid')).toBe(true);
        });

        it('el hint muestra el mensaje de error correspondiente', () => {
            const form = buildForm([{ id: 'username', value: 'ab' }]);
            FormValidator.init(form, { username: { minLength: 3 } });
            const input = form.querySelector('#username');
            input.dispatchEvent(new Event('blur'));
            const hint = form.querySelector('.field-hint');
            expect(hint.textContent).toContain('3');
            expect(hint.classList.contains('hint-error')).toBe(true);
        });

        it('verifica coincidencia de contraseñas', () => {
            const form = buildForm([
                { id: 'password', value: 'secret123', type: 'password' },
                { id: 'confirm-password', value: 'otrapass', type: 'password' },
            ]);
            const rules = {
                password: { minLength: 6 },
                'confirm-password': { matchField: 'password', matchMsg: 'Las contraseñas no coinciden' },
            };
            FormValidator.init(form, rules);
            const confirmInput = form.querySelector('#confirm-password');
            confirmInput.dispatchEvent(new Event('blur'));
            expect(confirmInput.classList.contains('input-invalid')).toBe(true);
        });
    });
});
