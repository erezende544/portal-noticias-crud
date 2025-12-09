import { API_BASE } from "./utils.js";

const CURRENT_USER_ID = String(localStorage.getItem("LOGGED_USER_ID"));

// ===============================
// Carrega dados do usuário
// ===============================
async function loadUserProfile() {
  if (!CURRENT_USER_ID) return;

  try {
    const response = await fetch(`${API_BASE}usuarios/${CURRENT_USER_ID}`);
    if (!response.ok) throw new Error("Usuário não encontrado");
    const user = await response.json();

    document.getElementById("user-name-placeholder").textContent = user.nome;
    document.getElementById("user-email-placeholder").textContent = user.email;

  } catch (error) {
    console.error("Erro ao carregar perfil:", error);
    document.getElementById("user-name-placeholder").textContent =
      "Erro ao carregar perfil";
  }
}

// ===============================
// Carregar Favoritos do Usuário
// ===============================
async function loadUserFavorites() {
  const container = document.getElementById("apadrinhados-container");

  container.innerHTML = "<p>Carregando seus favoritos...</p>";

  try {
    // 1. Buscar favoritos do usuário
    const favRes = await fetch(`${API_BASE}favoritos?usuarioId=${CURRENT_USER_ID}`);
    const favoritos = await favRes.json();

    if (favoritos.length === 0) {
      container.innerHTML = `
        <p class="text-muted">Você ainda não favoritou nenhuma notícia.</p>
      `;
      return;
    }

    // 2. Montar cards das notícias favoritos
    container.innerHTML = "";

    for (const fav of favoritos) {
      const noticiaRes = await fetch(`${API_BASE}noticias/${fav.noticiaId}`);
      const noticia = await noticiaRes.json();

      const card = document.createElement("div");
      card.className = "card shadow-sm";
      card.style.width = "18rem";

      card.innerHTML = `
        <img src="${noticia.imagem_pincipal}" class="card-img-top" alt="${noticia.titulo}">
        
        <div class="card-body">
          <h5 class="card-title">${noticia.titulo}</h5>
          <p class="card-text text-muted">${noticia.descricao}</p>

          <a href="noticia.html?id=${noticia.id}" class="btn btn-primary mt-2">
            Ler Notícia
          </a>
        </div>
      `;

      container.appendChild(card);
    }

  } catch (error) {
    console.error("Erro ao carregar favoritos:", error);
    container.innerHTML = `
      <p class="text-danger">Erro ao carregar favoritos.</p>
    `;
  }
}

// ===============================
// Inicialização
// ===============================
document.addEventListener("DOMContentLoaded", async () => {
  await loadUserProfile();
  await loadUserFavorites();
});
