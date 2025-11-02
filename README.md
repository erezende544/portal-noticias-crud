# Portal de Notícias - CRUD Completo com JSON Server

## 📋 Sobre o Projeto

Este projeto é um portal de notícias completo desenvolvido como parte da disciplina de Desenvolvimento de Interfaces Web. A aplicação implementa um CRUD (Create, Read, Update, Delete) completo utilizando JSON Server como backend simulado, proporcionando uma experiência próxima de um ambiente de desenvolvimento profissional.

## 🛠️ Tecnologias Utilizadas

- **Frontend**: HTML5, CSS3, JavaScript (ES6+), Bootstrap 5.3
- **Backend**: JSON Server
- **Ferramentas**: Node.js, Git, GitHub
- **Protocolo**: HTTP/REST API

## 🎯 Funcionalidades

- **📰 Listagem de Notícias** - Exibe todas as notícias em layout de grid responsivo (3 colunas desktop, 2 tablet, 1 mobile)
- **⭐ Destaques** - Carrossel com notícias em destaque
- **🔍 Detalhes** - Página individual para cada notícia
- **📝 Cadastro** - Formulário para criar novas notícias
- **✏️ Edição** - Formulário para editar notícias existentes
- **🗑️ Exclusão** - Remoção de notícias com confirmação
- **📱 Responsivo** - Layout adaptável para desktop, tablet e mobile

## 📁 Estrutura do Projeto
portal-noticias-crud/
├── public/ # Frontend
│ ├── index.html # Página inicial
│ ├── detalhes.html # Página de detalhes
│ ├── cadastro_noticias.html # Formulário CRUD
│ ├── header.html # Componente de navegação
│ ├── assets/
│ │ ├── css/
│ │ │ └── styles.css # Estilos customizados
│ │ └── js/
│ │ └── app.js # Lógica da aplicação
├── db/
│ └── db.json # Banco de dados JSON
├── package.json # Dependências do projeto
└── README.md # Documentação


## 🗃️ Estrutura de Dados (db.json)

```json
{
  "noticias": [
    {
      "titulo": "Prefeitura Lança Novo Plano de Mobilidade Urbana",
      "descricao": "Novo plano visa melhorar o transporte público e reduzir o trânsito na cidade.",
      "conteudo": "A Prefeitura apresentou nesta segunda-feira um novo plano de mobilidade urbana que inclui corredores exclusivos de ônibus, ciclovias e a requalificação de vias principais...",
      "categoria": "Cidades",
      "autor": "Joana Ribeiro",
      "imagem_pincipal": "https://images.pexels.com/photos/109919/pexels-photo-109919.jpeg",
      "destaque": false,
      "data": "2025-11-01",
      "id": "1"
    },
    {
      "titulo": "Tecnologia 6G Está em Desenvolvimento",
      "descricao": "Pesquisadores anunciam avanços na próxima geração de redes móveis.",
      "conteudo": "Universidades e empresas de telecomunicação já estão testando tecnologias que poderão compor a infraestrutura do 6G...",
      "categoria": "Tecnologia",
      "autor": "Carlos Mendes",
      "imagem_pincipal": "https://images.pexels.com/photos/373543/pexels-photo-373543.jpeg",
      "destaque": true,
      "data": "2025-11-01",
      "id": "2"
    },
    {
      "titulo": "Festival de Música Reúne Mais de 50 Mil Pessoas",
      "descricao": "Evento cultural movimentou o final de semana com atrações nacionais e internacionais.",
      "conteudo": "Durante três dias, o festival contou com mais de 40 artistas e promoveu atividades culturais e gastronômicas...",
      "categoria": "Cultura",
      "autor": "Ana Clara Silva",
      "imagem_pincipal": "https://images.pexels.com/photos/167636/pexels-photo-167636.jpeg",
      "destaque": false,
      "data": "2025-11-01",
      "id": "3"
    }
  ]
}


## 🗃️ Estrutura de Dados (db.json)

```json
{
  "noticias": [
    {
      "titulo": "Prefeitura Lança Novo Plano de Mobilidade Urbana",
      "descricao": "Novo plano visa melhorar o transporte público e reduzir o trânsito na cidade.",
      "conteudo": "A Prefeitura apresentou nesta segunda-feira um novo plano de mobilidade urbana que inclui corredores exclusivos de ônibus, ciclovias e a requalificação de vias principais...",
      "categoria": "Cidades",
      "autor": "Joana Ribeiro",
      "imagem_pincipal": "https://images.pexels.com/photos/109919/pexels-photo-109919.jpeg",
      "destaque": false,
      "data": "2025-11-01",
      "id": "1"
    },
    {
      "titulo": "Tecnologia 6G Está em Desenvolvimento",
      "descricao": "Pesquisadores anunciam avanços na próxima geração de redes móveis.",
      "conteudo": "Universidades e empresas de telecomunicação já estão testando tecnologias que poderão compor a infraestrutura do 6G...",
      "categoria": "Tecnologia",
      "autor": "Carlos Mendes",
      "imagem_pincipal": "https://images.pexels.com/photos/373543/pexels-photo-373543.jpeg",
      "destaque": true,
      "data": "2025-11-01",
      "id": "2"
    },
    {
      "titulo": "Festival de Música Reúne Mais de 50 Mil Pessoas",
      "descricao": "Evento cultural movimentou o final de semana com atrações nacionais e internacionais.",
      "conteudo": "Durante três dias, o festival contou com mais de 40 artistas e promoveu atividades culturais e gastronômicas...",
      "categoria": "Cultura",
      "autor": "Ana Clara Silva",
      "imagem_pincipal": "https://images.pexels.com/photos/167636/pexels-photo-167636.jpeg",
      "destaque": false,
      "data": "2025-11-01",
      "id": "3"
    }
  ]
}


