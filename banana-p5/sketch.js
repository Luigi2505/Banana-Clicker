// ============================================================
//  BANANA CLICKER — p5.js
//  Telas: INICIO → JOGO → LOJA → FIM
// ============================================================

// ---------- ESTADO DO JOGO ----------
let tela = "inicio";

let bananas = 0;
let porClique = 1;
let porSegundo = 0;
let totalCliques = 0;

// canto: "sup-esq" | "inf-esq" | "sup-dir" | "mid-dir" | "inf-dir"
// dir: "h" (horizontal) | "v" (vertical) — sentido de crescimento das unidades
let itensProducao = [
  {
    nome: "Macaquinho",
    emoji: "🐒",
    preco: 10,
    ps: 1,
    qtd: 0,
    canto: "sup-esq",
    dir: "h",
  },
  {
    nome: "Bananal",
    emoji: "🌴",
    preco: 50,
    ps: 5,
    qtd: 0,
    canto: "inf-esq",
    dir: "h",
  },
  {
    nome: "Fazenda",
    emoji: "🏡",
    preco: 200,
    ps: 20,
    qtd: 0,
    canto: "sup-dir",
    dir: "h",
  },
  {
    nome: "Fabrica",
    emoji: "🏭",
    preco: 500,
    ps: 50,
    qtd: 0,
    canto: "mid-dir",
    dir: "v",
  },
  {
    nome: "Nave",
    emoji: "🚀",
    preco: 2000,
    ps: 200,
    qtd: 0,
    canto: "inf-dir",
    dir: "h",
  },
];

let powerups = [
  { nome: "Luvas", emoji: "🧤", preco: 30, mult: 1.2, comprado: false },
  { nome: "Dedos Turbo", emoji: "⚡", preco: 150, mult: 1.5, comprado: false },
  { nome: "Mao Magica", emoji: "🪄", preco: 400, mult: 2.0, comprado: false },
  { nome: "Braco Robo", emoji: "🦾", preco: 1000, mult: 3.0, comprado: false },
  { nome: "Macaco Rei", emoji: "👑", preco: 3000, mult: 5.0, comprado: false },
];

// Números flutuantes do clique no macaco
let flutuantes = [];

// Bananas flutuantes dos itens de produção
let flutuantesProducao = [];

let ultimoSegundo = 0;
let abaLoja = "producao";

const META = 10000;
let LARGURA, ALTURA;

// ============================================================
//  SETUP
// ============================================================
function setup() {
  LARGURA = windowWidth;
  ALTURA = windowHeight;
  createCanvas(LARGURA, ALTURA);
  textFont("monospace");
  ultimoSegundo = millis();
}

function windowResized() {
  LARGURA = windowWidth;
  ALTURA = windowHeight;
  resizeCanvas(LARGURA, ALTURA);
}

// ============================================================
//  DRAW
// ============================================================
function draw() {
  background(245);

  if (tela === "jogo" || tela === "loja") {
    if (millis() - ultimoSegundo >= 1000) {
      bananas += porSegundo;
      ultimoSegundo = millis();

      // Gera flutuante de produção saindo de uma unidade aleatória de cada item
      for (let item of itensProducao) {
        if (item.qtd > 0) {
          let idx = floor(random(item.qtd));
          let pos = posicaoUnidade(item, idx);
          flutuantesProducao.push({
            x: pos.x + 12 + random(-6, 6),
            y: pos.y - 10,
            alpha: 255,
          });
        }
      }

      if (bananas >= META) tela = "fim";
    }
  }

  if (tela === "inicio") desenharInicio();
  if (tela === "jogo") desenharJogo();
  if (tela === "loja") desenharLoja();
  if (tela === "fim") desenharFim();
}

// ============================================================
//  TELA DE INÍCIO
// ============================================================
function desenharInicio() {
  textAlign(CENTER);
  textSize(32);
  fill(0);
  text("🍌 BANANA CLICKER 🍌", LARGURA / 2, 150);

  textSize(100);
  text("🐵", LARGURA / 2, 280);

  textSize(14);
  fill(80);
  text("Clique no macaco para ganhar bananas!", LARGURA / 2, 340);
  text("Compre melhorias na Loja.", LARGURA / 2, 360);
  text("Meta: " + META + " bananas para vencer.", LARGURA / 2, 380);

  desenharBotao(LARGURA / 2 - 80, 420, 160, 44, "▶  JOGAR");
}

