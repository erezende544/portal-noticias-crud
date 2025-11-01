/**
 * ==================================================
 * PORTAL DE NOTÍCIAS - APP.JS
 * Arquivo corrigido - Grid funcionando perfeitamente
 * ==================================================
 */

// URL base da API - conexão com JSON Server
const API_URL = "http://localhost:3030/noticias";

/**
 * CARREGA HEADER EM TODAS AS PÁGINAS
 */
async function loadHeader() {
  try {
    const response = await fetch('header.html');
    const headerHTML = await response.text();
    document.getElementById('header-placeholder').innerHTML = headerHTML;
  } catch (error) {
    console.error('Erro ao carregar header:', error);
  }
}

/**
 * CARREGA PÁGINA HOME
 */
async function carregarHome() {
  const containerDestaques = document.getElementById('destaques');
  const containerNoticias = document.getElementById('listaNoticias');

  try {
    const res = await fetch(API_URL);

    if (!res.ok) {
      throw new Error(`Erro na API: ${res.status}`);
    }

    const noticias = await res.json();

    // FILTRA NOTÍCIAS EM DESTAQUE para o carrossel
    const destaques = noticias.filter(n => n.destaque);

    // CONSTRÓI HTML DO CARROSSEL
    let carouselInner = '';
    destaques.forEach((item, index) => {
      carouselInner += `
        <div class="carousel-item ${index === 0 ? 'active' : ''}">
          <img src="${item.imagem_pincipal}" class="d-block w-100 carousel-image" alt="${item.titulo}">
          <div class="carousel-caption d-none d-md-block">
            <h5>${item.titulo}</h5>
            <p>${item.descricao}</p>
            <a href="detalhes.html?id=${item.id}" class="btn btn-primary btn-sm">Ver mais</a>
          </div>
        </div>`;
    });

    // INSERE CARROSSEL NA PÁGINA
    if (destaques.length > 0) {
      containerDestaques.innerHTML = `
        <div id="carouselDestaques" class="carousel slide" data-bs-ride="carousel">
          <div class="carousel-inner">${carouselInner}</div>
          <button class="carousel-control-prev" type="button" data-bs-target="#carouselDestaques" data-bs-slide="prev">
            <span class="carousel-control-prev-icon"></span>
          </button>
          <button class="carousel-control-next" type="button" data-bs-target="#carouselDestaques" data-bs-slide="next">
            <span class="carousel-control-next-icon"></span>
          </button>
        </div>`;
    } else {
      containerDestaques.innerHTML = '<p class="text-center">Nenhuma notícia em destaque no momento.</p>';
    }

    // CONSTRÓI GRID DE NOTÍCIAS CORRIGIDO
    containerNoticias.innerHTML = noticias.map(noticia => `
      <div class="noticia-card">
        <div class="card h-100 shadow-sm">
          <img src="${noticia.imagem_pincipal}" class="card-img-top" alt="${noticia.titulo}">
          <div class="card-body d-flex flex-column">
            <h5 class="card-title">${noticia.titulo}</h5>
            <p class="card-text">${noticia.descricao}</p>
            <div class="mt-auto btn-group">
              <a href="detalhes.html?id=${noticia.id}" class="btn btn-outline-primary">Ler mais</a>
              <a href="cadastro_noticias.html?id=${noticia.id}" class="btn btn-warning btn-sm">Editar</a>
              <button onclick="excluirNoticia('${noticia.id}')" class="btn btn-danger btn-sm">Excluir</button>
            </div>
          </div>
        </div>
      </div>
    `).join('');

  } catch (error) {
    console.error("Erro ao carregar notícias:", error);
    containerNoticias.innerHTML = '<p class="text-center text-danger">Erro ao carregar notícias. Verifique se o servidor está rodando.</p>';
  }
}

/**
 * CARREGA DETALHES DA NOTÍCIA
 */
