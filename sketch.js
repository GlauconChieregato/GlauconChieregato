let ball;
let leftPaddle;
let rightPaddle;
let leftScore = 0;
let rightScore = 0;
let isPaused = false; // Variável para controlar o estado de pausa
let modernFont; // Variável para a fonte moderna

function preload() {
  modernFont = loadFont('https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/webfonts/fa-regular-400.ttf');
}

function setup() {
  createCanvas(600, 400);
  ball = new Ball();
  leftPaddle = new Paddle(true);
  rightPaddle = new Paddle(false);
}

function draw() {
  background(20); // Fundo mais escuro para um visual moderno

  if (!isPaused) {
    ball.update();
    leftPaddle.update();
    rightPaddle.update();

    ball.checkPaddle(leftPaddle);
    ball.checkPaddle(rightPaddle);

    ball.show();
    leftPaddle.show();
    rightPaddle.show();
  } else {
    textSize(64);
    textFont(modernFont); // Aplicar a fonte moderna
    fill("#FFBC93"); // Cor para a mensagem de pausa
    textAlign(CENTER, CENTER);
    text("Pausa", width / 2, height / 2);
  }

  // Exibir placar
  textSize(32);
  textFont(modernFont); // Aplicar a fonte moderna
  fill(255);
  textAlign(CENTER, CENTER);
  text(leftScore, width / 4, 50);
  text(rightScore, 3 * width / 4, 50);
}

function keyPressed() {
  if (key === ' ') { // Verifica se a tecla pressionada é o ESPAÇO
    isPaused = !isPaused; // Alterna o estado de pausa
  }
}

class Ball {
  constructor() {
    this.reset();
    this.r = 12; // Raio para cálculo, não usado para renderização
    this.size = 24; // Tamanho da bola quadrada
    this.xspeed = 6;
    this.yspeed = 4;
    this.delay = 30; // Atraso em frames para reiniciar a bola após um ponto
    this.counter = 0; // Contador para o atraso
  }

  reset() {
    this.x = width / 2;
    this.y = height / 2;
    this.xspeed = random([-6, 6]); // Define direção e velocidade aleatórias ao resetar
    this.yspeed = random([-4, 4]);
    this.counter = 0; // Reinicia o contador ao resetar a bola
  }

  update() {
    if (this.counter > 0) {
      this.counter--; // Decrementa o contador do atraso
      return; // Retorna sem atualizar a posição da bola
    }

    this.x += this.xspeed;
    this.y += this.yspeed;

    if (this.y < 0 || this.y > height) {
      this.yspeed *= -1; // Inverte a direção vertical da bola
    }

    if (this.x < 0) {
      rightScore++; // Incrementa o placar da direita
      this.x = width / 2; // Reposiciona a bola no centro
      this.y = height / 2; // Reposiciona a bola no centro
      this.xspeed *= -1; // Inverte a direção horizontal da bola
    } else if (this.x > width) {
      leftScore++; // Incrementa o placar da esquerda
      this.x = width / 2; // Reposiciona a bola no centro
      this.y = height / 2; // Reposiciona a bola no centro
      this.xspeed *= -1; // Inverte a direção horizontal da bola
    }
  }

  show() {
    fill(255);
    noStroke();
    rect(this.x - this.size / 2, this.y - this.size / 2, this.size, this.size, 8); // Quadrado com cantos arredondados
  }

  checkPaddle(paddle) {
    if (
      this.x - this.size / 2 < paddle.x + paddle.w &&
      this.x + this.size / 2 > paddle.x &&
      this.y + this.size / 2 > paddle.y &&
      this.y - this.size / 2 < paddle.y + paddle.h
    ) {
      this.xspeed *= -1;

      // Adiciona uma variação aleatória à velocidade vertical
      let angle = random(-PI / 4, PI / 4); // Ângulo aleatório
      this.yspeed += sin(angle) * 2; // Modifica a velocidade vertical da bola

      // Limita a velocidade vertical para evitar que fique muito rápida ou muito lenta
      this.yspeed = constrain(this.yspeed, -6, 6);
    }
  }
}

class Paddle {
  constructor(isLeft) {
    this.w = 12; // Largura da raquete
    this.h = 100; // Altura da raquete
    this.isLeft = isLeft;
    this.x = isLeft ? 0 : width - this.w;
    this.y = height / 2 - this.h / 2;
    this.cornerRadius = 8; // Raio dos cantos para raquetes arredondadas
  }

  update() {
    if (this.isLeft) {
      if (keyIsDown(UP_ARROW)) {
        this.y -= 6; // Velocidade de movimento da raquete
      }
      if (keyIsDown(DOWN_ARROW)) {
        this.y += 6; // Velocidade de movimento da raquete
      }
      this.y = constrain(this.y, 0, height - this.h);
    } else {
      if (ball.y < this.y + this.h / 2) {
        this.y -= 6;
      } else {
        this.y += 6;
      }

      this.y = constrain(this.y, 0, height - this.h);
    }
  }

  show() {
    fill(255);
    noStroke();
    rect(this.x, this.y, this.w, this.h, this.cornerRadius); // Raquete com cantos arredondados
  }
}
