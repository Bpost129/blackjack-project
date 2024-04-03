/*-------------------------------- Constants --------------------------------*/

const fourDecks = ["dA","dQ","dK","dJ","d10","d09","d08","d07","d06","d05","d04","d03","d02","hA","hQ","hK","hJ","h10","h09","h08","h07","h06","h05","h04","h03","h02","cA","cQ","cK","cJ","c10","c09","c08","c07","c06","c05","c04","c03","c02","sA","sQ","sK","sJ","s10","s09","s08","s07","s06","s05","s04","s03","s02","dA","dQ","dK","dJ","d10","d09","d08","d07","d06","d05","d04","d03","d02","hA","hQ","hK","hJ","h10","h09","h08","h07","h06","h05","h04","h03","h02","cA","cQ","cK","cJ","c10","c09","c08","c07","c06","c05","c04","c03","c02","sA","sQ","sK","sJ","s10","s09","s08","s07","s06","s05","s04","s03","s02","dA","dQ","dK","dJ","d10","d09","d08","d07","d06","d05","d04","d03","d02","hA","hQ","hK","hJ","h10","h09","h08","h07","h06","h05","h04","h03","h02","cA","cQ","cK","cJ","c10","c09","c08","c07","c06","c05","c04","c03","c02","sA","sQ","sK","sJ","s10","s09","s08","s07","s06","s05","s04","s03","s02","dA","dQ","dK","dJ","d10","d09","d08","d07","d06","d05","d04","d03","d02","hA","hQ","hK","hJ","h10","h09","h08","h07","h06","h05","h04","h03","h02","cA","cQ","cK","cJ","c10","c09","c08","c07","c06","c05","c04","c03","c02","sA","sQ","sK","sJ","s10","s09","s08","s07","s06","s05","s04","s03","s02"]

const faces = ['J', 'Q', 'K']

/*---------------------------- Variables (state) ----------------------------*/
let deckCopy = [...fourDecks]

let totalEarnings = 1000
let wagerTotal = 0
let playerTotal = 0
let dealerTotal = 0
let hitCount = 0
let isDealerTurn = false

let turn, playerIdx1, playerIdx2, dealerIdx1, dealerIdx2, gameDeck

/*------------------------ Cached Element References ------------------------*/
const playerCardEl = document.querySelector('.player-cards')
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

const dealBtn = document.querySelector('#deal')
const hitBtn = document.querySelector('#hit')
const stayBtn = document.querySelector('#stay')
const doubleBtn = document.querySelector('#double')

earningsEl.textContent = `$${totalEarnings}`

/*----------------------------- Event Listeners -----------------------------*/

wagerBtns.forEach(wagerBtn => {
  wagerBtn.addEventListener('click', handleWager)
})
dealBtn.addEventListener('click', handleDeal)
hitBtn.addEventListener('click', handleHit)

/*-------------------------------- Functions --------------------------------*/

init()

function init() {
  gameDeck = shuffleDeck(deckCopy)
}

function handleWager(e) {
  const btnIdx = Math.floor(e.target.id.substring(3))
  wagerTotal += btnIdx
  wagerEl.textContent = `$${wagerTotal}`
}

function handleDeal() {
  totalEarnings -= wagerTotal
  earningsEl.textContent = `$${totalEarnings}`
  wagerTotal = 0
  // wagerEl.textContent = `$${wagerTotal}`
  while (hitCount > 0) {
    playerCardEl.removeChild(playerCardEl.lastChild)
    hitCount--
  }
  playerCount.textContent = `0`
  dealerCount.textContent = `0`
  distributeCards()
}

function distributeCards() {
  playerIdx1 = gameDeck.shift()
  dealerIdx1 = gameDeck.shift()
  playerIdx2 = gameDeck.shift()
  dealerIdx2 = gameDeck.shift()
  playerCard1.className = `card large ${playerIdx1}`
  setTimeout(() => {
    dealerCard1.className = `card large back`
  }, 500)
  setTimeout(() => {
    playerCard2.className = `card large ${playerIdx2}`
    playerCount.textContent = `${playerTotal}`
  }, 1000)
  setTimeout(() => {
    dealerCard2.className = `card large ${dealerIdx2}`
    dealerCount.textContent = `${dealerTotal}`
  }, 1500)

  let totals = countTotalFlop(playerIdx1, playerIdx2, dealerIdx1, dealerIdx2)
  playerTotal = totals[0]
  dealerTotal = totals[1]
}

function countTotalFlop(p1, p2, d1, d2) {
  let pTotal = 0
  let dTotal = 0
  
  if (!faces.includes(p1.substring(1)) && p1.substring(1) !== 'A') {
    pTotal += parseInt(p1.substring(1))
  } else if (!faces.includes(p1.substring(1)) && p1.substring(1) === 'A'){
    pTotal += 11
  } else {
    pTotal += 10
  }
  
  if (!faces.includes(p2.substring(1)) && p2.substring(1) !== 'A') {
    pTotal += parseInt(p2.substring(1))
  } else if (!faces.includes(p2.substring(1)) && p2.substring(1) === 'A'){
    if ((pTotal + 11) > 21) {
      pTotal += 1
    } else {
      pTotal += 11
    }
  } else {
    pTotal += 10
  }
  
  // if (!faces.includes(d1.substring(1)) && d1.substring(1) !== 'A') {
  //   dTotal += parseInt(d1.substring(1))
  // } else if (!faces.includes(d1.substring(1)) && d1.substring(1) === 'A') {
  //   if ((dTotal + 11) > 21) {
  //     dTotal += 1
  //   } else {
  //     dTotal += 11
  //   }
  // } else {
  //   dTotal += 10
  // }

  if (!faces.includes(d2.substring(1)) && d2.substring(1) !== 'A') {
    dTotal += parseInt(d2.substring(1))
  } else if (!faces.includes(d2.substring(1)) && d2.substring(1) === 'A') {
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

function handleHit() {
  hitCount++
  let extraCard = gameDeck.shift()
  let extraCardIdx = extraCard.substring(1)
  let extraCardEl = document.createElement('div')
  extraCardEl.className = `card large ${extraCard}`
  playerCardEl.appendChild(extraCardEl)
  addHitToTotal(extraCardIdx)
  playerCount.textContent = `${playerTotal}`
}

function addHitToTotal(extra) {
  if (!faces.includes(extra) && extra !== 'A') {
    playerTotal += parseInt(extra)
  } else if (!faces.includes(extra) && extra === 'A'){
    if ((playerTotal + 11) > 21) {
      playerTotal += 1
    } else {
      playerTotal += 11
    }
  } else {
    playerTotal += 10
  }

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
