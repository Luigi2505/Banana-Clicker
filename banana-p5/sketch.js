// ============================================================
//  BANANA CLICKER — p5.js
//  Telas: INICIO → SOBRE → JOGO → TRANSICAO → LOJA → FIM
// ============================================================

let tela = "inicio";

let bananas = 0;
let porClique = 1;
let porSegundo = 0;
let totalCliques = 0;

let fases = [
  {
    nome: "Selva",
    meta: 10000,
    inflacao: 1.15,
    txt: 0,
    desc: "Fase 1: Tudo normal",
  },
  {
    nome: "Chuva",
    meta: 150000,
    inflacao: 1.15,
    txt: 0,
    desc: "Fase 2: Clique reduzido em 70%",
  },
  {
    nome: "Seca",
    meta: 3000000,
    inflacao: 1.15,
    txt: 0,
    desc: "Fase 3: Fazendas e Fábr. produzem -50%",
  },
  {
    nome: "Tempestade",
    meta: 65000000,
    inflacao: 1.15,
    txt: 255,
    desc: "Fase 4: Produção global cai 40%",
  },
  {
    nome: "Espaço",
    meta: 1000000000,
    inflacao: 1.25,
    txt: 255,
    desc: "Fase 5: Preços sobem 25% por compra",
  },
];
let faseAtual = 0;

let itensProducao = [
  { nome: "Macaquinho", emoji: "🐒", preco: 10, ps: 100000000, qtd: 0 },
  { nome: "Bananal", emoji: "🌴", preco: 50, ps: 5, qtd: 0 },
  { nome: "Fazenda", emoji: "🏡", preco: 200, ps: 20, qtd: 0 },
  { nome: "Fabrica", emoji: "🏭", preco: 500, ps: 50, qtd: 0 },
  { nome: "Nave", emoji: "🚀", preco: 2000, ps: 200, qtd: 0 },
  { nome: "Templo", emoji: "🏛️", preco: 10000, ps: 1000, qtd: 0 },
  { nome: "Portal", emoji: "🌀", preco: 50000, ps: 5000, qtd: 0 },
  { nome: "Buraco Negro", emoji: "🌌", preco: 200000, ps: 20000, qtd: 0 },
];

let powerups = [
  { nome: "Luvas", emoji: "🧤", preco: 30, mult: 1.2, comprado: false },
  { nome: "Dedos Turbo", emoji: "⚡", preco: 150, mult: 1.5, comprado: false },
  { nome: "Mao Magica", emoji: "🪄", preco: 400, mult: 2.0, comprado: false },
  { nome: "Braco Robo", emoji: "🦾", preco: 1000, mult: 3.0, comprado: false },
  { nome: "Macaco Rei", emoji: "👑", preco: 3000, mult: 5.0, comprado: false },
  {
    nome: "Soro Mutante",
    emoji: "🧪",
    preco: 15000,
    mult: 10.0,
    comprado: false,
  },
  { nome: "Reliquia", emoji: "🗿", preco: 60000, mult: 25.0, comprado: false },
  {
    nome: "Aura Divina",
    emoji: "✨",
    preco: 250000,
    mult: 50.0,
    comprado: false,
  },
];

// ============================================================
//  CARREGAMENTO DE ASSETS
// ============================================================
let imagensFases = [];

function preload() {
  imagensFases[0] = loadImage("images/selva.jpg");
  imagensFases[1] = loadImage("images/chuva.jpg");
  imagensFases[2] = loadImage("images/seca.jpg");
  imagensFases[3] = loadImage("images/tempestade.jpg");
  imagensFases[4] = loadImage("images/espaco.jpg");
}

// ============================================================
//  CLASSES (POO)
// ============================================================
class TextoFlutuante {
  constructor(x, y, texto, cor, size, velY) {
    this.x = x;
    this.y = y;
    this.texto = texto;
    this.cor = cor;
    this.size = size;
    this.velY = velY;
    this.alpha = 255;
  }
  atualizar() {
    this.y -= this.velY;
    this.alpha -= 3;
  }
  desenhar() {
    fill(this.cor[0], this.cor[1], this.cor[2], this.alpha);
    textSize(this.size);
    textAlign(CENTER);
    text(this.texto, this.x, this.y);
  }
  estaMorto() {
    return this.alpha <= 0;
  }
}

