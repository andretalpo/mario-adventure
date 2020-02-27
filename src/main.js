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
            hideDialogs();
            hideInteractions();
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
                dialogs.push('Gosta de futebol? Eu só falo com quem gosta de futebol.');
                dialogs.push('Também gosto de jogar futebol, mas minha bola desapareceu.');
                dialogs.push('Se eu achar o ladrão...');
                dialogs.push('Quer entrar no castelo? Eu tenho a chave, mas preciso de um favor.');
                dialogs.push('Se puder encontrar minha bola, a chave é sua.');
                break;
            default:
                dialogs.push('Nenhuma resposta.');
        }
        return dialogs;
    };

    grab = () => {
        if (this.player.selectedItem === 'pow') {
            document.querySelectorAll('.block').forEach((e) => e.classList.remove('invisible'));
            document.querySelector('.key-hole').classList.remove('invisible');
            this.player.removeItem('pow');
        } else {
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
                    break;
                case 'jocker':
                    if (this.player.selectedItem !== 'ball') {
                        this.showDialog('Uma trombada comigo sem o equipamento necessário pode ser fatal');
                    }
                    break;
                case 'half-ball':
                    this.player.addItem('ball');
                    document.querySelector('.half-ball').classList.add('invisible');
                    break;
                case 'castle':
                    if (this.player.selectedItem !== 'key') {
                        if (this.solved) {
                            this.showDialog('A porta está aberta.');
                        } else {
                            this.showDialog('A porta está trancada.');
                        }
                    }
                    break;
                case 'key-hole':
                    if (this.player.selectedItem === 'key') {
                        document.querySelector('.key-hole-dot').classList.add('transition-ending');
                        setTimeout(() => {
                            document.querySelector('.game-screen').classList.add('invisible');
                            document.querySelector('.good-ending-screen').classList.remove('invisible');
                        }, 1000);
                    } else {
                        this.showDialog('As vezes, quando você olha para o vazio, ele olha de volta.');
                    }
            }
        }
        hideInteractions();
        if (this.constructor.name === 'Problem') this.checkProblemSolved();
        this.player.selectedItem = undefined;
    };

    talk = () => {
        this.showDialog(this.dialogs[this.dialogIndex]);
        if (this.constructor.name === 'Problem') this.checkProblemSolved();
        if (this.dialogIndex < this.dialogs.length - 1) this.dialogIndex++;
        hideInteractions();
    };

    movePlayerToProblem = () => {
        let player = document.querySelector('.player');
        const numberLeft = Number(this.left.match(/\d+/gi));
        player.style.left = numberLeft - 35 + "px";
        // player.style.top = this.top;
    };

    showDialog = (text) => {
        const dialog = document.querySelector(`.dialog-${this.name}`);
        dialog.classList.remove('invisible');
        dialog.innerText = text;
    };
}

class Problem extends Interactable {
    constructor(name, player) {
        super(name, player);
        this.solved = false;
    }

    checkProblemSolved = () => {
        if (!this.solved) {
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
                        this.dialogs.push('Obrigado Mario! Você é um amigo!');
                        this.dialogIndex = 0;
                        this.showDialog('Obrigado Mario! Você é um amigo!');
                        this.player.addItem('pow');
                        this.player.selectedItem = undefined;
                        this.player.removeItem('fruit');
                    }
                    break;
                case 'jocker':
                    if (this.player.selectedItem === 'ball') {
                        this.solved = true;
                        this.dialogs = [];
                        this.dialogs.push('Nossa, você encontrou! Não faço ideia onde poderia estar.');
                        this.dialogIndex = 0;
                        this.showDialog('Nossa, você encontrou! Não faço ideia onde poderia estar. Tome sua chave!');
                        this.player.addItem('key');
                        this.player.selectedItem = undefined;
                        this.player.removeItem('ball');
                    }
                    break;
                case 'castle':
                    if (this.player.selectedItem === 'key') {
                        this.solved = true;
                        this.player.selectedItem = undefined;
                        this.player.removeItem('key');
                        document.querySelector('.castle-open').classList.remove('invisible');
                        document.querySelector('.castle-open').onclick = () => {
                            this.showDialog("Você não pode sair, ainda tem assuntos a resolver!");
                        };
                    }
                    break;
            }
        }
    };

}