async function carregarDetalhe() {
  const params = new URLSearchParams(window.location.search);
  const id = params.get('id');

  if (!id) {
    document.getElementById('detalhe').innerHTML = '<p class="text-center text-danger">Notícia não encontrada.</p>';
    return;
  }

  try {
    const res = await fetch(`${API_URL}/${id}`);

    if (!res.ok) {
      throw new Error('Notícia não encontrada');
    }

    const noticia = await res.json();

    document.getElementById('detalhe').innerHTML = `
      <div class="card shadow-sm">
        <img src="${noticia.imagem_pincipal}" class="card-img-top" alt="${noticia.titulo}">
        <div class="card-body">
          <h2>${noticia.titulo}</h2>
          <p><strong>Categoria:</strong> ${noticia.categoria}</p>
          <p><strong>Autor:</strong> ${noticia.autor}</p>
          <p><strong>Data:</strong> ${new Date(noticia.data).toLocaleDateString('pt-BR')}</p>
          <p><strong>Descrição:</strong> ${noticia.descricao}</p>
          <hr>
          <div class="conteudo-noticia">${noticia.conteudo.replace(/\n/g, '<br>')}</div>
          <a href="index.html" class="btn btn-secondary mt-3">Voltar para Home</a>
        </div>
      </div>`;
  } catch (error) {
    console.error('Erro ao carregar detalhes:', error);
    document.getElementById('detalhe').innerHTML = '<p class="text-center text-danger">Erro ao carregar notícia.</p>';
  }
}

/**
 * CONFIGURA FORMULÁRIO DE CADASTRO/EDIÇÃO
 */
function setupForm() {
  const form = document.getElementById('formNoticia');
  const params = new URLSearchParams(window.location.search);
  const id = params.get('id');

  if (id) {
    carregarNoticiaParaEdicao(id);
    document.querySelector('h2').textContent = 'Editar Notícia';
    document.querySelector('button[type="submit"]').textContent = 'Atualizar Notícia';
  }

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const noticia = {
      titulo: document.getElementById('titulo').value,
      descricao: document.getElementById('descricao').value,
      conteudo: document.getElementById('conteudo').value,
      categoria: document.getElementById('categoria').value,
      autor: document.getElementById('autor').value,
      imagem_pincipal: document.getElementById('imagem_pincipal').value,
      destaque: document.getElementById('destaque').checked,
      data: new Date().toISOString().split('T')[0]
    };

    const method = id ? 'PUT' : 'POST';
    const url = id ? `${API_URL}/${id}` : API_URL;

    try {
      const res = await fetch(url, {
        method: method,
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(noticia)
      });

      if (!res.ok) {
        throw new Error(`Erro ao salvar notícia: ${res.status}`);
      }

      alert('Notícia salva com sucesso!');
      window.location.href = 'index.html';

    } catch (err) {
      console.error('Erro ao salvar notícia:', err);
      alert('Falha ao salvar notícia: ' + err.message);
    }
  });
}

/**
 * CARREGA NOTÍCIA PARA EDIÇÃO
 */
async function carregarNoticiaParaEdicao(id) {
  try {
    const res = await fetch(`${API_URL}/${id}`);

    if (!res.ok) {
      throw new Error('Notícia não encontrada para edição');
    }

    const noticia = await res.json();

    document.getElementById('id').value = noticia.id;
    document.getElementById('titulo').value = noticia.titulo;
    document.getElementById('descricao').value = noticia.descricao;
    document.getElementById('conteudo').value = noticia.conteudo;
    document.getElementById('categoria').value = noticia.categoria;
    document.getElementById('autor').value = noticia.autor;
    document.getElementById('imagem_pincipal').value = noticia.imagem_pincipal;
    document.getElementById('destaque').checked = noticia.destaque;

  } catch (error) {
    console.error('Erro ao carregar notícia para edição:', error);
    alert('Erro ao carregar notícia para edição: ' + error.message);
    window.location.href = 'cadastro_noticias.html';
  }
}

/**
 * EXCLUI NOTÍCIA
 */
async function excluirNoticia(id) {
  if (confirm("Deseja realmente excluir esta notícia?")) {
    try {
      const res = await fetch(`${API_URL}/${id}`, {
        method: 'DELETE'
      });

      if (!res.ok) {
        throw new Error('Erro ao excluir notícia');
      }

      alert("Notícia excluída com sucesso!");
      location.reload();

    } catch (error) {
      console.error("Erro ao excluir notícia:", error);
      alert("Erro ao excluir notícia: " + error.message);
    }
  }
}

/**
 * INICIALIZAÇÃO DA PÁGINA
 */
document.addEventListener('DOMContentLoaded', () => {
  console.log('Portal de Notícias - Inicializando...');

  if (document.getElementById('header-placeholder')) {
    loadHeader();
  }

  if (document.getElementById('destaques')) {
    carregarHome();
  }

  if (document.getElementById('detalhe')) {
    carregarDetalhe();
  }

  if (document.getElementById('formNoticia')) {
    setupForm();
  }

  console.log('Portal de Notícias - Inicialização concluída!');
});

/**
 * FUNÇÃO AUXILIAR: Formata data para o padrão brasileiro
 */
function formatarData(dataString) {
  const data = new Date(dataString);
  return data.toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  });
}