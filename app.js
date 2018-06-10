class Player {
    constructor (name, health, minHealth = 0, maxHealth = health) {
        this.name = name
        this.health = health
        this.minHealth = minHealth
        this.maxHealth = maxHealth
    }

    attack (otherPlayer) {
        let harm = Math.floor(Math.random() * 10)
        otherPlayer.health -= harm
        if (otherPlayer.health < otherPlayer.minHealth) {
            otherPlayer.health = otherPlayer.minHealth
        }
        return `${this.name} ATTACK ${otherPlayer.name}: ${harm} points`
    }

    specialAttack (otherPlayer) {
        let harm = Math.floor(Math.random() * 20)
        otherPlayer.health -= harm
        if (otherPlayer.health < otherPlayer.minHealth) {
            otherPlayer.health = otherPlayer.minHealth
        }

        let selfDamage = Math.floor(Math.random() * 10)
        this.health -= selfDamage
        if (this.health < this.minHealth) {
            this.health = this.minHealth
        }
        return `${this.name} SPECIAL ATTACK ${otherPlayer.name}: ${harm} points`
    }

    heal () {
        let cure = Math.floor(Math.random() * 10)
        this.health += cure
        if (this.health > this.maxHealth) {
            this.health = this.maxHealth
        }

        return `${this.name} HEAL : ${cure} points`
    }

    isDead () {
        return this.health <= 0
    }

    randomAction (otherPlayer) {
        let choice = Math.floor(Math.random() * 3)
        let message = ''
        console.log(`random action: ${choice}`)

        switch (choice) {
            case 0:
            message = this.attack(otherPlayer)
            break

            case 1:
            message = this.specialAttack(otherPlayer)
            break

            case 2:
            message = this.heal()
            break

            default:
            console.log("Something's wrong with random action")
        }

        return message
    }
}

new Vue({
    el: '#app',
    data: {
        isStarted: false,
        you: new Player('you', 100),
        monster: new Player('monster', 100),
        messages: []
    },
    computed: {
        reversedMessages() {
            return this.messages.slice().reverse()
        },
        youHealthStyle () {
            return this.healthStyle(this.you)
        },
        monsterHealthStyle () {
            return this.healthStyle(this.monster)
        }
    },
    methods: {
        healthStyle(player) {
            let health = (player.health / player.maxHealth) * 100
            let width = health + '%'

            let backgroundColor
            if (health > 70) {
                backgroundColor = 'green'
            } else if (health > 30) {
                backgroundColor = '#cccc00'
            } else {
                backgroundColor = 'red'
            }

            return {
                width: width,
                backgroundColor: backgroundColor
            }
        },
        startNewGame () {
            this.isStarted = true
            this.you.health = this.you.maxHealth
            this.monster.health = this.monster.maxHealth
            this.messages = []
        },
        attack () {
            this.messages.push({
                turn: 'player-turn',
                message: this.you.attack(this.monster)
            })
            this.executeTurn()
        },
        specialAttack () {
            this.messages.push({
                turn: 'player-turn',
                message: this.you.specialAttack(this.monster)
            })
            this.executeTurn()
        },
        heal () {
            this.messages.push({
                turn: 'player-turn',
                message: this.you.heal()
            })
            this.executeTurn()
        }, 
        giveUp () {
            this.isStarted = false
            this.messages.push({
                turn: 'monster-turn',
                message: `${this.you.name} gave up. You lose!`
            })
        },
        monsterAction () {
            this.messages.push({
                turn: 'monster-turn',
                message: this.monster.randomAction(this.you)
            })
        },
        isEnded () {
            return this.you.isDead() || this.monster.isDead()
        },
        executeTurn () {
            if (!this.isEnded()) {
                setTimeout(() => {
                    this.monsterAction()
                    if (this.isEnded()) {
                        this.endGame()
                    }
                }, 500)
            } else {
                this.endGame()
            }
        },
        endGame() {
            this.isStarted = false
            if (this.you.isDead()) {
                this.messages.push({
                    turn: 'monster-turn',
                    message: `${this.you.name} are beaten by ${this.monster.name}. You lose!`
                })
            } else {
                this.messages.push({
                    turn: 'player-turn',
                    message: `${this.you.name} beat ${this.monster.name}. You win!`
                })
            }
        }
    }
})

