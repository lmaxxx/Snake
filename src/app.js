class Preparation {
  mode = 'normal'
  size = 'medium'
  modes = document.querySelectorAll(".preparation__mode")
  sizes = document.querySelectorAll(".preparation__size")
  startButtonEl = document.querySelector(".preparation__button")
  modeStatuses = {easy: 0, normal: 1, hard: 2}
  sizeStatuses = {small: 0, medium: 1, big: 2}

  chooseMode(mode) {
    this.modes.forEach(mode => mode.classList.remove("preparation__mode-active"))

    switch(mode) {
      case this.modeStatuses.easy:
        this.mode = 'easy'
        this.modes[mode].classList.add("preparation__mode-active")
        break

      case this.modeStatuses.normal:
        this.mode = 'normal'
        this.modes[mode].classList.add("preparation__mode-active")
        break

      case this.modeStatuses.hard:
        this.mode = 'hard'
        this.modes[mode].classList.add("preparation__mode-active")
        break
    }
  }

  chooseSize(size) {
    this.sizes.forEach(sizeMode => sizeMode.classList.remove("preparation__size-active"))

    switch(size) {
      case this.sizeStatuses.small:
        this.size = 'small'
        this.sizes[size].classList.add("preparation__size-active")
        break
        
      case this.sizeStatuses.medium:
        this.size = 'medium'
        this.sizes[size].classList.add("preparation__size-active")
        break

      case this.sizeStatuses.big:
        this.size = 'big'
        this.sizes[size].classList.add("preparation__size-active")
        break
    }
  }

  slideToPlayground() {
    document.querySelector(".playground__wrapper").style.top = "0"
    document.querySelector(".preparation").style.top = "-100vh"
  }

  endPreparation() {
    game.mode = this.mode
    game.size = this.size
  }
}

const preparation = new Preparation()

class Game {
  mode = null
  size = null
  score = 0
  playgroundEl = document.querySelector(".playground")
  keyCodeStatuses = {
    W: 87,
    D: 68,
    S: 83,
    A: 65,
    UP: 38,
    RIGHT: 39,
    DOWN: 40,
    LEFT: 37,
  }

  update() {
    snake.move()
    snake.checkFood()
  }

  start() {
    preparation.endPreparation()
    preparation.slideToPlayground()

    this.renderPlayground()
    snake.setStartPosition(this.size)
    snake.firstSnakeRender()
    this.addKeyboardEvent()

    this.chooseSpeed()
    this.spawnFood()
  }

  getRandomNumber(min, max) {
    return Math.floor(Math.random() * max) + min;
  }

  getRandomFreeArea() {
    let row
    let column
    let area

    switch(this.size) {
      case "small":
        row = this.getRandomNumber(1, 7)
        column = this.getRandomNumber(1, 7)
        area = document.getElementById(`${row}_${column}`)

        if(area.classList.contains("playground__snake")) {
          this.getRandomFreeArea()
        } else return area

      case "medium":
        row = this.getRandomNumber(1, 10)
        column = this.getRandomNumber(1, 10)
        area = document.getElementById(`${row}_${column}`)

        if(area.classList.contains("playground__snake")) {
          this.getRandomFreeArea()
        } else return area

      case "big":
        row = this.getRandomNumber(1, 15)
        column = this.getRandomNumber(1, 15)
        area = document.getElementById(`${row}_${column}`)

        if(area.classList.contains("playground__snake")) {
          this.getRandomFreeArea()
        } else return area
    }
  }

  spawnFood() {
    const area = this.getRandomFreeArea()
    area.classList.add("playground__food")
  }

  renderPlayground() {
    switch(this.size) {
      case "small": 
        this.playgroundEl.style.gridTemplateColumns = `repeat(${7}, 1fr)`

        for(let i = 0, row = 0, column = 0; i < 7 * 7; i++) {
          const area = document.createElement("div")
          if(column === 7 && i > 0) {
            row++
            column = 0
          }
          area.innerHTML = `<div id="${`${column + 1}_${row + 1}`}" class="playground__area"></div>`

          this.playgroundEl.append(area)
          column++
        }
        break

      case "medium": 
        this.playgroundEl.style.gridTemplateColumns = `repeat(${10}, 1fr)`

        for(let i = 0, row = 0, column = 0; i < 10 * 10; i++) {
          const area = document.createElement("div")
          if(column === 10 && i > 0) {
            row++
            column = 0
          }
          area.innerHTML = `<div id="${`${column + 1}_${row + 1}`}" class="playground__area"></div>`

          this.playgroundEl.append(area)
          column++
        }
        break

      case "big": 
        this.playgroundEl.style.gridTemplateColumns = `repeat(${15}, 1fr)`

        for(let i = 0, row = 0, column = 0; i < 15 * 15; i++) {
          const area = document.createElement("div")
          if(column === 15 && i > 0) {
            row++
            column = 0
          }
          area.innerHTML = `<div id="${`${column + 1}_${row + 1}`}" class="playground__area playground__area-small"></div>`

          this.playgroundEl.append(area)
          column++
        }
        break
    }
  }

