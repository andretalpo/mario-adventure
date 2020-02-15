// renderPerson() {
//     let image = new Image();
//     image.src = './images/small-mario.png';
//     image.onload = () => {
//         let body = document.querySelector('body');
//         body.insertBefore(image, body.childNodes[0])

//     }
// }}

class Problem {
    constructor(name) {
        this.name = name;
        this.dialogs = this.createDialogs();
        this.solved = false;
        document.querySelector(`.${this.name}`).onclick = () => {
            document.querySelector(`grab-${this.name}`).classList.remove('invisible');
            document.querySelector(`grab-${this.name}`).onclick = () => this.grab();
            document.querySelector(`talk-${this.name}`).classList.remove('invisible');
            document.querySelector(`talk-${this.name}`).onclick = () => this.talk();
        };

        grab = () => {
            //cada um terá uma ação ao receber grab
        };

        talk = () => {
            //Roda a lista de diálogos até o final e deixa travado na última.
        }
    }
}

class Item {

}

class Game {
    constructor() {
        this.enemies = this.createEnemies();
    }

    createEnemies = () => {
        return [
            new Problem('red-koopa'),//koopa nervoso com o mario, deve conversar com ele até que ele de um graveto para ele
            new Problem('yoshi'),//yoshi esta com fome e mario deve usar a vara para pegar a fruta e dar pra ele, ganhando uma chave
            new Problem('jocker'),//jocker está sem sua bola de futebol, mario deve achar e devolver
        ]
    };

    checkGameOver = () => {
        //se todos os problemas estiverem resolvidos, a porta do castelo abre
    }

}

window.onload = () => {
    new Game();

};

