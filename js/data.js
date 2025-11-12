// ===== BASE DE DATOS SIMULADA (Mock Data) =====

const mockDB = {
    // Perfil de usuario inicial
    user: {
        name: "Juan Pérez",
        email: "juan.perez@email.com",
        avatarUrl: "https://placehold.co/100x100/E0E7FF/4F46E5?text=JP",
        relevantData: "Estudiante de primer año de universidad en Madrid."
    },

    // Contenido de la videoteca
    videos: [
        {
            id: 1,
            title: "Cómo solicitar la Beca MEC 2025-2026",
            description: "Guía paso a paso para estudiantes universitarios y no universitarios. No te dejes ningún documento.",
            thumbnail: "https://placehold.co/600x400/D1FAE5/10B981?text=Beca+MEC",
            tags: ["estudiantes", "becas", "universidad", "ayudas"]
        },
        {
            id: 2,
            title: "Renovar el DNI: Cita previa y documentación",
            description: "Qué necesitas para renovar tu Documento Nacional de Identidad. Tasas, fotos y plazos.",
            thumbnail: "https://placehold.co/600x400/E0E7FF/4F46E5?text=Renovar+DNI",
            tags: ["dni", "identificación", "cita previa", "general"]
        },
        {
            id: 3,
            title: "Guía para Empadronarse por primera vez",
            description: "El certificado de empadronamiento es clave para muchos trámites. Te explicamos cómo obtenerlo.",
            thumbnail: "https://placehold.co/600x400/FEF3C7/F59E0B?text=Empadronarse",
            tags: ["padrón", "vivienda", "ayuntamiento", "general"]
        },
        {
            id: 4,
            title: "Obtener el Certificado Digital (FNMT)",
            description: "La llave maestra para toda la burocracia online. Te guiamos en el proceso de solicitud e instalación.",
            thumbnail: "https://placehold.co/600x400/F3E8FF/A855F7?text=Certificado+Digital",
            tags: ["digital", "certificado", "fnmt", "general"]
        },
        {
            id: 5,
            title: "Declaración de la RENTA para principiantes",
            description: "¿Tu primera declaración? Te explicamos los conceptos básicos, borradores y cómo presentarla.",
            thumbnail: "https://placehold.co/600x400/FEE2E2/EF4444?text=RENTA",
            tags: ["impuestos", "renta", "hacienda", "autónomos"]
        },
        {
            id: 6,
            title: "Solicitar el NIE: Guía para extranjeros",
            description: "Todo lo que necesitas saber para obtener tu Número de Identificación de Extranjero en España.",
            thumbnail: "https://placehold.co/600x400/DBEAFE/3B82F6?text=NIE",
            tags: ["extranjeros", "nie", "inmigración", "identificación"]
        }
    ],

    // Plazos del calendario
    calendar: [
        { date: "2025-11-20", title: "Fin Plazo Matrícula Universidad" },
        { date: "2025-12-01", title: "Inicio Solicitud Beca MEC" },
        { date: "2025-12-15", title: "Último día pago impuestos (Autónomos)" },
        { date: "2026-01-31", title: "Fin Plazo Presentación Modelo 347" },
        { date: "2026-02-15", title: "Renovación DNI (vencimientos Q1)" },
        { date: "2026-03-31", title: "Declaración Trimestral IVA" }
    ],

    // Preguntas Frecuentes
    faqs: [
        {
            q: "¿Qué es el 'empadronamiento' y por qué lo necesito?",
            a: "El Padrón municipal es el registro que acredita tu residencia y domicilio habitual en un municipio. Lo necesitas para trámites como renovar el DNI, matricular un coche, acceder a ayudas sociales o inscribir a tus hijos en el colegio."
        },
        {
            q: "¿Qué diferencia hay entre el Certificado Digital y el sistema Cl@ve?",
            a: "Ambos son sistemas de identificación digital. El Certificado Digital es un archivo que instalas en tu navegador (más potente, pero más complejo). Cl@ve es un sistema más sencillo, a menudo basado en un PIN temporal que recibes en tu móvil, ideal para trámites comunes."
        },
        {
            q: "¿Qué es el 'NIE' y quién lo necesita?",
            a: "El NIE (Número de Identificación de Extranjero) es el número de identificación para personas no españolas. Es esencial para cualquier trámite legal o económico en España, como abrir una cuenta bancaria, firmar un contrato de trabajo o comprar una propiedad."
        },
        {
            q: "¿Cómo puedo saber si tengo que hacer la declaración de la RENTA?",
            a: "En general, debes hacer la declaración si has ganado más de 22.000€ anuales de un pagador, o más de 15.000€ si tienes más de un pagador. También si eres autónomo o has tenido ganancias patrimoniales. La Agencia Tributaria te enviará un borrador si estás obligado."
        },
        {
            q: "¿Cuánto tarda en renovarse el DNI?",
            a: "Una vez que acudes a tu cita en la Policía Nacional con toda la documentación, el DNI suele estar listo en aproximadamente 7-10 días hábiles. Te lo enviarán a tu domicilio o podrás recogerlo en la comisaría, según elijas."
        }
    ]
};

// Exportar para uso en otros módulos (si se usa con módulos ES6)
// export default mockDB;
