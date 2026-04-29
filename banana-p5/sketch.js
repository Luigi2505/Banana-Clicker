// ============================================================
//  BANANA CLICKER — p5.js
//  Telas: INICIO → JOGO → LOJA → FIM
// ============================================================

// ---------- ESTADO DO JOGO ----------
let tela = "inicio";   // tela atual: "inicio", "jogo", "loja", "fim"

let bananas    = 0;    // saldo de bananas
let porClique  = 1;    // bananas ganhas por clique
let porSegundo = 0;    // bananas ganhas por segundo (automático)
let totalCliques = 0;  // contador de cliques (pontuação)

// Itens de produção: geram bananas por segundo automaticamente
let itensProducao = [
  { nome: "Macaquinho",  emoji: "🐒", preco: 10,   ps: 1,   qtd: 0 },
  { nome: "Bananal",     emoji: "🌴", preco: 50,   ps: 5,   qtd: 0 },
  { nome: "Fazenda",     emoji: "🏡", preco: 200,  ps: 20,  qtd: 0 },
  { nome: "Fabrica",     emoji: "🏭", preco: 500,  ps: 50,  qtd: 0 },
  { nome: "Nave",        emoji: "🚀", preco: 2000, ps: 200, qtd: 0 },
];

// Power-ups: multiplicam o valor do clique (compra única)
let powerups = [
  { nome: "Luvas",       emoji: "🧤", preco: 30,   mult: 1.2, comprado: false },
  { nome: "Dedos Turbo", emoji: "⚡", preco: 150,  mult: 1.5, comprado: false },
  { nome: "Mao Magica",  emoji: "🪄", preco: 400,  mult: 2.0, comprado: false },
  { nome: "Braco Robo",  emoji: "🦾", preco: 1000, mult: 3.0, comprado: false },
  { nome: "Macaco Rei",  emoji: "👑", preco: 3000, mult: 5.0, comprado: false },
];

// Números flutuantes que aparecem quando clica no macaco
let flutuantes = [];

// Timer para produção automática (conta milissegundos)
let ultimoSegundo = 0;

// Aba ativa na tela da loja
let abaLoja = "producao"; // "producao" ou "powerup"

// Meta de bananas para terminar o jogo
const META = 10000;

// ---------- CONFIGURAÇÕES DO CANVAS ----------
const LARGURA  = 480;
const ALTURA   = 600;

// ============================================================
//  SETUP: roda uma vez quando o jogo começa
// ============================================================
function setup() {
  createCanvas(LARGURA, ALTURA);
  textFont("monospace");
  ultimoSegundo = millis();
}

// ============================================================
//  DRAW: roda ~60x por segundo — decide qual tela desenhar
// ============================================================
function draw() {
  background(245);

  // Produção automática: a cada 1000ms, adiciona bananas
  if (tela === "jogo" || tela === "loja") {
    if (millis() - ultimoSegundo >= 1000) {
      bananas += porSegundo;
      ultimoSegundo = millis();

      // Verifica se atingiu a meta → vai para tela de fim
      if (bananas >= META) {
        tela = "fim";
      }
    }
  }

  // Desenha a tela correspondente
  if (tela === "inicio") desenharInicio();
  if (tela === "jogo")   desenharJogo();
  if (tela === "loja")   desenharLoja();
  if (tela === "fim")    desenharFim();
}

