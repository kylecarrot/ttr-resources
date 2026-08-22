import { getBoilerStar } from '../../state.js';
import { getBoilerRoundSteps } from '../rounds.js';
import { calculateBoilerRoundsDamage } from './damage.js';
import { getHealthBarDisplayState } from './health.js';


function renderBoilerHealthBar() {
  const boilerStar = getBoilerStar();

  const boilerRoundSteps = getBoilerRoundSteps();

  const totalDamage = calculateBoilerRoundsDamage(boilerRoundSteps, boilerStar);

  const displayState = getHealthBarDisplayState(totalDamage, boilerStar);

  renderHealthBarView(displayState);
}


function renderHealthBarView({
  remainingHealth,
  activeLayerFillPercentage,
  activeLayerColor,
  backgroundLayerColor,
}) {
  const healthBarNumber = document.querySelector('.boiler-health-number');

  const activeLayer = document.querySelector('.boiler-health-layer.active');
  const backgroundLayer = document.querySelector('.boiler-health-layer.background');

  healthBarNumber.textContent = remainingHealth;

  activeLayer.dataset.color = activeLayerColor;
  backgroundLayer.dataset.color = backgroundLayerColor;

  activeLayer.style.setProperty('--fill-percentage', `${activeLayerFillPercentage}%`);
}


export { renderBoilerHealthBar };
