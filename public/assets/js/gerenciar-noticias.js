import { API_BASE } from './utils.js';

// Verificar se tem ID na URL (modo edição)
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
const submitBtn = form ? form.querySelector('button[type="submit"]') : null;
const tituloPagina = document.querySelector('title');
const pageTitle = document.querySelector('h2.text-center');

// Carregar dados da notícia se for modo edição
async function carregarNoticiaParaEdicao() {
    if (!noticiaId || !form) return;

    try {
        console.log(`Carregando notícia ID: ${noticiaId} de ${API_BASE}noticias/${noticiaId}`);
        const response = await fetch(`${API_BASE}noticias/${noticiaId}`);

        if (!response.ok) {
            throw new Error(`HTTP ${response.status}`);
        }

        const noticia = await response.json();
        console.log('Notícia carregada:', noticia);

        // Preencher campos do formulário
        idHiddenInput.value = noticia.id || '';
        tituloInput.value = noticia.titulo || '';
        descricaoInput.value = noticia.descricao || '';
        conteudoInput.value = noticia.conteudo || '';
        categoriaInput.value = noticia.categoria || '';
        autorInput.value = noticia.autor || '';
        imagemInput.value = noticia.imagem_pincipal || noticia.imagem_principal || '';
        destaqueInput.checked = noticia.destaque || false;

        // Mudar texto do botão e título da página
        if (submitBtn) {
            submitBtn.textContent = 'Atualizar Notícia';
            submitBtn.classList.remove('btn-primary');
            submitBtn.classList.add('btn-warning');
        }

        if (tituloPagina) {
            tituloPagina.textContent = `Editar: ${noticia.titulo.substring(0, 30)}...`;
        }

        if (pageTitle) {
            pageTitle.textContent = 'Editar Notícia';
        }

    } catch (error) {
        console.error('Erro ao carregar notícia:', error);
        alert('Erro ao carregar notícia para edição. Verifique o console.');
    }
}

// Salvar ou atualizar notícia
async function salvarNoticia(event) {
    event.preventDefault();

    // Verificar se usuário é admin
    const isAdmin = localStorage.getItem('LOGGED_USER_ADMIN') === 'true';
    if (!isAdmin) {
        alert('Apenas administradores podem gerenciar notícias.');
        window.location.href = 'login.html';
        return;
    }

    // Coletar dados do formulário
    const noticiaData = {
        titulo: tituloInput.value.trim(),
        descricao: descricaoInput.value.trim(),
        conteudo: conteudoInput.value.trim(),
        categoria: categoriaInput.value.trim(),
        autor: autorInput.value.trim(),
        imagem_pincipal: imagemInput.value.trim(),
        destaque: destaqueInput.checked,
        data: new Date().toISOString().split('T')[0]
    };

    // Validações básicas
    if (!noticiaData.titulo || !noticiaData.descricao || !noticiaData.conteudo) {
        alert('Título, descrição e conteúdo são obrigatórios!');
        return;
    }

    // Se tiver autor vazio, usar nome do usuário logado
    if (!noticiaData.autor) {
        noticiaData.autor = localStorage.getItem('LOGGED_USER_NAME') || 'Anônimo';
    }

    console.log('Enviando dados:', noticiaData);

    try {
        let response;
        const url = isEditMode ? `${API_BASE}noticias/${noticiaId}` : `${API_BASE}noticias`;

        response = await fetch(url, {
            method: isEditMode ? 'PUT' : 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(noticiaData)
        });

        if (response.ok) {
            const mensagem = isEditMode ? 'Notícia atualizada com sucesso!' : 'Notícia criada com sucesso!';
            alert(mensagem);
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

// Configurar formulário
function configurarFormulario() {
    if (form) {
        form.addEventListener('submit', salvarNoticia);
        carregarNoticiaParaEdicao();
    } else {
        console.log('Formulário não encontrado nesta página');
    }
}

// Inicializar quando o DOM carregar
document.addEventListener('DOMContentLoaded', configurarFormulario);