  addKeyboardEvent() {
    document.addEventListener('keydown', (e) => {
      const keyCode = e.keyCode

      if(keyCode === this.keyCodeStatuses.DOWN || 
        keyCode === this.keyCodeStatuses.S) {
        snake.activeDirection = snake.directionStatuses.down
      }
      else if(keyCode === this.keyCodeStatuses.UP ||
        keyCode === this.keyCodeStatuses.W) {
        snake.activeDirection = snake.directionStatuses.up
      }
      else if(keyCode === this.keyCodeStatuses.RIGHT || 
        keyCode === this.keyCodeStatuses.D) {
        snake.activeDirection = snake.directionStatuses.right
      }
      else if(keyCode === this.keyCodeStatuses.LEFT ||
        keyCode === this.keyCodeStatuses.A) {
        snake.activeDirection = snake.directionStatuses.left
      }
    })
  }

  chooseSpeed() {
    switch(this.mode) {
      case 'easy':
        setInterval(() => this.update(), 550)
        break

      case 'normal':
        setInterval(() => this.update(), 350)
        break

      case 'hard': 
      setInterval(() => this.update(), 150)
        break
    }
  }
}

const game = new Game()

class Snake {
  position = []
  directionStatuses = {up: 0, right: 1, down: 2, left: 3}
  activeDirection = this.directionStatuses.down

  firstSnakeRender() {
    for(const areaСoordinates of this.position) {
      const [row, column] = areaСoordinates
      const futureSnakeArea = document.getElementById(`${row}_${column}`)

      futureSnakeArea.classList.add('playground__snake')
    }
  }

  setStartPosition(size) {
    switch(size) {
      case "small":
        this.position = [[4, 3], [4, 2], [4, 1]]
        break

      case "medium":
        this.position = [[5, 3], [5, 2], [5, 1]]
        break

      case "big":
        this.position = [[8, 3], [8, 2], [8, 1]]
        break
    }
  }

  move() {
    switch(this.activeDirection) {
      case this.directionStatuses.up:
        this.goUp()
        break

      case this.directionStatuses.right:
        this.goRight()
        break

      case this.directionStatuses.down:
        this.goDown()
        break

      case this.directionStatuses.left:
        this.goLeft()
        break
    }
  }

  goUp() {
    const [firstSnakeAreaColumn, firstSnakeAreaRow] = this.position[0]
    const nextSnakeArea = document.getElementById(`${firstSnakeAreaColumn}_${firstSnakeAreaRow - 1}`)
    this.position.unshift([firstSnakeAreaColumn, firstSnakeAreaRow - 1])
    nextSnakeArea.classList.add("playground__snake")

    this.removeLastSnakeArea()
  }

  goRight() {
    const [firstSnakeAreaColumn, firstSnakeAreaRow] = this.position[0]
    const nextSnakeArea = document.getElementById(`${firstSnakeAreaColumn + 1}_${firstSnakeAreaRow}`)
    this.position.unshift([firstSnakeAreaColumn + 1, firstSnakeAreaRow])
    nextSnakeArea.classList.add("playground__snake")

    this.removeLastSnakeArea()
  }

  goDown() {
    const [firstSnakeAreaColumn, firstSnakeAreaRow] = this.position[0]
    const nextSnakeArea = document.getElementById(`${firstSnakeAreaColumn}_${firstSnakeAreaRow + 1}`)
    this.position.unshift([firstSnakeAreaColumn, firstSnakeAreaRow + 1])
    nextSnakeArea.classList.add("playground__snake")

    this.removeLastSnakeArea()
  }

