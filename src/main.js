// renderPerson() {
//     let image = new Image();
//     image.src = './images/small-mario.png';
//     image.onload = () => {
//         let body = document.querySelector('body');
//         body.insertBefore(image, body.childNodes[0])

//     }
// }}

class Problem {
    constructor(name, player) {
        this.name = name;
        this.dialogs = this.createDialogs();
        this.dialogIndex = 0;
        this.left = getComputedStyle(document.querySelector(`.${this.name}`)).left;
        this.top = getComputedStyle(document.querySelector(`.${this.name}`)).top;
        this.solved = false;
        this.player = player;

        document.querySelector(`.${this.name}`).onclick = () => {
            this.movePlayerToProblem();
            this.hideDialogs();
            document.querySelector(`.grab-${this.name}`).classList.remove('invisible');
            document.querySelector(`.grab-${this.name}`).onclick = () => this.grab();
            document.querySelector(`.talk-${this.name}`).classList.remove('invisible');
            document.querySelector(`.talk-${this.name}`).onclick = () => this.talk();
        };
    }

    createDialogs = () => {
        const dialogs = [];
        switch (this.name) {
            case 'red-koopa':
                dialogs.push('Ora, você não é aquele Mario? Acha que pode sair por aí pisando na cabeça de todo mundo?');
                dialogs.push('Odeio pessoas que resolvem as coisas com violência.');
                dialogs.push('Por que ainda está falando comigo?');
                dialogs.push('Ah, percebeu que é melhor resolver as coisas com diálogo?');
                dialogs.push('Fico feliz que tenhamos nos acertado, tome minha bengala como recompensa!');
                break;
        }
        return dialogs;
    };

    grab = () => {
        switch (this.name) {
            case 'red-koopa':
                this.showDialog('Se tentar pular em mim, eu vou te deitar na porrada!');
                break;
        }
        this.hideInteractions();
        this.checkProblemSolved();
    };

    talk = () => {
        this.showDialog(this.dialogs[this.dialogIndex]);
        this.checkProblemSolved();
        if (this.dialogIndex < this.dialogs.length - 1) {
            this.dialogIndex++;
        }
        this.hideInteractions();
    };

    movePlayerToProblem = () => {
        let player = document.querySelector('.player');
        player.style.left = this.left;
        player.style.top = this.top;
    };

    showDialog = (text) => {
        const dialog = document.querySelector(`.dialog-${this.name}`);
        dialog.classList.remove('invisible');
        dialog.innerText = text;
    };

    checkProblemSolved = () => {
        switch (this.name) {
            case 'red-koopa':
                if (this.dialogIndex === this.dialogs.length-1) {
                    this.solved = true;
                    this.player.itens.push('bengala');
                }
                break;
        }
    };

    hideInteractions = () => {
        document.querySelector(`.grab-${this.name}`).classList.add('invisible');
        document.querySelector(`.talk-${this.name}`).classList.add('invisible');
    }

    hideDialogs = () => {
        document.querySelectorAll('.dialog').forEach((e) => e.classList.add('invisible'));
    }

}

class Player {
    constructor() {
        this.itens = [];
    }
}

class Game {
    constructor(player) {
        this.player = player;
        this.enemies = this.createEnemies();
    }

    createEnemies = () => {
        return [
            new Problem('red-koopa', this.player),//koopa nervoso com o mario, deve conversar com ele até que ele de um graveto para ele
            // new Problem('yoshi'),//yoshi esta com fome e mario deve usar a vara para pegar a fruta e dar pra ele, ganhando uma chave
            // new Problem('jocker'),//jocker está sem sua bola de futebol, mario deve achar e devolver
        ]
    };

    checkGameOver = () => {
        //se todos os problemas estiverem resolvidos, a porta do castelo fica disponível para clique
    }

}

window.onload = () => {
    const player = new Player();
    new Game(player);
    document.querySelector('.background').onclick = () => {
        document.querySelectorAll('.interaction').forEach((e) => e.classList.add('invisible'));
        document.querySelectorAll('.dialog').forEach((e) => e.classList.add('invisible'));
    };
};

