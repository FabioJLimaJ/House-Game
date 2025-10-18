// main.js - Phaser 3
const config = {
    type: Phaser.AUTO, // Renderizador automático (WebGL se possível, senão Canvas)
    width: window.innerWidth,
    height: window.innerHeight,
    backgroundColor: "#383838",
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 600 },
            debug: false
        }
    },
    scene: {
        preload,
        create,
        update
    }
};

let player;
let cursors;
let clouds = [];

function preload() {
    // Carrega imagens
    this.load.image("botParado", "assets/img/botEsquerdo.png");
    this.load.image("botVoando", "assets/img/botVoando.png");
    this.load.image('ground', 'https://labs.phaser.io/assets/sprites/platform.png');
    this.load.image('nuvem', 'assets/img/nuvem.png');
}

function create() {
    // --- PLAYER ---
    player = this.physics.add.sprite(400, 300, "botParado");
    player.setScale(0.3);
    player.setDepth(1); // Fica na frente
    player.setCollideWorldBounds(true); // Não sai do mundo

    // --- CASA EXEMPLO ---
    let casa = this.add.container(400, 600);
    let corpo = this.add.rectangle(0, -40, 300, 300, 0x8B4513);
    corpo.setOrigin(0.5, 1);
    let telhado = this.add.triangle(0, -145, -150, 0, 150, 0, 0, -150, 0xFF0000);
    telhado.setOrigin(0, 1.3);
    casa.add([corpo, telhado]);
    casa.setDepth(0); // Atrás do player

    // --- CHÃO ---
    const ground = this.physics.add.staticGroup();
    ground.create(config.width / 2, config.height - 50, 'ground')
        .setScale(100, 5)
        .refreshBody();

    // Colisão do player com o chão
    this.physics.add.collider(player, ground);

    // --- NUVENS ---
    for (let i = 0; i < 10; i++) {
        let cloud = this.add.image(
            Phaser.Math.Between(0, config.width),
            Phaser.Math.Between(50, 200),
            'nuvem'
        );
        cloud.setScale(Phaser.Math.FloatBetween(0.3, 1.2));
        cloud.setAlpha(0.7);
        cloud.speed = Phaser.Math.FloatBetween(0.3, 1);
        cloud.setDepth(-1); // Atrás de tudo
        clouds.push(cloud);
    }

    // --- CONTROLES ---
    cursors = this.input.keyboard.createCursorKeys();

    // --- MUNDO ---
    this.physics.world.setBounds(0, 0, config.width * 3, config.height);
    this.cameras.main.setBounds(0, 0, config.width * 3, config.height);

    // --- CÂMERA ---
    this.cameras.main.startFollow(player, true, 0.1, 0.1); // Segue suavemente
    this.cameras.main.setZoom(1.1); // Zoom opcional
}

function update() {
    // --- MOVIMENTO PLAYER ---
    player.body.setVelocityX(0); // Zera velocidade horizontal

    if (cursors.left.isDown) {
        player.body.setVelocityX(-300); // esquerda
        player.flipX = true;
        player.setTexture("botVoando");
    } else if (cursors.right.isDown) {
        player.body.setVelocityX(300); // direita
        player.flipX = false;
        player.setTexture("botVoando");
    } else {
        player.setTexture("botParado");
    }

    // --- MOVIMENTO DAS NUVENS ---
    clouds.forEach(cloud => {
        cloud.x += cloud.speed;
        if (cloud.x > config.width + 100) {
            cloud.x = -100;
            cloud.y = Phaser.Math.Between(50, 200);
            cloud.speed = Phaser.Math.FloatBetween(0.3, 1);
        }
    });
}

// --- INICIA O JOGO ---
new Phaser.Game(config);
