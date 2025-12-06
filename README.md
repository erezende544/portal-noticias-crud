# Portal de Notícias - README

[![JavaScript](https://img.shields.io/badge/JavaScript-ES6+-yellow.svg)](https://developer.mozilla.org/en-US/docs/Web/JavaScript)
[![HTML5](https://img.shields.io/badge/HTML5-E34F26.svg)](https://developer.mozilla.org/en-US/docs/Web/HTML)
[![CSS3](https://img.shields.io/badge/CSS3-1572B6.svg)](https://developer.mozilla.org/en-US/docs/Web/CSS)
[![JSON Server](https://img.shields.io/badge/JSON%20Server-0A0A0A.svg)](https://github.com/typicode/json-server)

Portal de Notícias completo com sistema de autenticação, CRUD de notícias, favoritos e calendário de eventos.

## ✨ Funcionalidades

- **🔐 Autenticação de Usuários** - Login e cadastro com diferentes níveis de acesso
- **📰 CRUD de Notícias** - Criação, edição e exclusão de notícias (apenas administrador)
- **⭐ Sistema de Favoritos** - Usuários podem salvar notícias favoritas
- **📅 Calendário de Eventos** - Visualização de notícias em formato de calendário
- **📱 Design Responsivo** - Adaptado para mobile, tablet e desktop
- **🔒 Proteção de Rotas** - Controle de acesso baseado em permissões

## 🧪 Guia de Avaliação do Sistema

A seguir estão todas as instruções necessárias para executar, testar e validar o Portal de Notícias, tanto utilizando a API hospedada no Replit quanto rodando localmente.

---

## 🚀 1. Como Executar o Projeto

### ✔️ **Opção A – Usar o Replit (API Online)**  
Caso prefira utilizar um backend pronto, basta copiar o conteúdo do `db.json` e colar na sua própria instância do Replit com JSON Server.

---

### ✔️ **Opção B – Executar Localmente**

#### **Requisitos**
- Node.js LTS  
- NPM ou Yarn  

#### **Passo a passo**
```bash
# 1. Instalar dependências
npm install

# 2. Iniciar o servidor JSON Server
json-server --watch db/db.json --port 3030
```

A API ficará disponível em:
👉 **[http://localhost:3030](http://localhost:3030)**

---

## ⚙️ 2. Configuração da API no Projeto

O arquivo `utils.js` já possui uma lógica que permite alternar entre API remota ou local:

```js
export const API_BASE =
    "https://effdd743-2e9e-49d5-bb9a-ff660046a048-00-1qnb66fffuyko.janeway.replit.dev/"
    || 
    "http://localhost:3030/";
```

Se o avaliador quiser utilizar sua própria URL do Replit, basta substituir o endereço acima.

---

## 👤 3. Contas para Testes

### **Administrador**

* **E-mail:** [admin@email.com](mailto:admin@email.com)
* **Senha:** 123456

### **Usuário Comum**

* **E-mail:** [usuario@email.com](mailto:usuario@email.com)
* **Senha:** 123456

---

## 📝 4. Funcionalidades a Serem Testadas

### **1. Cadastro de Usuário**

* Criar nova conta
* Realizar login com a nova conta

---

### **2. Login**

* Testar login do usuário comum
* Testar login do administrador

---

### **3. CRUD de Notícias (Apenas Administrador)**

O admin deve conseguir:

* Criar notícia
* Editar notícia
* Excluir notícia
* Visualizar todas as notícias

Validar:

* Campos obrigatórios
* Mensagens de erro
* Mensagens de sucesso

---

### **4. Visualização de Notícias**

* Listar todas as notícias
* Abrir notícia individual
* Conferir data, autor e categoria

---

### **5. Favoritos**

O usuário deve conseguir:

* Adicionar aos favoritos
* Remover dos favoritos
* Ver lista de favoritos

---

### **6. Proteção de Rotas**

Validar que:

* Usuário comum **não** acessa páginas administrativas
* Administrador acessa tudo normalmente

---

### **7. Responsividade**

Testar o site em:

* Mobile
* Tablet
* Desktop

---

### **8. Calendário de Notícias**

* Carregamento dos eventos
* Exibição correta no calendário
* Interação ao clicar no evento

---

## ✅ 5. Conclusão da Avaliação

Ao final, o avaliador deve confirmar que:

* Todo o fluxo de notícias funciona
* CRUD do admin está 100% operacional
* Favoritos funcionam sem erro
* Login e permissões estão corretos
* O sistema funciona via Replit **ou** local
* Interface responsiva e funcional

---

## 📁 Estrutura do Projeto

```
portal-noticias/
├── db/
│   └── db.json          # Banco de dados JSON
├── css/
│   ├── styles.css       # Estilos principais
│   └── calendar.css     # Estilos do calendário
├── js/
│   ├── utils.js         # Configurações da API
│   ├── auth.js          # Autenticação
│   ├── news.js          # CRUD de notícias
│   ├── calendar.js      # Calendário de eventos
│   └── favorites.js     # Sistema de favoritos
├── index.html           # Página inicial
├── login.html           # Login
├── register.html        # Cadastro
├── news.html            # Lista de notícias
├── admin.html           # Painel administrativo
└── README.md            # Documentação
```

## 🛠️ Tecnologias Utilizadas

- **Frontend:** HTML5, CSS3, JavaScript (ES6+)
- **Backend:** JSON Server (API REST)
- **Autenticação:** Session Storage
- **Calendário:** FullCalendar.js
- **Ícones:** Font Awesome

**Desenvolvido por Eduardo Rezende Machado**