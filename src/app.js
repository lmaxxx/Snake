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

  update() {}

  start() {
    preparation.endPreparation()
    preparation.slideToPlayground()
    this.renderPlayground()
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
        area = document.getElementById(`${column}_${row}`)

        if(area.classList.contains("playground__snake")) {
          this.getRandomFreeArea()
        } else return area

      case "medium":
        row = this.getRandomNumber(1, 10)
        column = this.getRandomNumber(1, 10)
        area = document.getElementById(`${column}_${row}`)

        if(area.classList.contains("playground__snake")) {
          this.getRandomFreeArea()
        } else return area

      case "big":
        row = this.getRandomNumber(1, 15)
        column = this.getRandomNumber(1, 15)
        area = document.getElementById(`${column}_${row}`)

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
          if(row === 7 && i > 0) {
            column++
            row = 0
          }
          area.innerHTML = `<div id="${`${column + 1}_${row + 1}`}" class="playground__area"></div>`

          this.playgroundEl.append(area)
          row++
        }
        break

      case "medium": 
        this.playgroundEl.style.gridTemplateColumns = `repeat(${10}, 1fr)`

        for(let i = 0, row = 0, column = 0; i < 10 * 10; i++) {
          const area = document.createElement("div")
          if(row === 10 && i > 0) {
            column++
            row = 0
          }
          area.innerHTML = `<div id="${`${column + 1}_${row + 1}`}" class="playground__area"></div>`

          this.playgroundEl.append(area)
          row++
        }
        break

      case "big": 
        this.playgroundEl.style.gridTemplateColumns = `repeat(${15}, 1fr)`

        for(let i = 0, row = 0, column = 0; i < 15 * 15; i++) {
          const area = document.createElement("div")
          if(row === 15 && i > 0) {
            column++
            row = 0
          }
          area.innerHTML = `<div id="${`${column + 1}_${row + 1}`}" class="playground__area playground__area-small"></div>`

          this.playgroundEl.append(area)
          row++
        }
        break
    }
  }
}

const game = new Game()

class Snake {
  position = [[],[],[]]
}

//add click event on the option buttons

preparation.modes.forEach((mode, index) => {
  mode.addEventListener('click', () => preparation.chooseMode(index))
})

preparation.sizes.forEach((mode, index) => {
  mode.addEventListener('click', () => preparation.chooseSize(index))
})

preparation.startButtonEl.addEventListener('click', () => game.start(preparation.size, preparation.mode))
