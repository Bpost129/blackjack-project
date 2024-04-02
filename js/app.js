/*-------------------------------- Constants --------------------------------*/

const fourDecks = ["dA","dQ","dK","dJ","d10","d09","d08","d07","d06","d05","d04","d03","d02","hA","hQ","hK","hJ","h10","h09","h08","h07","h06","h05","h04","h03","h02","cA","cQ","cK","cJ","c10","c09","c08","c07","c06","c05","c04","c03","c02","sA","sQ","sK","sJ","s10","s09","s08","s07","s06","s05","s04","s03","s02","dA","dQ","dK","dJ","d10","d09","d08","d07","d06","d05","d04","d03","d02","hA","hQ","hK","hJ","h10","h09","h08","h07","h06","h05","h04","h03","h02","cA","cQ","cK","cJ","c10","c09","c08","c07","c06","c05","c04","c03","c02","sA","sQ","sK","sJ","s10","s09","s08","s07","s06","s05","s04","s03","s02","dA","dQ","dK","dJ","d10","d09","d08","d07","d06","d05","d04","d03","d02","hA","hQ","hK","hJ","h10","h09","h08","h07","h06","h05","h04","h03","h02","cA","cQ","cK","cJ","c10","c09","c08","c07","c06","c05","c04","c03","c02","sA","sQ","sK","sJ","s10","s09","s08","s07","s06","s05","s04","s03","s02","dA","dQ","dK","dJ","d10","d09","d08","d07","d06","d05","d04","d03","d02","hA","hQ","hK","hJ","h10","h09","h08","h07","h06","h05","h04","h03","h02","cA","cQ","cK","cJ","c10","c09","c08","c07","c06","c05","c04","c03","c02","sA","sQ","sK","sJ","s10","s09","s08","s07","s06","s05","s04","s03","s02"]

/*---------------------------- Variables (state) ----------------------------*/
let deckCopy = [...fourDecks]

let totalEarnings = 1000
let wagerTotal = 0
let playerTotal = 0
let dealerTotal = 0
let isDealerTurn = false

let playerIdx1, playerIdx2, dealerIdx1, dealerIdx2, gameDeck

/*------------------------ Cached Element References ------------------------*/

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
  wagerEl.textContent = `$${wagerTotal}`

  //distribute 2 cards per player
  distributeCards()
}

function distributeCards() {
  playerIdx1 = gameDeck.shift()
  playerCard1.className = (`card large ${playerIdx1}`)
  // setTimeout(() => {
  //   dealerIdx1 = gameDeck.shift()
  // }, 500)

  let faces = ['J', 'Q', 'K']
  if (!faces.includes(playerIdx1.substring(1))) {
    playerTotal += parseInt(playerIdx1.substring(1))
  } else {
    playerTotal += 10
  }
  
  console.log(playerTotal)
}



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
