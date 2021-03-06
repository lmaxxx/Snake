class Preparation {
  mode = 'normal'
  size = 'medium'
  wallTeleport = false
  modes = document.querySelectorAll(".preparation__mode")
  sizes = document.querySelectorAll(".preparation__size")
  recordEl = document.querySelector(".preparation__record")
  startButtonEl = document.querySelector(".preparation__button")
  wallTeleportEl = document.querySelector(".preparation__checkbox")
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
    }
  }

  slideToPlayground() {
    document.querySelector(".playground__wrapper").style.top = "0"
    document.querySelector(".preparation").style.top = "-100vh"
  }

  endPreparation() {
    game.mode = this.mode
    game.size = this.size
    game.wallTeleport = this.wallTeleport
  }
}

const preparation = new Preparation()

class Game {
  mode = null
  size = null
  wallTeleport = null
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
  touchstartX = 0;
  touchendX = 0;
  touchstartY = 0;
  touchendY = 0;

  update() {
    snake.move()
    snake.checkFood()
    snake.checkEatSelf()
  }

  start() {
    preparation.endPreparation()
    preparation.slideToPlayground()

    this.renderPlayground()
    snake.setStartPosition(this.size)
    snake.firstSnakeRender()
    this.addKeyboardEvent()
    this.addSwipeEvent()

    this.chooseSpeed()
    this.spawnFood()
  }

  end() {
    this.setRecordToLocalStorage() 
    location.reload()
  }

  setRecordToLocalStorage() {
    if(this.score > this.getRecordFromLoaclStorage()) {
      const encryptRecord = this.b64EncodeUnicode(this.score + "")
      localStorage.setItem('record', encryptRecord)
    }
  }

  getRecordFromLoaclStorage() {
    const encryptRecord = localStorage.getItem('record')
    return encryptRecord ? +this.b64DecodeUnicode(encryptRecord) : false
  }

  b64EncodeUnicode(str) {
    return btoa(encodeURIComponent(str).replace(/%([0-9A-F]{2})/g,
        function toSolidBytes(match, p1) {
            return String.fromCharCode('0x' + p1)
    }))
  }

  b64DecodeUnicode(str) {
    return decodeURIComponent(atob(str).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)
    }).join(''))
  }

  getRandomNumber(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min
  }

  getRandomFreeArea() {
    const allAreas = document.querySelectorAll(".playground__area")
    const freeAreas = []

    for(const area of allAreas) {
      if(!area.classList.contains("playground__snake")) freeAreas.push(area)
    }

    return freeAreas[this.getRandomNumber(0, freeAreas.length - 1)]
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
    }
  }

  addKeyboardEvent() {
    document.addEventListener('keydown', (e) => {
      const keyCode = e.keyCode

      if(snake.possibilityToChangeDirection) {
        if((keyCode === this.keyCodeStatuses.DOWN || 
          keyCode === this.keyCodeStatuses.S) && snake.activeDirection !== snake.directionStatuses.up) {
          snake.activeDirection = snake.directionStatuses.down

          snake.possibilityToChangeDirection = false
        }
        else if((keyCode === this.keyCodeStatuses.UP ||
          keyCode === this.keyCodeStatuses.W) && snake.activeDirection !== snake.directionStatuses.down) {
          snake.activeDirection = snake.directionStatuses.up

          snake.possibilityToChangeDirection = false
        }
        else if((keyCode === this.keyCodeStatuses.RIGHT || 
          keyCode === this.keyCodeStatuses.D) && snake.activeDirection !== snake.directionStatuses.left) {
          snake.activeDirection = snake.directionStatuses.right

          snake.possibilityToChangeDirection = false
        }
        else if((keyCode === this.keyCodeStatuses.LEFT ||
          keyCode === this.keyCodeStatuses.A) && snake.activeDirection !== snake.directionStatuses.right) {
          snake.activeDirection = snake.directionStatuses.left

          snake.possibilityToChangeDirection = false
        }
      }
    })
  }

  addSwipeEvent() {
    document.addEventListener('touchstart', e => {
      this.touchstartX = e.changedTouches[0].screenX;
      this.touchstartY = e.changedTouches[0].screenY;
    })

    document.addEventListener('touchend', e => {
      this.touchendX = e.changedTouches[0].screenX;
      this.touchendY = e.changedTouches[0].screenY;

      this.guessDirectionBySwipe()
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
    }
  }

  addScore() {
    this.score += 1

    document.querySelector(".playground__score").innerHTML = `Score: ${this.score}`
  }

  guessDirectionBySwipe() {
    
    if(Math.abs(this.touchendX - this.touchstartX) > Math.abs(this.touchendY - this.touchstartY)) {
      if (this.touchendX < this.touchstartX && snake.activeDirection !== snake.directionStatuses.right) {
        snake.activeDirection =  snake.directionStatuses.left
        snake.possibilityToChangeDirection = false
      } else if (this.touchendX > this.touchstartX && snake.activeDirection !== snake.directionStatuses.left) {
        snake.activeDirection =  snake.directionStatuses.right
        snake.possibilityToChangeDirection = false
      }
  
    } else {
      if (this.touchendY < this.touchstartY && snake.activeDirection !== snake.directionStatuses.down) {
        snake.activeDirection =  snake.directionStatuses.up
        snake.possibilityToChangeDirection = false
      } else if (this.touchendY > this.touchstartY && snake.activeDirection !== snake.directionStatuses.up) {
        snake.activeDirection =  snake.directionStatuses.down
        snake.possibilityToChangeDirection = false
      }
    }
  }
}

