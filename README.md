# Estudos Maria — Neonatologia

App de estudos com quiz e flashcards gerados a partir de 13 PDFs de
Perinatologia / Neonatologia. Funciona 100% no navegador, sem backend e sem
login — o progresso por tópico fica em `localStorage`.

- **150 questões** (objetivas e abertas) em 13 tópicos
- Em cada alternativa das objetivas, o app explica **por que está errada** (ou certa)
- Questões abertas com gabarito modelo + pontos-chave + auto-avaliação
- **80 flashcards** de conceitos-chave
- Barra de progresso por tópico (vermelho / âmbar / verde)
- Tema dark minimalista

## Stack

- [Next.js 14](https://nextjs.org/) (App Router) + TypeScript
- [Tailwind CSS](https://tailwindcss.com/)
- [Zod](https://zod.dev/) (validação dos dados)
- [Lucide Icons](https://lucide.dev/)
- [Vitest](https://vitest.dev/) (testes)
- Deploy: [Vercel](https://vercel.com/)

## Rodando localmente

```bash
npm install
npm run dev
# abre em http://localhost:3000
```

Scripts disponíveis:

| Script | Para quê |
|---|---|
| `npm run dev` | Desenvolvimento com hot reload |
| `npm run build` | Build de produção |
| `npm run start` | Serve o build de produção |
| `npm test` | Roda os testes unitários |
| `npm run validate:data` | Valida `topics.json`, `questions.json`, `flashcards.json` contra os schemas Zod |

## Estrutura

```
app/
  page.tsx                       home com tópicos + barras
  quiz/[topicId]/page.tsx        tela de quiz
  flashcards/[topicId]/page.tsx  tela de flashcards
components/
  TopicCard, QuestionCard, ObjectiveQuestion, OpenQuestion,
  Flashcard, ProgressBar, ResultSummary
lib/
  schema.ts      Zod + tipos TS (fonte única de verdade)
  storage.ts     wrapper do localStorage (com testes)
  progress.ts    cálculo de % e faixa de cor (com testes)
  questions.ts   carrega topics.json + questions.json
  flashcards.ts  carrega flashcards.json
data/
  topics.json       13 tópicos
  questions.json    150 questões (gerado a partir de data/blocks/)
  flashcards.json   80 flashcards
  blocks/           questões por tópico (facilita regeneração)
scripts/
  extract-pdfs.py   extrai texto dos PDFs em scripts/extracted/
  build-bank.ts     junta data/blocks/*.json em data/questions.json
  validate-data.ts  valida dados contra schemas Zod
```

## Regerar / editar o banco de questões

1. Edite os arquivos em `data/blocks/<topic>.json` (ou crie novos)
2. Rode `npx tsx scripts/build-bank.ts` para consolidar em `data/questions.json`
3. Rode `npm run validate:data` para checar que ficou válido

Cada questão objetiva exige **todas** as alternativas com `explanation` preenchido
(correta e incorretas) — é aí que o app ensina o porquê.

## Deploy no Vercel (2 passos)

### Opção A — via dashboard web

1. Crie um repositório Git com este projeto e faça push (GitHub, GitLab ou Bitbucket)
2. Em [vercel.com/new](https://vercel.com/new), importe o repositório
   - Framework: **Next.js** (detectado automaticamente)
   - Build command: `npm run build` (padrão)
   - Output directory: `.next` (padrão)
   - Install command: `npm install` (padrão)
3. Clique em **Deploy**. URL pública em ~1 minuto.

Não há variáveis de ambiente a configurar — o app é totalmente estático do ponto
de vista de dados (questões no repositório, progresso no navegador do usuário).

### Opção B — via CLI

```bash
npm install -g vercel
vercel login
vercel        # primeira vez, perguntas iniciais
vercel --prod # deploy em produção
```

## Licença

Uso privado para estudo. Conteúdo médico extraído de material de aula
(Perinatologia / Neonatologia) — respeite os direitos dos autores originais.