// ============================================================
//  TELA DE JOGO
// ============================================================
function desenharJogo() {
  // --- Cabeçalho ---
  fill(255);
  stroke(0);
  rect(0, 0, LARGURA, 70);
  noStroke();

  fill(0);
  textAlign(LEFT);
  textSize(13);
  text("🍌 " + floor(bananas), 16, 28);
  text("Cliques: " + totalCliques, 16, 48);

  textAlign(RIGHT);
  text("+clique: " + porClique, LARGURA - 16, 28);
  text("+/s: " + porSegundo, LARGURA - 16, 48);

  desenharBotao(LARGURA / 2 - 50, 16, 100, 36, "🛒 Loja");

  // --- Macaco clicável ---
  textAlign(CENTER);
  textSize(100);
  text("🐵", LARGURA / 2, 220);

  noFill();
  stroke(180);
  ellipse(LARGURA / 2, 185, 160, 160);
  noStroke();

  textSize(13);
  fill(100);
  text("clique no macaco!", LARGURA / 2, 280);

  // --- Barra de progresso ---
  desenharBarraProgresso();

  // --- Área de itens de produção ---
  desenharItensNaTela();

  // --- Painel de power-ups equipados ---
  desenharPainelPowerups();

  // --- Flutuantes do clique no macaco ---
  for (let i = flutuantes.length - 1; i >= 0; i--) {
    let f = flutuantes[i];
    f.y -= 1.5;
    f.alpha -= 3;
    fill(0, 0, 0, f.alpha);
    textSize(18);
    textAlign(CENTER);
    text("+" + porClique + " 🍌", f.x, f.y);
    if (f.alpha <= 0) flutuantes.splice(i, 1);
  }

  // --- Flutuantes dos itens de produção ---
  for (let i = flutuantesProducao.length - 1; i >= 0; i--) {
    let f = flutuantesProducao[i];
    f.y -= 1.2;
    f.alpha -= 4;
    fill(180, 120, 0, f.alpha);
    textSize(14);
    textAlign(CENTER);
    text("🍌", f.x, f.y);
    if (f.alpha <= 0) flutuantesProducao.splice(i, 1);
  }
}

// Retorna a posição (x,y) de cada unidade de um item dado seu canto e índice
function posicaoUnidade(item, i) {
  let gap = 32;

  // Âncoras de cada canto com direção de crescimento (dx,dy)
  // Canvas 480x600. Cabeçalho: 0-70. Painel powerups: 510-600.
  // Zonas livres: sup (80-200), mid-dir (260-420), inf (430-505).
  // Âncoras nas bordas reais da tela, fora da área central do macaco (x: 160-320)
  // sup = logo abaixo do cabeçalho (y~80), inf = acima do painel powerups (y~490)
  // esq cresce para direita, dir cresce para esquerda, mid-dir cresce para cima
  let ancoras = {
    "sup-esq": { x: 5, y: 105, dx: gap, dy: 0 },
    "sup-dir": { x: LARGURA - 5, y: 105, dx: -gap, dy: 0 },
    "inf-esq": { x: 5, y: 490, dx: gap, dy: 0 },
    "inf-dir": { x: LARGURA - 5, y: 490, dx: -gap, dy: 0 },
    "mid-dir": { x: LARGURA - 5, y: 390, dx: 0, dy: -gap },
  };

  let a = ancoras[item.canto];
  return { x: a.x + a.dx * i, y: a.y + a.dy * i };
}

// Desenha todas as unidades de todos os itens de produção comprados
function desenharItensNaTela() {
  for (let item of itensProducao) {
    for (let i = 0; i < item.qtd; i++) {
      let pos = posicaoUnidade(item, i);
      textSize(24);
      // Itens do lado direito: ancora no x direito, cresce para esquerda
      let ladoDireito =
        item.canto === "sup-dir" ||
        item.canto === "inf-dir" ||
        item.canto === "mid-dir";
      textAlign(ladoDireito ? RIGHT : LEFT);
      fill(0);
      text(item.emoji, pos.x, pos.y);
    }
  }
}

