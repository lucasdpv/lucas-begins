# 📜 Histórico de Evolução | Lucas Begins

Este documento registra os marcos de desenvolvimento, melhorias de interface e implementações técnicas do portal **Lucas Begins**.

---

## 🧩 [v3.1.0] - The Block Master & Drag Update
*Data: 14 de Maio de 2026*

### 🧱 Editor de Blocos (Block Editor)
- **Drag-and-Drop Reordering**: Implementação de sistema de arraste e solte (`framer-motion`) para reordenação fluida de blocos de conteúdo, facilitando a montagem da estrutura do post.
- **Floating Toolbar**: Substituição dos controles estáticos por uma barra de ferramentas flutuante no topo de cada bloco, contendo ações de movimentação e exclusão rápida.
- **Enhanced Safety**: Adição de divisor visual no botão de exclusão para prevenir cliques acidentais e remoção do conflito visual com seletores de imagem.
- **Unified Controls**: Centralização da lógica de blocos para garantir que capas e imagens de conteúdo sigam o mesmo padrão de recorte (16:9).

### 🖼️ Mídia & Upload
- **Global Image Stability**: Correção de bug crítico que disparava salvamento precoce do post durante o recorte de fotos. Agora todos os botões de modal são protegidos (`type="button"`).
- **Aspect Ratio Sync**: Padronização de todas as imagens do corpo do texto para a proporção **16:9**, espelhando a estética das imagens de capa.

### ⚙️ UX & Navegação
- **Bottom Preview Toggle**: Adição de botões secundários de "Editar/Preview" no rodapé da página de edição e pré-visualização, otimizando o workflow em matérias extensas.
- **Smooth Navigation**: Implementação de scroll automático para o topo ao trocar de abas no rodapé, garantindo uma revisão sem interrupções.

### 🛠️ Manutenção
- **Version Bump**: Atualização global para v3.1.0, focada em produtividade e estabilidade do CMS.

---

## ⚖️ [v3.0.1] - The Legal & SEO Update
*Data: 13 de Maio de 2026*

### ✨ Legal & Privacidade
- **Política de Privacidade**: Criação da página oficial de privacidade (`/privacy`) abordando uso de Cookies (Google AdSense), armazenamento do Firebase Auth e LGPD.
- **Cookie Consent Banner**: Implementação de um banner global, animado com framer-motion e design Neo-Brutalista, persistindo a aprovação do usuário no `localStorage`.
- **Login Disclaimer**: Adição do termo de consentimento e link direto no Modal de Login para blindar o site juridicamente.

### 🌐 SEO & Indexação
- **Sitemap & Robots**: Atualização do `robots.txt` bloqueando rotas administrativas (`/admin`, `/editor`, `/dashboard`) e correção do `sitemap.xml` para apontar para as rotas corretas do React.

---

## 🎨 [v3.0.0] - The Ultimate UI Polish & Dynamic Navigation
*Data: 13 de Maio de 2026*

### ✨ UI/UX: Refinamento Minimalista
- **Slim Footer Bar**: Redesign radical do rodapé para uma estética ultra-slim e minimalista, reduzindo a altura e removendo poluição visual para um fechamento de página mais elegante.
- **Light Mode Accessibility**: Grande revisão de contraste no Modo Claro. Subtítulos agora usam `slate-700` para melhor leitura, metadados tiveram opacidade aumentada e cabeçalhos dinâmicos corrigidos para evitar invisibilidade em fundos claros.
- **Search Visibility**: Otimização completa dos campos de busca com placeholders e ícones de alto contraste, garantindo que a funcionalidade seja imediatamente legível no modo claro.
- **Social Icon Overhaul**: Transição de efeitos de hover estáticos para dinâmicos (Purple/Pink) que se adaptam ao tema e fornecem feedback visual premium.

### ⚙️ Navegação Inteligente
- **Dynamic Category Menu**: Implementação de lógica de filtragem em tempo real no Navbar. Categorias vazias (sem posts publicados) são ocultadas automaticamente, garantindo que o usuário nunca encontre seções sem conteúdo.
- **Refined Section Labels**: Remoção de efeitos de "glow" (brilho) em textos sobre fundos claros para garantir nitidez absoluta em telas de alta resolução.

