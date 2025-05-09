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
    // ENTORNO
    this.add.image(400, 300, "Cielo").setScale(2);

    this.platforms = this.physics.add.staticGroup();

    this.platforms.create(400, 568, 'plataforma').setScale(2).refreshBody();

    this.platforms.create(700, 450, 'plataforma').setScale(0.5).refreshBody();
    this.platforms.create(50, 250, 'plataforma').setScale(0.5).refreshBody();
    this.platforms.create(360, 350, 'plataforma').setScale(0.5).refreshBody();

    // PERSONAJE
    this.player = this.physics.add.sprite(400, 500, "ninja").setScale(0.1).setOrigin(0.5, 0.5);
    this.player.setCollideWorldBounds(true);
    this.physics.add.collider(this.player, this.platforms); // Colisión entre el jugador y las plataformas
    this.cursors = this.input.keyboard.createCursorKeys(); // Entrada del teclado

    //ITEMS
    this.items = this.physics.add.group()

    this.physics.add.collider(this.items, this.platforms); // Colisión entre los items y las plataformas

    this.physics.add.overlap(this.player, this.items, this.collectItem, null, this); // Colisión entre el jugador y los items

    this.time.addEvent({
      delay: 500,
      callback: this.spawnItem,
      callbackScope: this,
      loop: true,
    });
    
    //PUNTOS
    this.score = 0; // Inicializa la puntuación
    this.scoreText = this.add.text(30, 16, `Score: ${this.score}`, { //texto de puntos
      fontSize: "32px",
      fill: "#fff",
      fontFamily: "Arial",
    });

    this.collectedItems = {
      cuadrado: 0,
      triangulo: 0,
      diamante: 0,
    };

    //TIEMPO
    this.tiempoRestante = 20; // Inicializa el tiempo restante
    this.timerText = this.add.text(600, 16, `Tiempo: ${this.tiempoRestante}`, { //texto de tiempo
      fontSize: "32px",
      fill: "#fff",
      fontFamily: "Arial",
    });
    this.timerEvent = this.time.addEvent({
      delay: 1000,
      callback: () => {
        this.tiempoRestante--;
        this.timerText.setText(`Tiempo: ${this.tiempoRestante}`);
        
        if (this.tiempoRestante <= 0) {
          this.time.removeAllEvents(); // Detiene el temporizador
          this.loseGame(); // Llama a la función de perder si el tiempo se agota
        };
      },
      callbackScope: this,
      loop: true,
    });


  }
  update() {
    // MOVIMIENTO DEL PERSONAJE
    if (this.cursors.left.isDown) {
      this.player.setVelocityX(-160);

      //this.player.anims.play("left", true);
    } else if (this.cursors.right.isDown) {
      this.player.setVelocityX(160);

      //this.player.anims.play("right", true);
    } else {
      this.player.setVelocityX(0);

      //this.player.anims.play("turn");
    }

    if (this.cursors.up.isDown && this.player.body.touching.down) {
      this.player.setVelocityY(-270);    }

      this.items.children.iterate((item) => {
        if (!item.body) return; // Si el item no tiene cuerpo, no hacer nada
      
        if (item.body.blocked.down) {
          if (!item.hasJustBounced) {
            item.valor -= 5;
            item.hasJustBounced = true; // Marca que ya rebotó
          }
        } else {
          item.hasJustBounced = false; // Si no está tocando el suelo, se resetea
        }
      
        if (item.valor === 0) {
          item.disableBody(true, true); // Desactiva el item si su valor es menor o igual a 0
        }
      });

    }
    
      collectItem(player, item) {
        item.disableBody(true, true);
        this.score += item.valor || 0;
        this.scoreText.setText(`Score: ${this.score}`);

        if (this.collectedItems.hasOwnProperty(item.texture.key)) {
          this.collectedItems[item.texture.key]++;
        };
        if (
          this.score >= 100 &&
          this.collectedItems.cuadrado >= 2 &&
          this.collectedItems.triangulo >= 2 &&
          this.collectedItems.diamante >= 2)
          this.winGame()
        
          }

      spawnItem() {
        const itemKeys = ["cuadrado", "triangulo", "diamante", "ninjamalo"];
        const randomKey = Phaser.Utils.Array.GetRandom(itemKeys);
        let itemValues = {
          cuadrado: 10,
          triangulo: 20,
          diamante: 30,
          ninjamalo: -20,
        };
        const x = Phaser.Math.Between(50, 750);
        const item = this.items.create(x, 0, randomKey);
        item.setScale(0.5).setBounceY(Phaser.Math.FloatBetween(0.4, 0.8));
        item.setVelocityY(Phaser.Math.Between(50, 100));
        item.setCollideWorldBounds(true);
      
        if (randomKey === "ninjamalo") {
          item.setScale(0.1);
        }
      
        item.valor = itemValues[randomKey];
      }

      winGame() {
        this.scene.start("GameOverScene", {
        result: "win",
        score: this.score,
      });
      }

      loseGame() {
        this.scene.start("GameOverScene", {
          result: "lose",
          score: this.score,
        });
      }
  }