const game = new Game()

class Snake {
  position = []
  directionStatuses = {up: 0, right: 1, down: 2, left: 3}
  activeDirection = this.directionStatuses.down
  lastRemovedArea = []
  possibilityToChangeDirection = true

  firstSnakeRender() {
    for(const area??oordinates of this.position) {
      const [row, column] = area??oordinates
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
    }
  }

  move() {
      this.possibilityToChangeDirection = true

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
    }
  }

  goUp() {
    try {
      this.removeLastSnakeArea()

      const [firstSnakeAreaColumn, firstSnakeAreaRow] = this.position[0]
      let nextSnakeArea = document.getElementById(`${firstSnakeAreaColumn}_${firstSnakeAreaRow - 1}`)
      let playgrounColumnsAndRows 

      switch(game.size) {
        case 'small':
          playgrounColumnsAndRows = 7
          break
        case 'medium':
          playgrounColumnsAndRows = 10
          break
        case "big":
          playgrounColumnsAndRows = 15
      }

      if(game.wallTeleport && nextSnakeArea === null) {
        nextSnakeArea = document.getElementById(`${firstSnakeAreaColumn}_${playgrounColumnsAndRows}`)
        this.position.unshift([firstSnakeAreaColumn, playgrounColumnsAndRows])
      } else { 
        this.position.unshift([firstSnakeAreaColumn, firstSnakeAreaRow - 1])
      }

      nextSnakeArea.classList.add("playground__snake")
    } catch(err) {
      game.end()
    }
  }

  goRight() {
    try {
      this.removeLastSnakeArea()

      const [firstSnakeAreaColumn, firstSnakeAreaRow] = this.position[0]
      let nextSnakeArea = document.getElementById(`${firstSnakeAreaColumn + 1}_${firstSnakeAreaRow}`)

      if(game.wallTeleport && nextSnakeArea === null) {
        nextSnakeArea = document.getElementById(`${1}_${firstSnakeAreaRow}`)
        this.position.unshift([1, firstSnakeAreaRow])
      } else { 
        this.position.unshift([firstSnakeAreaColumn + 1, firstSnakeAreaRow])
      }
              
      nextSnakeArea.classList.add("playground__snake")
    } catch(err) {
      game.end()
    }
  }

  goDown() {
    try {
      this.removeLastSnakeArea()

      const [firstSnakeAreaColumn, firstSnakeAreaRow] = this.position[0]
      let nextSnakeArea = document.getElementById(`${firstSnakeAreaColumn}_${firstSnakeAreaRow + 1}`)

      if(game.wallTeleport && nextSnakeArea === null) {
        nextSnakeArea = document.getElementById(`${firstSnakeAreaColumn}_${1}`)
        this.position.unshift([firstSnakeAreaColumn, 1])
      } else { 
        this.position.unshift([firstSnakeAreaColumn, firstSnakeAreaRow + 1])
      }

      nextSnakeArea.classList.add("playground__snake")
    } catch(err) {
      game.end()
    }

  }

  goLeft() {
    try {
      this.removeLastSnakeArea()

      const [firstSnakeAreaColumn, firstSnakeAreaRow] = this.position[0]
      let nextSnakeArea = document.getElementById(`${firstSnakeAreaColumn - 1}_${firstSnakeAreaRow}`)
      let playgrounColumnsAndRows 

      switch(game.size) {
        case 'small':
          playgrounColumnsAndRows = 7
          break
        case 'medium':
          playgrounColumnsAndRows = 10
          break
        case "big":
          playgrounColumnsAndRows = 15
      }

      if(game.wallTeleport && nextSnakeArea === null) {
        nextSnakeArea = document.getElementById(`${playgrounColumnsAndRows}_${firstSnakeAreaRow}`)
        this.position.unshift([playgrounColumnsAndRows, firstSnakeAreaRow])
      } else { 
        this.position.unshift([firstSnakeAreaColumn - 1, firstSnakeAreaRow])
      }

      nextSnakeArea.classList.add("playground__snake")
    } catch(err) {
      game.end()
    } 

  }  

  removeLastSnakeArea() { 
    const [lastSnakeAreaColumn, lastSnakeAreaRow] = this.position[this.position.length - 1]
    const lastSnakeArea = document.getElementById(`${lastSnakeAreaColumn}_${lastSnakeAreaRow}`)

    lastSnakeArea.classList.remove("playground__snake")
    this.lastRemovedArea = [lastSnakeAreaColumn, lastSnakeAreaRow]
    this.position.pop()
  }

  checkFood() {
    const [firstSnakeAreaColumn, firstSnakeAreaRow] = this.position[0]
    const fisrtSnakeArea = document.getElementById(`${firstSnakeAreaColumn}_${firstSnakeAreaRow}`)

    if(fisrtSnakeArea.classList.contains("playground__food")) {
      this.eatFood()
      this.addSnakeArea()
      
      game.addScore()
      game.spawnFood()
    } 
  }

  eatFood() {
    const [firstSnakeAreaColumn, firstSnakeAreaRow] = this.position[0]
    const fisrtSnakeArea = document.getElementById(`${firstSnakeAreaColumn}_${firstSnakeAreaRow}`)
    fisrtSnakeArea.classList.remove('playground__food')
  }

  addSnakeArea() {
    const [lastRemovedAreaColumn, lastRemovedAreaRow] = this.lastRemovedArea

    document.getElementById(`${lastRemovedAreaColumn}_${lastRemovedAreaRow}`).classList.add("playground__snake")
    this.position.push([lastRemovedAreaColumn, lastRemovedAreaRow])
  }

  checkEatSelf() {
    const [headAreaColumn, headAreaRow] = this.position[0]
    const areasWithoutHead = this.position.slice(1)

    for(const [column, row] of areasWithoutHead) {
      if(column === headAreaColumn && row === headAreaRow) game.end()
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

preparation.wallTeleportEl.checked ? 
preparation.wallTeleport = true:
preparation.wallTeleport = false

preparation.wallTeleportEl.addEventListener('click', () => {
  preparation.wallTeleportEl.checked ? 
  preparation.wallTeleport = true:
  preparation.wallTeleport = false
})

preparation.startButtonEl.addEventListener('click', () => game.start(preparation.size, preparation.mode))

// render record 

if(game.getRecordFromLoaclStorage()) {
  preparation.recordEl.innerHTML = `Record: ${game.getRecordFromLoaclStorage()}`
}