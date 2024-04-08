/*-------------------------------- Constants --------------------------------*/
// deck copied from card deck css
const fourDecks = ["dA","dQ","dK","dJ","d10","d09","d08","d07","d06","d05","d04","d03","d02","hA","hQ","hK","hJ","h10","h09","h08","h07","h06","h05","h04","h03","h02","cA","cQ","cK","cJ","c10","c09","c08","c07","c06","c05","c04","c03","c02","sA","sQ","sK","sJ","s10","s09","s08","s07","s06","s05","s04","s03","s02","dA","dQ","dK","dJ","d10","d09","d08","d07","d06","d05","d04","d03","d02","hA","hQ","hK","hJ","h10","h09","h08","h07","h06","h05","h04","h03","h02","cA","cQ","cK","cJ","c10","c09","c08","c07","c06","c05","c04","c03","c02","sA","sQ","sK","sJ","s10","s09","s08","s07","s06","s05","s04","s03","s02","dA","dQ","dK","dJ","d10","d09","d08","d07","d06","d05","d04","d03","d02","hA","hQ","hK","hJ","h10","h09","h08","h07","h06","h05","h04","h03","h02","cA","cQ","cK","cJ","c10","c09","c08","c07","c06","c05","c04","c03","c02","sA","sQ","sK","sJ","s10","s09","s08","s07","s06","s05","s04","s03","s02","dA","dQ","dK","dJ","d10","d09","d08","d07","d06","d05","d04","d03","d02","hA","hQ","hK","hJ","h10","h09","h08","h07","h06","h05","h04","h03","h02","cA","cQ","cK","cJ","c10","c09","c08","c07","c06","c05","c04","c03","c02","sA","sQ","sK","sJ","s10","s09","s08","s07","s06","s05","s04","s03","s02"]

const faces = ['J', 'Q', 'K']

/*---------------------------- Variables (state) ----------------------------*/
let deckCopy = [...fourDecks]
let playedCards = []
let hitCount = 0
let dHitCount = 0

let totalEarnings, wagerTotal, playerTotal, dealerTotal, aceCount, dAceCount
let turn, playerIdx1, playerIdx2, dealerIdx1, dealerIdx2, gameDeck

/*------------------------ Cached Element References ------------------------*/
const playerCardEl = document.querySelector('.player-cards')
const dealerCardEl = document.querySelector('.dealer-cards')
const playerCard1 = document.querySelector('#player-card-1')
const playerCard2 = document.querySelector('#player-card-2')
const dealerCard1 = document.querySelector('#dealer-card-1')
const dealerCard2 = document.querySelector('#dealer-card-2')
const dealerCount = document.querySelector('.dealer-count')
const playerCount = document.querySelector('.player-count')

const wagerBtns = [...document.querySelectorAll('.wager-buttons')]
const wagerEl = document.querySelector('.wager-display')

const earningsEl = document.querySelector('.total')
const yourChipsMsg = document.getElementById('your-chips')
const resultEl = document.querySelector('.result')
const playBtn = document.querySelector('.play-button')
const placeholderEl = document.querySelector('.placeholder')
const resetBtn = document.querySelector('.reset-button')

const dealBtn = document.querySelector('#deal')
const hitBtn = document.querySelector('#hit')
const standBtn = document.querySelector('#stand')
const doubleBtn = document.querySelector('#double')

const dealSound = new Audio('../sounds/deal.ogg')
const pokerChips = new Audio('../sounds/poker_chips.wav')
const reload = new Audio('../sounds/reload.wav')
const shot = new Audio('../sounds/shot2.wav')
const blackjack = new Audio('../sounds/blackjack.mp3')
const winner = new Audio('../sounds/winner2.mp3')
const loser = new Audio('../sounds/lose.mp3')
const click = new Audio('../sounds/click.mp3')
dealSound.volume = .6
pokerChips.volume = .6
reload.volume = .5
shot.volume = .5
blackjack.volume = .5
winner.volume = .35
loser.volume = .5
click.volume = .6

/*----------------------------- Event Listeners -----------------------------*/

wagerBtns.forEach(wagerBtn => {
  wagerBtn.addEventListener('click', handleWager)
})
dealBtn.addEventListener('click', handleDeal)
hitBtn.addEventListener('click', handleHit)
standBtn.addEventListener('click', handleStand)
doubleBtn.addEventListener('click', handleDouble)
playBtn.addEventListener('click', handlePlay)
resetBtn.addEventListener('click', reset)

