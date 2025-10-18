const config = {
    tywhitepe: Phaser.AUTO,
    width: 3000,
    height: window.innerHeight,
    backgroundColor: "#383838ff",
    scene: {
        preload,
        create,
        update,

        physics: {
            default: 'arcade',
            arcade: {
                gravity: { y: 600 },
                debug: false
            }
        }
    }

};
let player;
let cursors;

function preload() {

    this.load.image("botParado", "assets/img/botEsquerdo.png");
    this.load.image("botVoando", "assets/img/botVoando.png");
    this.load.image('ground', 'https://labs.phaser.io/assets/sprites/platform.png');
    this.load.image('nuvem', 'assets/img/nuvem.png');

}

function create() {

    player = this.add.sprite(400, 300, "botParado");  //Add o elemento + Sprite 
    player.setScale(0.3);  //Setar tamanho do personagem
    player.setDepth(1);  //deixa a camada na frente

    let casa = this.add.container(400, 600); // posição da base da casa

    // Corpo da casa (retângulo)
    let corpo = this.add.rectangle(0, -40, 300, 300, 0x8B4513);
    corpo.setOrigin(0.5, 1); // base alinhada à posição

    // Telhado (triângulo)
    let telhado = this.add.triangle(0, -145, 
        -150, 0, 150, 0, 0, -150, 0xFF0000);
    telhado.setOrigin(0, 1.3);

    // Adiciona as formas ao container
    casa.add([corpo, telhado]);
    
    // Coloca a casa atrás de outros elementos
    casa.setDepth(0);
    

    this.physics.add.existing(player); 
    player.body.setCollideWorldBounds(true);

   
    cursors = this.input.keyboard.createCursorKeys();

    const ground = this.physics.add.staticGroup();
    ground.create(config.width / 2, config.height - 50, 'ground')
        .setScale(100,5)
        .refreshBody();

    this.physics.add.collider(player, ground);



clouds = [];
for (let i = 0; i < 10; i++) {
    let cloud = this.add.image(
        Phaser.Math.Between(0, config.width),
        Phaser.Math.Between(50, 200),
        'nuvem'
    );
    cloud.setScale(Phaser.Math.FloatBetween(0.5, 1.2));
    cloud.setAlpha(0.7);
    cloud.speed = Phaser.Math.FloatBetween(0.3, 1); // velocidade
    cloud.setDepth(-1); // atrás de tudo
    clouds.push(cloud);
    cloud.setScale(0.3);


}
// this.cameras.main.startFollow(player);
// this.cameras.main.setBounds(0, 0, 1000, 600);


//GIOVOS

    // 🎥 Configura os limites do mundo (maior que a tela)
    this.physics.world.setBounds(0, 0, config.width * 3, config.height);
    this.cameras.main.setBounds(0, 0, config.width * 3, config.height);

    // Faz a câmera seguir o personagem
    this.cameras.main.startFollow(player, true, 0.08, 0.08);

    // Zoom opcional
    this.cameras.main.setZoom(1.1);

// 🛠️ Cria um chão longo que acompanha o cenário inteiro


}
function update() {
    
    if (cursors.left.isDown) {
        player.x -= 100;
        player.flipX = true;
        player.setTexture("botVoando");
    } else if (cursors.right.isDown) {
        player.x += 100;
        player.flipX = false;
        player.setTexture("botVoando");
    } else {

        player.setTexture("botParado");
        player.flipX = true;
    }

    
clouds.forEach(cloud => {
    cloud.x += cloud.speed;
    if (cloud.x > config.width + 100) {
        cloud.x = -100;
        cloud.y = Phaser.Math.Between(50, 200);
        cloud.speed = Phaser.Math.FloatBetween(0.3, 1);
    }
});


}

new Phaser.Game(config);
