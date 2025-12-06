import { handleLogout } from './auth.js';

export function loadHeader() {
  const placeholder = document.getElementById("header-placeholder");
  if (!placeholder) return;

  const userName = localStorage.getItem("LOGGED_USER_NAME");
  const isAdmin = localStorage.getItem("LOGGED_USER_ADMIN") === "true";

  placeholder.innerHTML = `
    <nav class="navbar navbar-expand-lg navbar-dark bg-dark">
      <div class="container-fluid">
        <!-- Logo à esquerda -->
        <a class="navbar-brand" href="index.html">
          <i class="bi bi-newspaper me-2"></i>
          Portal de Notícias
        </a>

        <!-- Botão hamburger mobile -->
        <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarMain">
          <span class="navbar-toggler-icon"></span>
        </button>

        <!-- Conteúdo principal -->
        <div class="collapse navbar-collapse" id="navbarMain">
          <!-- Barra de pesquisa à esquerda (visível apenas desktop) -->
          <div class="navbar-search d-none d-lg-flex me-auto">
            <div class="input-group search-box">
              <input type="text" class="form-control" id="header-search" placeholder="Buscar notícias...">
              <button class="btn btn-outline-light" type="button" id="search-btn">
                <i class="bi bi-search"></i>
              </button>
            </div>
          </div>

          <!-- Menu central -->
          <ul class="navbar-nav mx-auto">
            <li class="nav-item">
              <a class="nav-link active" href="index.html">Home</a>
            </li>
            ${isAdmin ? `
              <li class="nav-item">
                <a class="nav-link" href="cadastro_noticias.html">Nova Notícia</a>
              </li>
            ` : ''}
            <li class="nav-item">
              <a class="nav-link" href="favoritos.html">Favoritos</a>
            </li>
            <li class="nav-item">
              <a class="nav-link" href="noticia.html">Todas Notícias</a>
            </li>
            <li class="nav-item">
              <a class="nav-link" href="calendar.html">Calendário</a>
            </li>
          </ul>

          <!-- Usuário à direita -->
          <div class="navbar-user">
            ${userName ? `
              <div class="dropdown">
                <button class="btn btn-outline-light dropdown-toggle d-flex align-items-center" type="button" 
                        data-bs-toggle="dropdown">
                  <i class="bi bi-person-circle me-2"></i>
                  ${userName.split(' ')[0]}
                </button>
                <ul class="dropdown-menu dropdown-menu-end">
                  <li><span class="dropdown-item-text"><strong>${userName}</strong></span></li>
                  <li><span class="dropdown-item-text text-muted">${localStorage.getItem("LOGGED_USER_EMAIL")}</span></li>
                  ${isAdmin ? '<li><span class="dropdown-item-text"><small class="badge bg-danger">Admin</small></span></li>' : ''}
                  <li><hr class="dropdown-divider"></li>
                  <li><a class="dropdown-item" href="meu-perfil.html"><i class="bi bi-person me-2"></i>Meu Perfil</a></li>
                  <li><button class="dropdown-item text-danger" id="logout-btn"><i class="bi bi-box-arrow-right me-2"></i>Sair</button></li>
                </ul>
              </div>
            ` : `
              <div class="d-flex gap-2">
                <a href="login.html" class="btn btn-outline-light">Login</a>
                <a href="registro.html" class="btn btn-primary">Registrar</a>
              </div>
            `}
          </div>

          <!-- Barra de pesquisa mobile (só ícone) -->
          <div class="d-lg-none mt-3">
            <div class="input-group">
              <input type="text" class="form-control" id="mobile-search" placeholder="Buscar...">
              <button class="btn btn-outline-primary" type="button" id="mobile-search-btn">
                <i class="bi bi-search"></i>
              </button>
            </div>
          </div>
        </div>
      </div>
    </nav>
  `;

  // Configurar eventos
  const searchBtn = document.getElementById('search-btn');
  const searchInput = document.getElementById('header-search');
  const mobileSearchBtn = document.getElementById('mobile-search-btn');
  const mobileSearchInput = document.getElementById('mobile-search');
  const logoutBtn = document.getElementById('logout-btn');

  function performSearch(term) {
    if (!term.trim()) return;

    // Já estamos na home?
    if (
      window.location.pathname.includes("index.html") ||
      window.location.pathname.endsWith("/") ||
      window.location.pathname === "/"
    ) {
      if (typeof window.performNewsSearch === "function") {
        window.performNewsSearch(term);
      }
    } else {
      window.location.href = `index.html?search=${encodeURIComponent(term)}`;
    }
  }



  // Desktop
  if (searchBtn && searchInput) {
    searchBtn.addEventListener('click', () => performSearch(searchInput.value));
    searchInput.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') performSearch(searchInput.value);
    });
  }

  // Mobile
  if (mobileSearchBtn && mobileSearchInput) {
    mobileSearchBtn.addEventListener('click', () => performSearch(mobileSearchInput.value));
    mobileSearchInput.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') performSearch(mobileSearchInput.value);
    });
  }

  if (logoutBtn) {
    logoutBtn.addEventListener('click', (e) => {
      e.preventDefault();
      handleLogout();
    });
  }
}

document.addEventListener('DOMContentLoaded', loadHeader);