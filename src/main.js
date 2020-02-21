// renderPerson() {
//     let image = new Image();
//     image.src = './images/small-mario.png';
//     image.onload = () => {
//         let body = document.querySelector('body');
//         body.insertBefore(image, body.childNodes[0])

//     }
// }}

class Interactable {
    constructor(name, player) {
        this.name = name;
        this.dialogs = this.createDialogs();
        this.dialogIndex = 0;
        this.left = getComputedStyle(document.querySelector(`.${this.name}`)).left;
        this.top = getComputedStyle(document.querySelector(`.${this.name}`)).top;
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
            case 'yoshi':
                dialogs.push('Mario! Você por aqui!');
                dialogs.push('Estou morrendo de fome, mas as frutas que sobraram estão tão altas.');
                break;
            case 'jocker':
                dialogs.push('Não tenho tempo pra você.');
                dialogs.push('Ora, saia daqui!');
                dialogs.push('Quer entrar no castelo? Eu tenho a chave, mas preciso de um favor.');
                dialogs.push('Perdi minha bola, se puder encontrá-la, a chave é sua.');
                break;
            default:
                dialogs.push('Você é encarado em silêncio.');
        }
        return dialogs;
    };

    grab = () => {
        switch (this.name) {
            case 'red-koopa':
                this.showDialog('Se tentar pular em mim, eu vou te deitar na porrada!');
                break;
            case 'yoshi':
                if (this.player.selectedItem !== 'fruit') {
                    this.showDialog('Não estou afim de cavalgar Mario, estou com fome!');
                }
                break;
            case 'fruit':
                if (this.player.selectedItem === 'stick') {
                    this.player.addItem('fruit');
                    document.querySelector('.fruit').classList.add('invisible');
                } else {
                    this.showDialog('A fruta está alta demais. Quem sabe um cogumelo ajude');
                }
        }
        this.hideInteractions();
        if (this.constructor.name === 'Problem') this.checkProblemSolved();
    };

    talk = () => {
        this.showDialog(this.dialogs[this.dialogIndex]);
        if (this.constructor.name === 'Problem') this.checkProblemSolved();
        if (this.dialogIndex < this.dialogs.length - 1) this.dialogIndex++;
        this.hideInteractions();
    };

    movePlayerToProblem = () => {
        let player = document.querySelector('.player');
        player.style.left = this.left;
        // player.style.top = this.top;
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
        super(name, player);
        this.solved = false;
    }

    checkProblemSolved = () => {
        switch (this.name) {
            case 'red-koopa':
                if (this.dialogIndex === this.dialogs.length - 1) {
                    this.solved = true;
                    this.player.addItem('stick');
                }
                break;
            case 'yoshi':
                if (this.player.selectedItem === 'fruit') {
                    this.solved = true;
                    this.dialogs = [];
                    this.dialogs.push('Obrigado amigo! Você é um amigo!');
                    this.dialogIndex = 0;
                    this.showDialog('Obrigado amigo! Você é um amigo!');
                }
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
        let itemIcon = document.querySelector(`.inventory-${item}`);
        itemIcon.classList.remove('invisible');
        itemIcon.onclick = () => {
            this.selectedItem = item;
            this.hideInventory();
        };
    }

    removeItem = (item) => {
        this.itens = this.itens.filter((e) => e !== item);
        document.querySelector(`.inventory-${item}`).classList.add('invisible');
    }

    showInventory = () => {
        document.querySelector('.inventory').classList.remove('invisible');
    };

    hideInventory = () => {
        document.querySelector('.inventory').classList.add('invisible');
    }
}

class Game {
    constructor(player) {
        this.player = player;
        this.problems = this.createProblems();
        this.itens = this.createItens();

        setInterval(() => {
            this.checkGameOver();
        }, 1000);
    }

    createProblems = () => {
        return [
            new Problem('red-koopa', this.player),
            new Problem('yoshi', this.player),
            // new Problem('jocker', this.player),
        ];
    };

    createItens = () => {
        return [
            new Interactable('fruit', this.player),
            new Interactable('half-ball', this.player),
        ];
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