class Botao {
  constructor(x, y, w, h, texto) {
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
    this.texto = texto;
    this.corFundo = 255;
    this.corTexto = 0;
  }
  desenhar() {
    fill(this.corFundo);
    stroke(0);
    rect(this.x, this.y, this.w, this.h, 4);
    fill(this.corTexto);
    noStroke();
    textAlign(CENTER, CENTER);
    textSize(13);
    text(this.texto, this.x + this.w / 2, this.y + this.h / 2);
  }
  foiClicado(px, py) {
    return (
      px >= this.x &&
      px <= this.x + this.w &&
      py >= this.y &&
      py <= this.y + this.h
    );
  }
}

let flutuantes = [];
let ultimoSegundo = 0;
let abaLoja = "producao";
let LARGURA, ALTURA;
let scrollLoja = 0;

// Instâncias Globais da Interface
let bJogar,
  bSobre,
  bVoltarSobre,
  bLoja,
  bVoltarLoja,
  bContinuar,
  bReset,
  bAbaProd,
  bAbaPower;

function inicializarBotoes() {
  bJogar = new Botao(LARGURA / 2 - 170, 420, 160, 44, "▶  JOGAR");
  bSobre = new Botao(LARGURA / 2 + 10, 420, 160, 44, "ℹ  SOBRE");
  bVoltarSobre = new Botao(LARGURA / 2 - 80, 420, 160, 44, "← VOLTAR");
  bLoja = new Botao(LARGURA / 2 - 50, 16, 100, 36, "🛒 Loja");
  bVoltarLoja = new Botao(LARGURA - 120, 16, 100, 36, "← Voltar");
  bContinuar = new Botao(LARGURA / 2 - 80, 450, 160, 44, "CONTINUAR ▶");
  bReset = new Botao(LARGURA / 2 - 80, 430, 160, 44, "↺  JOGAR DE NOVO");
  bAbaProd = new Botao(20, 78, 210, 36, "🏭 Producao");
  bAbaPower = new Botao(250, 78, 210, 36, "⚡ Power-ups");
}

function fmt(num) {
  // Converte para formato local garantindo até 1 casa decimal, sem cortar os decimais flutuantes
  return Number(num).toLocaleString("pt-BR", { maximumFractionDigits: 1 });
}

function atualizarStatus() {
  let baseMult = 1;
  for (let p of powerups) if (p.comprado) baseMult *= p.mult;

  porClique = 1 * baseMult;
  if (faseAtual === 1) porClique *= 0.3;
  porClique = max(0.1, round(porClique * 10) / 10);

  porSegundo = 0;
  for (let item of itensProducao) {
    let prodItem = item.ps * item.qtd;
    if (
      faseAtual === 2 &&
      (item.nome === "Fazenda" || item.nome === "Fabrica")
    ) {
      prodItem *= 0.5;
    }
    porSegundo += prodItem;
  }
  if (faseAtual === 3) porSegundo *= 0.6;
  porSegundo = round(porSegundo * 10) / 10;
}

function setup() {
  LARGURA = windowWidth;
  ALTURA = windowHeight;
  createCanvas(LARGURA, ALTURA);
  textFont("monospace");
  inicializarBotoes();
  ultimoSegundo = millis();
  atualizarStatus();
}

function windowResized() {
  LARGURA = windowWidth;
  ALTURA = windowHeight;
  resizeCanvas(LARGURA, ALTURA);
  inicializarBotoes();
}

function draw() {
  if (tela === "jogo" || tela === "transicao") {
    // Desenha a imagem de fundo correspondente à fase
    image(imagensFases[faseAtual], 0, 0, LARGURA, ALTURA);
  } else {
    background(245);
  }

  if (tela === "jogo" || tela === "loja") {
    if (millis() - ultimoSegundo >= 1000) {
      bananas += porSegundo;
      ultimoSegundo = millis();

      let ativos = itensProducao.filter((i) => i.qtd > 0);
      if (ativos.length > 0) {
        let espaco = LARGURA / ativos.length;
        for (let i = 0; i < ativos.length; i++) {
          let px = (i + 0.5) * espaco;
          flutuantes.push(
            new TextoFlutuante(
              px + random(-10, 10),
              330,
              "🍌",
              [255, 200, 0],
              14,
              1.2,
            ),
          );
        }
      }

      if (bananas >= fases[faseAtual].meta) {
        if (faseAtual < fases.length - 1) {
          faseAtual++;
          atualizarStatus();
          tela = "transicao";
        } else {
          tela = "fim";
        }
      }
    }
  }

  if (tela === "inicio") desenharInicio();
  if (tela === "sobre") desenharSobre();
  if (tela === "jogo") desenharJogo();
  if (tela === "transicao") desenharTransicao();
  if (tela === "loja") desenharLoja();
  if (tela === "fim") desenharFim();
}