Método	Endpoint	Descrição
GET	/noticias	Lista todas as notícias
GET	/noticias/:id	Busca notícia por ID
POST	/noticias	Cria nova notícia
PUT	/noticias/:id	Atualiza notícia existente
DELETE	/noticias/:id	Remove notícia

🚀 Como Executar o Projeto
Pré-requisitos
Node.js instalado
Git para controle de versão

📸 Screenshots
<!-- ADICIONE SEUS PRINTS AQUI -->

## 📸 Screenshots

<!-- ADICIONE SEUS PRINTS AQUI -->
*Página inicial 
![Página Inicial](./public/assets/images/print-tela-inicial-01.png)

*Página inicial com grid de notícias e carrossel de destaques*
![Página Inicial - Grid Notícias](./public/assets/images/print-tela-inicial-grid-noticias.png)

*Página de detalhes com conteúdo completo da notícia*
![Página de Detalhes](./public/assets/images/print-detalhe-noticia.png)

*Formulário para editar notícias*
![Formulário de Ediçaõ de Notícia](./public/assets/images/print-edição-noticia.png

*Formulário para cadastro de notícias*
![Formulário de cadastro de notícias](./public/assets/images/print-criacao-noticia.png)

*Abas Network mostrando requisições HTTP para a API*
![Testes da API](./public/assets/images/print-rede.png)


📝 Controle de Versão
Tags e Commits
v1.0 - chore: montagem do ambiente de desenvolvimento inicial

v2.0 - chore: Testes da API para a estrutura noticias

v3.0 - feat: dinâmica de CRUD para noticias com JSONServer

v4.0 - docs: Alterações do README.md

🔧 Funcionalidades Técnicas Implementadas
API Fetch: Consumo assíncrono da API RESTful

CRUD Completo: Create, Read, Update, Delete

Parâmetros URL: Passagem de IDs via query string

Responsividade: Media queries para diferentes dispositivos

Validação de Formulários: Front-end validation

Navegação Fluida: Transições entre páginas sem recarregamento

JSON Server: Backend simulado com API RESTful


🧪 Testes Realizados
Testes de API com Thunder Client/Postman:
✅ GET /noticias - Listagem de todas as notícias

✅ GET /noticias/1 - Busca de notícia específica

✅ POST /noticias - Criação de nova notícia

✅ PUT /noticias/1 - Atualização de notícia

✅ DELETE /noticias/1 - Exclusão de notícia

Testes de Funcionalidade:
✅ Listagem responsiva de notícias

✅ Navegação entre páginas

✅ Formulários de criação e edição

✅ Exclusão com confirmação

✅ Carrossel de destaques funcionando

👨‍💻 Desenvolvedor
Eduardo Machado
📧 eduardo.machado@sga.pucminas.br
🎓 Análise e Desenvolvimento de Sistemas - PUC Minas
📅 2025/2 - Semipresencial
🏫 Disciplina: Desenvolvimento de Interfaces Web

