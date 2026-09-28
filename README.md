# 🚀 Facilitei - Plataforma de Serviços Locais

**Facilitei** é uma aplicação web moderna construída com React, projetada para ser a ponte definitiva entre clientes que necessitam de serviços locais e profissionais qualificados (trabalhadores) que buscam oportunidades.

A plataforma oferece um ecossistema completo onde clientes podem encontrar, filtrar e contratar prestadores de serviço com segurança, enquanto os profissionais gerenciam suas solicitações, perfis e agenda de forma eficiente.

## 📜 Descrição do Sistema

O Facilitei é um marketplace de duas vias:

  * **Para Clientes:** Permite que usuários se cadastrem, busquem profissionais por diversas categorias (Construção, Serviços Domésticos, Técnicos, etc.), filtrem por localização e nota, visualizem perfis detalhados e solicitem serviços. Após a conclusão, os clientes podem aprovar o serviço e avaliar o profissional, garantindo um sistema de reputação transparente.
  * **Para Trabalhadores:** Profissionais podem se cadastrar, definir os serviços que oferecem, gerenciar um perfil público, receber e gerenciar solicitações de novos serviços (aceitando ou recusando), e também avaliar os clientes após a conclusão do trabalho.

A plataforma inclui dashboards dedicados para cada tipo de usuário, um sistema de autenticação, gerenciamento de estado global com Zustand e um chat em tempo real (via StompJS/WebSockets) para facilitar a comunicação sobre serviços em andamento.

## ✨ Features Principais

  * **Autenticação e Perfis:** Sistema de cadastro e login para Clientes e Trabalhadores.
  * **Busca e Filtragem:** Página dedicada (`/dashboard/solicitar`) para filtrar profissionais por categoria, serviço específico, nome, localização (cidade/UF) e nota mínima.
  * **Dashboard do Cliente:** Visualiza serviços ativos, aprova finalizações, contesta e avalia serviços concluídos.
  * **Dashboard do Trabalhador:** Recebe e gerencia novas solicitações (aceitar/recusar), acompanha serviços em andamento e avalia clientes.
  * **Sistema de Avaliação Mútuo:** Clientes avaliam trabalhadores (impactando a nota do perfil) e trabalhadores avaliam clientes.
  * **Gerenciamento de Serviços:** Fluxo de status completo (`PENDENTE`, `EM_ANDAMENTO`, `PENDENTE_APROVACAO`, `FINALIZADO`, `CANCELADO`).
  * **Chat em Tempo Real:** Comunicação direta entre cliente e trabalhador para serviços ativos (`/dashboard/chat/:servicoId`).
  * **Design Responsivo:** Interface adaptável para dispositivos móveis e desktop, com animações fluidas (Framer Motion).

## 🛠️ Tecnologias Utilizadas

