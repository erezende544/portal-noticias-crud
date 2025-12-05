import { API_BASE } from './utils.js';

const CURRENT_USER_ID = localStorage.getItem("LOGGED_USER_ID");
const JSON_GLOBAL = window.JSON;

async function loadFavorites() {
  const container = document.getElementById("favoritos-container");
  if (!container) return;

  if (!CURRENT_USER_ID) {
    container.innerHTML = `
      <div class="col-12">
        <div class="alert alert-warning text-center">
          <i class="bi bi-exclamation-triangle me-2"></i>
          Você precisa fazer login para ver seus favoritos.
          <a href="login.html" class="alert-link">Faça login aqui</a>
        </div>
      </div>
    `;
    return;
  }

  container.innerHTML = `
    <div class="col-12">
      <div class="text-center py-5">
        <div class="spinner-border text-primary mb-3" style="width: 3rem; height: 3rem;" role="status"></div>
        <h5>Carregando seus favoritos...</h5>
      </div>
    </div>
  `;

  try {
    const favUrl = `${API_BASE}favoritos?usuarioId=${CURRENT_USER_ID}`;
    const favResponse = await fetch(favUrl);

    if (!favResponse.ok) {
      throw new Error(`Erro ao buscar favoritos: ${favResponse.status}`);
    }

    const favorites = await favResponse.json();

    if (!favorites || favorites.length === 0) {
      container.innerHTML = `
        <div class="col-12">
          <div class="alert alert-info text-center">
            <i class="bi bi-info-circle me-2"></i>
            Você ainda não tem notícias favoritadas.
            <div class="mt-3">
              <a href="index.html" class="btn btn-primary">Ver notícias</a>
            </div>
          </div>
        </div>
      `;
      return;
    }

    const newsPromises = favorites.map(async fav => {
      try {
        const res = await fetch(`${API_BASE}noticias/${fav.noticiaId}`);
        return res.ok ? await res.json() : null;
      } catch {
        return null;
      }
    });

    const noticias = await Promise.all(newsPromises);
    const validas = noticias.filter(n => n !== null);

    if (validas.length === 0) {
      container.innerHTML = `
        <div class="col-12">
          <div class="alert alert-warning text-center">
            <i class="bi bi-exclamation-triangle me-2"></i>
            Não foi possível carregar suas notícias favoritadas.
            <div class="mt-3">
              <button onclick="loadFavorites()" class="btn btn-outline-warning">Tentar novamente</button>
            </div>
          </div>
        </div>
      `;
      return;
    }

    container.innerHTML = `
      <div class="row">
        ${validas
        .map(
          noticia => `
          <div class="col-md-4 mb-4">
            <div class="card h-100 shadow-sm border-0">
              <div class="position-relative">
                <img src="${noticia.imagem_pincipal || 'https://via.placeholder.com/400x300'}" 
                     class="card-img-top" 
                     style="height: 200px; object-fit: cover;">
                <span class="position-absolute top-0 end-0 m-2 badge bg-danger">
                  <i class="bi bi-heart-fill"></i> Favorito
                </span>
              </div>

              <div class="card-body d-flex flex-column">
                <h5 class="card-title text-truncate">${noticia.titulo}</h5>
                <p class="card-text flex-grow-1">${(noticia.descricao || '').substring(0, 100)}...</p>

                <div class="d-flex justify-content-between align-items-center mt-auto">
                  <small class="text-muted">
                    <i class="bi bi-calendar"></i> 
                    ${noticia.data ? noticia.data.split('-').reverse().join('/') : 'Sem data'}
                  </small>
                  <small class="badge bg-primary">${noticia.categoria}</small>
                </div>

                <div class="btn-group w-100 mt-3">
                  <a href="detalhes.html?id=${noticia.id}" class="btn btn-outline-primary flex-grow-1">
                    <i class="bi bi-eye"></i> Ler mais
                  </a>
                  <button class="btn btn-danger" onclick="removeFavorite('${noticia.id}')">
                    <i class="bi bi-trash"></i>
                  </button>
                </div>
              </div>
            </div>
          </div>
        `
        )
        .join("")}
      </div>
    `;
  } catch (error) {
    console.error("Erro ao carregar favoritos:", error);

    container.innerHTML = `
      <div class="col-12">
        <div class="alert alert-danger text-center">
          <i class="bi bi-exclamation-triangle me-2"></i>
          Erro ao carregar favoritos.
          <div class="mt-3">
            <button onclick="loadFavorites()" class="btn btn-outline-danger">Tentar novamente</button>
          </div>
        </div>
      </div>
    `;
  }
}

async function removeFavorite(noticiaId) {
  if (!confirm("Remover dos favoritos?")) return;

  try {
    const favRes = await fetch(`${API_BASE}favoritos?usuarioId=${CURRENT_USER_ID}&noticiaId=${noticiaId}`);
    const favList = await favRes.json();

    if (favList.length > 0) {
      await fetch(`${API_BASE}favoritos/${favList[0].id}`, { method: "DELETE" });
      loadFavorites();
    }
  } catch (error) {
    console.error("Erro ao remover favorito:", error);
    alert("Erro ao remover favorito.");
  }
}

window.removeFavorite = removeFavorite;
window.loadFavorites = loadFavorites;

document.addEventListener("DOMContentLoaded", loadFavorites);