class Player {
    constructor() {
        this.itens = [];
        this.selectedItem;

        document.querySelector('.inventory-icon').onclick = () => {
            this.toggleInventory();
        }
    }

    addItem = (item) => {
        this.itens.push(item);
        this.renderObtainedItem(item);
        let itemIcon = document.querySelector(`.inventory-${item}`);
        itemIcon.classList.remove('invisible');
        itemIcon.onclick = () => {
            this.selectedItem = item;
            this.renderSelectedItem();
            hideInventory();
        };
    }

    removeItem = (item) => {
        this.itens = this.itens.filter((e) => e !== item);
        document.querySelector(`.inventory-${item}`).classList.add('invisible');
    }

    toggleInventory = () => {
        document.querySelector('.container').classList.toggle('invisible');
        document.querySelector('.inventory').classList.toggle('transition-open-inventory');
    };

    renderSelectedItem = () => {
        let image = new Image();
        image.src = `images/${this.selectedItem}.png`;
        image.style.height = '40px';
        document.querySelector('.selected-item').childNodes.forEach((e) => e.remove());
        document.querySelector('.selected-item').appendChild(image);
    };

    renderObtainedItem = (item) => {
        let image = new Image();
        image.src = `images/${item}.png`;
        image.style.height = '40px';

        let obtainedItem = document.querySelector('.obtained-item');
        obtainedItem.style.top = getComputedStyle(document.querySelector('.player')).top;
        obtainedItem.style.left = getComputedStyle(document.querySelector('.player')).left;
        obtainedItem.childNodes.forEach((e) => e.remove());
        obtainedItem.appendChild(image);
        
        obtainedItem.classList.remove('invisible');
        obtainedItem.classList.add('animated-obtained-item');
        setTimeout(() => obtainedItem.classList.add('invisible'), 1200);
    };
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
            new Problem('jocker', this.player),
            new Problem('castle', this.player),
        ];
    };

    createItens = () => {
        return [
            new Interactable('fruit', this.player),
            new Interactable('half-ball', this.player),
            new Interactable('key-hole', this.player),
        ];
    };

    checkGameOver = () => {
        if (this.problems.every((e) => e.solved)) {
            document.querySelector('.castle-open').onclick = (e) => {
                e.target.classList.add('transition-ending');
                setTimeout(() => {
                    document.querySelector('.game-screen').classList.add('invisible');
                    document.querySelector('.bad-ending-screen').classList.remove('invisible');
                }, 1000);

            };
        }
    }

}

start = () => {
    document.querySelector('.title-screen').classList.toggle('invisible');
    document.querySelector('.game-screen').classList.toggle('invisible');
    const player = new Player();
    new Game(player);
    document.querySelector('.background').onclick = () => {
        hideAll();
    };
    document.onkeydown = (e) => {
        if (e.keyCode === 27) {
            hideAll();
        }
    }
    animateStuff();
}

hideAll = () => {
    hideInteractions();
    hideDialogs();
    hideInventory();
}

hideInteractions = () => {
    document.querySelectorAll('.interaction').forEach((e) => e.classList.add('invisible'));
}


hideDialogs = () => {
    document.querySelectorAll('.dialog').forEach((e) => e.classList.add('invisible'));
}

hideInventory = () => {
    document.querySelector('.container').classList.add('invisible');
    document.querySelector('.inventory').classList.remove('transition-open-inventory');
}

animateStuff = () => {
    document.querySelector('.fly-koopa').classList.add('animate-fly-koopa');
    document.querySelector('.bullet').classList.add('animate-bullet');
    document.querySelector('.rod').classList.add('animate-rod');
    document.querySelector('.plant').classList.add('animate-plant');
    setTimeout(() => document.querySelector('.bullet').classList.add('invisible'), 3950);
}