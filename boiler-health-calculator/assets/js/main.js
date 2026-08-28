import { getBoilerStar } from './state.js';
import { loadStateFromUrl, updateBoilerStarUrl } from './url.js';
import { attackData } from './attacks/index.js';
import { applyBoilerStar, handleBoilerStarSelect, handleAttackSelection } from './actions.js';
import { initBoilerStarSelector } from './boiler/star/index.js';
import { renderAttackGrid } from './attacks/index.js';
import {
  initSteps,
  goToPreviousAttackChoiceBox,
  goToNextAttackChoiceBox,
  goToPreviousStep,
  goToNextStep,
  clearAttack,
} from './steps/index.js';
import { initKeyboardControls } from './keyboard-controls.js';


init();


function init() {
  const { boilerStar: starFromUrl } = loadStateFromUrl();

  initBoilerStarSelector(handleBoilerStarSelect);

  applyBoilerStar(getBoilerStar());
  
  renderAttackGrid(attackData, handleAttackSelection);

  initSteps();

  initKeyboardControls({
    toonLeft: goToPreviousAttackChoiceBox,
    toonRight: goToNextAttackChoiceBox,
    stepUp: goToPreviousStep,
    stepDown: goToNextStep,
    clearAttack,
  });

  if (starFromUrl === null) {
    updateBoilerStarUrl();
  }

}

