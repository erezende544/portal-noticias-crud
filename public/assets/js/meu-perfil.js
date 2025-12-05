import { JSON } from './utils.js';

// Obter ID do usuário atual
const CURRENT_USER_ID = localStorage.getItem("LOGGED_USER_ID");

async function loadUserProfile() {
  if (!CURRENT_USER_ID) return;

  try {
    const response = await fetch(`${JSON}usuarios/${CURRENT_USER_ID}`);
    if (!response.ok) throw new Error("Usuário não encontrado");
    const user = await response.json();

    document.getElementById("user-name-placeholder").textContent = user.nome;
    document.getElementById("user-email-placeholder").textContent = user.email;
  } catch (error) {
    console.error("Erro ao carregar perfil:", error);
    document.getElementById("user-name-placeholder").textContent = "Erro ao carregar perfil";
  }
}

// Remova a parte de animais apadrinhados se não for usar
async function loadSponsoredAnimals() {
  const container = document.getElementById("apadrinhados-container");
  container.innerHTML = "<p>Funcionalidade de animais apadrinhados não disponível no Portal de Notícias.</p>";
}

document.addEventListener("DOMContentLoaded", async () => {
  if (!CURRENT_USER_ID) {
    return;
  }
  await loadUserProfile();
  await loadSponsoredAnimals();
});