### 🛠️ Documentação & Firebase
- **Firebase Universal Guide**: Criação de um guia mestre em Markdown para facilitar a replicação da infraestrutura de backend em outros projetos.
- **Version Jump**: Atualização global para v3.0.0, marcando o amadurecimento final da interface do portal.

---

## 💎 [v2.7.0] - The Seamless Glass Update
*Data: 12 de Maio de 2026*

### ✨ Redesign: Seamless Glass Navbar
- **Glassmorphism Overhaul**: Transição do cabeçalho rígido para uma estética "Seamless Glass" (vidro contínuo), utilizando transparências suaves (`bg-white/10`) e desfoque de fundo (`backdrop-blur`) para um visual ultra-premium e leve.
- **Integrated Control Dock**: Substituição dos balões e recipientes monolíticos por um sistema de "Nodos Flutuantes". Agora os controles de busca, redes sociais e menu de usuário integram-se de forma fluida à barra, eliminando divisores físicos (pipes) e bordas excessivas.
- **Readability & Typography**: Implementação de tipografia extra-bold (`font-black`) em todos os elementos de navegação para garantir acessibilidade e clareza, mantendo a identidade visual forte do projeto.
- **Glass Login Button**: Redesign completo do botão de Login, abandonando o estilo Neo-Brutalista pesado por um botão de vidro roxo translúcido que se alinha perfeitamente ao novo ritmo horizontal.

### 🔍 UX & Busca
- **Hybrid Search Bar**: Refinamento do campo de busca com fundo de baixo contraste que ganha destaque apenas no foco, proporcionando uma navegação menos intrusiva.
- **Horizontal Rhythm**: Ajuste preciso de gaps e paddings para garantir que a interface se comporte de forma equilibrada tanto para usuários logados (Admin/User) quanto para visitantes.

---

## 📱 [v2.6.0] - The Social Connection Update
*Data: 12 de Maio de 2026*

### 🌐 Integração com Redes Sociais
- **Social Hub**: Implementação de links diretos para Instagram e Threads no cabeçalho (Navbar) e rodapé (Footer), facilitando o engajamento do público.
- **Mobile Connectivity**: Adição de atalhos de redes sociais no menu lateral mobile para acesso rápido em dispositivos móveis.
- **Unified Icons**: Padronização dos ícones de redes sociais com estética retro e efeitos de hover dinâmicos.

### 🛠️ Refinamento de Rodapé & Estabilidade
- **Multiplayer Hub Cleanup**: Limpeza da seção social do rodapé, removendo ícones não utilizados (YouTube/Twitch) e adicionando selo de "Em Breve" para o X (Twitter).
- **Merge Stability**: Resolução de conflitos críticos entre as branches de desenvolvimento, garantindo a integridade dos sistemas de Cropper e Compressão de imagens.
- **Version Bump**: Atualização global para v2.6.0.

---

## 🎨 [v2.5.0] - The Advanced Media & Interactivity Update
*Data: 11 de Maio de 2026*

### ✂️ Edição de Mídia & Cropper
- **Interactive Image Cropping**: Integração da biblioteca `react-easy-crop`. Agora é possível ajustar zoom e posição da imagem antes do upload.
- **Molduras Inteligentes**: Suporte a corte circular para avatares e proporção 16:9 para capas de posts, garantindo visual consistente em todo o site.
- **Smart Compression v2**: Otimização automática (max 1MB) integrada ao fluxo de edição, economizando storage e acelerando o carregamento.

### 📟 Nova Experiência 404
- **BIOS Terminal Interface**: Redesign interativo da página 404 que simula um boot de sistema retrô com logs animados e comandos (`GOTO_HOME`, `REBOOT`).
- **Estabilidade de Animação**: Correção de bugs de renderização no loop de logs para evitar crashes abruptos.

