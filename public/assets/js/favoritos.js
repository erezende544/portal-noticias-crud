import { JSON } from './utils.js';

const CURRENT_USER_ID = localStorage.getItem("LOGGED_USER_ID");

async function loadFavorites() {
    const container = document.getElementById("favoritos-container");

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

    try {
        // Busca favoritos do usuário
        const favResponse = await fetch(`${JSON}favoritos?usuarioId=${CURRENT_USER_ID}`);
        if (!favResponse.ok) throw new Error("Erro ao buscar favoritos");
        const favorites = await favResponse.json();

        if (favorites.length === 0) {
            container.innerHTML = `
        <div class="col-12">
          <div class="alert alert-info text-center">
            <i class="bi bi-info-circle me-2"></i>
            Você ainda não tem notícias favoritadas.
            <a href="index.html" class="alert-link">Veja as notícias</a>
          </div>
        </div>
      `;
            return;
        }

        // Busca detalhes das notícias favoritadas
        const newsPromises = favorites.map(fav =>
            fetch(`${JSON}noticias/${fav.noticiaId}`).then(res => res.json())
        );
        const noticias = await Promise.all(newsPromises);

        // Renderiza as notícias
        container.innerHTML = noticias.map(noticia => `
      <div class="col-md-4 mb-4">
        <div class="card h-100 shadow-sm">
          <img src="${noticia.imagem_pincipal}" class="card-img-top" alt="${noticia.titulo}">
          <div class="card-body d-flex flex-column">
            <h5 class="card-title">${noticia.titulo}</h5>
            <p class="card-text">${noticia.descricao}</p>
            <div class="mt-auto btn-group">
              <a href="detalhes.html?id=${noticia.id}" class="btn btn-outline-primary">Ler mais</a>
              <button class="btn btn-danger btn-sm" onclick="removeFavorite('${noticia.id}')">
                <i class="bi bi-heart-fill"></i> Remover
              </button>
            </div>
          </div>
        </div>
      </div>
    `).join('');

    } catch (error) {
        console.error("Erro ao carregar favoritos:", error);
        container.innerHTML = `
      <div class="col-12">
        <div class="alert alert-danger text-center">
          <i class="bi bi-exclamation-triangle me-2"></i>
          Erro ao carregar favoritos.
        </div>
      </div>
    `;
    }
}

async function removeFavorite(noticiaId) {
    if (!confirm("Remover dos favoritos?")) return;

    try {
        const favResponse = await fetch(`${JSON}favoritos?usuarioId=${CURRENT_USER_ID}&noticiaId=${noticiaId}`);
        const favorites = await favResponse.json();

        if (favorites.length > 0) {
            await fetch(`${JSON}favoritos/${favorites[0].id}`, {
                method: 'DELETE'
            });
            alert("Removido dos favoritos!");
            loadFavorites(); // Recarrega a lista
        }
    } catch (error) {
        console.error("Erro ao remover favorito:", error);
        alert("Erro ao remover favorito.");
    }
}

// Exporta a função para o onclick
window.removeFavorite = removeFavorite;

document.addEventListener('DOMContentLoaded', loadFavorites);