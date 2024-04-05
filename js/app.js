/*-------------------------------- Constants --------------------------------*/

const fourDecks = ["dA","dQ","dK","dJ","d10","d09","d08","d07","d06","d05","d04","d03","d02","hA","hQ","hK","hJ","h10","h09","h08","h07","h06","h05","h04","h03","h02","cA","cQ","cK","cJ","c10","c09","c08","c07","c06","c05","c04","c03","c02","sA","sQ","sK","sJ","s10","s09","s08","s07","s06","s05","s04","s03","s02","dA","dQ","dK","dJ","d10","d09","d08","d07","d06","d05","d04","d03","d02","hA","hQ","hK","hJ","h10","h09","h08","h07","h06","h05","h04","h03","h02","cA","cQ","cK","cJ","c10","c09","c08","c07","c06","c05","c04","c03","c02","sA","sQ","sK","sJ","s10","s09","s08","s07","s06","s05","s04","s03","s02","dA","dQ","dK","dJ","d10","d09","d08","d07","d06","d05","d04","d03","d02","hA","hQ","hK","hJ","h10","h09","h08","h07","h06","h05","h04","h03","h02","cA","cQ","cK","cJ","c10","c09","c08","c07","c06","c05","c04","c03","c02","sA","sQ","sK","sJ","s10","s09","s08","s07","s06","s05","s04","s03","s02","dA","dQ","dK","dJ","d10","d09","d08","d07","d06","d05","d04","d03","d02","hA","hQ","hK","hJ","h10","h09","h08","h07","h06","h05","h04","h03","h02","cA","cQ","cK","cJ","c10","c09","c08","c07","c06","c05","c04","c03","c02","sA","sQ","sK","sJ","s10","s09","s08","s07","s06","s05","s04","s03","s02"]

const faces = ['J', 'Q', 'K']

/*---------------------------- Variables (state) ----------------------------*/
let deckCopy = [...fourDecks]
let playedCards = []
let totalEarnings = 1000
let wagerTotal = 0
let playerTotal = 0
let dealerTotal = 0
let hitCount = 0
let dHitCount = 0
let aceCount
let dAceCount
let turn

let playerIdx1, playerIdx2, dealerIdx1, dealerIdx2, gameDeck


//
//when total earnings reaches 0, enable reset button
//

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

earningsEl.textContent = `$${totalEarnings}`

/*----------------------------- Event Listeners -----------------------------*/

wagerBtns.forEach(wagerBtn => {
  wagerBtn.addEventListener('click', handleWager)
})
dealBtn.addEventListener('click', handleDeal)
hitBtn.addEventListener('click', handleHit)
standBtn.addEventListener('click', handleStand)
doubleBtn.addEventListener('click', handleDouble)
playBtn.addEventListener('click', handlePlay)
resetBtn.addEventListener('click', init)

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
  
  wagerTotal = 0

  playerTotal = 0
  dealerTotal = 0
}

function handlePlay() {
  turn *= -1
  playBtn.style.display = 'none'
  resultEl.style.display = ''
  resetBtn.style.display = 'none'
}

function handleWager(e) {
  if (turn === 1) {
    const btnIdx = Math.floor(e.target.id.substring(3))
    if (wagerTotal < totalEarnings && (wagerTotal + btnIdx) <= totalEarnings) {
      wagerTotal += btnIdx
      wagerEl.textContent = `$${wagerTotal}`
      placeholderEl.style.display = ''
      resetBtn.style.display = 'none'/* change back to '' */
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
  //blackjack on flop not being handled correctly
}



function handleHit() {
  doubleBtn.disabled = true
  hitCount++
  let extraCard = gameDeck.shift()
  let extraCardIdx = extraCard.substring(1)
  let extraCardEl = document.createElement('div')
  extraCardEl.className = `card large ${extraCard}`
  playerCardEl.appendChild(extraCardEl)
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

  totalEarnings -= wagerTotal
  wagerTotal *= 2
  wagerEl.textContent = `$${wagerTotal}`
  earningsEl.textContent = `$${totalEarnings}`

  extraCardEl.className = `card large ${extraCard} west`
  playerCardEl.appendChild(extraCardEl)
  playerTotal = addHitToTotal(extraCardIdx, playerTotal, aceCount)
  playerCount.textContent = `${playerTotal}`
  setTimeout(handleStand, 1000)
}

function handleStand() {
  turn *= -1

  //flips & adds 1st dealer card
  setTimeout(() => {
    dealerCard1.className = `card large ${dealerIdx1}`

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
  }, 2000)
  //flips & adds 1st dealer card

  disableBtns()
  setTimeout(handleDealerTurn, 2000)
}

function handleDealerTurn() {
  while (dealerTotal < 17) {
    dHitCount++
    let extraCard = gameDeck.shift()
    let extraCardIdx = extraCard.substring(1)
    let extraCardEl = document.createElement('div')
    extraCardEl.className = `card large ${extraCard}`
    dealerTotal = addHitToTotal(extraCardIdx, dealerTotal, dAceCount)
  
    setTimeout(() => {
      dealerCardEl.appendChild(extraCardEl)
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
    resetBtn.style.display = 'none' /* change back to '' */
  }
}

function distributeCards() {
  disableWagers()
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
  playerCard1.className = `card large ${playerIdx1} animate__animated animate__fadeInTopRight`
  setTimeout(() => {
    dealerCard1.className = `card large back animate__animated animate__fadeInTopRight`
  }, 600)
  setTimeout(() => {
    playerCard2.className = `card large ${playerIdx2} animate__animated animate__fadeInTopRight`
    playerCount.textContent = `${playerTotal}`
  }, 1200)
  setTimeout(() => {
    dealerCard2.className = `card large ${dealerIdx2} animate__animated animate__fadeInTopRight`
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

  if ((playerTotal === 21 && hitCount === 0) && (dealerTotal !== 21 && dHitCount === 0)) {
    totalEarnings += (wagerTotal * 3/2)
    wagerEl.textContent = `$0`
    earningsEl.textContent = `$${totalEarnings}`
    resultEl.textContent = `Blackjack!`
  } else if ((dealerTotal < playerTotal && playerTotal <= 21) || (dealerTotal > 21 && playerTotal <= 21)) {
    totalEarnings += (wagerTotal * 2)
    wagerEl.textContent = `$0`
    earningsEl.textContent = `$${totalEarnings}`
    resultEl.textContent === `Blackjack!` ? resultEl.textContent = `Blackjack!` : resultEl.textContent = `Player Wins!`
  } else if ((dealerTotal === playerTotal) && (dealerTotal <= 21 && playerTotal <= 21)) {
    totalEarnings += wagerTotal
    wagerEl.textContent = `$0`
    earningsEl.textContent = `$${totalEarnings}`
    resultEl.textContent = `Push!`
  } else if ((dealerTotal > playerTotal && dealerTotal <= 21) || (dealerTotal <= 21 && playerTotal > 21)) {
    wagerEl.textContent = `$0`
    earningsEl.textContent = `$${totalEarnings}`
    resultEl.textContent = `Dealer Wins!`
  } else {
    wagerEl.textContent = `$0`
    earningsEl.textContent = `${totalEarnings}`
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
  resultEl.textContent = `Place Your Bet`
  wagerEl.textContent = `$${wagerTotal}`
  playerCard1.className = `card large outline`
  dealerCard1.className = `card large outline`
  playerCard2.className = `card large outline`
  dealerCard2.className = `card large outline`
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

// basically copied from memory-game 
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