### 🌐 SEO & Social Media
- **Advanced Metadata**: Implementação de metadados dinâmicos para SEO e redes sociais (Twitter Cards / OpenGraph).
- **Social Preview**: Posts agora exibem capas, títulos e resumos profissionais ao serem compartilhados.

### 🛠️ Manutenção
- **Version Bump**: Atualização global para v2.5.0.

---

## ⚔️ [v2.5.1] - The RPG & Terminal Update
*Data: 11 de Maio de 2026*

### 💬 RPG Contact System
- **Dialogue Box UI**: Redesign completo da página de contato. Agora utiliza uma caixa de diálogo estilo SNES com avatar animado.
- **Typing Effect**: Implementação de efeito de digitação de texto para as mensagens do Game Master (Player 1).
- **Gamified Form**: Campos de entrada renomeados para "Nickname", "Canal de Comunicação" e "Detalhes da Missão".

### 🔍 Subtle & Premium Search
- **Polished UI**: Redesign da barra de busca para um visual mais sutil e integrado à Navbar.
- **Improved UX**: Feedback visual suave ao focar no campo e transições fluidas no mobile com efeito de desfoque (backdrop-blur).
- **Theme Sync**: Cores e bordas ajustadas para perfeita harmonia com os modos claro e escuro.

---
## 🖼️ [v2.4.0] - The Image Hosting & Performance Update
*Data: 10 de Maio de 2026*

### ☁️ Firebase Image Hosting
- **Native Storage Integration**: Implementação de sistema de upload direto para o Firebase Storage, eliminando a dependência de URLs externas.
- **Auto Image Compression**: Integração da biblioteca `browser-image-compression` para otimizar imagens automaticamente antes do envio, economizando até 80% de espaço sem perda perceptível de qualidade.

### ✨ Novo Media Selector (UX/UI)
- **Unified Component**: Novo componente `ImageUpload` unificado que gerencia tanto Upload de arquivos quanto Links de URL com sistema de abas.
- **Drag & Drop & Preview**: Suporte a arrastar-e-soltar e visualização em tamanho real (Full-size Preview) com overlay de ações.
- **Layout Compacto**: Redesign do formulário no `PostEditor` e `Dashboard`, reduzindo espaços vazios e unificando a estética Neo-Brutalista arredondada.

### 🛠️ Estabilidade & Correções
- **Preview Lock**: Bloqueio de interações (curtidas, comentários, links) durante o modo de visualização para evitar inconsistências de dados.
- **Dashboard Fixes**: Resolução de crash ao carregar o ID do perfil e remoção de campos redundantes.
- **CORS Config**: Adição do arquivo `cors.json` para configuração correta do bucket do Firebase.

---

## 🚀 [v2.3.1] - UX & Navigation Fix
*Data: 09 de Maio de 2026*

### ✨ Melhorias de Navegação
- **Native Link Support**: Refatoração dos componentes `PostCard` e `Carousel` utilizando o padrão **Stretched Link**. Isso permite que o card inteiro seja um link real (`<a>`), habilitando funcionalidades nativas como "Abrir em nova aba" (botão do meio) e "Ctrl + Clique".
- **Limpeza de Lógica**: Remoção de navegação imperativa via código (`navigate`) na Home, favorecendo o comportamento declarativo e mais performático do navegador.

### 🛠️ Correções e Ajustes
- **Import Fixes**: Correção de caminhos de importação quebrados após a refatoração modular.
- **Merge Resolution**: Consolidação da branch após resolução de conflitos, garantindo a integridade da arquitetura v2.3.0.


## 🧩 [v2.3.0] - Architecture & Stability Overhaul
*Data: 09 de Maio de 2026*

### 🏛️ Arquitetura Modular
- **Decomposition of "God Components"**: Refatoração completa da `AdminPage` e `PostDetailPage` (antes com 1000+ linhas) em componentes atômicos e especializados.
- **Hooks Dedicados**: Centralização da lógica de mensagens e ações administrativas no hook `useAdminActions`, garantindo que o contador de mensagens nunca mais fique zerado ao entrar no painel.
- **Tipagem Estrita**: Resolução de erros de TypeScript em mutações de Like, Favoritos e Comentários, garantindo maior segurança na comunicação com o Firebase.

