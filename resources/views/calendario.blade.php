<!DOCTYPE html>
<html lang="es">

<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Civis · Calendario</title>
  <link rel="stylesheet" href="{{ asset('css/styles.css') }}">
</head>

<body>

  <!-- LAYOUT PRINCIPAL -->
  <div class="layout-wrapper">

    <!-- SIDEBAR IZQUIERDO -->
    <aside class="sidebar">

      <!-- Logo -->
      <div class="sidebar-logo">
        <h1 onclick="window.location.href='{{ route('index') }}'">Civis</h1>
      </div>

      <!-- Perfil de Usuario -->
      <div class="user-card">
        <div class="user-avatar"></div>
        <p class="user-name" id="user-name">Usuario</p>
        <p class="user-email" id="user-email">usuario@civis.com</p>
        <button class="btn-edit-profile" id="btn-edit-profile" onclick="window.location.href='{{ route('usuario') }}'">
          Ver perfil
        </button>
      </div>

      <!-- Plazos Cercanos -->
      <div class="deadlines-section">
        <h3 class="deadlines-title">Plazos cercanos</h3>
        <ul class="deadlines-list" id="deadlines-list">
          <!-- Los plazos se cargarán aquí desde la API -->
        </ul>
      </div>

    </aside>

    <!-- CONTENIDO PRINCIPAL -->
    <main class="main-wrapper">

      <!-- NAVBAR SUPERIOR -->
      <header class="navbar">
        <div class="navbar-container">

          <!-- Buscador -->
          <div class="search-box">
            <input type="text" id="search-input" class="search-input" placeholder="Buscar trámites...">
            <button class="search-btn" aria-label="Buscar">🔍</button>
          </div>

          <!-- Navegación -->
          <nav class="nav-links">
            <a href="{{ route('index') }}" class="nav-link">Inicio</a>
            <a href="{{ route('calendario') }}" class="nav-link active">Calendario</a>
            <a href="{{ route('preguntasFrecuentes') }}" class="nav-link">Preguntas Frecuentes</a>
          </nav>

        </div>
      </header>

      <!-- CONTENIDO -->
      <div class="content-area">

        <header class="view-header">
          <h2 class="view-title">Calendario de Trámites</h2>
        </header>

        <!-- Área del calendario -->
        <div class="calendar-container">
          <div class="calendar-wrapper">
            <!-- El calendario se cargará aquí desde la API o mediante JavaScript -->
            <p class="placeholder-text">El calendario de trámites y plazos se mostrará aquí.</p>
          </div>
        </div>

      </div>

    </main>

  </div>

  <!-- SCRIPTS -->
  <script src="{{ asset('js/config.js') }}"></script>
  <script src="{{ asset('js/api.js') }}"></script>
  <script src="{{ asset('js/auth.js') }}"></script>
  <script src="{{ asset('js/app.js') }}"></script>

</body>

</html>