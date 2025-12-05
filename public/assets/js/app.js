import { API_BASE } from './utils.js';

const API_URL = API_BASE + "noticias";
const CURRENT_USER_ID = localStorage.getItem("LOGGED_USER_ID");

// ===== CORRIGE JSON GLOBAL =====
const GLOBAL_JSON = window.JSON;

// ===== UTILS =====
function formatarData(dataString) {
  if (!dataString) return '';
  try {
    const [ano, mes, dia] = dataString.split('-');
    return `${dia}/${mes}/${ano}`;
  } catch {
    return dataString;
  }
}

function isAdmin() {
  return localStorage.getItem("LOGGED_USER_ADMIN") === "true";
}

// ===== FAVORITOS =====
async function isFavorite(noticiaId) {
  if (!CURRENT_USER_ID) return false;

  try {
    const url = `${API_BASE}favoritos?usuarioId=${CURRENT_USER_ID}&noticiaId=${noticiaId}`;
    const res = await fetch(url);
    if (!res.ok) return false;
    const data = await res.json();
    return data.length > 0;
  } catch {
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
    const favUrl = `${API_BASE}favoritos?usuarioId=${CURRENT_USER_ID}&noticiaId=${noticiaId}`;
    const res = await fetch(favUrl);
    const existing = await res.json();

    if (existing.length > 0) {
      await fetch(`${API_BASE}favoritos/${existing[0].id}`, { method: "DELETE" });
      alert("Removido dos favoritos!");
    } else {
      await fetch(`${API_BASE}favoritos`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: GLOBAL_JSON.stringify({
          usuarioId: Number(CURRENT_USER_ID),
          noticiaId: Number(noticiaId),
          data: new Date().toISOString().split("T")[0]
        })
      });
      alert("Adicionado aos favoritos!");
    }

    if (window.location.pathname.includes("index.html")) {
      carregarHome();
    }

  } catch {
    alert("Erro ao atualizar favorito.");
  }
}

// ===== EXCLUIR =====
async function excluirNoticia(id) {
  if (!isAdmin()) {
    alert("Acesso restrito para administradores.");
    return;
  }
  if (!confirm("Tem certeza que deseja excluir esta notícia?")) return;

  try {
    await fetch(`${API_URL}/${id}`, { method: "DELETE" });
    alert("Notícia excluída!");
    if (window.location.pathname.includes("index.html")) carregarHome();
  } catch {
    alert("Erro ao excluir notícia.");
  }
}

// ===== RENDER =====
async function renderNews(newsList) {
  const container = document.getElementById("listaNoticias");
  if (!container) return;

  if (!newsList || newsList.length === 0) {
    container.innerHTML = `
      <div class="empty-state">
        <i class="bi bi-newspaper"></i>
        <h3>Nenhuma notícia</h3>
      </div>`;
    return;
  }

  const favs = await Promise.all(newsList.map(n => isFavorite(n.id)));

  container.innerHTML = `
    <div class="news-grid">
      ${newsList.map((noticia, i) => `
        <div class="news-card fade-in">
          <div class="news-image-wrapper">
            <img src="${noticia.imagem_pincipal || 'https://via.placeholder.com/400'}" loading="lazy">
          </div>

          <div class="news-content">
            <h3>${noticia.titulo}</h3>
            <p>${noticia.descricao}</p>

            <div class="news-meta">
              <span>${noticia.categoria}</span>
              <span>${formatarData(noticia.data)}</span>
            </div>

            <div class="news-actions">
              <a href="detalhes.html?id=${noticia.id}" class="btn-read">Ler mais</a>

              <button onclick="toggleFavorite('${noticia.id}')" 
                class="btn-icon btn-fav ${favs[i] ? "active" : ""}">
                <i class="bi ${favs[i] ? "bi-heart-fill" : "bi-heart"}"></i>
              </button>
            </div>
          </div>
        </div>
      `).join("")}
    </div>
  `;
}

function renderCarousel(destaques) {
  const container = document.getElementById('destaques');
  if (!container || destaques.length === 0) return;

  const inner = destaques.map((item, i) => `
    <div class="carousel-item ${i === 0 ? "active" : ""}">
      <img src="${item.imagem_pincipal}" class="carousel-image">
      <div class="carousel-caption">
        <h5>${item.titulo}</h5>
        <p>${item.descricao}</p>
        <a href="detalhes.html?id=${item.id}" class="btn btn-primary btn-lg">Ler mais</a>
      </div>
    </div>
  `).join("");

  container.innerHTML = `
    <div class="carousel-fullwidth">
      <div id="carouselDestaques" class="carousel slide carousel-fade" data-bs-ride="carousel">
        <div class="carousel-inner">${inner}</div>
      </div>
    </div>
  `;
}

// ===== HOME =====
async function carregarHome() {
  const list = document.getElementById("listaNoticias");
  if (!list) return;

  list.innerHTML = `
    <div class="loading">
      <div class="spinner"></div>
      <p>Carregando notícias...</p>
    </div>`;

  try {
    const res = await fetch(API_URL);
    const noticias = await res.json();

    renderCarousel(noticias.filter(n => n.destaque));
    await renderNews(noticias);
  } catch {
    list.innerHTML = `<h3>Erro ao carregar notícias</h3>`;
  }
}

window.performNewsSearch = async function (term) {
  const res = await fetch(API_URL);
  const noticias = await res.json();

  const filtradas = noticias.filter(n =>
    n.titulo.toLowerCase().includes(term.toLowerCase()) ||
    n.descricao.toLowerCase().includes(term.toLowerCase())
  );

  renderNews(filtradas);
};

// ===== GLOBAL =====
window.toggleFavorite = toggleFavorite;
window.excluirNoticia = excluirNoticia;

document.addEventListener("DOMContentLoaded", () => {
  if (
    window.location.pathname.includes("index.html") ||
    window.location.pathname === "/" ||
    window.location.pathname.endsWith("/")
  ) {
    carregarHome();
  }
});