### ✨ UI/UX & Navbar
- **Meu Painel (Admin)**: Substituição do ícone de engrenagem pelo botão textual "MEU PAINEL", seguindo a mesma identidade visual premium do "MEU QG".
- **Navegação Inteligente**: Ajuste na Navbar para limpar a busca automaticamente ao selecionar categorias, além de garantir o scroll para o topo da página.

### 🚀 Performance & Robustez
- **Fetch Local Estratégico**: Transição da Home para o hook `useAllPosts`, permitindo busca global e filtragem de categorias instantâneas na memória, sem dependência de índices complexos do Firebase para consultas paginadas.
- **Sorting Resiliente**: Nova lógica de ordenação no `PostService` que suporta diversos formatos de timestamp e datas, prevenindo falhas de exibição na Home.


## 🛰️ [v2.1.0] - The Stability & Sync Update
*Data: 08 de Maio de 2026*

### 🚀 Sincronização Multi-Dispositivo
- **Firestore Server-First**: Desativação da persistência local agressiva para garantir que favoritos e XP sejam sincronizados instantaneamente entre Celular, Tablet e Desktop.
- **Cache Inteligente**: Redução do `staleTime` para zero no perfil do usuário, forçando a re-sincronização da "verdade do banco" a cada nova sessão ou navegação.
- **Linkagem Inteligente**: Implementado sistema de busca por ID/Slug na `PostDetailPage`, garantindo que favoritos antigos sempre levem ao post correto.

### 🪙 Refinamento de Gamificação
- **XP Justo**: Correção na lógica de Favoritos e Likes; agora o bônus de XP só é concedido na primeira interação (adicionar), evitando abusos de XP infinito.
- **Persistência de Novos Jogadores**: Agora o sistema cria automaticamente o documento do usuário ao ganhar o primeiro XP, eliminando a perda de progresso em contas novas.
- **Ajuste de Regras**: Recompensa por Comentário atualizada para **+20 XP** conforme a nova tabela de economia de jogo.

---

## 🏆 [v2.0.0] - The Community & Maintenance Update
*Data: 08 de Maio de 2026*

### 🎮 Sistema de Gamificação (XP & Level)
- **Progressão em Tempo Real**: Implementação de sistema de XP e Níveis para todos os usuários logados.
- **Recompensas por Ação**: Ganhos de XP automatizados e persistentes: Ler Artigo (+10 XP), Curtir (+5 XP), Comentar (+20 XP), Favoritar (+15 XP).
- **Sincronização Persistente**: Correção de bug crítico de sobrescrita; agora o progresso de Nível e XP é protegido contra perdas durante atualizações de perfil.

### 🏠 QG do Usuário (Dashboard 2.0)
- **Acesso Universal**: Liberação da rota `/dashboard` para todos os usuários autenticados, transformando-a no centro de comando do leitor.
- **Customização de Perfil**: Nova funcionalidade de edição de perfil (Nome, AKA, Bio, Avatar) disponível para todos os jogadores diretamente no Dashboard.
- **Interface Viva**: Dashboard agora exibe estatísticas em tempo real e barra de progresso de XP sincronizada instantaneamente com o Firestore.

### 🛠️ Ferramentas de Manutenção (Admin)
- **Aba de Ferramentas**: Nova seção administrativa dedicada à integridade e saúde do banco de dados.
- **Normalização de Dados**: Implementação de ferramenta para resetar contadores de visualizações inflados, ajustando-os para valores realistas baseados no engajamento real.