/*-------------------------------- Functions --------------------------------*/

init()

function init() {
  gameDeck = shuffleDeck(deckCopy)
  turn = -1
  disableBtns()
  playBtn.style.display = ''
  resultEl.style.display = 'none'
  placeholderEl.style.display = 'none'
  resetBtn.style.display = 'none'
  totalEarnings = 1000
  playerTotal = 0
  dealerTotal = 0
  earningsEl.textContent = `$${totalEarnings}`
  render()
}

function handlePlay() {
  turn *= -1
  playBtn.style.display = 'none'
  resultEl.style.display = ''
  resetBtn.style.display = 'none'
  shot.play()
}

function handleWager(e) {
  if (turn === 1) {
    const btnIdx = Math.floor(e.target.id.substring(3))
    if (wagerTotal < totalEarnings && (wagerTotal + btnIdx) <= totalEarnings) {
      wagerTotal += btnIdx
      wagerEl.textContent = `$${wagerTotal}`
      pokerChips.play()
      placeholderEl.style.display = 'none'
      resetBtn.style.display = ''
    }
  }
  
  if (wagerTotal !== 0) {
    resultEl.style.display = 'none'
    disableBtns()
    hitBtn.disabled = true
    standBtn.disabled = true
    doubleBtn.disabled = true
  }
}

function handleDeal() {
  disableBtns()
  totalEarnings -= wagerTotal
  earningsEl.textContent = `$${totalEarnings}`
  distributeCards()
  
  if (playerTotal >= 21) {
    setTimeout(handleStand, 1000)
  }
}

function handleHit() {
  doubleBtn.disabled = true
  hitCount++
  let extraCard = gameDeck.shift()
  let extraCardIdx = extraCard.substring(1)
  let extraCardEl = document.createElement('div')
  extraCardEl.className = `card xlarge ${extraCard}`
  playerCardEl.appendChild(extraCardEl)
  dealSound.play()
  playerTotal = addHitToTotal(extraCardIdx, playerTotal, aceCount)
  playerCount.textContent = `${playerTotal}`

  if (playerTotal >= 21) {
    setTimeout(handleStand, 1000)
  } 
}

function handleDouble() {
  hitCount++
  let extraCard = gameDeck.shift()
  let extraCardIdx = extraCard.substring(1)
  let extraCardEl = document.createElement('div')

  if (wagerTotal < totalEarnings && (wagerTotal + wagerTotal) <= totalEarnings) {
    totalEarnings -= wagerTotal
    wagerTotal *= 2
    wagerEl.textContent = `$${wagerTotal}`
    earningsEl.textContent = `$${totalEarnings}`
  
    extraCardEl.className = `card xlarge ${extraCard} west`
    playerCardEl.appendChild(extraCardEl)
    dealSound.play()
    playerTotal = addHitToTotal(extraCardIdx, playerTotal, aceCount)
    playerCount.textContent = `${playerTotal}`
    setTimeout(handleStand, 1000)
  } else {
    doubleBtn.disabled = true
  }
}

function handleStand() {
  turn *= -1

  //flips & adds 1st dealer card vvv
  setTimeout(() => {
    dealerCard1.className = `card xlarge ${dealerIdx1}`
    dealSound.play()

    if (!faces.includes(dealerIdx1.substring(1)) && dealerIdx1.substring(1) !== 'A') {
      dealerTotal += parseInt(dealerIdx1.substring(1))
    } else if (!faces.includes(dealerIdx1.substring(1)) && dealerIdx1.substring(1) === 'A') {
      dAceCount++
      if ((dealerTotal + 11) > 21) {
        dealerTotal += 1
      } else {
        dealerTotal += 11
      }
    } else {
      dealerTotal += 10
    }
  
    dealerCount.textContent = dealerTotal
  }, 1000)
  //flips & adds 1st dealer card ^^^

  disableBtns()
  setTimeout(handleDealerTurn, 2000)
}