function desenharInicio() {
  textAlign(CENTER);
  textSize(32);
  fill(0);
  text("🍌 BANANA CLICKER 🍌", LARGURA / 2, 150);
  textSize(100);
  text("🐵", LARGURA / 2, 280);
  textSize(14);
  fill(80);
  text("Sobreviva as 5 fases para vencer.", LARGURA / 2, 340);
  text("A dificuldade aumenta. Seu progresso continua.", LARGURA / 2, 360);

  bJogar.desenhar();
  bSobre.desenhar();
}

function desenharSobre() {
  textAlign(CENTER);
  textSize(24);
  fill(0);
  text("EQUIPE & INFO", LARGURA / 2, 150);
  textSize(14);
  fill(50);
  text("Desenvolvido por:", LARGURA / 2, 200);
  text("- Luigi Bilyk", LARGURA / 2, 230);
  text("- Eric Juan", LARGURA / 2, 250);
  text("- Guilherme Albuquerque", LARGURA / 2, 270);
  text("Trabalho Final - Disciplina de Games", LARGURA / 2, 320);

  bVoltarSobre.desenhar();
}

function desenharJogo() {
  let corTxt = fases[faseAtual].txt;

  fill(0, 0, 0, 150);
  rect(0, 0, LARGURA, 70);

  fill(255);
  textAlign(LEFT);
  textSize(13);
  text("🍌 " + fmt(bananas), 16, 28);
  text("Cliques Totais: " + fmt(totalCliques), 16, 48);

  textAlign(RIGHT);
  text("Poder de Clique: " + fmt(porClique), LARGURA - 16, 28);
  text("Prod Total: " + fmt(porSegundo) + "/s", LARGURA - 16, 48);

  bLoja.desenhar();

  // --- NOVA CAIXA DE TEXTO DA FASE (FONTE MAIOR + FUNDO BRANCO) ---
  fill(255, 255, 255, 230); // Fundo branco levemente translúcido
  noStroke();
  rect(LARGURA / 2 - 200, 80, 400, 70, 10);

  fill(0); // Fonte preta para ler bem no fundo branco
  textAlign(CENTER);
  textSize(24); // Fonte maior para o nome
  text(fases[faseAtual].nome, LARGURA / 2, 110);

  textSize(16); // Fonte maior para a descrição
  text(fases[faseAtual].desc, LARGURA / 2, 135);

  // --- MACACO CENTRAL ---
  textSize(100);
  text("🐵", LARGURA / 2, 230);
  noStroke();

  desenharBarraProgresso();
  desenharItensNaTela();
  desenharPainelPowerups();

  for (let i = flutuantes.length - 1; i >= 0; i--) {
    flutuantes[i].atualizar();
    flutuantes[i].desenhar();
    if (flutuantes[i].estaMorto()) flutuantes.splice(i, 1);
  }
}

function desenharTransicao() {
  fill(0, 0, 0, 200);
  rect(0, 0, LARGURA, ALTURA);

  textAlign(CENTER);
  fill(255);
  textSize(32);
  text("⚠️ NOVA FASE ALCANCADA! ⚠️", LARGURA / 2, 120);

  let f = fases[faseAtual];
  textSize(24);
  fill(255, 220, 50);
  text("Cenario Atual: " + f.nome, LARGURA / 2, 180);

  textSize(16);
  fill(200);
  text(f.desc, LARGURA / 2, 210);

  fill(255);
  text("Nova Meta: " + fmt(f.meta) + " bananas", LARGURA / 2, 250);

  let indiceNovo = faseAtual + 3;
  let novoProd = itensProducao[indiceNovo];
  let novoPower = powerups[indiceNovo];

  fill(100, 200, 255);
  text("Desbloqueios na Loja:", LARGURA / 2, 320);

  textSize(18);
  fill(255);
  if (novoProd) text(novoProd.emoji + " " + novoProd.nome, LARGURA / 2, 350);
  if (novoPower) text(novoPower.emoji + " " + novoPower.nome, LARGURA / 2, 380);

  bContinuar.desenhar();
}

function desenharItensNaTela() {
  let ativos = itensProducao.filter((i) => i.qtd > 0);
  if (ativos.length === 0) return;

  let espaco = LARGURA / ativos.length;
  let corTxt = fases[faseAtual].txt;

  for (let i = 0; i < ativos.length; i++) {
    let item = ativos[i];
    let px = (i + 0.5) * espaco;
    let py = 350;

    textSize(36);
    textAlign(CENTER);
    text(item.emoji, px, py);
    textSize(14);
    fill(corTxt);

    // Pequeno fundo escuro se o texto for branco para leitura na imagem
    if (corTxt === 255) {
      fill(0, 0, 0, 150);
      rect(px - 20, py + 12, 40, 18, 4);
      fill(255);
    }
    text("x" + fmt(item.qtd), px, py + 25);
  }
}