### 🛡️ Estabilidade & Segurança
- **Migração TypeScript**: Refatoração completa da arquitetura do projeto de JavaScript para TypeScript, garantindo tipagem estática e maior robustez contra bugs de tempo de execução.
- **Anti-Loop de Visualizações**: Implementação de trava técnica via `useRef` para impedir o consumo excessivo de cota do Firebase por múltiplos incrementos de views.
- **Refatoração de Permissões**: Novo `ProtectedRoute` com lógica de hierarquia inteligente, permitindo que Admins acessem áreas de usuários sem restrições.
- **Correções de Código**: Resolução de erros de referência e importação no `AdminPage` e `PostDetailPage`.

---

## 🎡 [v1.10.0] - Curation System & Manual Featured
*Data: 07 de Maio de 2026*

### ⚙️ Funcionalidades & Curadoria
- **Destaques Manuais**: Implementação de sistema de curadoria que permite aos administradores selecionar manualmente até 5 artigos para o carrossel da home.
- **Regra dos 5**: Lógica de validação em tempo real que impede a seleção de mais de 5 itens, com feedback visual (toasts) e bloqueio de interface.
- **Persistência isFeatured**: Adição do campo `isFeatured` ao modelo de posts no Firestore para persistência do estado de destaque.

### ✨ UI/UX & Painel Admin
- **Ações Centralizadas**: Agrupamento do botão de alternância de destaque (estrela) dentro da coluna de ações na tabela administrativa para melhor fluxo de trabalho.
- **Feedback Visual**: Implementação de ícones de estrela com preenchimento dourado e brilho neon para identificar artigos destacados no painel.
- **Editor Integrado**: Adição de checkbox de destaque na página de edição de artigos, respeitando as mesmas regras de limite.

### 🐛 Estabilidade & Performance
- **Correção de Cache (HMR)**: Resolução de conflitos de estado global que causavam erros de referência após atualizações de código.
- **Otimização de Contexto**: Refatoração do `AppProvider` para garantir que o estado dos posts e ações de curadoria sejam propagados corretamente para toda a aplicação.

---

## 🛠️ [v1.9.0] - Refactoring & Code Stability
*Data: 07 de Maio de 2026*

### ⚙️ Arquitetura & Estabilidade
- **Centralização de Erros**: Criação do `errorService.js` para padronizar o tratamento de exceções e traduzir erros do Firebase para mensagens amigáveis ao usuário.
- **Remoção de Logs**: Limpeza global de `console.log`, `console.error` e `console.warn` em todo o projeto, garantindo um console 100% limpo em produção.
- **Refatoração de Skeletons**: Correção de erros de referência (`ReferenceError`) e otimização da sintaxe nos componentes de carregamento.

### ✨ UI/UX & Refinamento
- **RetroSeparator Universal**: Implementação de um componente de separador padronizado com estética Neo-Brutalista para garantir visibilidade em todos os temas.
- **Consistência Mobile**: Revisão e padronização dos textos no menu mobile (Drawer) para alinhamento com a versão Desktop.
- **Correção de Fontes (CORS)**: Ajuste nas políticas de carregamento do Google Fonts via `index.html` e Service Worker (`sw.js`).

---

## 🦴 [v1.8.0] - Universal Skeleton Overhaul
*Data: 07 de Maio de 2026*

### ✨ UI/UX & Carregamento
- **Skeletons de Próxima Geração**: Redesign completo de todos os estados de carregamento (Home, Sobre, Artigos) para espelhar perfeitamente o design Neo-Brutalista.
- **Layout Mirroring**: Skeletons agora utilizam bordas rígidas, sombras sólidas (`shadow-[4px_4px_0px_rgba(0,0,0,1)]`) e labels flutuantes para consistência visual absoluta.
- **Zero Layout Shift**: Introdução do `CarouselSkeleton` na página inicial, simulando o carrossel e a sidebar em tempo real durante o fetch de dados.
- **Otimização de Percepção**: Placeholders de texto e blocos de conteúdo agora respeitam milimetricamente as dimensões dos componentes renderizados.

---

## 🕹️ [v1.7.0] - Neo-Brutalist & Stability Overhaul
*Data: 06 de Maio de 2026*