// ============================================================
//  TELA DE INÍCIO
// ============================================================
function desenharInicio() {
  // Título
  textAlign(CENTER);
  textSize(32);
  fill(0);
  text("🍌 BANANA CLICKER 🍌", LARGURA / 2, 150);

  // Macaco grande decorativo
  textSize(100);
  text("🐵", LARGURA / 2, 280);

  // Instrução
  textSize(14);
  fill(80);
  text("Clique no macaco para ganhar bananas!", LARGURA / 2, 340);
  text("Compre melhorias na Loja.", LARGURA / 2, 360);
  text("Meta: " + META + " bananas para vencer.", LARGURA / 2, 380);

  // Botão de iniciar
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

  // Botão de ir para a Loja
  desenharBotao(LARGURA / 2 - 50, 16, 100, 36, "🛒 Loja");

  // --- Macaco clicável ---
  textAlign(CENTER);
  textSize(100);
  text("🐵", LARGURA / 2, 220);

  // Borda ao redor do macaco (área de clique)
  noFill();
  stroke(180);
  ellipse(LARGURA / 2, 185, 160, 160);
  noStroke();

  // Texto de dica
  textSize(13);
  fill(100);
  text("clique no macaco!", LARGURA / 2, 280);

  // Barra de progresso até a meta
  desenharBarraProgresso();

  // --- Números flutuantes ---
  for (let i = flutuantes.length - 1; i >= 0; i--) {
    let f = flutuantes[i];
    f.y -= 1.5;           // sobe
    f.alpha -= 3;         // some aos poucos

    fill(0, 0, 0, f.alpha);
    textSize(18);
    textAlign(CENTER);
    text("+" + porClique + " 🍌", f.x, f.y);

    // Remove quando sumiu completamente
    if (f.alpha <= 0) {
      flutuantes.splice(i, 1);
    }
  }
}

// Barra de progresso até a meta
function desenharBarraProgresso() {
  let progresso = constrain(bananas / META, 0, 1);
  let barX = 40, barY = 310, barW = LARGURA - 80, barH = 20;

  // Fundo da barra
  fill(220);
  stroke(0);
  rect(barX, barY, barW, barH);

  // Preenchimento
  fill(255, 200, 0);
  rect(barX, barY, barW * progresso, barH);
  noStroke();

  // Texto
  fill(0);
  textAlign(CENTER);
  textSize(12);
  text("Meta: " + floor(bananas) + " / " + META + " 🍌", LARGURA / 2, barY + barH + 16);
}