function desenharPainelPowerups() {
  fill(210);
  stroke(160);
  rect(0, ALTURA - 90, LARGURA, 90);
  noStroke();
  fill(100);
  textSize(10);
  textAlign(CENTER);
  text("MELHORIAS EQUIPADAS", LARGURA / 2, ALTURA - 75);

  let equipados = powerups.filter((p) => p.comprado);
  if (equipados.length === 0) {
    fill(160);
    textSize(11);
    text("nenhuma melhoria comprada", LARGURA / 2, ALTURA - 42);
  } else {
    let limitados = equipados.slice(-6);
    let espaco = 60;
    let startX = LARGURA / 2 - ((limitados.length - 1) * espaco) / 2;
    for (let i = 0; i < limitados.length; i++) {
      let p = limitados[i];
      let px = startX + i * espaco;
      fill(255, 220, 50);
      stroke(180, 150, 0);
      rect(px - 22, ALTURA - 68, 44, 46, 6);
      noStroke();
      textSize(22);
      textAlign(CENTER);
      fill(0);
      text(p.emoji, px, ALTURA - 42);
      textSize(9);
      fill(80, 50, 0);
      text("x" + p.mult, px, ALTURA - 28);
    }
  }
}

function desenharBarraProgresso() {
  let meta = fases[faseAtual].meta;
  let progresso = constrain(bananas / meta, 0, 1);

  // Eixo Y dinâmico para ficar colado no footer de powerups
  let barX = 40,
    barY = ALTURA - 160,
    barW = LARGURA - 80,
    barH = 25;

  // Desenho da barra
  fill(220);
  stroke(0);
  rect(barX, barY, barW, barH);
  fill(255, 200, 0);
  rect(barX, barY, barW * progresso, barH);
  noStroke();

  // --- CAIXA DE TEXTO DO PROGRESSO (FONTE MAIOR + FUNDO BRANCO) ---
  fill(255, 255, 255, 230);
  rect(LARGURA / 2 - 250, barY + barH + 10, 500, 32, 8);

  fill(0); // Texto preto
  textAlign(CENTER);
  textSize(16);
  text(
    `Progresso Geral: ${fmt(bananas)} / ${fmt(meta)} 🍌`,
    LARGURA / 2,
    barY + barH + 32,
  );
}

function desenharLoja() {
  fill(255);
  stroke(0);
  rect(0, 0, LARGURA, 70);
  noStroke();
  fill(0);
  textAlign(LEFT);
  textSize(13);
  text("🍌 " + fmt(bananas), 16, 28);
  textAlign(CENTER);
  textSize(18);
  text("🛒 LOJA", LARGURA / 2, 30);

  bVoltarLoja.desenhar();

  bAbaProd.corFundo = abaLoja === "producao" ? color(0) : color(200);
  bAbaProd.corTexto = abaLoja === "producao" ? color(255) : color(0);
  bAbaProd.desenhar();

  bAbaPower.corFundo = abaLoja === "powerup" ? color(0) : color(200);
  bAbaPower.corTexto = abaLoja === "powerup" ? color(255) : color(0);
  bAbaPower.desenhar();

  let lista = abaLoja === "producao" ? itensProducao : powerups;
  let itensVisiveis = lista.filter((_, index) => index <= faseAtual + 3);

  for (let i = 0; i < itensVisiveis.length; i++) {
    desenharItemLoja(itensVisiveis[i], i, abaLoja, scrollLoja);
  }

  fill(150);
  textSize(10);
  textAlign(CENTER);
  text(
    "Use a Roda do Mouse para rolar a loja se necessario",
    LARGURA / 2,
    ALTURA - 15,
  );
}

function desenharItemLoja(item, indice, tipo, offsetY) {
  let y = 130 + indice * 82 - offsetY;
  if (y > ALTURA || y < 70) return;

  let preco = calcPreco(item, tipo);
  let pode = bananas >= preco;
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
    text("Base: +" + fmt(item.ps) + "/s  |  qtd: " + fmt(item.qtd), 80, y + 46);
    text("Preco: 🍌 " + fmt(preco), 80, y + 62);
    fill(0);
    textAlign(RIGHT);
    textSize(18);
    text("x" + fmt(item.qtd), LARGURA - 36, y + 44);
  } else {
    text("x" + item.mult + " base de clique", 80, y + 46);
    text(jaComprou ? "JA COMPRADO" : "Preco: 🍌 " + fmt(preco), 80, y + 62);
    if (jaComprou) {
      fill(0, 150, 0);
      textAlign(RIGHT);
      textSize(18);
      text("✓", LARGURA - 36, y + 44);
    }
  }
}

