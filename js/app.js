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
let dHitCount = 0
let aceCount = 0
let dAceCount
let turn

let playerIdx1, playerIdx2, dealerIdx1, dealerIdx2, gameDeck

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
stayBtn.addEventListener('click', handleStay)
doubleBtn.addEventListener('click', handleDouble)

/*-------------------------------- Functions --------------------------------*/

init()


function init() {
  gameDeck = shuffleDeck(deckCopy)
  turn = 1
  //can press deal on init with no bet
}

function handleWager(e) {
  const btnIdx = Math.floor(e.target.id.substring(3))
  wagerTotal += btnIdx
  wagerEl.textContent = `$${wagerTotal}`
  disableBtns()
}

function handleDeal() {
  totalEarnings -= wagerTotal
  earningsEl.textContent = `$${totalEarnings}`
  distributeCards()

  if (playerTotal >= 21) {
    setTimeout(handleStay, 1000)
  }
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
  
  //first dealer card calculated once it is dealers turn

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
    setTimeout(handleStay, 1000)
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
  setTimeout(handleStay, 1000)
}

function handleStay() {
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
  setTimeout(handleDealerTurn, 4000)
}

function handleDealerTurn() {
  while (dealerTotal < 17) {
    dHitCount++
    let extraCard = gameDeck.shift()
    let extraCardIdx = extraCard.substring(1)
    let extraCardEl = document.createElement('div')
    extraCardEl.className = `card large ${extraCard}`
    dealerCardEl.appendChild(extraCardEl)
    dealerTotal = addHitToTotal(extraCardIdx, dealerTotal, dAceCount)
    dealerCount.textContent = `${dealerTotal}`
  }

  calculateWinnerAndEarnings()
  turn *= -1
  setTimeout(() => {
    reset()
  }, 3000)
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
  if ((dealerTotal < playerTotal && playerTotal <= 21) || (dealerTotal > 21 && playerTotal <= 21)) {
    totalEarnings += (wagerTotal * 2)
    wagerEl.textContent = `$0`
    earningsEl.textContent = `$${totalEarnings}`
    resultEl.textContent = `Player Wins!`
  } 

  if ((dealerTotal === playerTotal) && (dealerTotal <= 21 && playerTotal <= 21)) {
    totalEarnings += wagerTotal
    wagerEl.textContent = `$0`
    earningsEl.textContent = `$${totalEarnings}`
    resultEl.textContent = `Push!`
  }

  if ((dealerTotal > playerTotal && dealerTotal <= 21) || (dealerTotal <= 21 && playerTotal > 21)) {
    wagerEl.textContent = `$0`
    earningsEl.textContent = `$${totalEarnings}`
    resultEl.textContent = `Dealer Wins!`
  }
}

function reset() {
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
    stayBtn.disabled = true
    doubleBtn.disabled = true
  } else {
    dealBtn.disabled = false
    hitBtn.disabled = false
    stayBtn.disabled = false
    doubleBtn.disabled = false
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
