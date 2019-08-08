const count = document.querySelector('.counter');
const result = document.querySelector('.result');
let grille = [];
let myRow = 9;
let myColumn = 9;
let myMines = 10;
let myTable = '<tr><td class="unopened"></td><td class="unopened"></td><td class="unopened"></td><td class="unopened"></td><td class="unopened"></td><td class="unopened"></td><td class="unopened"></td><td class="unopened"></td><td class="unopened"></td></tr>';
// Creation Grille ete Table

// Attribution nombre voisin dans Grille
const numberMines = (tab, i, j) => {
  let counter = 0;
  if (i - 1 >= 0) {
    if (j - 1 >= 0 && tab[i - 1][j - 1] === 'm') {
      counter += 1;
    }
    if (j + 1 < myColumn && tab[i - 1][j + 1] === 'm') {
      counter += 1;
    }
    if (tab[i - 1][j] === 'm') {
      counter += 1;
    }
  }
  if (i + 1 < myRow) {
    if (j - 1 >= 0 && tab[i + 1][j - 1] === 'm') {
      counter += 1;
    }
    if (j + 1 < myColumn && tab[i + 1][j + 1] === 'm') {
      counter += 1;
    }
    if (tab[i + 1][j] === 'm') {
      counter += 1;
    }
  }
  if (j - 1 >= 0 && tab[i][j - 1] === 'm') {
    counter += 1;
  }
  if (j + 1 < myColumn && tab[i][j + 1] === 'm') {
    counter += 1;
  }
  return counter.toString();
};

// Creation et insertion code html de Table
const creaTable = () => {
  const myBody = document.getElementById('minesweeper');
  myBody.innerHTML = '';
  for (let i = 0; i < myRow; i += 1) {
    myBody.insertAdjacentHTML('beforeend', myTable);
  }
};

// Appel sur tout element, methode nombre de voisin
const infoGrille = (tab) => {
  for (let i = 0; i < myRow; i += 1) {
    for (let j = 0; j < myColumn; j += 1) {
      if (tab[i][j] !== 'm') {
        tab[i][j] = numberMines(tab, i, j);
      }
    }
  }
  return tab;
};

// Lancement principal création grille et table
const creaGrille = () => {
  creaTable();
  const tab = [];
  for (let a = 0; a < myRow; a += 1) {
    tab[a] = [];
    for (let b = 0; b < myColumn; b += 1) {
      tab[a][b] = 'none';
    }
  }
  let counter = 0;
  while (counter < myMines) {
    const row = Math.floor(Math.random() * (myRow - 1));
    const column = Math.floor(Math.random() * (myColumn - 1));
    if (tab[row][column] !== 'm') {
      tab[row][column] = 'm';
      counter += 1;
    }
  }
  return infoGrille(tab);
};

// Affichage grille après ouverture ou jeu

// Attribution couleur par innerText
const couleur = (carre) => {
  carre.innerText = '';
  const color = ['1E90FF', '2E8B57', 'FF0000', '191970', '8B4513', '6B8E23', '4B0082', 'FF4500'];
  const column = carre.cellIndex;
  const row = carre.parentNode.rowIndex;
  const number = Number.parseInt(grille[row][column].charAt(0), 10) - 1;
  carre.insertAdjacentHTML('beforeend', `<span style="color:#${color[number]}">${grille[row][column].charAt(0)}</span>`);
};

// Fin de jeu et affichage
const endGame = (bool) => {
  let i = 0;
  let j = 0;
  document.querySelectorAll('td').forEach((carre) => {
    carre.classList.remove('unopened');
    carre.innerText = '';
    if (grille[i][j].includes('m')) {
      carre.insertAdjacentHTML('beforeend', '<i class="fas fa-bomb"></i>');
      carre.classList.add('mine');
    } else if (grille[i][j].includes('0')) {
      carre.innerText = '';
      carre.classList.remove('unopened');
      carre.classList.add('opened');
      carre.classList.add('empty');
    } else {
      couleur(carre);
    }
    j += 1;
    if (j === myColumn) {
      j = 0;
      i += 1;
    }
  });
  if (bool) {
    result.style.backgroundColor = '#9ACD32';
    result.insertAdjacentHTML('beforeend', '<h5 class="py-2">You win, congrats!</h5>');
    result.style.display = 'block';
  } else {
    result.style.backgroundColor = '#FF0000';
    result.insertAdjacentHTML('beforeend', '<h5 class="py-2">Looooooser !</h5>');
    result.style.display = 'block';
  }
};

// Affichage d'une case
const reveal = (carre) => {
  const column = carre.cellIndex;
  const row = carre.parentNode.rowIndex;
  carre.classList.remove('unopened');
  carre.classList.add('opened');
  if (grille[row][column] !== '0') {
    couleur(carre);
  }
};

// Affichage (spread) cases selon valeur
const spreadReveal = (carre) => {
  const i = carre.cellIndex;
  const j = carre.parentNode.rowIndex;
  carre.classList.remove('unopened');
  carre.classList.add('opened');
  carre.classList.add('empty');
  carre.innerText = '';
  const combinaison = [[i - 1, j - 1], [i - 1, j], [i - 1, j + 1], [i, j - 1], [i, j + 1], [i + 1, j - 1], [i + 1, j], [i + 1, j + 1]];
  combinaison.forEach((element) => {
    if (element[0] >= 0 && element[0] < myColumn && element[1] >= 0 && element[1] < myRow) {
      let row = 0;
      let column = 0;
      document.querySelectorAll('td').forEach((thing) => {
        if (column === element[0] && row === element[1] && thing.innerText !== ('🏳️') && thing.innerText !== '?' && thing.classList.value === 'unopened') {
          if (grille[row][column] === '0') {
            spreadReveal(thing);
          } else if (thing.innerText !== ('🏳️') && thing.innerText !== '?' && thing.classList.value === 'unopened') {
            reveal(thing);
          }
        }
        column += 1;
        if (column === myColumn) {
          column = 0;
          row += 1;
        }
      });
    }
  });
  if (document.querySelectorAll('unopened').childElementCount === 10) {
    endGame(true);
  }
};

