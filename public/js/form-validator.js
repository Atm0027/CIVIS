// ===== VALIDADOR DE FORMULARIOS EN TIEMPO REAL - CIVIS =====
// Módulo que añade feedback visual instantáneo mientras el usuario escribe.
// Uso: FormValidator.init(formElement, rules)
//      FormValidator.isValid(formElement) → boolean

const FormValidator = (() => {

    // -----------------------------------------------------------------------
    // REGLAS DE VALIDACIÓN PURAS
    // Cada regla recibe (value, allValues) y devuelve null (ok) o string (error)
    // -----------------------------------------------------------------------
    const validators = {
        required: (value) =>
            value.trim().length === 0 ? 'Este campo es obligatorio' : null,

        minLength: (value, _all, min) =>
            value.trim().length > 0 && value.trim().length < min
                ? `Mínimo ${min} caracteres`
                : null,

        isEmail: (value) =>
            value.trim().length > 0 && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim())
                ? 'Introduce un email válido'
                : null,

        pattern: (value, _all, regex, msg) =>
            value.trim().length > 0 && !regex.test(value.trim())
                ? msg
                : null,

        matchField: (value, allValues, fieldId, msg) =>
            value.trim().length > 0 && value !== allValues[fieldId]
                ? (msg || 'Los campos no coinciden')
                : null,
    };

    // -----------------------------------------------------------------------
    // HELPERS DOM
    // -----------------------------------------------------------------------

    /**
     * Escapa un ID para usarlo en querySelector (reemplaza CSS.escape que no existe en jsdom).
     * @param {string} id
     * @returns {string}
     */
    function _escapeId(id) {
        return id.replace(/([^a-zA-Z0-9_-])/g, '\\$1');
    }
    /**
     * Busca o crea el <span class="field-hint"> inmediatamente después del input.
     * @param {HTMLInputElement} input
     * @returns {HTMLElement|null}
     */
    function _getHint(input) {
        // Buscamos el span de hint por el atributo data-hint-for o por proximidad
        const parent = input.closest('.form-group');
        if (!parent) return null;
        return parent.querySelector('.field-hint');
    }

    /**
     * Actualiza el estado visual de un campo (borde + mensaje de hint).
     * @param {HTMLInputElement} input
     * @param {string|null} errorMsg - null = válido, string = mensaje de error
     * @param {boolean} touched - si el campo ha sido modificado alguna vez
     */
    function _setFieldState(input, errorMsg, touched) {
        const hint = _getHint(input);

        if (!touched) {
            // El campo no ha sido tocado: estado neutro
            input.classList.remove('input-valid', 'input-invalid');
            if (hint) { hint.textContent = ''; hint.className = 'field-hint'; }
            return;
        }

        if (errorMsg) {
            input.classList.remove('input-valid');
            input.classList.add('input-invalid');
            if (hint) {
                hint.textContent = errorMsg;
                hint.className = 'field-hint hint-error';
            }
        } else {
            input.classList.remove('input-invalid');
            input.classList.add('input-valid');
            if (hint) {
                hint.textContent = '✓';
                hint.className = 'field-hint hint-success';
            }
        }
    }

    /**
     * Recoge los valores actuales de todos los inputs del formulario.
     * @param {HTMLFormElement} form
     * @returns {Object} - { [inputId]: value }
     */
    function _getFormValues(form) {
        const values = {};
        form.querySelectorAll('input, select, textarea').forEach(input => {
            if (input.id) values[input.id] = input.value;
        });
        return values;
    }

    // -----------------------------------------------------------------------
    // LÓGICA DE VALIDACIÓN DE UN CAMPO
    // -----------------------------------------------------------------------

    /**
     * Evalúa las reglas de un campo y devuelve el primer mensaje de error, o null.
     * @param {HTMLInputElement} input
     * @param {Object} rules - Reglas del campo
     * @param {Object} allValues - Valores actuales de todos los campos del form
     * @returns {string|null}
     */
    function _validateField(input, rules, allValues) {
        const value = input.value;

        // Si el campo es opcional y está vacío, no hay error
        if (rules.optional && value.trim().length === 0) return null;

        // required implícito si hay otras reglas y no es opcional
        if (rules.required !== false && !rules.optional) {
            const err = validators.required(value);
            if (err) return err;
        }

        if (rules.minLength) {
            const err = validators.minLength(value, allValues, rules.minLength);
            if (err) return err;
        }

        if (rules.isEmail) {
            const err = validators.isEmail(value);
            if (err) return err;
        }

        if (rules.pattern) {
            const err = validators.pattern(value, allValues, rules.pattern, rules.patternMsg || 'Formato incorrecto');
            if (err) return err;
        }

        if (rules.matchField) {
            const err = validators.matchField(value, allValues, rules.matchField, rules.matchMsg);
            if (err) return err;
        }

        return null;
    }

    // -----------------------------------------------------------------------
    // API PÚBLICA
    // -----------------------------------------------------------------------

    /**
     * Inicializa la validación en tiempo real en un formulario.
     * @param {HTMLFormElement} form
     * @param {Object} rulesMap - { [fieldId]: { minLength, isEmail, pattern, ... } }
     */
    function init(form, rulesMap) {
        if (!form) return;

        // Mapa de "campos tocados" para no mostrar error en campo virgen
        const touched = {};

        Object.keys(rulesMap).forEach(fieldId => {
            const input = form.querySelector(`#${_escapeId(fieldId)}`);
            if (!input) return;

            const rules = rulesMap[fieldId];

            // Validar en blur (primera interacción completa)
            input.addEventListener('blur', () => {
                touched[fieldId] = true;
                const allValues = _getFormValues(form);
                const error = _validateField(input, rules, allValues);
                _setFieldState(input, error, true);

                // Si este campo es objetivo de un matchField, re-validar el campo confirmación
                _revalidateDependents(form, rulesMap, fieldId, touched);
            });

            // Validar en input (sólo si ya fue tocado)
            input.addEventListener('input', () => {
                if (!touched[fieldId]) return;
                const allValues = _getFormValues(form);
                const error = _validateField(input, rules, allValues);
                _setFieldState(input, error, true);

                // Re-validar dependientes
                _revalidateDependents(form, rulesMap, fieldId, touched);
            });
        });
    }

    /**
     * Re-valida campos que dependen del campo que acaba de cambiar (e.g. confirm-password).
     */
    function _revalidateDependents(form, rulesMap, changedFieldId, touched) {
        Object.keys(rulesMap).forEach(fId => {
            if (rulesMap[fId].matchField === changedFieldId && touched[fId]) {
                const depInput = form.querySelector(`#${_escapeId(fId)}`);
                if (!depInput) return;
                const allValues = _getFormValues(form);
                const error = _validateField(depInput, rulesMap[fId], allValues);
                _setFieldState(depInput, error, true);
            }
        });
    }

    /**
     * Ejecuta todas las validaciones y marca todos los campos como tocados.
     * Útil para el evento submit.
     * @param {HTMLFormElement} form
     * @param {Object} rulesMap
     * @returns {boolean} - true si el formulario es válido
     */
    function isValid(form, rulesMap) {
        if (!form || !rulesMap) return true;

        let valid = true;
        const allValues = _getFormValues(form);

        Object.keys(rulesMap).forEach(fieldId => {
            const input = form.querySelector(`#${_escapeId(fieldId)}`);

            if (!input) return;

            const error = _validateField(input, rulesMap[fieldId], allValues);
            _setFieldState(input, error, true); // siempre marcar como tocado
            if (error) valid = false;
        });

        return valid;
    }

    /**
     * Expone los validadores puros para testing sin DOM.
     */
    const _validators = validators;

    return { init, isValid, _validators };
})();

// Exponer como global para scripts clásicos del browser
if (typeof window !== 'undefined') {
    window.FormValidator = FormValidator;
}

// Exportar para tests (ESM - Vitest)
export { FormValidator };
