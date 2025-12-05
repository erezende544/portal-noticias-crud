import { JSON } from "./utils.js";

const API_URL = JSON + "noticias";
const CURRENT_USER_ID = localStorage.getItem("LOGGED_USER_ID");

// ===== FUNÇÕES UTILITÁRIAS =====
function formatarData(dataString) {
  if (!dataString) return '';
  try {
    const [ano, mes, dia] = dataString.split('-');
    return `${dia}/${mes}/${ano}`;
  } catch (error) {
    return dataString;
  }
}

function isAdmin() {
  return localStorage.getItem("LOGGED_USER_ADMIN") === "true";
}

// ===== FUNÇÕES DE FAVORITOS =====
async function isFavorite(noticiaId) {
  if (!CURRENT_USER_ID) return false;

  try {
    const response = await fetch(`${JSON}favoritos?usuarioId=${CURRENT_USER_ID}&noticiaId=${noticiaId}`);
    if (!response.ok) return false;
    const favorites = await response.json();
    return favorites.length > 0;
  } catch (error) {
    return false;
  }
}

async function toggleFavorite(noticiaId) {
  if (!CURRENT_USER_ID) {
    alert("Você precisa fazer login para favoritar notícias.");
    window.location.href = "login.html";
    return;
  }

  try {
    const isFav = await isFavorite(noticiaId);

    if (isFav) {
      const response = await fetch(`${JSON}favoritos?usuarioId=${CURRENT_USER_ID}&noticiaId=${noticiaId}`);
      const favorites = await response.json();
      if (favorites.length > 0) {
        await fetch(`${JSON}favoritos/${favorites[0].id}`, { method: 'DELETE' });
        alert("Removido dos favoritos!");
      }
    } else {
      await fetch(`${JSON}favoritos`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          usuarioId: CURRENT_USER_ID,
          noticiaId: noticiaId,
          data: new Date().toISOString().split('T')[0]
        })
      });
      alert("Adicionado aos favoritos!");
    }

    carregarHome();
  } catch (error) {
    alert("Erro ao atualizar favorito.");
  }
}

// ===== FUNÇÃO PRINCIPAL =====
async function carregarHome() {
  const containerDestaques = document.getElementById('destaques');
  const containerNoticias = document.getElementById('listaNoticias');

  try {
    // Mostrar loading
    containerNoticias.innerHTML = `
      <div class="loading">
        <div class="spinner"></div>
        <p>Carregando notícias...</p>
      </div>
    `;

    const res = await fetch(API_URL);
    const noticias = await res.json();

    // ===== CARROSSEL FULL-WIDTH =====
    const destaques = noticias.filter(n => n.destaque);
    if (destaques.length > 0) {
      let carouselInner = '';
      destaques.forEach((item, index) => {
        carouselInner += `
      <div class="carousel-item ${index === 0 ? 'active' : ''}">
        <img src="${item.imagem_pincipal || 'https://via.placeholder.com/1200x500/0d6efd/ffffff?text=Destaque'}" 
             class="carousel-image d-block w-100" 
             alt="${item.titulo}">
        <div class="carousel-caption">
          <h5 class="animate__animated animate__fadeInDown">${item.titulo}</h5>
          <p class="animate__animated animate__fadeInUp animate__delay-1s">${item.descricao}</p>
          <a href="detalhes.html?id=${item.id}" 
             class="btn btn-primary btn-lg animate__animated animate__bounceIn animate__delay-2s">
            Ler mais
          </a>
        </div>
      </div>
    `;
      });

      containerDestaques.innerHTML = `
    <div class="carousel-fullwidth">
      <div id="carouselDestaques" class="carousel slide carousel-fade" data-bs-ride="carousel" data-bs-interval="5000">
        <div class="carousel-inner">${carouselInner}</div>
        <button class="carousel-control-prev" type="button" data-bs-target="#carouselDestaques" data-bs-slide="prev">
          <span class="carousel-control-prev-icon"></span>
          <span class="visually-hidden">Anterior</span>
        </button>
        <button class="carousel-control-next" type="button" data-bs-target="#carouselDestaques" data-bs-slide="next">
          <span class="carousel-control-next-icon"></span>
          <span class="visually-hidden">Próximo</span>
        </button>
      </div>
    </div>
  `;
    }

    // ===== GRID DE NOTÍCIAS (3 por linha) =====
    await renderNews(noticias);

  } catch (error) {
    console.error("Erro:", error);
    containerNoticias.innerHTML = `
      <div class="empty-state">
        <i class="bi bi-exclamation-triangle"></i>
        <h3>Erro ao carregar</h3>
        <p>Não foi possível carregar as notícias.</p>
      </div>
    `;
  }
}

async function renderNews(newsList) {
  const containerNoticias = document.getElementById('listaNoticias');

  if (!newsList || newsList.length === 0) {
    containerNoticias.innerHTML = `
      <div class="empty-state">
        <i class="bi bi-newspaper"></i>
        <h3>Nenhuma notícia</h3>
        <p>Não há notícias para exibir.</p>
      </div>
    `;
    return;
  }

  // Verificar favoritos
  const favoritesPromises = newsList.map(noticia => isFavorite(noticia.id));
  const favoritesStatus = await Promise.all(favoritesPromises);

  containerNoticias.innerHTML = `
    <div class="news-grid">
      ${newsList.map((noticia, index) => `
        <div class="news-card fade-in">
          <div class="news-image-wrapper">
            <img src="${noticia.imagem_pincipal || 'https://via.placeholder.com/400x300/6c757d/ffffff?text=Notícia'}" 
                 alt="${noticia.titulo}">
          </div>
          <div class="news-content">
            <h3 class="news-title">${noticia.titulo || 'Sem título'}</h3>
            <p class="news-description">${noticia.descricao || 'Sem descrição'}</p>
            
            <div class="news-meta">
              <span class="news-category">${noticia.categoria || 'Geral'}</span>
              <span class="news-date">${formatarData(noticia.data)}</span>
            </div>
            
            <div class="news-actions">
              <a href="detalhes.html?id=${noticia.id}" class="btn-read">Ler mais</a>
              
              <button onclick="toggleFavorite('${noticia.id}')" class="btn-icon btn-fav ${favoritesStatus[index] ? 'active' : ''}">
                <i class="bi ${favoritesStatus[index] ? 'bi-heart-fill' : 'bi-heart'}"></i>
              </button>
              
              ${isAdmin() ? `
                <a href="cadastro_noticias.html?id=${noticia.id}" class="btn-icon btn-edit">
                  <i class="bi bi-pencil"></i>
                </a>
                <button onclick="excluirNoticia('${noticia.id}')" class="btn-icon btn-delete">
                  <i class="bi bi-trash"></i>
                </button>
              ` : ''}
            </div>
          </div>
        </div>
      `).join('')}
    </div>
  `;
}

// ===== FUNÇÃO DE EXCLUSÃO =====
async function excluirNoticia(id) {
  if (!isAdmin()) {
    alert("Acesso restrito para administradores.");
    return;
  }

  if (!confirm("Tem certeza que deseja excluir esta notícia?")) return;

  try {
    await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
    alert("Notícia excluída com sucesso!");
    carregarHome();
  } catch (error) {
    alert("Erro ao excluir notícia.");
  }
}

// ===== EXPORTAR =====
window.toggleFavorite = toggleFavorite;
window.excluirNoticia = excluirNoticia;

// ===== INICIALIZAR =====
document.addEventListener('DOMContentLoaded', carregarHome);