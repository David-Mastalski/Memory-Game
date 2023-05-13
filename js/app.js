///ELEMENTY
const body = document.querySelector('body')
const gameBoard = document.querySelector('#game-board')
const menuSection = document.querySelector('#menu-section')
const scoreSection = document.querySelector('#score-section-overlay')
const playersSection = document.querySelector('#players')
const menuForm = document.querySelector('#menu')

///BUTTONY
const startGameBtn = document.querySelector('#start-game-btn')
const newGameBtns = document.querySelectorAll('.new-game-btn')
const restartGameBtns = document.querySelectorAll('.restart-btn')

///Zmienne
const players = []
const virtualBoard = []

let numberOfPlayers = 0
let gridSize = 0

///Funkcje

const checkScreenWidth = (gridSize) => {

    if(screen.width > 445){
        gameBoard.style.gridTemplateColumns = `repeat(${gridSize}, 70px)`
        gameBoard.style.gridTemplateRows = `repeat(${gridSize}, 70px)`
        gameBoard.style.width = `${((gridSize*70) + ((gridSize-1)*5))}px`
    }else{
        let tileWidth = `${((screen.width - 20) - (gridSize-1)*5) / gridSize}`

        gameBoard.style.gridTemplateColumns = `repeat(${gridSize}, ${tileWidth}px)`
        gameBoard.style.gridTemplateRows = `repeat(${gridSize}, ${tileWidth}px)`
        gameBoard.style.width = `100vw`
    }
}

const checkState = (selectedItems, allItems) => {
    if(selectedItems === allItems){

        let winPlayer = 0
        let maxScore = 0

        players.forEach(player => {
            if(player.points > maxScore){
                maxScore = player.points
                winPlayer = player
            }
        })

        scoreSection.querySelector('#winner').innerText = winPlayer.playerNumber
        showMenuAndScore(scoreSection,true)
    }
}

const showMenuAndScore = (element,value) => {
    value? element.style.display = 'flex' : element.style.display = 'none'
}

const renderPlayers = (playersTiles,activePlayer) => {
    playersTiles.forEach((tile,index) => {
        tile.classList.remove('active-player')

        if(index === activePlayer){
            tile.querySelector('p').innerText = players[activePlayer].points
            tile.classList.add('active-player')
        }
    })
}

const renderGame = (tiles) => {
    virtualBoard.forEach((virtualTile,index) => {
        if(virtualTile.visibility){
            tiles[index].textContent = virtualTile.number
        }else{
            tiles[index].textContent = ''
        }
    })
}

const createPlayers = (numberOfPlayers) => {
    
    for(i = 0; i<numberOfPlayers; i++){
        const player = {
            playerNumber: i+1,
            points: 0
        }
        players.push(player)

        const playerTile = document.createElement('div')
        playerTile.classList.add('player-tile')
            const playerNumber = document.createElement('span')
            playerNumber.innerText = `Player ${player.playerNumber}`

            const playerPoints = document.createElement('p')
            playerPoints.innerText = `${player.points}`
        
        playerTile.append(playerNumber,playerPoints)  
        playersSection.append(playerTile)  
    }
}

const createTileNumbers = (gridSize) => {
    const array = []

    for(i = 0; i<2; i++){
        for(j = 1; j <= (Math.pow(gridSize,2)/2); j++){
            array.push(j)
        }
    }

    return array
}

const createTiles = (gridSize) => {
    checkScreenWidth(gridSize)
    const numbers = createTileNumbers(gridSize)

    for(i = 0; i < Math.pow(gridSize,2); i++){

        let randomNumber = Math.floor(Math.random()*numbers.length)

        const virtualTile = {
            index: i,
            number: numbers[randomNumber],
            visibility: false
        }

        const tile = document.createElement('span')
            tile.classList.add('tile')

        numbers.splice(randomNumber,1)
        virtualBoard.push(virtualTile)
        gameBoard.append(tile)
    }
}

const game = () => {

    const tiles = document.querySelectorAll('.tile')
    const playersTiles = document.querySelectorAll('.player-tile')
    
    let turn = 1
    let activePlayer = 0
    const selectedCouple = []

    renderPlayers(playersTiles,activePlayer)

    tiles.forEach((tile,index) => {
        tile.addEventListener('click', () => {

            if(virtualBoard[index].visibility === false){

                virtualBoard[index].visibility = true
                selectedCouple.push(virtualBoard[index])
                
                if(selectedCouple.length <= 2){

                    renderGame(tiles)

                    if(selectedCouple.length === 2){

                        if(selectedCouple[0].number === selectedCouple[1].number){

                            players[activePlayer].points = (players[activePlayer].points) + 1
                            renderPlayers(playersTiles,activePlayer)
                        }else{

                            selectedCouple.forEach(tile => tile.visibility = false)

                            setTimeout(() => {
                                renderGame(tiles)
                                renderPlayers(playersTiles,activePlayer)
                            },500)

                            activePlayer++

                            if(activePlayer === players.length){
                                activePlayer = 0
                            }
                        }
                        selectedCouple.length = 0
                    }

                }else{
                    return
                }

            }else{
                return
            }
        })
    })
}

const startGame = () => {
    gameBoard.innerHTML = null
    playersSection.innerHTML = null
    players.length = 0
    virtualBoard.length = 0

    numberOfPlayers = document.querySelector("input[name='number-of-players']:checked").value
    gridSize = document.querySelector("input[name='grid-size']:checked").value

    showMenuAndScore(menuSection,false)
    createTiles(gridSize)
    createPlayers(numberOfPlayers)
    game()
}

startGameBtn.addEventListener('click', (e) => {
    e.preventDefault()
    startGame()
})

newGameBtns.forEach(newGameBtn => {
    newGameBtn.addEventListener('click', () => {
        showMenuAndScore(menuSection,true)
    })
})

restartGameBtns.forEach(retartGameBtn => {
    retartGameBtn.addEventListener('click', () => {
        showMenuAndScore(scoreSection,false)
        startGame(numberOfPlayers,gridSize)
    })
})

window.addEventListener('resize', () => {
    if(gameBoard.innerHTML === ''){
        return
    }else{
        checkScreenWidth(gridSize)
    }
})