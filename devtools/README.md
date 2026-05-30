Uso rápido

1. Assegure que o servidor local esteja rodando (Live Server geralmente em http://127.0.0.1:5500).
2. No terminal, instale dependências e rode a varredura:

```bash
cd devtools
npm install
npm run axe
```

3. O relatório será gerado em `devtools/axe-report.json` e um resumo será impresso no console.

Obs: se o seu servidor usa outra porta, rode `node run-axe.js http://127.0.0.1:5501`.
