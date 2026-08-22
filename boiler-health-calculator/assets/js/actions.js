import { getBoilerStar, setBoilerStar } from './state.js';
import { updateBoilerStarUrl } from './url.js';
import { setSelectedStar } from './boiler/star/index.js';
import { setCurrentAttack } from './steps/index.js';


function applyBoilerStar(star) {
  setBoilerStar(star);
  setSelectedStar(star);

  renderBoilerHealthBar();
}

function handleBoilerStarSelect(star) {
  if (getBoilerStar() === star) {
    return;
  }

  applyBoilerStar(star);
  updateBoilerStarUrl();
}


function handleAttackSelection(attackId) {
  setCurrentAttack(attackId);
}


export { applyBoilerStar, handleBoilerStarSelect, handleAttackSelection };
