# kinetic-solutions

Site da Kinetic Solutions (KSI): React + TypeScript + Vite + Tailwind, deploy Netlify (`netlify.toml`).

Scripts: `dev`, `build`, `preview`, `lint` (`tsc --noEmit`), `clean` (`rm -rf dist`, exige shell tipo bash).

## Regras comuns

- `.env*` nunca é lido, impresso nem commitado (nomes das variáveis: `.env.example`, quando existir).
- Sem `git push`/deploy sem pedido; commits com caminhos explícitos (nada de `git add .`).
- Os comandos citados vêm do `package.json` (quando o repo tem um) e **não foram executados** (`node`/`npm` fora do PATH nesta máquina). Confirme antes de afirmar que passam.
