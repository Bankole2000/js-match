document.addEventListener('DOMContentLoaded', () => {

  M.AutoInit();
  
  let theme = 'ffvii';

  // Card Options
  let cardArray = []; 
  let game = []; 
  
  const startNewGame = () => {
    grid.innerHTML = '';
    game = [];
    cardArray = [];
    cardsWon = [];
    cardsChosen = [];
    cardsChosenId = [];
    theme = selectTheme.value;
    resultDisplay.textContent = '';
    createBoard(theme);
  }

  const grid = document.querySelector('.grid')
  const newGameBtn = document.querySelector('#newGame');
  const selectTheme = document.querySelector('#theme');
  newGameBtn.addEventListener('click', startNewGame);
  selectTheme.addEventListener('change', startNewGame);
  const resultDisplay = document.querySelector('#result')
  let cardsChosen = [];
  let cardsChosenId = [];
  let cardsWon = [];

  
  // creat the board
  async function createBoard(theme) {
    game = await getGameData(theme);
    cardArray.sort(() => 0.5 - Math.random())
    let i = 0;
    for (const card of cardArray) {
      console.log(card);
      let c = document.createElement('img');
      c.setAttribute('src', await game.default[i].img)
      c.setAttribute('data-id', i)
      c.addEventListener('click', flipcard);
      grid.appendChild(c);
      i += 1;
    }
  };

  async function getGameData(theme) {
    const response = await fetch(`cards/${theme}.json`)
    const game = await response.json();
    cardArray.push(...game.cards, ...game.cards);
    game.cards = cardArray;
    return game;
  };

  // check for Matches 
  const checkForMatch = () => {
    const cards = document.querySelectorAll('img');
    const optionOneId = cardsChosenId[0]
    const optionTwoId = cardsChosenId[1]
    if (cardsChosen[0] === cardsChosen[1]) {
      // alert('You found a match');
      cards[optionTwoId].removeEventListener("click", flipcard);
      cards[optionOneId].removeEventListener("click", flipcard);
      
      
      
      M.toast({
        html: `You Found a Match - ${cardsChosen[0]}`, 
        completeCallback: function(){
          cards[optionOneId].setAttribute('src', game.blank.img)
          cards[optionTwoId].setAttribute('src', game.blank.img)
          
          cardsWon.push(cardsChosen);
          cardsChosen = [];  
          cardsChosenId = [];
          resultDisplay.textContent = cardsWon.length;
          console.log('Success')
          if (cardsWon.length === cardArray.length/2) {
            resultDisplay.textContent = `Congratulations you've won the game`;
          }
        }, 
        displayLength: 500
      })
      
    } else {
      cardsChosen = [];
    cardsChosenId = [];
    resultDisplay.textContent = cardsWon.length;
      M.toast({
        html: 'Mismatch, Sorry! Try Again', 
        completeCallback: function(){
          cards[optionOneId].setAttribute('src', game.default[optionOneId].img)
          cards[optionTwoId].setAttribute('src', game.default[optionTwoId].img)
          resultDisplay.textContent = cardsWon.length;
          console.log('failed');
        }, 
        displayLength: 500})
    
     
      // alert('Sorry, try again');
      }
    
      
    if (cardsWon.length === cardArray.length/2) {
      resultDisplay.textContent = `Congratulations you've won the game`;
    }
  }

  // function to flipcard
  function flipcard() {
    let cardId = this.getAttribute('data-id');
    if (cardsChosenId.includes(cardId)) { return; } 
    cardsChosen.push(cardArray[cardId].name)
    console.log(cardsChosen, cardsChosenId);
    cardsChosenId.push(cardId);
    this.setAttribute('src', cardArray[cardId].img)
    if (cardsChosen.length === 2) {
      checkForMatch();
    }
  }
  createBoard(theme);
})