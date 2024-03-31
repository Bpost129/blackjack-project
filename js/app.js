/*-------------------------------- Constants --------------------------------*/



/*---------------------------- Variables (state) ----------------------------*/

let wagerTotal = 0

/*------------------------ Cached Element References ------------------------*/

const wagerBtns = [...document.querySelectorAll('.wager-buttons')]
const wagerEl = document.querySelector('.wager-display')

/*----------------------------- Event Listeners -----------------------------*/

wagerBtns.forEach(wagerBtn => {
  wagerBtn.addEventListener('click', handleWager)
})

/*-------------------------------- Functions --------------------------------*/

function handleWager(e) {
  const btnIdx = Math.floor(e.target.id.substring(3))
  // Number(+btnIdx)
  console.log(btnIdx)
  wagerTotal += btnIdx
  wagerEl.textContent = `$${wagerTotal}`
}