// ============================================================
//  TELA DA LOJA
// ============================================================
function desenharLoja() {
  // Cabeçalho
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

  // Botão voltar ao jogo
  desenharBotao(LARGURA - 120, 16, 100, 36, "← Voltar");

  // Abas
  let corProd  = abaLoja === "producao" ? color(0)   : color(200);
  let corPower = abaLoja === "powerup"  ? color(0)   : color(200);
  let txtProd  = abaLoja === "producao" ? color(255) : color(0);
  let txtPower = abaLoja === "powerup"  ? color(255) : color(0);

  fill(corProd); stroke(0); rect(20, 78, 210, 36);
  fill(txtProd); noStroke(); textAlign(CENTER); textSize(13);
  text("🏭 Producao", 125, 102);

  fill(corPower); stroke(0); rect(250, 78, 210, 36);
  fill(txtPower); noStroke(); textAlign(CENTER); textSize(13);
  text("⚡ Power-ups", 355, 102);

  // Conteúdo da aba selecionada
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

// Desenha um item dentro da loja
function desenharItemLoja(item, indice, tipo) {
  let y    = 130 + indice * 82;
  let pode = bananas >= calcPreco(item, tipo);
  let jaComprou = tipo === "powerup" && item.comprado;

  // Fundo do item
  fill(jaComprou ? 180 : pode ? 240 : 220);
  stroke(jaComprou ? 150 : pode ? 0 : 170);
  rect(20, y, LARGURA - 40, 72, 6);
  noStroke();

  // Emoji
  textSize(30);
  textAlign(LEFT);
  fill(0);
  text(item.emoji, 36, y + 44);

  // Nome e descrição
  textSize(14);
  fill(jaComprou ? 120 : 0);
  text(item.nome, 80, y + 26);

  textSize(12);
  fill(80);
  if (tipo === "producao") {
    text("+1/s por compra  |  qtd: " + item.qtd, 80, y + 46);
    text("Preco atual: 🍌 " + calcPreco(item, tipo), 80, y + 62);
  } else {
    text("x" + item.mult + " no clique  |  compra unica", 80, y + 46);
    text(jaComprou ? "JA COMPRADO" : "Preco: 🍌 " + item.preco, 80, y + 62);
  }

  // Badge quantidade (lado direito)
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

// Calcula o preço atual de um item (sobe 15% por compra na produção)
function calcPreco(item, tipo) {
  if (tipo === "producao") {
    return floor(item.preco * pow(1.15, item.qtd));
  }
  return item.preco;
}

// ============================================================
//  TELA DE FIM (game over / vitória)
// ============================================================
function desenharFim() {
  textAlign(CENTER);

  // Título
  textSize(36);
  fill(0);
  text("🎉 VOCE VENCEU! 🎉", LARGURA / 2, 160);

  // Macaco
  textSize(100);
  text("🐵", LARGURA / 2, 280);

  // Estatísticas
  textSize(15);
  fill(50);
  text("Bananas coletadas: " + floor(bananas), LARGURA / 2, 340);
  text("Total de cliques: " + totalCliques, LARGURA / 2, 365);
  text("Producao por segundo: " + porSegundo + "/s", LARGURA / 2, 390);

  // Botão de recomeçar
  desenharBotao(LARGURA / 2 - 80, 430, 160, 44, "↺  JOGAR DE NOVO");
}

// ============================================================
//  FUNÇÃO AUXILIAR: desenha um botão retangular com texto
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
//  MOUSE CLICKED: detecta cliques em botões e no macaco
// ============================================================
function mouseClicked() {

  // ---------- TELA DE INÍCIO ----------
  if (tela === "inicio") {
    // Botão JOGAR
    if (dentroDoRetangulo(mouseX, mouseY, LARGURA / 2 - 80, 420, 160, 44)) {
      tela = "jogo";
    }
    return;
  }

  // ---------- TELA DE JOGO ----------
  if (tela === "jogo") {
    // Botão Loja
    if (dentroDoRetangulo(mouseX, mouseY, LARGURA / 2 - 50, 16, 100, 36)) {
      tela = "loja";
      return;
    }

    // Clique no macaco (área circular)
    let dx = mouseX - LARGURA / 2;
    let dy = mouseY - 185;
    if (sqrt(dx * dx + dy * dy) < 80) {
      bananas += porClique;
      totalCliques++;
      // Adiciona número flutuante
      flutuantes.push({ x: LARGURA / 2 + random(-30, 30), y: 180, alpha: 255 });

      // Verifica meta
      if (bananas >= META) tela = "fim";
    }
    return;
  }

  // ---------- TELA DA LOJA ----------
  if (tela === "loja") {
    // Botão Voltar
    if (dentroDoRetangulo(mouseX, mouseY, LARGURA - 120, 16, 100, 36)) {
      tela = "jogo";
      return;
    }

    // Aba Produção
    if (dentroDoRetangulo(mouseX, mouseY, 20, 78, 210, 36)) {
      abaLoja = "producao";
      return;
    }

    // Aba Power-ups
    if (dentroDoRetangulo(mouseX, mouseY, 250, 78, 210, 36)) {
      abaLoja = "powerup";
      return;
    }

    // Clique em item da loja
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

  // ---------- TELA DE FIM ----------
  if (tela === "fim") {
    // Botão Jogar de Novo → reinicia tudo
    if (dentroDoRetangulo(mouseX, mouseY, LARGURA / 2 - 80, 430, 160, 44)) {
      reiniciar();
    }
  }
}

// ============================================================
//  COMPRAR ITEM: lógica de compra de produção ou power-up
// ============================================================
function comprarItem(item, tipo) {
  let preco = calcPreco(item, tipo);

  if (tipo === "producao") {
    if (bananas >= preco) {
      bananas    -= preco;
      porSegundo += item.ps;
      item.qtd++;
    }
  }

  if (tipo === "powerup") {
    if (!item.comprado && bananas >= preco) {
      bananas   -= preco;
      porClique  = round(porClique * item.mult * 10) / 10;
      item.comprado = true;
    }
  }
}

// ============================================================
//  REINICIAR: reseta todas as variáveis para o estado inicial
// ============================================================
function reiniciar() {
  bananas      = 0;
  porClique    = 1;
  porSegundo   = 0;
  totalCliques = 0;
  flutuantes   = [];
  tela         = "inicio";

  // Reinicia itens de produção
  for (let item of itensProducao) item.qtd = 0;

  // Reinicia power-ups
  for (let pu of powerups) pu.comprado = false;
}

// ============================================================
//  FUNÇÃO AUXILIAR: verifica se um ponto está dentro de um retângulo
// ============================================================
function dentroDoRetangulo(px, py, rx, ry, rw, rh) {
  return px >= rx && px <= rx + rw && py >= ry && py <= ry + rh;
}
