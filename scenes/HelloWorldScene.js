// URL to explain PHASER scene: https://rexrainbow.github.io/phaser3-rex-notes/docs/site/scene/

export default class HelloWorldScene extends Phaser.Scene {
  constructor() {
    super("Helloworld")
  }

  init() {
  }

  preload() {
    // load assets
    this.load.image ("Cielo","public/assets/Cielo.webp")
    this.load.image ("plataforma","public/assets/platform.png")
    this.load.image ("ninja","public/assets/Ninja.png")
  }

  create() {
    // Fondo
    this.add.image(400, 300, "Cielo").setScale(2);

    // Plataformas
    const platforms = this.physics.add.staticGroup();
    platforms.create(400, 568, 'plataforma').setScale(2).refreshBody();
    platforms.create(600, 400, 'plataforma').setScale(0.5).refreshBody();
    platforms.create(50, 250, 'plataforma').setScale(0.5).refreshBody();

    // Personaje
    this.player = this.physics.add.sprite(400, 500, "ninja").setScale(0.1).setOrigin(0.5, 0.5);
    this.player.setCollideWorldBounds(true);
    this.player.body.setGravityY(300);

    // Colision
    this.physics.add.collider(this.player, platforms);

    // Entrada del teclado
    this.cursors = this.input.keyboard.createCursorKeys();
}
    update() {
    // Movimiento del personaje
    if (this.cursors.left.isDown) {
      this.player.setVelocityX(-160);
      this.player.rotation -= 0.1; // Gira a la izquierda
  } else if (this.cursors.right.isDown) {
      this.player.setVelocityX(160);
      this.player.rotation += 0.1; // Gira a la derecha
  } else {
      this.player.setVelocityX(0);
  }
   
    // Salto del personaje
    if (this.cursors.up.isDown && this.player.body.touching.down) {
      this.player.setVelocityY(-330);
    }

  }
}