function handleDealerTurn() {
  while (dealerTotal < 17) {
    dHitCount++
    let extraCard = gameDeck.shift()
    let extraCardIdx = extraCard.substring(1)
    let extraCardEl = document.createElement('div')
    extraCardEl.className = `card xlarge ${extraCard}`
    dealerTotal = addHitToTotal(extraCardIdx, dealerTotal, dAceCount)
  
    setTimeout(() => {
      dealerCardEl.appendChild(extraCardEl)
      dealSound.play()
    }, dHitCount * 750)
  }

  setTimeout(() => {
    dealerCount.textContent = `${dealerTotal}`
  }, dHitCount * 750)
  
  setTimeout(calculateWinnerAndEarnings, (dHitCount * 750) + 1000)
  turn *= -1
  setTimeout(render, (dHitCount * 750) + 3000)

  if (totalEarnings === 0) {
    turn *= -1
    disableBtns()
    resultEl.style.display = 'none'
    resetBtn.style.display = ''
  }
}

function distributeCards() {
  // disable wager buttons once dealing
  if (gameDeck.length < 10) {
    gameDeck = [...gameDeck, ...playedCards]
    gameDeck = shuffleDeck(gameDeck)
    playedCards.length = 0
  }

  playerIdx1 = gameDeck.shift()
  dealerIdx1 = gameDeck.shift()
  playerIdx2 = gameDeck.shift()
  dealerIdx2 = gameDeck.shift()
  playedCards.push(playerIdx1, playerIdx2, dealerIdx1, dealerIdx2)
  playerCard1.className = `card xlarge ${playerIdx1}`
  dealSound.play()
  setTimeout(() => {
    dealerCard1.className = `card xlarge back`
    dealSound.play()
  }, 600)
  setTimeout(() => {
    playerCard2.className = `card xlarge ${playerIdx2}`
    dealSound.play()
    playerCount.textContent = `${playerTotal}`
  }, 1200)
  setTimeout(() => {
    dealerCard2.className = `card xlarge ${dealerIdx2}`
    dealSound.play()
    dealerCount.textContent = `${dealerTotal}`
  }, 1800)

  let totals = countTotalFlop(playerIdx1, playerIdx2, dealerIdx2)
  playerTotal = totals[0]
  dealerTotal = totals[1]
}

function countTotalFlop(p1, p2, d2) {
  let pTotal = 0
  let dTotal = 0
  
  if (!faces.includes(p1.substring(1)) && p1.substring(1) !== 'A') {
    pTotal += parseInt(p1.substring(1))
  } else if (!faces.includes(p1.substring(1)) && p1.substring(1) === 'A'){
    aceCount++
    pTotal += 11
  } else {
    pTotal += 10
  }
  
  if (!faces.includes(p2.substring(1)) && p2.substring(1) !== 'A') {
    pTotal += parseInt(p2.substring(1))
  } else if (!faces.includes(p2.substring(1)) && p2.substring(1) === 'A'){
    aceCount++
    if ((pTotal + 11) > 21) {
      pTotal += 1
    } else {
      pTotal += 11
    }
  } else {
    pTotal += 10
  }
  
  //first dealer card is calculated once it is dealer's turn

  if (!faces.includes(d2.substring(1)) && d2.substring(1) !== 'A') {
    dTotal += parseInt(d2.substring(1))
  } else if (!faces.includes(d2.substring(1)) && d2.substring(1) === 'A') {
    dAceCount++
    if ((dTotal + 11) > 21) {
      dTotal += 1
    } else {
      dTotal += 11
    }
  } else {
    dTotal += 10
  }
  
  return [pTotal, dTotal]
}

function addHitToTotal(extra, userSum, aces) {
  if (aces) {
    if (!faces.includes(extra) && extra !== 'A') {
      if (userSum + parseInt(extra) <= 21) {
        userSum += parseInt(extra)
      }  else {
        for (let i = 1; i <= aces; i++) {
          userSum -= 10
          userSum += parseInt(extra)
          if (userSum <= 21) break
        }
      }
    } else if (!faces.includes(extra) && extra === 'A') {
      aces++
      if (userSum + 11 <= 21) {
        userSum += 11
      } else {
        for (let i = 1; i <= aces; i++) {
          userSum -= 10
          if (userSum + 11 > 21) {
            userSum += 1
          } else {
            userSum += 11
            break
          }
        }
      }
    } else {
      if (userSum + 10 <= 21) {
        userSum += 10
      } else {
        for (let i = 1; i <= aces; i++) {
          userSum -= 10
          userSum += 10
        }
      }
    }
  } else {
    if (!faces.includes(extra) && extra !== 'A') {
      userSum += parseInt(extra)
    } else if (!faces.includes(extra) && extra === 'A'){
      aces++
      if ((userSum + 11) > 21) {
        userSum += 1
      } else {
        userSum += 11
      }
    } else {
      userSum += 10
    }
  }
  
  return userSum
}

