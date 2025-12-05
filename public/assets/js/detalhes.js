import { API_BASE } from "./utils.js";

async function carregarDetalhe() {
    const container = document.getElementById("detalhe");
    if (!container) return;

    // Pega o ID da URL
    const params = new URLSearchParams(window.location.search);
    const id = params.get("id");

    if (!id) {
        container.innerHTML = `
      <div class="alert alert-danger text-center">
        <i class="bi bi-x-circle"></i> Nenhuma notícia selecionada.
      </div>
    `;
        return;
    }

    // Loading
    container.innerHTML = `
    <div class="text-center py-5">
      <div class="spinner-border text-primary" role="status"></div>
      <p class="mt-3">Carregando notícia...</p>
    </div>
  `;

    try {
        const res = await fetch(`${API_BASE}noticias/${id}`);

        if (!res.ok) {
            container.innerHTML = `
        <div class="alert alert-danger text-center">
          Erro ao carregar notícia (HTTP ${res.status})
        </div>
      `;
            return;
        }

        const noticia = await res.json();

        // Renderização
        container.innerHTML = `
      <div class="card shadow-sm">
        <img src="${noticia.imagem_pincipal || 'https://via.placeholder.com/900x400'}"
             class="card-img-top"
             style="max-height: 400px; object-fit: cover;">

        <div class="card-body">
          <h1 class="mb-3">${noticia.titulo}</h1>

          <p class="text-muted">
            <i class="bi bi-calendar"></i>
            ${noticia.data?.split('-').reverse().join('/') || 'Sem data'}
            &nbsp; • &nbsp;
            <i class="bi bi-tag"></i>
            ${noticia.categoria}
          </p>

          <p class="lead">${noticia.descricao}</p>

          <hr class="my-4">

          <div class="conteudo-noticia">
            ${noticia.conteudo || "<em>Sem conteúdo completo disponível.</em>"}
          </div>
        </div>
      </div>
    `;

    } catch (erro) {
        container.innerHTML = `
      <div class="alert alert-danger text-center">
        <i class="bi bi-x-circle"></i>
        Erro inesperado ao carregar a notícia.
      </div>
    `;
        console.error(erro);
    }
}

document.addEventListener("DOMContentLoaded", carregarDetalhe);