function calcPreco(item, tipo) {
  if (tipo === "producao") {
    return floor(item.preco * pow(fases[faseAtual].inflacao, item.qtd));
  }
  return item.preco;
}

function desenharFim() {
  textAlign(CENTER);
  textSize(36);
  fill(0);
  text("🎉 VOCE VENCEU! 🎉", LARGURA / 2, 160);
  textSize(100);
  text("🐵", LARGURA / 2, 280);
  textSize(15);
  fill(50);
  text("Fases Concluidas: 5/5", LARGURA / 2, 340);
  text("Total de cliques: " + fmt(totalCliques), LARGURA / 2, 365);
  bReset.desenhar();
}

function mouseClicked() {
  if (tela === "inicio") {
    if (bJogar.foiClicado(mouseX, mouseY)) tela = "jogo";
    if (bSobre.foiClicado(mouseX, mouseY)) tela = "sobre";
    return;
  }

  if (tela === "sobre") {
    if (bVoltarSobre.foiClicado(mouseX, mouseY)) tela = "inicio";
    return;
  }

  if (tela === "transicao") {
    if (bContinuar.foiClicado(mouseX, mouseY)) {
      tela = "jogo";
      ultimoSegundo = millis();
    }
    return;
  }

  if (tela === "jogo") {
    if (bLoja.foiClicado(mouseX, mouseY)) {
      tela = "loja";
      scrollLoja = 0;
      return;
    }
    let dx = mouseX - LARGURA / 2;
    let dy = mouseY - 195;
    if (sqrt(dx * dx + dy * dy) < 80) {
      bananas += porClique;
      totalCliques++;
      let corTxt = fases[faseAtual].txt === 0 ? [0, 0, 0] : [255, 255, 255];
      flutuantes.push(
        new TextoFlutuante(
          LARGURA / 2 + random(-30, 30),
          190,
          "+" + fmt(porClique),
          corTxt,
          18,
          1.5,
        ),
      );

      if (bananas >= fases[faseAtual].meta) {
        if (faseAtual < fases.length - 1) {
          faseAtual++;
          atualizarStatus();
          tela = "transicao";
        } else {
          tela = "fim";
        }
      }
    }
    return;
  }

  if (tela === "loja") {
    if (bVoltarLoja.foiClicado(mouseX, mouseY)) {
      tela = "jogo";
      return;
    }
    if (bAbaProd.foiClicado(mouseX, mouseY)) {
      abaLoja = "producao";
      scrollLoja = 0;
      return;
    }
    if (bAbaPower.foiClicado(mouseX, mouseY)) {
      abaLoja = "powerup";
      scrollLoja = 0;
      return;
    }

    let lista = abaLoja === "producao" ? itensProducao : powerups;
    let itensVisiveis = lista.filter((_, index) => index <= faseAtual + 3);

    for (let i = 0; i < itensVisiveis.length; i++) {
      let y = 130 + i * 82 - scrollLoja;
      if (
        mouseX >= 20 &&
        mouseX <= LARGURA - 20 &&
        mouseY >= y &&
        mouseY <= y + 72
      ) {
        comprarItem(itensVisiveis[i], abaLoja);
        return;
      }
    }
    return;
  }

  if (tela === "fim" && bReset.foiClicado(mouseX, mouseY)) {
    bananas = 0;
    totalCliques = 0;
    faseAtual = 0;
    flutuantes = [];
    tela = "inicio";
    for (let item of itensProducao) item.qtd = 0;
    for (let pu of powerups) pu.comprado = false;
    atualizarStatus();
  }
}

function mouseWheel(event) {
  if (tela === "loja") {
    scrollLoja += event.delta;
    scrollLoja = constrain(scrollLoja, 0, max(0, 8 * 82 - ALTURA + 150));
  }
}

function comprarItem(item, tipo) {
  let preco = calcPreco(item, tipo);
  if (tipo === "producao" && bananas >= preco) {
    bananas -= preco;
    item.qtd++;
    atualizarStatus();
  } else if (tipo === "powerup" && !item.comprado && bananas >= preco) {
    bananas -= preco;
    item.comprado = true;
    atualizarStatus();
  }
}