function calculateWinnerAndEarnings() {
  resultEl.style.display = ''
  placeholderEl.style.display = 'none'
  resetBtn.style.display = 'none'

  if ((playerTotal === 21 && hitCount === 0) && ((dealerTotal !== 21 && dHitCount === 0) || (dealerTotal !== 21 && dHitCount))) {
    totalEarnings += (wagerTotal * 3/2)
    wagerTotal = 0
    wagerEl.textContent = `$${wagerTotal}`
    earningsEl.textContent = `$${totalEarnings}`
    resultEl.textContent = `Blackjack!`
    blackjack.play()
  } else if ((dealerTotal < playerTotal && playerTotal <= 21) || (dealerTotal > 21 && playerTotal <= 21)) {
    totalEarnings += (wagerTotal * 2)
    wagerTotal = 0
    wagerEl.textContent = `$${wagerTotal}`
    earningsEl.textContent = `$${totalEarnings}`
    resultEl.textContent === `Blackjack!` ? resultEl.textContent = `Blackjack!` : resultEl.textContent = `You Win!`
    winner.play()
  } else if ((dealerTotal === playerTotal) && (dealerTotal <= 21 && playerTotal <= 21)) {
    totalEarnings += wagerTotal
    wagerTotal = 0
    wagerEl.textContent = `$${wagerTotal}`
    earningsEl.textContent = `$${totalEarnings}`
    resultEl.textContent = `Push!`
  } else if ((dealerTotal > playerTotal && dealerTotal <= 21) || (dealerTotal <= 21 && playerTotal > 21)) {
    wagerTotal = 0
    wagerEl.textContent = `$${wagerTotal}`
    earningsEl.textContent = `$${totalEarnings}`
    resultEl.textContent = `Dealer Wins!`
    loser.play()
  } else {
    wagerTotal = 0
    wagerEl.textContent = `$${wagerTotal}`
    earningsEl.textContent = `$${totalEarnings}`
    resultEl.textContent = `Bust!`
  }
}

function render() {
  while (hitCount > 0) {
    playerCardEl.removeChild(playerCardEl.lastChild)
    hitCount--
  }

  while (dHitCount > 0) {
    dealerCardEl.removeChild(dealerCardEl.lastChild)
    dHitCount--
  }

  aceCount = 0
  dAceCount = 0
  wagerTotal = 0
  playerCount.textContent = `0`
  dealerCount.textContent = `0`

  if (totalEarnings === 0) {
    resultEl.style.display = 'none'
    resetBtn.style.display = ''
  } else {
    resultEl.textContent = `Place Your Bet`
  }
  
  wagerEl.textContent = `$${wagerTotal}`
  playerCard1.className = `card xlarge outline`
  dealerCard1.className = `card xlarge outline`
  playerCard2.className = `card xlarge outline`
  dealerCard2.className = `card xlarge outline`
}

function reset() {
  init()
  reload.play()
}

function disableBtns() {
  if (turn !== 1) {
    dealBtn.disabled = true
    hitBtn.disabled = true
    standBtn.disabled = true
    doubleBtn.disabled = true
    wagerBtns.forEach(btn => {
      btn.disabled = true
    })
  } else {
    dealBtn.disabled = false
    hitBtn.disabled = false
    standBtn.disabled = false
    doubleBtn.disabled = false
    wagerBtns.forEach(btn => {
      btn.disabled = false
    })
  }
}

function disableWagers() {
  wagerBtns.forEach(btn => {
    if (btn.disabled) {
      btn.disabled = false
    } else {
      btn.disabled = true
    }
  })
}

// copied from memory-game 
function shuffleDeck(deck) {
  let cardsToShuffle = [...deck]
  let shuffleAmount = cardsToShuffle.length
  let shuffledDeck = []
  for (let i = 0; i < shuffleAmount; i++) {
    let randomIdx = Math.floor(Math.random() * cardsToShuffle.length)
    shuffledDeck.push(cardsToShuffle.splice(randomIdx, 1)[0])
  }
  return shuffledDeck
}