  goLeft() {
    const [firstSnakeAreaColumn, firstSnakeAreaRow] = this.position[0]
    const nextSnakeArea = document.getElementById(`${firstSnakeAreaColumn - 1}_${firstSnakeAreaRow}`)
    this.position.unshift([firstSnakeAreaColumn - 1, firstSnakeAreaRow])
    nextSnakeArea.classList.add("playground__snake")

    this.removeLastSnakeArea()
  }  

  removeLastSnakeArea() {
    const [lastSnakeAreaColumn, lastSnakeAreaRow] = this.position[this.position.length - 1]
    const lastSnakeArea = document.getElementById(`${lastSnakeAreaColumn}_${lastSnakeAreaRow}`)

    lastSnakeArea.classList.remove("playground__snake")
    this.position.pop()
  }

  checkFood() {
    const [firstSnakeAreaColumn, firstSnakeAreaRow] = this.position[0]
    const fisrtSnakeArea = document.getElementById(`${firstSnakeAreaColumn}_${firstSnakeAreaRow}`)

    if(fisrtSnakeArea.classList.contains("playground__food")) {
      
      this.eatFood()
      this.addSnakeArea()
      
      game.spawnFood()
    } 
  }

  eatFood() {
    const [firstSnakeAreaColumn, firstSnakeAreaRow] = this.position[0]
    const fisrtSnakeArea = document.getElementById(`${firstSnakeAreaColumn}_${firstSnakeAreaRow}`)
    fisrtSnakeArea.classList.remove('playground__food')
  }

  addSnakeArea() {
    const [lastSnakeAreaColumn, lastSnakeAreaRow] = this.position[this.position.length - 1]
    const [penultimateColumn, penultimateRow] = this.position[this.position.length - 2]

    if(lastSnakeAreaColumn > penultimateColumn) {
      document.getElementById(`${lastSnakeAreaColumn + 1}_${lastSnakeAreaRow}`).classList.add("playground__snake")
      this.position.push([lastSnakeAreaColumn + 1 , lastSnakeAreaRow])
    }
    else if(lastSnakeAreaColumn < penultimateColumn) {
      document.getElementById(`${lastSnakeAreaColumn - 1}_${lastSnakeAreaRow}`).classList.add("playground__snake")
      this.position.push([lastSnakeAreaColumn - 1, lastSnakeAreaRow])
    }
    else if(lastSnakeAreaRow > penultimateRow) {
      document.getElementById(`${lastSnakeAreaColumn}_${lastSnakeAreaRow + 1}`).classList.add("playground__snake")
      this.position.push([lastSnakeAreaColumn, lastSnakeAreaRow + 1])
    }
    else if(lastSnakeAreaRow < penultimateRow) {
      document.getElementById(`${lastSnakeAreaColumn}_${lastSnakeAreaRow - 1}`).classList.add("playground__snake")
      this.position.push([lastSnakeAreaColumn, lastSnakeAreaRow - 1])
    }
  }
}

const snake = new Snake()

//add click event on the option buttons

preparation.modes.forEach((mode, index) => {
  mode.addEventListener('click', () => preparation.chooseMode(index))
})

preparation.sizes.forEach((mode, index) => {
  mode.addEventListener('click', () => preparation.chooseSize(index))
})

preparation.startButtonEl.addEventListener('click', () => game.start(preparation.size, preparation.mode))



// const [lastSnakeAreaColumn, lastSnakeAreaRow] = this.position[this.position.length - 1]

// switch(this.activeDirection) {
//   case this.directionStatuses.up:
//     document.getElementById(`${lastSnakeAreaColumn}_${lastSnakeAreaRow - 1}`).classList.add("playground__snake")
//     this.position.push([lastSnakeAreaColumn , lastSnakeAreaRow - 1])

//     break

//   case this.directionStatuses.right:
//     document.getElementById(`${lastSnakeAreaColumn - 1}_${lastSnakeAreaRow}`).classList.add("playground__snake")
//     this.position.push([lastSnakeAreaColumn  - 1, lastSnakeAreaRow])

//     break

//   case this.directionStatuses.down:
//     document.getElementById(`${lastSnakeAreaColumn}_${lastSnakeAreaRow + 1}`).classList.add("playground__snake")
//     this.position.push([lastSnakeAreaColumn , lastSnakeAreaRow + 1])

//     break

//   case this.directionStatuses.right:
//     document.getElementById(`${lastSnakeAreaColumn + 1}_${lastSnakeAreaRow}`).classList.add("playground__snake")
//     this.position.push([lastSnakeAreaColumn  + 1, lastSnakeAreaRow])

//     break
// }
