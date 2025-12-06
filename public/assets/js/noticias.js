import { API_BASE } from './utils.js';

const API_URL = API_BASE + "noticias";

// ========== buscar notícias ==========
async function buscarNoticias(termo) {
  try {
    const res = await fetch(`${API_URL}?q=${encodeURIComponent(termo)}`);
    if (!res.ok) throw new Error("Erro ao buscar notícias");
    return res.json();
  } catch {
    return [];
  }
}

// ========== render ==========
function renderResultados(lista) {
  const container = document.getElementById("listaNoticias");

  if (!container) return;

  if (lista.length === 0) {
    container.innerHTML = `
            <div class="empty-state">
                <h3>Nenhum resultado encontrado</h3>
            </div>`;
    return;
  }

  container.innerHTML = lista.map(n => `
        <div class="news-card fade-in">
            <img src="${n.imagem_pincipal || 'https://via.placeholder.com/300'}">
            <h3>${n.titulo}</h3>
            <p>${n.descricao}</p>

            <a class="btn-read" href="detalhes.html?id=${n.id}">Ler mais</a>
        </div>
    `).join("");
}

// ========== carregamento da página ==========
document.addEventListener("DOMContentLoaded", async () => {
  const params = new URLSearchParams(window.location.search);
  const termo = params.get("search");

  if (!termo) return;

  const resultados = await buscarNoticias(termo);
  renderResultados(resultados);
});