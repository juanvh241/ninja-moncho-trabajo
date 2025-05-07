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
    this.load.image ("cuadrado","public/assets/square.png")
    this.load.image ("triangulo","public/assets/triangle.png")
    this.load.image ("diamante","public/assets/diamond.png")
    this.load.image ("ninjamalo","public/assets/ninja_malo.png")
  }

  create() {
    // Fondo
    this.add.image(400, 300, "Cielo").setScale(2);

    // puntos
    this.score = 0;
    this.scoreText = this.add.text(16, 16, 'Puntos: 0', { fontSize: '24px', fill: '#fff' });
    this.itemValues = {
      cuadrado: 10,
      triangulo: 20,
      diamante: 30,
      ninjamalo: -20
  };

    // Plataformas
    const platforms = this.physics.add.staticGroup();
    platforms.create(400, 568, 'plataforma').setScale(2).refreshBody();
    platforms.create(700, 450, 'plataforma').setScale(0.5).refreshBody();
    platforms.create(50, 250, 'plataforma').setScale(0.5).refreshBody();
    platforms.create(360, 350, 'plataforma').setScale(0.5).refreshBody();


    // Personaje
    this.player = this.physics.add.sprite(400, 500, "ninja").setScale(0.1).setOrigin(0.5, 0.5);
    this.player.setCollideWorldBounds(true);
    this.player.body.setGravityY(300);

    // Grupo de ítems
    this.items = this.physics.add.group();
    this.physics.world.on('worldbounds', (body, up, down, left, right) => {
      const item = body.gameObject;
  
      // Solo ítems, y solo si tocaron el borde de abajo (suelo)
      if (this.items.contains(item) && down) {
          let puntos = item.getData('puntosRestantes') || 0;
          puntos -= 5;
          item.setData('puntosRestantes', puntos);
  
          if (puntos <= 0) {
              item.destroy();
          }
      }
  });
  

    // Colision
    this.physics.add.collider(this.player, platforms);
    this.physics.add.collider(this.items, platforms); // Colisión entre ítems y plataformas

    // Entrada del teclado
    this.cursors = this.input.keyboard.createCursorKeys();

     // Timer: cada 1 segundo, crea un ítem
     this.time.addEvent({
         delay: 500,
         callback: this.spawnItem,
         callbackScope: this,
         loop: true
     });

     // overlap puntos y win

     this.physics.add.overlap(this.player, this.items, (player, item) => {
      const tipo = item.texture.key;
      const puntos = this.itemValues[tipo] || 0;
      this.score += puntos;
      this.scoreText.setText('Puntos: ' + this.score);
    
      item.destroy();
    
      if (this.score >= 100 && !this.gameWon) {
          this.gameWon = true;
    
          this.add.text(200, 250, '¡GANASTE!', {
              fontSize: '48px',
              fill: '#0f0',
              fontFamily: 'Arial'
          }).setScrollFactor(0);
    
          this.physics.pause();
          this.player.setTint(0x00ff00);
      }
    });
    
  
 }
 
 spawnItem() {
    const itemKeys = ['cuadrado', 'triangulo', 'diamante', 'ninjamalo'];
    const randomKey = Phaser.Utils.Array.GetRandom(itemKeys);
    const x = Phaser.Math.Between(50, 750);
    const item = this.items.create(x, 0, randomKey).setScale(0.5);
    if (randomKey === 'ninjamalo') {
        item.setScale(0.1);
    }

    item.setVelocityY(Phaser.Math.Between(100, 200));
    item.setCollideWorldBounds(true);
    item.setBounce(0.5);
    item.setData('puntosRestantes', this.itemValues[randomKey]);

    // Activar rebote individual
    item.setData('puedeDescontar', true);
}

    update() {
        // Movimiento del personaje
        if (this.cursors.left.isDown) {
          this.player.setVelocityX(-160);
          this.player.rotation -= 0.1;
        } else if (this.cursors.right.isDown) {
          this.player.setVelocityX(160);
          this.player.rotation += 0.1;
        } else {
          this.player.setVelocityX(0);
        }
      
        // Salto
        if (this.cursors.up.isDown && this.player.body.touching.down) {
          this.player.setVelocityY(-330);
        }

        //gameover
        if (this.score >= 100 && !this.gameOver) {
          this.gameOver = true;
          this.scene.stop(); // Detiene esta escena
          this.scene.start('GameOverScene', { ganaste: true, puntos: this.score });
        }
        
        if (this.score < 0 && !this.gameOver) {
          this.gameOver = true;
          this.scene.stop(); // Detiene esta escena
          this.scene.start('GameOverScene', { ganaste: false, puntos: this.score });
        }      
      }
    } //hola