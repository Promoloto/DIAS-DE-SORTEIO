import test from 'node:test';
import assert from 'node:assert/strict';
import {
  extractLotteryCode,
  buildCaixaBolaoUrl,
  getDaysForGame,
  getGamesForDay,
  generateSvgQrCode,
  SCHEDULE_DATA
} from './lottery';

test('extractLotteryCode correctly identifies 4 digits from Caixa URLs and inputs', () => {
  // Test full URL
  assert.equal(
    extractLotteryCode('https://www.loteriasonline.caixa.gov.br/silce-web/#/bolao-caixa/4832'),
    '4832'
  );
  // Test URL with trailing slash
  assert.equal(
    extractLotteryCode('https://www.loteriasonline.caixa.gov.br/silce-web/#/bolao-caixa/9876/'),
    '9876'
  );
  // Test raw 4-digit code
  assert.equal(extractLotteryCode('4832'), '4832');
  assert.equal(extractLotteryCode('  1234  '), '1234');
  // Fallback default
  assert.equal(extractLotteryCode(''), '4832');
});

test('buildCaixaBolaoUrl produces the official Caixa URL', () => {
  assert.equal(
    buildCaixaBolaoUrl('4832'),
    'https://www.loteriasonline.caixa.gov.br/silce-web/#/bolao-caixa/4832'
  );
  assert.equal(
    buildCaixaBolaoUrl('https://site.com/bolao-caixa/5521'),
    'https://www.loteriasonline.caixa.gov.br/silce-web/#/bolao-caixa/5521'
  );
});

test('SCHEDULE_DATA complies exactly with the official Caixa lottery days', () => {
  // Segunda: Lotofácil, Quina, Dupla Sena, Lotomania, Super Sete
  assert.deepEqual(getGamesForDay('Segunda'), [
    'Lotofácil', 'Quina', 'Dupla Sena', 'Lotomania', 'Super Sete'
  ]);

  // Terça: Mega-Sena, Lotofácil, Quina, Timemania, Dia de Sorte
  assert.deepEqual(getGamesForDay('Terça'), [
    'Mega-Sena', 'Lotofácil', 'Quina', 'Timemania', 'Dia de Sorte'
  ]);

  // Quarta: Lotofácil, Quina, +Milionária, Dupla Sena, Lotomania, Super Sete, Federal
  assert.deepEqual(getGamesForDay('Quarta'), [
    'Lotofácil', 'Quina', '+Milionária', 'Dupla Sena', 'Lotomania', 'Super Sete', 'Federal'
  ]);

  // Quinta: Mega-Sena, Lotofácil, Quina, Timemania, Dia de Sorte
  assert.deepEqual(getGamesForDay('Quinta'), [
    'Mega-Sena', 'Lotofácil', 'Quina', 'Timemania', 'Dia de Sorte'
  ]);

  // Sexta: Lotofácil, Quina, Dupla Sena, Lotomania, Super Sete
  assert.deepEqual(getGamesForDay('Sexta'), [
    'Lotofácil', 'Quina', 'Dupla Sena', 'Lotomania', 'Super Sete'
  ]);

  // Sábado: Mega-Sena, Lotofácil, Quina, +Milionária, Timemania, Dia de Sorte, Federal
  assert.deepEqual(getGamesForDay('Sábado'), [
    'Mega-Sena', 'Lotofácil', 'Quina', '+Milionária', 'Timemania', 'Dia de Sorte', 'Federal'
  ]);
});

test('getDaysForGame correctly retrieves all draw days for each game', () => {
  const megaDays = getDaysForGame('Mega-Sena');
  assert.deepEqual(megaDays, ['Terça', 'Quinta', 'Sábado']);

  const federalDays = getDaysForGame('Federal');
  assert.deepEqual(federalDays, ['Quarta', 'Sábado']);

  const milionariaDays = getDaysForGame('+Milionária');
  assert.deepEqual(milionariaDays, ['Quarta', 'Sábado']);

  const duplaSenaDays = getDaysForGame('Dupla Sena');
  assert.deepEqual(duplaSenaDays, ['Segunda', 'Quarta', 'Sexta']);
});

test('generateSvgQrCode creates valid transparent SVG for CorelDRAW', () => {
  const matrix = [
    [true, false],
    [false, true]
  ];
  const svg = generateSvgQrCode('test', '#003366', matrix);
  assert.ok(svg.includes('<svg xmlns="http://www.w3.org/2000/svg"'));
  assert.ok(svg.includes('fill="none"')); // Transparent background
  assert.ok(svg.includes('fill="#003366"'));
  assert.ok(svg.includes('viewBox="0 0 48 48"'));
});
