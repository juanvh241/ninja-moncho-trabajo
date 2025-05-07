export class GameOverScene extends Phaser.Scene {
    constructor() {
        super({ key: 'GameOverScene' });
    }

    init(data) {
        this.ganaste = data.ganaste;
        this.puntos = data.puntos;
    }

    create() {
        const mensaje = this.ganaste ? '¡GANASTE!' : '¡PERDISTE!';
        const color = this.ganaste ? '#0f0' : '#f00';

        this.add.text(400, 200, mensaje, {
            fontSize: '48px',
            color: color,
            fontFamily: 'Arial',
        }).setOrigin(0.5);

        this.add.text(400, 280, `Puntos: ${this.puntos}`, {
            fontSize: '32px',
            color: '#fff',
            fontFamily: 'Arial',
        }).setOrigin(0.5);
    }
} 
