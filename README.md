# 🎯 Prompt Manager

### 📖 Sobre o Projeto

**Prompt Manager** é um projeto **full-stack educacional** que demonstra:

✅ Arquitetura Limpa (Clean Architecture)  
✅ Testes Automatizados (Jest + Playwright)  
✅ Type Safety end-to-end (TypeScript + Zod)  
✅ Design orientado para Escalabilidade  
✅ Animações e UX fluida  

Um simples gerenciador de prompts (CRUD) construído com rigor de software enterprise—masterclass de como fazer certo.

---

### 🛠 Stack de Tecnologias

**Frontend:**
- Next.js 16 + React 19 + TypeScript
- Tailwind CSS 4 + shadcn/ui + Radix UI
- react-hook-form + Zod (validação)
- Motion (animações) + sonner (toasts)

**Backend & Banco:**
- Prisma 7 (ORM type-safe)
- PostgreSQL 17 (Docker)
- Server Actions (Next.js)

**Qualidade & Testing:**
- Biome 2.2 (linter + formatter rápido)
- Jest 30 (testes unitários)
- Playwright 1.58 (E2E testing)

---

### 🏗 Arquitetura (Clean Architecture)

```
src/core/                    # Lógica de Negócio
├── domain/                  # Entidades & Interfaces
├── application/             # Use Cases & DTOs
└── errors/                  # Erros customizados

src/infra/                   # Implementações (Prisma)
src/app/                     # Next.js & Server Actions
src/components/              # React Components
```

**Benefícios:**
- 🔄 Lógica independente do framework
- 🧪 Altamente testável
- 🔌 Implementações intercambiáveis (Repository Pattern)
- 📈 Escalável desde dia 1

---

### 🎯 Decisões Arquiteturais

1. **Repository Pattern** → Abstrai acesso a dados, permite trocar Prisma por outro ORM
2. **Use Cases** → Cada operação de negócio é uma classe isolada e testável
3. **DTOs + Zod** → Validação em limites do sistema, schemas reutilizáveis
4. **Server Actions** → Backend seguro sem API routes separadas
5. **Prisma com PrismaPg** → Type-safe, performance ótima com PostgreSQL
6. **Biome** → Setup rápido (uma ferramenta, sem ESLint/Prettier)
7. **Testing em 2 níveis** → Jest (testes rápidos) + Playwright (fluxos reais)
8. **Motion** → Animações declarativas e suaves

---

### 🚀 Começar Rápido

```bash
# 1. Instalar dependências
pnpm install

# 2. Iniciar banco de dados
docker-compose up -d

# 3. Setup de banco
pnpm db:migrate
pnpm db:seed

# 4. Rodar aplicação
pnpm dev
# Acesse http://localhost:3000
```

**Variáveis de Ambiente:**
```
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/prompt_manager
```

---

### 🧪 Testes

```bash
# Testes unitários
pnpm test

# Testes E2E (multi-browser)
pnpm test:e2e

# Relatório de cobertura
pnpm test --coverage
```

**Abordagem:**
- **Jest** → Components, use cases, lógica
- **Playwright** → Fluxos completos do usuário (criar, editar, deletar, buscar)
- **Multi-browser** → Chromium, Firefox, WebKit

---

### 📊 Modelo de Dados

```prisma
model Prompt {
  id        String   @id @default(cuid())
  title     String   @unique
  content   String
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}
```

**Use Cases:** Create, Update, Delete, GetAll, SearchByTitle

---

### 📋 Scripts Principais

```bash
pnpm dev              # Dev server
pnpm build            # Build production
pnpm start            # Start production
pnpm test             # Jest
pnpm test:e2e         # Playwright
pnpm lint             # Biome lint
pnpm format           # Biome format
pnpm db:migrate       # Prisma migrations
pnpm db:seed          # Seed data
```

---

### 🌱 Escalabilidade

Este design permite crescimento:

- **Autenticação** → Adicionar userId em prompts
- **Caching** → Redis sem alterar lógica (Repository Pattern)
- **Tagging** → Categorização e filtros
- **Full-text search** → Postgresql capabilities
- **Versionamento** → Histórico de edições
- **API pública** → Reutilizar use cases

---

### 🎓 O Que Se Aprende

1. Clean Architecture em prática
2. Domain-Driven Design
3. Padrões: Repository, Use Case, DTO
4. TypeScript rigoroso
5. Testes automatizados (unit + E2E)
6. Prisma + PostgreSQL
7. Next.js App Router
8. shadcn/ui e Radix

---

**Construído com ❤️ como masterclass de arquitetura**
