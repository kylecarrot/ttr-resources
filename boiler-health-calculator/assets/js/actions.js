import { getBoilerStar, setBoilerStar } from './state.js';
import { updateBoilerStarUrl } from './url.js';
import { setSelectedStar } from './boiler/star/index.js';
import { renderBoilerHealthBar } from './boiler/health/render.js';
import { updateMeltdownStartBoilerRoundIndex } from './boiler/health/damage.js';
import {
  prepareStepsForGroupingChange,
  rerenderRevealedStepsGroups,
  setCurrentAttack,
} from './steps/index.js';


function applyBoilerStar(star) {
  setBoilerStar(star);
  setSelectedStar(star);

  updateMeltdownStartBoilerRoundIndex();

  renderBoilerHealthBar();
}

function handleBoilerStarSelect(star) {
  const previousBoilerStar = getBoilerStar();

  if (previousBoilerStar === star) {
    return;
  }

  applyBoilerStar(star);

  if (previousBoilerStar === 4 || star === 4) {
    prepareStepsForGroupingChange();
    rerenderRevealedStepsGroups();
  }

  updateBoilerStarUrl();
}


function handleAttackSelection(attackId) {
  setCurrentAttack(attackId);
}


export { applyBoilerStar, handleBoilerStarSelect, handleAttackSelection };
