const fs = require('fs');
const path = require('path');
const puppeteer = require('puppeteer');
const axeCore = require('axe-core');

(async () => {
  const url = process.argv[2] || 'http://127.0.0.1:5500';
  console.log(`Abrindo ${url} ...`);
  const browser = await puppeteer.launch({
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });
  const page = await browser.newPage();
  try {
    const res = await page.goto(url, {
      waitUntil: 'networkidle2',
      timeout: 30000,
    });
    if (!res || res.status() >= 400) {
      console.warn('Aviso: resposta da requisição non-OK', res && res.status());
    }

    // injeta o source do axe-core no contexto da página
    await page.evaluate((axeSource) => {
      // eslint-disable-next-line no-eval
      eval(axeSource);
    }, axeCore.source);

    // execute axe
    const results = await page.evaluate(async () => {
      return await axe.run(document, {
        // configure conforme necessário
        runOnly: {
          type: 'tag',
          values: ['wcag2a', 'wcag2aa'],
        },
      });
    });

    const outPath = path.resolve(__dirname, 'axe-report.json');
    fs.writeFileSync(outPath, JSON.stringify(results, null, 2));
    console.log(`Relatório salvo em: ${outPath}`);
    console.log(`Violations: ${results.violations.length}`);
    results.violations.forEach((v) => {
      console.log(`- [${v.id}] ${v.help} (${v.nodes.length} nós)`);
    });
  } catch (err) {
    console.error('Erro ao executar a varredura axe:', err);
  } finally {
    await browser.close();
  }
})();
