import { getAttackImagePath, attackRegistry } from './attacks.js';


const attackGridRows = [
  {
    type: 'gag',
    track: 'sound',
  },
  {
    type: 'gag',
    track: 'throw',
  },
  {
    type: 'gag',
    track: 'squirt',
  },
  {
    type: 'sos-toon',
  },
]


function renderAttackGrid(attackData, onAttackItemClick) {
  const attackGrid = document.querySelector('.attack-grid');

  attackGridRows.forEach(row => {
    let rowAttackData;

    switch (row.type) {
      case 'gag':
        rowAttackData = attackData.gags[row.track];
        break;

      case 'sos-toon':
        rowAttackData = attackData['sos-toons'];
        break;

      default:
        throw new Error(`Unknown attack row type: ${row.type}`);
    }

    const attackGridRow = createAttackGridRow(rowAttackData, onAttackItemClick);

    attackGrid.appendChild(attackGridRow);
  });
}


function createAttackGridRow(attackItems, onAttackItemClick) {
  const rowDiv = document.createElement('div');
  rowDiv.classList.add('attack-grid-row');

  attackItems.forEach(attack => {
    rowDiv.appendChild(createAttackItem(attack.id, onAttackItemClick));
  });
  
  return rowDiv;
}


function createAttackItem(attackId, onAttackItemClick) {
  const itemButton = document.createElement('button');
  itemButton.type = 'button';
  itemButton.classList.add('attack-item');

  itemButton.dataset.type = attackRegistry.get(attackId).type;

  itemButton.addEventListener('click', () => onAttackItemClick(attackId));

  const itemImg = createAttackImage(attackId);
  itemButton.appendChild(itemImg);

  const organicIndicatorDiv = createOrganicIndicator();
  itemButton.prepend(organicIndicatorDiv);

  return itemButton;
}


function createAttackImage(attackId) {
  const itemImg = document.createElement('img');

  itemImg.src = getAttackImagePath(attackId);
  itemImg.draggable = false;

  return itemImg;
}


function createOrganicIndicator() {
  const organicIndicator = document.createElement('div');
  organicIndicator.classList.add('organic-indicator');

  return organicIndicator;
}


function disableSosToons() {
  const sosToonButtons = document.querySelectorAll(
    '.attack-grid .attack-item[data-type="sos-toon"]'
  );

  sosToonButtons.forEach(button => {
    button.disabled = true;
  });
}


function enableSosToons() {
  const sosToonButtons = document.querySelectorAll(
    '.attack-grid .attack-item[data-type="sos-toon"]'
  );

  sosToonButtons.forEach(button => {
    button.disabled = false;
  });
}


export { renderAttackGrid, disableSosToons, enableSosToons };
