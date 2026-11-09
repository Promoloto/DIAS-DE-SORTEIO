/**
 * Regras e utilitários de sorteios das Loterias Caixa
 */

export const SCHEDULE_DATA: Record<string, string[]> = {
  "Segunda": ["Lotofácil", "Quina", "Dupla Sena", "Lotomania", "Super Sete"],
  "Terça": ["Mega-Sena", "Lotofácil", "Quina", "Timemania", "Dia de Sorte"],
  "Quarta": ["Lotofácil", "Quina", "+Milionária", "Dupla Sena", "Lotomania", "Super Sete", "Federal"],
  "Quinta": ["Mega-Sena", "Lotofácil", "Quina", "Timemania", "Dia de Sorte"],
  "Sexta": ["Lotofácil", "Quina", "Dupla Sena", "Lotomania", "Super Sete"],
  "Sábado": ["Mega-Sena", "Lotofácil", "Quina", "+Milionária", "Timemania", "Dia de Sorte", "Federal"]
};

export const ALL_GAMES = [
  "Mega-Sena",
  "Lotofácil",
  "Quina",
  "+Milionária",
  "Dupla Sena",
  "Lotomania",
  "Timemania",
  "Dia de Sorte",
  "Super Sete",
  "Federal"
];

export const GAME_COLORS: Record<string, { bg: string; text: string; hex: string }> = {
  "Mega-Sena": { bg: "bg-emerald-700", text: "text-white", hex: "#048243" },
  "Lotofácil": { bg: "bg-purple-800", text: "text-white", hex: "#930089" },
  "Quina": { bg: "bg-blue-800", text: "text-white", hex: "#260085" },
  "+Milionária": { bg: "bg-slate-900", text: "text-amber-300", hex: "#1d2342" },
  "Dupla Sena": { bg: "bg-rose-800", text: "text-white", hex: "#a61324" },
  "Lotomania": { bg: "bg-amber-600", text: "text-white", hex: "#f78100" },
  "Timemania": { bg: "bg-yellow-400", text: "text-green-950", hex: "#009944" },
  "Dia de Sorte": { bg: "bg-amber-700", text: "text-white", hex: "#cb852b" },
  "Super Sete": { bg: "bg-lime-600", text: "text-white", hex: "#9ecb3c" },
  "Federal": { bg: "bg-sky-700", text: "text-white", hex: "#1b4a78" }
};

/**
 * Extrai os 4 dígitos do código da lotérica a partir de um link ou texto digitado.
 */
export function extractLotteryCode(input: string): string {
  if (!input) return "4832";
  const trimmed = input.trim();
  // Se contiver padrão de URL da Caixa ou código de 4 dígitos
  const urlMatch = trimmed.match(/bolao-caixa\/(\d{4})/i) || trimmed.match(/\/(\d{4})(?:\/|$)/);
  if (urlMatch && urlMatch[1]) {
    return urlMatch[1];
  }
  const digitsMatch = trimmed.match(/(\d{4})/);
  if (digitsMatch && digitsMatch[1]) {
    return digitsMatch[1];
  }
  return "4832";
}

/**
 * Constrói a URL oficial do Bolão Caixa da lotérica com base no código de 4 dígitos.
 */
export function buildCaixaBolaoUrl(codeOrUrl: string): string {
  const code = extractLotteryCode(codeOrUrl);
  return `https://www.loteriasonline.caixa.gov.br/silce-web/#/bolao-caixa/${code}`;
}

/**
 * Retorna os dias em que um determinado jogo é sorteado.
 */
export function getDaysForGame(game: string): string[] {
  const days: string[] = [];
  for (const [day, games] of Object.entries(SCHEDULE_DATA)) {
    if (games.includes(game)) {
      days.push(day);
    }
  }
  return days;
}

/**
 * Retorna os jogos que ocorrem em um determinado dia.
 */
export function getGamesForDay(day: string): string[] {
  return SCHEDULE_DATA[day] || [];
}

/**
 * Gera a string SVG de um QR Code com fundo transparente, compatível com importação no CorelDRAW.
 */
export function generateSvgQrCode(
  data: string,
  color: string = "#003366",
  moduleMatrix: boolean[][] = []
): string {
  if (!moduleMatrix || moduleMatrix.length === 0) {
    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="100%" height="100%"><rect width="100%" height="100%" fill="none"/></svg>`;
  }

  const moduleCount = moduleMatrix.length;
  const cellSize = 8;
  const margin = 16;
  const size = moduleCount * cellSize + margin * 2;

  const rects: string[] = [];
  for (let r = 0; r < moduleCount; r++) {
    for (let c = 0; c < moduleCount; c++) {
      if (moduleMatrix[r][c]) {
        const x = c * cellSize + margin;
        const y = r * cellSize + margin;
        rects.push(`<rect x="${x}" y="${y}" width="${cellSize}" height="${cellSize}" fill="${color}"/>`);
      }
    }
  }

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${size} ${size}" width="100%" height="100%">
  <rect width="100%" height="100%" fill="none"/>
  ${rects.join('\n  ')}
</svg>`;
}
