import { defineConfig, devices } from '@playwright/test'

// Fase 2 do ROADMAP.md — suíte de teste persistida, substituindo os
// scripts avulsos que eram escritos, rodados uma vez, e descartados a
// sessão inteira. `webServer` sobe um build de produção real antes dos
// testes — a mesma coisa que valida manualmente antes de cada entrega,
// agora automatizada.
//
// PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH: opcional, só necessária em
// ambientes sem acesso a cdn.playwright.dev (ex: sandboxes com rede
// restrita). Em desenvolvimento normal e no CI do GitHub Actions, deixe
// essa variável vazia — `npx playwright install chromium` baixa o
// binário certo automaticamente.
export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  reporter: 'list',

  use: {
    baseURL: 'http://localhost:3000',
    trace: 'on-first-retry',
    ...(process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH && {
      launchOptions: { executablePath: process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH },
    }),
  },

  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],

  webServer: {
    // A raiz "/" retorna 404 (este projeto não tem página nela — tudo
    // fica sob /style-guides). Achado real durante a Fase 2: apontar o
    // healthcheck pra "/" fazia o webServer nunca ser considerado pronto,
    // travando em timeout mesmo com build e start funcionando
    // perfeitamente quando testados isolados.
    //
    // Comando condicional (Fase 3): no CI, o workflow já roda `npm run
    // build` como passo separado antes dos testes (Fase 1) — repetir o
    // build aqui dobraria o tempo de CI à toa. Localmente, builda sempre,
    // por conveniência de quem só quer rodar `npm test` sem lembrar de
    // buildar antes.
    command: process.env.CI ? 'npm run start' : 'npm run build && npm run start',
    url: 'http://localhost:3000/style-guides',
    reuseExistingServer: !process.env.CI,
    timeout: 180_000,
  },
})