### 🎨 Design & Estética Neo-Brutalista
- **"Hard Edge" UI**: Transição para uma estética de console retro com cantos 100% retos (`rounded-none`) em cards de posts e containers principais.
- **Solid Shadows**: Implementação de sombras pretas sólidas e espessas (`shadow-[4px_4px_0px_rgba(0,0,0,1)]`) para criar profundidade tátil.
- **Refinamento de Sidebar**: Redesign da barra lateral "Mais Acessados" com foco em legibilidade e harmonia visual.
- **Botões "Moda Antiga"**: Retorno das bordas arredondadas (`rounded-xl`) exclusivamente para elementos de controle (Navbar e botões de ação), garantindo conforto visual e tátil.

### ⚙️ Estabilidade & Core
- **Contador de Acessos Universal**: Otimização do sistema de views para contabilizar acessos de usuários anônimos e logados de forma transparente.
- **Login Padronizado**: Re-estilização do acesso via AuthGate para seguir o padrão visual de botões premium do sistema.
- **Hierarquia de Ações**: Reorganização da barra de ferramentas do artigo para priorizar a experiência de leitura e interação social.

---

## 📱 [v1.6.1] - Mobile & Tablet UX Masterclass
*Data: 06 de Maio de 2026*

### ✨ UI/UX Responsivo
- **Redesign do Mobile Menu**: Substituição de cards pesados por um layout flat e minimalista para perfil de usuário e painel admin.
- **Accordion de Categorias**: Implementação de menu colapsável para categorias no mobile, economizando espaço vertical.
- **Busca Overlay (Fluída)**: Nova transição de pesquisa que sobrepõe a Navbar sem causar "pulos" de layout, garantindo 100% de fluidez.
- **Otimização iPad Pro**: Ajuste dos breakpoints para `xl` (1280px), garantindo que tablets de alta resolução recebam a interface mobile otimizada.
- **Acessibilidade Tátil**: Aumento dos alvos de toque e refinamento dos botões de Admin e Sair no menu.

---

## 🎨 [v1.6.0] - Premium Retro Overhaul & Admin UX
*Data: 05 de Maio de 2026*

### ✨ UI/UX & Redesign
- **Admin Inbox 2.0**: Implementação de linhas expansíveis no Inbox com visual de card detalhado e animações *slide-in*.
- **Sistema Universal de Modais**: Substituição de alertas do sistema por modais customizados com estética retrô, sombras 3D e feedback tátil.
### 🎨 Design & UX
- **Páginas de Contato e Sobre**: Redesign completo com caixas de diálogo estilo SNES, sombras sólidas e alinhamento reto para maior harmonia.
- **Sistema de Skeletons**: Atualização de todos os estados de carregamento (About, Admin, Contact) para espelhar perfeitamente os novos layouts 7xl.
- **Legibilidade Aprimorada**: Remoção global de `text-justify` em artigos e na página Sobre para evitar "rios de branco" e melhorar a leitura no mobile.
- **Visual Polish (Glow & DropCap)**: Implementação de efeito neon glow nos títulos e refinamento da letra capitular (Drop Cap) para um visual de revista de luxo.
- **Veredito Responsivo**: Redesign da seção de nota para garantir que o selo de score permaneça circular e bem posicionado em todas as telas.

### ⚙️ Funcionalidades & Backend
- **Integração Gmail Direct**: Botão "Responder Agora" que redireciona automaticamente para a aba de composição do Gmail Web.
- **Stats Sincronizadas**: Mensagens agora carregam no mount do Admin, mantendo os contadores de estatísticas sempre atualizados.
- **Correção de Data/Hora**: Ajuste no utilitário de formatação de data para suportar objetos nativos do JS e evitar "Data Desconhecida".

### 🐛 Estabilização
- **Limpeza de Debug Logs**: Remoção de mensagens excessivas no console para uma performance mais limpa.
- **Permissões Firebase**: Atualização das regras de segurança para permitir envio público de mensagens e leitura administrativa protegida.

---

## 🎨 [v1.5.1] - Modernização Visual & UX de Busca
*Data: 05 de Maio de 2026*

