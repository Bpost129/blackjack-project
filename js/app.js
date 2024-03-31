/*-------------------------------- Constants --------------------------------*/



/*---------------------------- Variables (state) ----------------------------*/

let totalEarnings = 100
let wagerTotal = 0

/*------------------------ Cached Element References ------------------------*/

const wagerBtns = [...document.querySelectorAll('.wager-buttons')]
const wagerEl = document.querySelector('.wager-display')
const earningsEl = document.querySelector('.total')
const dealBtn = document.querySelector('#deal')

/*----------------------------- Event Listeners -----------------------------*/

wagerBtns.forEach(wagerBtn => {
  wagerBtn.addEventListener('click', handleWager)
})
dealBtn.addEventListener('click', handleDeal)

/*-------------------------------- Functions --------------------------------*/

earningsEl.textContent = `$${totalEarnings}`

// function init() {
//   earningsEl.textContent = `$${totalEarnings}`
// }

function handleWager(e) {
  const btnIdx = Math.floor(e.target.id.substring(3))
  wagerTotal += btnIdx
  wagerEl.textContent = `$${wagerTotal}`
}

function handleDeal() {
  console.log('deal!')
  totalEarnings -= wagerTotal
}