// Painel de power-ups equipados (canto inferior)
function desenharPainelPowerups() {
  // Fundo do painel
  fill(210);
  stroke(160);
  rect(0, 510, LARGURA, 90);
  noStroke();

  fill(100);
  textSize(10);
  textAlign(CENTER);
  text("MELHORIAS EQUIPADAS", LARGURA / 2, 525);

  let equipados = powerups.filter((p) => p.comprado);

  if (equipados.length === 0) {
    fill(160);
    textSize(11);
    textAlign(CENTER);
    text("nenhuma melhoria comprada ainda", LARGURA / 2, 558);
  } else {
    // Centraliza os itens no painel
    let total = equipados.length;
    let espaco = 60;
    let startX = LARGURA / 2 - ((total - 1) * espaco) / 2;

    for (let i = 0; i < equipados.length; i++) {
      let p = equipados[i];
      let px = startX + i * espaco;

      // Fundo do badge
      fill(255, 220, 50);
      stroke(180, 150, 0);
      rect(px - 22, 532, 44, 46, 6);
      noStroke();

      // Emoji
      textSize(22);
      textAlign(CENTER);
      fill(0);
      text(p.emoji, px, 558);

      // Multiplicador
      textSize(9);
      fill(80, 50, 0);
      text("x" + p.mult, px, 572);
    }
  }
}

// Barra de progresso até a meta
function desenharBarraProgresso() {
  let progresso = constrain(bananas / META, 0, 1);
  let barX = 40,
    barY = 310,
    barW = LARGURA - 80,
    barH = 20;

  fill(220);
  stroke(0);
  rect(barX, barY, barW, barH);

  fill(255, 200, 0);
  rect(barX, barY, barW * progresso, barH);
  noStroke();

  fill(0);
  textAlign(CENTER);
  textSize(12);
  text(
    "Meta: " + floor(bananas) + " / " + META + " 🍌",
    LARGURA / 2,
    barY + barH + 16,
  );
}

// ============================================================
//  TELA DA LOJA
// ============================================================
function desenharLoja() {
  fill(255);
  stroke(0);
  rect(0, 0, LARGURA, 70);
  noStroke();

  fill(0);
  textAlign(LEFT);
  textSize(13);
  text("🍌 " + floor(bananas), 16, 28);

  textAlign(CENTER);
  textSize(18);
  text("🛒 LOJA", LARGURA / 2, 30);

  desenharBotao(LARGURA - 120, 16, 100, 36, "← Voltar");

  let corProd = abaLoja === "producao" ? color(0) : color(200);
  let corPower = abaLoja === "powerup" ? color(0) : color(200);
  let txtProd = abaLoja === "producao" ? color(255) : color(0);
  let txtPower = abaLoja === "powerup" ? color(255) : color(0);

  fill(corProd);
  stroke(0);
  rect(20, 78, 210, 36);
  fill(txtProd);
  noStroke();
  textAlign(CENTER);
  textSize(13);
  text("🏭 Producao", 125, 102);

  fill(corPower);
  stroke(0);
  rect(250, 78, 210, 36);
  fill(txtPower);
  noStroke();
  textAlign(CENTER);
  textSize(13);
  text("⚡ Power-ups", 355, 102);

  if (abaLoja === "producao") {
    for (let i = 0; i < itensProducao.length; i++) {
      desenharItemLoja(itensProducao[i], i, "producao");
    }
  } else {
    for (let i = 0; i < powerups.length; i++) {
      desenharItemLoja(powerups[i], i, "powerup");
    }
  }
}

function desenharItemLoja(item, indice, tipo) {
  let y = 130 + indice * 82;
  let pode = bananas >= calcPreco(item, tipo);
  let jaComprou = tipo === "powerup" && item.comprado;

  fill(jaComprou ? 180 : pode ? 240 : 220);
  stroke(jaComprou ? 150 : pode ? 0 : 170);
  rect(20, y, LARGURA - 40, 72, 6);
  noStroke();

  textSize(30);
  textAlign(LEFT);
  fill(0);
  text(item.emoji, 36, y + 44);

  textSize(14);
  fill(jaComprou ? 120 : 0);
  text(item.nome, 80, y + 26);

  textSize(12);
  fill(80);
  if (tipo === "producao") {
    text("+" + item.ps + "/s por compra  |  qtd: " + item.qtd, 80, y + 46);
    text("Preco atual: 🍌 " + calcPreco(item, tipo), 80, y + 62);
  } else {
    text("x" + item.mult + " no clique  |  compra unica", 80, y + 46);
    text(jaComprou ? "JA COMPRADO" : "Preco: 🍌 " + item.preco, 80, y + 62);
  }

  if (tipo === "producao") {
    fill(0);
    textAlign(RIGHT);
    textSize(18);
    text("x" + item.qtd, LARGURA - 36, y + 44);
  } else if (jaComprou) {
    fill(0, 150, 0);
    textAlign(RIGHT);
    textSize(18);
    text("✓", LARGURA - 36, y + 44);
  }
}

