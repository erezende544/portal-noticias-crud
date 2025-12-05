// Verifica se usuário está logado
export function isLoggedIn() {
  return localStorage.getItem("LOGGED_USER_ID") !== null;
}

// Obtém dados do usuário atual
export function getCurrentUser() {
  return {
    id: localStorage.getItem("LOGGED_USER_ID"),
    name: localStorage.getItem("LOGGED_USER_NAME"),
    email: localStorage.getItem("LOGGED_USER_EMAIL"),
    admin: localStorage.getItem("LOGGED_USER_ADMIN") === "true"
  };
}

// Verifica se usuário é administrador
export function isAdmin() {
  return localStorage.getItem("LOGGED_USER_ADMIN") === "true";
}

// Verifica se página é protegida
export function checkProtectedPage() {
  const currentPage = window.location.pathname.split("/").pop();
  const privatePages = ["cadastro_noticias.html", "meu-perfil.html"];
  const adminPages = ["cadastro_noticias.html"];

  if (privatePages.includes(currentPage) && !isLoggedIn()) {
    alert("Você precisa fazer login para acessar esta página.");
    window.location.href = "login.html";
    return false;
  }

  if (adminPages.includes(currentPage) && !isAdmin()) {
    alert("Acesso restrito para administradores.");
    window.location.href = "index.html";
    return false;
  }

  return true;
}

// Logout
export function handleLogout() {
  localStorage.removeItem("LOGGED_USER_ID");
  localStorage.removeItem("LOGGED_USER_NAME");
  localStorage.removeItem("LOGGED_USER_EMAIL");
  localStorage.removeItem("LOGGED_USER_ADMIN");

  window.location.href = "index.html";
}

// Verifica página protegida ao carregar
document.addEventListener('DOMContentLoaded', checkProtectedPage);