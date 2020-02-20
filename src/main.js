// renderPerson() {
//     let image = new Image();
//     image.src = './images/small-mario.png';
//     image.onload = () => {
//         let body = document.querySelector('body');
//         body.insertBefore(image, body.childNodes[0])

//     }
// }}

class Interactable {
    constructor(name) {
        this.name = name;
        this.dialogs = this.createDialogs();
        this.dialogIndex = 0;
        this.left = getComputedStyle(document.querySelector(`.${this.name}`)).left;
        this.top = getComputedStyle(document.querySelector(`.${this.name}`)).top;

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
            case 'yoshi':
                dialogs.push('Mario! Você por aqui!');
                dialogs.push('Estou morrendo de fome, mas as frutas que sobraram estão tão altas.');
        }
        return dialogs;
    };

    grab = () => {
        switch (this.name) {
            case 'red-koopa':
                this.showDialog('Se tentar pular em mim, eu vou te deitar na porrada!');
                break;
            case 'yoshi':
                this.showDialog('Não estou afim de cavalgar Mario, estou com fome!');
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

    hideInteractions = () => {
        document.querySelector(`.grab-${this.name}`).classList.add('invisible');
        document.querySelector(`.talk-${this.name}`).classList.add('invisible');
    }

    hideDialogs = () => {
        document.querySelectorAll('.dialog').forEach((e) => e.classList.add('invisible'));
    }
}

class Problem extends Interactable {
    constructor(name, player) {
        super(name);
        this.solved = false;
        this.player = player;
    }

    checkProblemSolved = () => {
        switch (this.name) {
            case 'red-koopa':
                if (this.dialogIndex === this.dialogs.length - 1) {
                    this.solved = true;
                    this.player.addItem('stick');
                }
                break;
        }
    };

}

class Player {
    constructor() {
        this.itens = [];
        this.selectedItem;

        document.querySelector('.inventory-icon').onclick = () => {
            this.showInventory();
        }
    }

    addItem = (item) => {
        this.itens.push(item);
        document.querySelector(`.inventory-${item}`).classList.remove('invisible');
    }

    removeItem = (item) => {
        this.itens = this.itens.filter((e) => e !== item);
        document.querySelector(`.inventory-${item}`).classList.add('invisible');
    }

    showInventory = () => {
        document.querySelector('.inventory').classList.remove('invisible');
    };
}

class Game {
    constructor(player) {
        this.player = player;
        this.problems = this.createProblems();

        setInterval(() => {
            this.checkGameOver();
        }, 1000);
    }

    createProblems = () => {
        return [
            new Problem('red-koopa', this.player),//koopa nervoso com o mario, deve conversar com ele até que ele de um graveto para ele
            new Problem('yoshi'),//yoshi esta com fome e mario deve usar a vara para pegar a fruta e dar pra ele, ganhando uma chave
            // new Problem('jocker'),//jocker está sem sua bola de futebol, mario deve achar e devolver
        ]
    };

    checkGameOver = () => {
        if (this.problems.every((e) => e.solved)) {
            let castleDoor = document.querySelector('.castle-open');
            castleDoor.classList.remove('invisible');
            castleDoor.onclick = () => {
                this.endGame()
            };
        }
    }

    endGame = () => {
        console.log('Ganhoooooou');
    }

}

window.onload = () => {
    const player = new Player();
    new Game(player);
    document.querySelector('.background').onclick = () => {
        document.querySelectorAll('.interaction').forEach((e) => e.classList.add('invisible'));
        document.querySelectorAll('.dialog').forEach((e) => e.classList.add('invisible'));
        document.querySelector('.inventory').classList.add('invisible');
    };
};

