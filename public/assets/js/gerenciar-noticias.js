import { API_BASE } from './utils.js';

// Pegar ID da notícia da URL
const urlParams = new URLSearchParams(window.location.search);
const noticiaId = urlParams.get('id');
const isEditMode = !!noticiaId;

// Elementos do formulário
const form = document.getElementById('formNoticia');
const tituloInput = document.getElementById('titulo');
const descricaoInput = document.getElementById('descricao');
const conteudoInput = document.getElementById('conteudo');
const categoriaInput = document.getElementById('categoria');
const autorInput = document.getElementById('autor');
const imagemInput = document.getElementById('imagem_pincipal');
const destaqueInput = document.getElementById('destaque');
const idHiddenInput = document.getElementById('id');
const submitBtn = document.getElementById('btnSalvar');
const pageTitle = document.querySelector('h2.text-center');
const tituloPagina = document.querySelector('title');

// Função para carregar notícia no modo edição
async function carregarNoticiaParaEdicao() {
    if (!isEditMode || !form) return;

    try {
        const response = await fetch(`${API_BASE}noticias/${noticiaId}`);
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        const noticia = await response.json();

        // Preencher campos
        idHiddenInput.value = noticia.id || '';
        tituloInput.value = noticia.titulo || '';
        descricaoInput.value = noticia.descricao || '';
        conteudoInput.value = noticia.conteudo || '';
        categoriaInput.value = noticia.categoria || '';
        autorInput.value = noticia.autor || '';
        imagemInput.value = noticia.imagem_pincipal || noticia.imagem_principal || '';
        destaqueInput.checked = noticia.destaque || false;

        // Atualizar botão e título
        if (submitBtn) {
            submitBtn.textContent = 'Atualizar Notícia';
            submitBtn.classList.remove('btn-primary');
            submitBtn.classList.add('btn-primary');
        }
        if (pageTitle) pageTitle.textContent = 'Editar Notícia';
        if (tituloPagina) tituloPagina.textContent = `Editar: ${noticia.titulo.substring(0, 30)}...`;

    } catch (error) {
        console.error('Erro ao carregar notícia:', error);
        alert('Erro ao carregar notícia para edição. Veja o console.');
    }
}

// Função para salvar ou atualizar notícia
async function salvarNoticia(event) {
    event.preventDefault();

    const isAdmin = localStorage.getItem('LOGGED_USER_ADMIN') === 'true';
    if (!isAdmin) {
        alert('Apenas administradores podem gerenciar notícias.');
        window.location.href = 'login.html';
        return;
    }

    const noticiaData = {
        titulo: tituloInput.value.trim(),
        descricao: descricaoInput.value.trim(),
        conteudo: conteudoInput.value.trim(),
        categoria: categoriaInput.value.trim(),
        autor: autorInput.value.trim() || localStorage.getItem('LOGGED_USER_NAME') || 'Anônimo',
        imagem_pincipal: imagemInput.value.trim(),
        destaque: destaqueInput.checked,
        data: new Date().toISOString().split('T')[0]
    };

    if (!noticiaData.titulo || !noticiaData.descricao || !noticiaData.conteudo) {
        alert('Título, descrição e conteúdo são obrigatórios!');
        return;
    }

    try {
        const url = isEditMode ? `${API_BASE}noticias/${noticiaId}` : `${API_BASE}noticias`;
        const response = await fetch(url, {
            method: isEditMode ? 'PUT' : 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(noticiaData)
        });

        if (response.ok) {
            alert(isEditMode ? 'Notícia atualizada com sucesso!' : 'Notícia criada com sucesso!');
            window.location.href = 'index.html';
        } else {
            const errorData = await response.json();
            throw new Error(`HTTP ${response.status}: ${JSON.stringify(errorData)}`);
        }
    } catch (error) {
        console.error('Erro ao salvar notícia:', error);
        alert(`Erro ao salvar notícia: ${error.message}`);
    }
}

// Inicializar formulário
function configurarFormulario() {
    if (!form) return;

    form.addEventListener('submit', salvarNoticia);
    carregarNoticiaParaEdicao();
}

// Executar quando DOM estiver pronto
document.addEventListener('DOMContentLoaded', configurarFormulario);