function calcPreco(item, tipo) {
  if (tipo === "producao") {
    return floor(item.preco * pow(1.15, item.qtd));
  }
  return item.preco;
}

// ============================================================
//  TELA DE FIM
// ============================================================
function desenharFim() {
  textAlign(CENTER);

  textSize(36);
  fill(0);
  text("🎉 VOCE VENCEU! 🎉", LARGURA / 2, 160);

  textSize(100);
  text("🐵", LARGURA / 2, 280);

  textSize(15);
  fill(50);
  text("Bananas coletadas: " + floor(bananas), LARGURA / 2, 340);
  text("Total de cliques: " + totalCliques, LARGURA / 2, 365);
  text("Producao por segundo: " + porSegundo + "/s", LARGURA / 2, 390);

  desenharBotao(LARGURA / 2 - 80, 430, 160, 44, "↺  JOGAR DE NOVO");
}

// ============================================================
//  AUXILIARES
// ============================================================
function desenharBotao(x, y, w, h, texto) {
  fill(255);
  stroke(0);
  rect(x, y, w, h);
  fill(0);
  noStroke();
  textAlign(CENTER, CENTER);
  textSize(13);
  text(texto, x + w / 2, y + h / 2);
}

// ============================================================
//  MOUSE CLICKED
// ============================================================
function mouseClicked() {
  if (tela === "inicio") {
    if (dentroDoRetangulo(mouseX, mouseY, LARGURA / 2 - 80, 420, 160, 44)) {
      tela = "jogo";
    }
    return;
  }

  if (tela === "jogo") {
    if (dentroDoRetangulo(mouseX, mouseY, LARGURA / 2 - 50, 16, 100, 36)) {
      tela = "loja";
      return;
    }

    let dx = mouseX - LARGURA / 2;
    let dy = mouseY - 185;
    if (sqrt(dx * dx + dy * dy) < 80) {
      bananas += porClique;
      totalCliques++;
      flutuantes.push({ x: LARGURA / 2 + random(-30, 30), y: 180, alpha: 255 });
      if (bananas >= META) tela = "fim";
    }
    return;
  }

  if (tela === "loja") {
    if (dentroDoRetangulo(mouseX, mouseY, LARGURA - 120, 16, 100, 36)) {
      tela = "jogo";
      return;
    }

    if (dentroDoRetangulo(mouseX, mouseY, 20, 78, 210, 36)) {
      abaLoja = "producao";
      return;
    }

    if (dentroDoRetangulo(mouseX, mouseY, 250, 78, 210, 36)) {
      abaLoja = "powerup";
      return;
    }

    let lista = abaLoja === "producao" ? itensProducao : powerups;
    for (let i = 0; i < lista.length; i++) {
      let y = 130 + i * 82;
      if (dentroDoRetangulo(mouseX, mouseY, 20, y, LARGURA - 40, 72)) {
        comprarItem(lista[i], abaLoja);
        return;
      }
    }
    return;
  }

  if (tela === "fim") {
    if (dentroDoRetangulo(mouseX, mouseY, LARGURA / 2 - 80, 430, 160, 44)) {
      reiniciar();
    }
  }
}

// ============================================================
//  COMPRAR ITEM
// ============================================================
function comprarItem(item, tipo) {
  let preco = calcPreco(item, tipo);

  if (tipo === "producao") {
    if (bananas >= preco) {
      bananas -= preco;
      porSegundo += item.ps;
      item.qtd++;
    }
  }

  if (tipo === "powerup") {
    if (!item.comprado && bananas >= preco) {
      bananas -= preco;
      porClique = round(porClique * item.mult * 10) / 10;
      item.comprado = true;
    }
  }
}

// ============================================================
//  REINICIAR
// ============================================================
function reiniciar() {
  bananas = 0;
  porClique = 1;
  porSegundo = 0;
  totalCliques = 0;
  flutuantes = [];
  flutuantesProducao = [];
  tela = "inicio";

  for (let item of itensProducao) item.qtd = 0;
  for (let pu of powerups) pu.comprado = false;
}

// ============================================================
//  AUXILIAR: ponto dentro de retângulo
// ============================================================
function dentroDoRetangulo(px, py, rx, ry, rw, rh) {
  return px >= rx && px <= rx + rw && py >= ry && py <= ry + rh;
}