// Lancement affichage de case
const revealCarre = (carre) => {
  const column = carre.cellIndex;
  const row = carre.parentNode.rowIndex;
  if (grille[row][column] === '0') {
    spreadReveal(carre);
  } else {
    reveal(carre);
  }
};

// Action dans le jeu

// Click droit action
const rightClickAction = (carre) => {
  const column = carre.cellIndex;
  const row = carre.parentNode.rowIndex;
  if (carre.innerText.includes('🏳️')) {
    count.innerText = '';
    carre.innerText = '?';
    count.dataset.counter = (Number.parseInt(count.dataset.counter, 10) + 1).toString();
    if (Number.parseInt(count.dataset.counter, 10) < 10) {
      count.dataset.counter = '0' + count.dataset.counter;
    }
    count.insertAdjacentHTML('beforeend', `${count.dataset.counter}  <i class="fas fa-bomb"></i>`);
  } else if (carre.innerText.includes('?')) {
    carre.innerText = '';
  } else {
    count.innerText = '';
    carre.innerText = '🏳️';
    count.dataset.counter = (Number.parseInt(count.dataset.counter, 10) - 1).toString();
    if (Number.parseInt(count.dataset.counter, 10) < 10) {
      count.dataset.counter = '0' + count.dataset.counter;
    }
    count.insertAdjacentHTML('beforeend', `${count.dataset.counter}  <i class="fas fa-bomb"></i>`);
  }
  if (document.querySelectorAll('unopened').childElementCount === 10) {
    endGame(true);
  }
};

// Click gauche action
const leftClickAction = (carre) => {
  const column = carre.cellIndex;
  const row = carre.parentNode.rowIndex;
  if (grille[row][column] === 'm') {
    endGame(false);
  } else if (carre.innerText.includes('🏳️') === false && carre.innerText.includes('?') === false) {
    revealCarre(carre);
  }
  if (document.querySelectorAll('.unopened').length === 10) {
    endGame(true);
  }
};

// ============ Lancement du jeu ============ //
const letStartGame = () => {
  result.innerHTML = '';
  result.style.display = 'none';
  count.innerText = '';
  count.dataset.counter = (myMines).toString();
  count.insertAdjacentHTML('beforeend', `${count.dataset.counter}  <i class="fas fa-bomb"></i>`);
  grille = creaGrille();
  console.log(grille);
  const tab = document.querySelectorAll('td');
  tab.forEach((carre) => {
    carre.addEventListener('mouseup', (event) => {
      if (event.button === 2 && event.currentTarget.classList.value !== 'opened') {
        rightClickAction(event.currentTarget);
      } else if (event.button === 0 && event.currentTarget.classList.value !== 'opened') {
        console.log('coucou');
        leftClickAction(event.currentTarget);
      }
    });
  });
};

// Lance le jeu au load de page
letStartGame();

// ==================== Evenement click =================== //

// Changement vers grille 9x9
document.querySelector('.btn-8').addEventListener('click', (event) => {
  event.preventDefault();
  myRow = 9;
  myColumn = 9;
  myMines = 10;
  state = false;
  myTable = '<tr><td class="unopened"></td><td class="unopened"></td><td class="unopened"></td><td class="unopened"></td><td class="unopened"></td><td class="unopened"></td><td class="unopened"></td><td class="unopened"></td><td class="unopened"></td></tr>'
  letStartGame();
});

// Prevent action par defaut clique droit
document.addEventListener("contextmenu", (event) => {
  event.preventDefault();
});

// Changement vers grille 16x16
document.querySelector('.btn-16').addEventListener('click', (event) => {
  event.preventDefault();
  myRow = 16;
  myColumn = 16;
  myMines = 40;
  state = false;
  myTable = '<tr><td class="unopened"></td><td class="unopened"></td><td class="unopened"></td><td class="unopened"></td><td class="unopened"></td><td class="unopened"></td><td class="unopened"></td><td class="unopened"></td><td class="unopened"></td><td class="unopened"></td><td class="unopened"></td><td class="unopened"></td><td class="unopened"></td><td class="unopened"></td><td class="unopened"></td><td class="unopened"></td></tr>';
  letStartGame();
});

// Changement vers grille 16x30
document.querySelector('.btn-30').addEventListener('click', (event) => {
  event.preventDefault();
  myRow = 16;
  myColumn = 30;
  myMines = 99;
  state = false;
  myTable = '<tr><td class="unopened"></td><td class="unopened"></td><td class="unopened"></td><td class="unopened"></td><td class="unopened"></td><td class="unopened"></td><td class="unopened"></td><td class="unopened"></td><td class="unopened"></td><td class="unopened"></td><td class="unopened"></td><td class="unopened"></td><td class="unopened"></td><td class="unopened"></td><td class="unopened"></td><td class="unopened"></td><td class="unopened"></td><td class="unopened"></td><td class="unopened"></td><td class="unopened"></td><td class="unopened"></td><td class="unopened"></td><td class="unopened"></td><td class="unopened"></td><td class="unopened"></td><td class="unopened"></td><td class="unopened"></td><td class="unopened"></td><td class="unopened"></td><td class="unopened"></td></tr>';
  letStartGame();
});
