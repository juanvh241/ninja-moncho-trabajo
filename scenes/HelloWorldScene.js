// URL to explain PHASER scene: https://rexrainbow.github.io/phaser3-rex-notes/docs/site/scene/

export default class HelloWorldScene extends Phaser.Scene {
  constructor() {
    super("Helloword")
  }

  init() {
  }

  preload() {
    // load assets
    this.load.image ("Cielo","public/assets/Cielo.webp")
  }

  create() {
    // create game objects
    this.add.image (400, 300, "Cielo").setScale (2);
    }

    update() {
      // update game objects
    }
  }


