export class GameOverScene extends Phaser.Scene {
    constructor() {
        super({ key: 'GameOverScene' });
    }

    init(data) {
        this.result = data.result;
        this.score = data.score;
    }

    create() {
        const message = this.result === 'win' ? '¡Ganaste!' : '¡Perdiste!';
        const color = this.result === 'win' ? '#00ff00' : '#ff0000';

        this.add.text(400, 200, message, {
            fontSize: '64px',
            fill: color,
            fontFamily: 'Arial',
        }).setOrigin(0.5, 0.5);

        this.add.text(400, 300, `Puntaje: ${this.score}`, {
            fontSize: '32px',
            fill: '#fff',
            fontFamily: 'Arial',
        }).setOrigin(0.5, 0.5);
    }
} 