Este projeto foi construído com um ecossistema moderno de front-end:

  * **Core:** [React 19](https://react.dev/), [Vite](https://vitejs.dev/), [TypeScript](https://www.typescriptlang.org/)
  * **Roteamento:** [React Router DOM](https://reactrouter.com/) (v7)
  * **Estilização:** [TailwindCSS](https://tailwindcss.com/)
  * **Gerenciamento de Estado:**
      * [Zustand](https://zustand-demo.pmnd.rs/): Para estado global (autenticação do usuário).
      * [TanStack Query](https://tanstack.com/query/latest): Para gerenciamento de estado do servidor (fetching, caching, e mutações de API).
  * **Animações:** [Framer Motion](https://www.framer.com/motion/)
  * **Formulários:** [React Hook Form](https://react-hook-form.com/) & [Zod](https://zod.dev/) (para validação de schema).
  * **Notificações:** [React Hot Toast](https://react-hot-toast.com/)
  * **Comunicação Real-time:** [@stomp/stompjs](https://stomp-js.github.io/) (para o chat WebSocket).

## ⚙️ Instruções de Execução

O frontend consome a API Spring Boot real por meio do proxy `/api`. Em
desenvolvimento, o Vite encaminha as requisições HTTP e WebSocket para
`http://localhost:8080`; portanto, inicie a API separadamente antes do front.

### Pré-requisitos

  * [Node.js](https://nodejs.org/) (v18 ou superior)
  * [NPM](https://www.npmjs.com/) ou [Yarn](https://yarnpkg.com/)

### 1\. Clonar o Repositório

```bash
git clone <url-do-seu-repositorio>
cd facilitei-react
```

### 2\. Instalar as Dependências

```bash
npm install
```

### 3\. Iniciar a Aplicação React (Frontend)

```bash
npm run dev
```

A aplicação estará disponível em `http://localhost:5173` (ou outra porta indicada pelo Vite).

### Executar o ambiente completo com Docker

O Compose inicia MySQL, API, frontend e um servidor SMTP local para testar a
recuperação de senha:

```bash
docker compose up --build -d
```

Serviços disponíveis:

  * Frontend: `http://localhost:8080`
  * Swagger da API: `http://localhost:8081/swagger-ui/index.html`
  * Caixa de e-mail local (Mailpit): `http://localhost:8025`

### Configurar notificações push

O sino do painel e as notificações internas funcionam para todos os usuários
autenticados. Para também receber avisos com o PWA fechado, copie `.env.example`
para `.env` e configure um par VAPID exclusivo do ambiente:

```bash
npx web-push generate-vapid-keys
```

Preencha `WEB_PUSH_PUBLIC_KEY`, `WEB_PUSH_PRIVATE_KEY` e `WEB_PUSH_SUBJECT` antes
de executar o Compose. Nunca versione a chave privada. A permissão do navegador
é solicitada somente quando o usuário clica em “Ativar notificações”. Em iPhone
ou iPad, o site precisa estar instalado na tela inicial para usar Web Push.

### Administração e suporte

Defina `APP_ADMIN_EMAILS` no `.env` com uma ou mais contas já cadastradas,
separadas por vírgula. Após um novo login, essas contas recebem acesso a
`/admin`, onde podem triar denúncias e disputas, assumir atendimentos, registrar
notas internas, responder ao usuário e documentar a resolução. Usuários comuns
abrem e acompanham protocolos em `/painel/suporte`.

Para encerrar os containers preservando os dados do MySQL:

```bash
docker compose down
```

### Rotas públicas

As rotas `/dashboard`, `/dashboard/solicitar` e `/trabalhador/:id` são públicas
intencionalmente para permitir a descoberta de profissionais. A contratação,
configurações e o chat continuam exigindo autenticação. A recuperação de senha
usa `/recuperar-senha`; os links enviados pela API abrem `/reset-password?token=...`.

### Contrato aguardado para o portfólio

A seção de portfólio já está preparada no front e permanece desabilitada quando
a API responde `404`. O contrato isolado em `src/lib/portfolio.ts` aguarda
`GET /api/portfolio/trabalhador/{id}`, `POST /api/portfolio` e
`DELETE /api/portfolio/{id}`. O `POST` recebe `trabalhadorId`, `url` e a
`descricao` opcional; a URL da imagem é gerada pelo upload já existente.

## 📂 Estrutura de Diretórios (Simplificada)

A arquitetura do projeto está organizada da seguinte forma:

```
facilitei-react/
├── public/
│   └── avatars/         # Imagens de perfil mockadas
├── src/
│   ├── components/
│   │   ├── layout/      # Componentes de layout (Header, Footer, MainLayout)
│   │   └── ui/          # Componentes de UI reutilizáveis (Button, Card, Input, Modal, etc.)
│   ├── lib/
│   │   └── variants.ts  # Variantes de animação (Framer Motion)
│   ├── pages/
│   │   ├── AboutPage.tsx
│   │   ├── ChatPage.tsx
│   │   ├── DashboardClientePage.tsx
│   │   ├── DashboardTrabalhadorPage.tsx
│   │   ├── HomePage.tsx
│   │   ├── LoginPage.tsx
│   │   ├── RegisterPage.tsx
│   │   ├── SettingsRootPage.tsx
│   │   ├── SolicitarServicoPage.tsx
│   │   └── ...
│   ├── routes/
│   │   ├── ProtectedRoute.tsx # Rota protegida por autenticação
│   │   └── index.tsx        # Configuração principal do React Router
│   ├── store/
│   │   └── useAuthStore.ts  # Store global de autenticação (Zustand)
│   ├── types/
│   │   └── api.ts           # Definições de tipos (TypeScript)
│   ├── main.tsx             # Ponto de entrada da aplicação
│   └── index.css            # Estilos globais (Tailwind)
├── package.json
└── tailwind.config.js
```

## 🤝 Contribuições da Equipe

Este projeto foi o resultado de um esforço colaborativo de toda a equipe. Todos os membros participaram ativamente das discussões, planejamento e desenvolvimento das funcionalidades.

  * **Arthur**
  * **Sávio**
  * **Ricardo**
  * **Pedro**
  * **Jorge**
  * **Leandro**
