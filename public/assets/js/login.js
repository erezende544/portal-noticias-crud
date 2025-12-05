import { JSON } from './utils.js';

async function handleLogin(event) {
  event.preventDefault();

  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  if (!email || !password) {
    alert("Por favor, preencha todos os campos.");
    return;
  }

  try {
    const response = await fetch(`${JSON}usuarios`);

    if (!response.ok) {
      throw new Error(`Erro HTTP: ${response.status}`);
    }

    const users = await response.json();
    const user = users.find(u => u.email === email && u.senha === password);

    if (user) {
      // Salva dados no localStorage
      localStorage.setItem("LOGGED_USER_ID", user.id);
      localStorage.setItem("LOGGED_USER_NAME", user.nome);
      localStorage.setItem("LOGGED_USER_EMAIL", user.email);
      localStorage.setItem("LOGGED_USER_ADMIN", user.admin || false);

      alert(`Bem-vindo(a), ${user.nome}!`);
      window.location.href = "index.html";
    } else {
      alert("E-mail ou senha incorretos.");
    }
  } catch (error) {
    console.error("Erro no login:", error);
    alert("Erro de conexão com o servidor.");
  }
}

document.addEventListener("DOMContentLoaded", () => {
  const loginForm = document.getElementById("login-form");
  if (loginForm) {
    loginForm.addEventListener("submit", handleLogin);
  }
});