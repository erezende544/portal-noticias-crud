import { API_BASE } from './utils.js';

async function handleRegister(event) {
  event.preventDefault();

  const nome = document.getElementById("user-nome").value;
  const email = document.getElementById("user-email").value;
  const senha = document.getElementById("user-senha").value;
  const senhaConfirma = document.getElementById("user-senha-confirma").value;

  if (senha !== senhaConfirma) {
    alert("As senhas não coincidem.");
    return;
  }

  try {
    const checkResponse = await fetch(`${JSON}usuarios?email=${email}`);
    const existingUsers = await checkResponse.json();

    if (existingUsers.length > 0) {
      alert("Este e-mail já está cadastrado.");
      return;
    }

    const newUser = { nome, email, senha };
    await fetch(`${JSON}usuarios`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newUser),
    });

    alert("Conta criada com sucesso!");
    window.location.href = "login.html";
  } catch (error) {
    console.error("Erro ao registrar:", error);
    alert("Falha ao registrar. Tente novamente.");
  }
}

// Para compatibilidade com o formulário de ONG (simplificando)
function toggleFormFields(type) {
  const fieldsUsuario = document.getElementById("fields-usuario");
  const fieldsOng = document.getElementById("fields-ong");

  if (type === "ong") {
    fieldsUsuario.classList.add("d-none");
    fieldsOng.classList.remove("d-none");
  } else {
    fieldsUsuario.classList.remove("d-none");
    fieldsOng.classList.add("d-none");
  }
}

document.addEventListener("DOMContentLoaded", () => {
  const registerForm = document.getElementById("register-form");
  if (registerForm) {
    registerForm.addEventListener("submit", handleRegister);
  }

  const radioUsuario = document.getElementById("tipo-usuario");
  const radioOng = document.getElementById("tipo-ong");

  if (radioUsuario) {
    radioUsuario.addEventListener("change", () => toggleFormFields("usuario"));
  }
  if (radioOng) {
    radioOng.addEventListener("change", () => toggleFormFields("ong"));
  }

  toggleFormFields("usuario");
});