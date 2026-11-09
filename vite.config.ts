import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import {defineConfig} from 'vite';

function caixaApiPlugin() {
  return {
    name: 'caixa-api-proxy',
    configureServer(server: any) {
      server.middlewares.use('/api/loterica', async (req: any, res: any) => {
        try {
          const urlObj = new URL(req.url || '', `http://${req.headers.host || 'localhost'}`);
          const rawCode = urlObj.pathname.replace(/^\//, '').trim() || urlObj.searchParams.get('codigo') || '';
          const digitsMatch = rawCode.match(/(\d{1,6})/);
          if (!digitsMatch) {
            res.statusCode = 400;
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({ error: 'Código inválido' }));
            return;
          }
          const lotericaCode = digitsMatch[1];
          // Caixa REST endpoint for lotérica by code (bG90ZXJpY2FzL25vbWUtbG90ZXJpY28= is base64 of 'lotericas/nome-loterico')
          const caixaUrl = `https://www.loteriasonline.caixa.gov.br/silce-servico-rest/rest/v1/bG90ZXJpY2FzL25vbWUtbG90ZXJpY28=/?nomeCodigo=${encodeURIComponent(lotericaCode)}`;
          
          const controller = new AbortController();
          const timeoutId = setTimeout(() => controller.abort(), 6000);

          const response = await fetch(caixaUrl, {
            signal: controller.signal,
            headers: {
              'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
              'Accept': 'application/json, text/plain, */*',
              'Subcanal': '1'
            }
          });
          clearTimeout(timeoutId);

          if (!response.ok) {
            res.statusCode = response.status;
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({ error: `Caixa API error: ${response.status}` }));
            return;
          }

          const data = await response.json();
          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify(data));
        } catch (err: any) {
          res.statusCode = 500;
          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify({ error: err.message || 'Erro ao consultar Caixa' }));
        }
      });
    }
  };
}

export default defineConfig(() => {
  return {
    plugins: [react(), tailwindcss(), caixaApiPlugin()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      // Do not modify—file watching is disabled to prevent flickering during agent edits.
      hmr: process.env.DISABLE_HMR !== 'true',
      // Disable file watching when DISABLE_HMR is true to save CPU during agent edits.
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});

