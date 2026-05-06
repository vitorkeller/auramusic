# 🎵 Aura Music

<img width="1920" height="1248" alt="Home" src="https://imgur.com/oGHDbKi.png" />

## 🔗 Links Úteis
- **Protótipo Figma (Web):** [Acessar](https://www.figma.com/proto/0dhsr7aXEIwemElDrDjzRn/Aura-Music?node-id=7-7&t=Awq4McOkmmOavw87-1&scaling=scale-down&content-scaling=fixed&page-id=0%3A1&starting-point-node-id=7%3A7&show-proto-sidebar=1)
- **Protótipo Figma (Mobile):** [Acessar](https://www.figma.com/proto/0dhsr7aXEIwemElDrDjzRn/Aura-Music?node-id=34153-340&p=f&t=502gF1sHhZuRN09t-0&scaling=scale-down&content-scaling=fixed&page-id=34153%3A337&starting-point-node-id=34153%3A340)

---

## Metodologia e Domínio do Problema
Este projeto foi concebido como um trabalho prático para a faculdade de Engenharia de Software. O desafio consiste em projetar, desenvolver e colocar em produção uma aplicação web funcional inspirada no Spotify. A abordagem prioriza a resolução de desafios técnicos, como o desenvolvimento de um player de música fluído, salvamento de playlists públicas e privadas, e boas práticas de arquitetura e infraestrutura.

## Como rodar o projeto localmente

### Backend (Python / FastAPI)
1. Certifique-se de ter o Python 3.10+ instalado.
2. Clone o repositório e navegue até a pasta `backend`:
   ```bash
   cd backend
   ```
3. Configure as variáveis de ambiente com o banco de dados PostgreSQL no supabase em um arquivo .env na raiz do backend:
	```bash
	DATABASE_URL="postgresql://user:password@aws-0-sa-east-1.pooler.supabase.com:6543/postgres"
	SECRET_KEY="sua-chave-secreta-aqui"
	```
3. Execute o comando:
   ```bash
   docker compose up --build
   ```
4. A API estará disponível em http://localhost:8000

### Frontend (Next.js)
1. Navegue até a pasta frontend:
	```bash
	cd frontend
	```

2. Instale as dependências e inicie o projeto:
	```bash
	npm install
	npm run dev
	# Acesse a aplicação em: http://localhost:3000
	```

## Arquitetura e Padrões do Projeto

## Backend

O backend segue uma arquitetura **Monolítica modular**, organizada em camadas bem definidas para garantir separação de responsabilidades e facilitar manutenção e testes.

As principais camadas são:

- **Routes (Controllers):** Responsáveis por expor os endpoints da API
- **Services:** Contêm a lógica de negócio
- **Repositories:** Abstraem o acesso ao banco de dados
- **Models:** Representação das entidades no banco

### Padrões de Projeto aplicados:

- **Repository Pattern:** Isola a lógica de acesso a dados
- **Dependency Injection (FastAPI):** Gerenciamento de dependências
- **JWT Authentication:** Controle de autenticação stateless

## Frontend

O frontend da aplicação foi desenvolvido utilizando o Next.js com React, adotando uma arquitetura baseada em componentes (Component-Based Architecture). Essa abordagem permite a construção de interfaces reutilizáveis, modulares e de fácil manutenção.

A estrutura do projeto segue uma organização em camadas, separando responsabilidades entre:

- Pages (rotas da aplicação)
- Componentes reutilizáveis (UI)
- Serviços (comunicação com API)
- Hooks (lógica reutilizável)
- Gerenciamento de estado

### Padrões de Projeto Utilizados

- **Component Pattern:** construção da interface através de componentes reutilizáveis.
- **Hooks Pattern:** encapsulamento de lógica reutilizável com hooks personalizados.
- **Separation of Concerns:** separação entre interface, lógica e acesso a dados.
- **Service Layer Pattern:** centralização das chamadas à API em serviços.
- **State Management Pattern:** gerenciamento de estado com hooks nativos do React.

Essa abordagem garante maior escalabilidade e facilita a evolução da aplicação.

## Stack Tecnológica:
* **Frontend:** Next.js | React | TypeScript | Tailwind CSS
  * *Justificativa:* Permite a criação de uma SPA (Single Page Application) robusta. Fundamental para um player de áudio não interromper a reprodução durante a navegação entre telas.
* **Backend:** Python | FastAPI | SQLAlchemy
  * *Justificativa:* FastAPI oferece altíssima performance (ASGI), tipagem forte com Pydantic, e documentação Swagger autogerada. Python facilita o fluxo ágil e possui excelente suporte a manipulação de dados.
* **Banco de Dados:** PostgreSQL (Hospedado no Supabase)
  * *Justificativa:* Banco de dados relacional poderoso, garantindo consistência na modelagem complexa.
* **Qualidade e Testes:** Pytest (Backend)
  * *Justificativa:* Cobertura de testes unitários de rotas e validações de regras de negócio.

## Engenharia e Produção (Deploy e CI/CD)
- **Backend:** Hospedado no **Render.com** dentro de um container Docker, com deploy automático a partir da branch `main`.
- **Frontend:** Hospedado na **Vercel**, conectando-se ao backend via HTTPS e configurado com variáveis de ambiente para transição fluida entre local e produção.

## Requisitos do Sistema

### Requisitos Funcionais (RF)

* **RF01 - Controles de Reprodução (Play/Pause/Skip)**
  * **Descrição:** Implementar as funções básicas de controle do fluxo de áudio para permitir a interação do usuário com a música.
  * **Critérios de Aceite:**
    * Alternar ícones de Play e Pause dinamicamente conforme o estado do áudio.
    * Botão "Next" deve carregar a próxima faixa da lista.
    * Botão "Prev" deve reiniciar a faixa atual ou voltar para a anterior.


* **RF02 - Barra de Progresso Interativa (Seek Bar)**
  * **Descrição:** Visualizar o tempo decorrido da música e permitir o salto para trechos específicos da timeline.
  * **Critérios de Aceite:**
    * Atualizar a barra em tempo real conforme o progresso do áudio.
    * Formatar tempo decorrido e total no padrão `mm:ss`.
    * Implementar funcionalidade de clique ou arraste para navegar na posição do áudio.


* **RF03 - Controle de Volume**
  * **Descrição:** Permitir que o usuário ajuste a intensidade sonora da aplicação ou silencie o áudio rapidamente.
  * **Critérios de Aceite:**
    * Implementar input range funcional para ajuste de volume (0 a 100).
    * Criar botão de Mute que preserva o estado do volume anterior ao ser desativado.
    * Exibir feedback visual no ícone de volume conforme o nível selecionado.

### Requisitos Não Funcionais (RNF)

* **RNF01 - Interface Responsiva (Mobile-First)**
  * **Descrição:** Garantir que os controles do player sejam acessíveis e o layout se ajuste corretamente a diferentes tamanhos de tela.
  * **Critérios de Aceite:**
    * Utilizar breakpoints do Tailwind CSS para adaptação de layout (Mobile/Desktop).
    * Garantir áreas de clique (touch targets) de no mínimo 44px para dispositivos móveis.
    * Otimizar o carregamento de imagens (capas dos álbuns) para conexões móveis.


* **RNF02 - Acessibilidade Web (a11y)**
  * **Descrição:** Tornar o player navegável via teclado e compatível com tecnologias assistivas para garantir inclusão.
  * **Critérios de Aceite:**
    * Adicionar `aria-label` em todos os botões que utilizam apenas ícones.
    * Suporte completo para navegação e acionamento via teclas `TAB` e `Espaço`.
    * Garantir contraste de cores adequado entre os textos e o fundo da aplicação.

## Diagramas C4 - Arquitetura do Sistema

### Nível 1: Diagrama de Contexto
![Diagrama de Contexto](https://imgur.com/S3xAM1n.png)

### Nível 2: Diagrama de Contêineres
![Diagrama de Contêineres](https://imgur.com/IJLevds.png)

### Nível 3: Diagrama de Contêineres
**API Catálogo e Streaming:**

![Componentes - Catálogo e Streaming](https://imgur.com/SQ1gMf0.png)

**API Login e Cadastro:**

![Componentes - Login e Cadastro](https://imgur.com/RiJeZ46.png)

**API Playlists:**

![Componentes - Playlists](https://imgur.com/c72nxSB.png)

**API Admin:**

![Componentes - ADM](https://imgur.com/Kd21Ap1.png)

## Atribuições e Responsabilidades
- Protótipo e Front-end: [Lucas Moraes](https://github.com/hub-Moraes)
- Banco de Dados e Back-end: [Vitor Keller](https://github.com/vitorkeller)