### ✨ UI/UX
- **Mega Menu de Categorias**: Redesign do dropdown de categorias para um formato de grade (2 colunas) com ícones e ponteiro indicador.
- **Busca com Memória (Cancelar)**: Implementação da funcionalidade de "Cancelar Busca" que retorna o usuário para a página anterior ao clicar no botão 'X'.
- **Refinamento de Alinhamento**: Ajuste fino no posicionamento dos elementos da Navbar e botões de ação.
- **Botão de Limpar Busca no Desktop**: Adicionado botão de cancelamento dinâmico na barra de pesquisa desktop.

---

## 🚀 [v1.5.0] - Refinamento de UX & PWA
*Data: 05 de Maio de 2026*

### ✨ UI/UX Mobile
- **Nova Busca Expansível**: Implementação de lupa na Navbar mobile que se expande com animação fluida, removendo a necessidade de abrir o menu para pesquisar.
- **Gaveta de Navegação (Drawer)**: Redesign do menu mobile para o formato lateral fixo com bloqueio de scroll no fundo.
- **Aesthetics Revert**: Restauração das cores sólidas (`bg-gray-900`) e bordas roxas para um visual mais focado e profissional.

### ⚙️ Funcionalidades & Performance
- **Busca Global**: Implementação de busca e filtragem em todo o banco de dados (Firebase), superando a limitação da paginação inicial.
- **Debounce de Pesquisa**: Adição de atraso inteligente de 400ms na busca para economizar recursos e evitar piscadas na tela.
- **Cache Local de Posts**: Sistema que carrega todos os posts uma única vez durante a busca e filtra instantaneamente na memória.
- **PWA Ready**: Configuração de manifestos, ícones de alta resolução e suporte para instalação como aplicativo nativo.

### 🐛 Correções de Bugs
- Fim do loop infinito no carregamento de posts.
- Correção de duplicidade de cartões na página inicial.
- Ajuste no "falso negativo" (mensagem de nenhum post encontrado) durante o carregamento de categorias.

---

## 🎨 [v1.4.0] - Modernização Premium & Glassmorphism
*Data: 04 de Maio de 2026*

### ✨ UI/UX
- **Deep Dark Theme**: Transição do visual retro rígido para um tema escuro profundo e moderno.
- **Glassmorphism**: Aplicação de efeitos de desfoque de fundo e transparência em cards de títulos para melhor legibilidade.
- **Tipografia**: Ajustes na hierarquia visual usando fontes como *Outfit* e *Inter*.
- **Newsletter**: Implementação de seção de captura de emails no rodapé.

---

## 🎨 [v1.3.0] - Interatividade & Melhorias Visuais
*Data: 04 de Maio de 2026*

### ✨ Features
- **Feedback Tátil**: Animações de clique e hover aprimoradas para simular botões de consoles clássicos.
- **Sistemas de Comentários**: Implementação de sistema de discussão e likes em tempo real.

---

## 🛠️ [v1.2.0] - Infraestrutura & CMS
*Data: 03 de Maio de 2026*

### ⚙️ Backend (Firebase)
- **Painel Administrativo**: Criação da interface de editor chefe para criação e edição de posts.
- **Sistema de Likes/Comentários**: Implementação de interações sociais em tempo real.
- **Slug System**: Geração automática de URLs amigáveis para SEO baseadas no título dos posts.

---

## 🏗️ [v1.1.0] - Fundação & Core
*Data: 01 de Maio de 2026*

### ⚙️ Arquitetura
- **React + Vite**: Setup inicial da aplicação com foco em performance de carregamento.
- **Tailwind CSS**: Estruturação do sistema de design baseado em variáveis de CSS customizáveis.
- **Context API**: Centralização de estados globais (Tema, Usuário, Posts).

---

> **Legenda:**
> - ✨ **UI/UX**: Melhorias visuais e de experiência do usuário.
> - ⚙️ **Funcionalidades**: Novas ferramentas e lógica de programação.
> - 🐛 **Correções**: Resolução de bugs e otimizações técnicas.
