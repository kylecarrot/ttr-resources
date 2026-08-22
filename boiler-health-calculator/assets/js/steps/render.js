import {
  getStep,
  getSteps,
  getStepAttackIds,
  getCurrentStep,
  getCurrentToon,
  getBoilerStar,
} from '../state.js';
import {
  getBoilerPhaseFromBoilerRoundIndex,
  getBoilerRoundIndexFromStepIndex,
} from '../boiler/rounds.js';
import { getAttackImagePath } from '../attacks/index.js';
import { getExistingStepsGroups, getExistingStepsGroup } from './steps.js';
import { isToonOrganicGag } from '../attacks/attacks.js';


let onAttackChoiceBoxClick;


function initStepsRenderer(onClick) {
  onAttackChoiceBoxClick = onClick;
}


function renderSteps() {
  const stepsPanel = document.querySelector('.steps-panel');
  const groupCount = getExistingStepsGroups().length;

  stepsPanel.replaceChildren();

  for (let groupIndex = 0; groupIndex < groupCount; groupIndex++) {
    renderStepsGroup(groupIndex);
  }
}


function renderStepsGroup(groupIndex) {
  const group = getExistingStepsGroup(groupIndex);

  if (!group) {
    return;
  }

  const newElement = document.createElement('div');

  newElement.className = 'steps-group';
  newElement.dataset.groupIndex = groupIndex;

  const endStepIndex =
    group.startStepIndex + group.existingStepCount;

  for (let stepIndex = group.startStepIndex; stepIndex < endStepIndex; stepIndex++) {
    newElement.append(createStepElement(stepIndex));
  }

  const oldElement = document.querySelector(`[data-group-index='${groupIndex}']`);

  if (oldElement) {
    oldElement.replaceWith(newElement);
    return;
  }

  document.querySelector('.steps-panel').append(newElement);
}


function renderStep(stepIndex) {
  const oldElement = document.querySelector(`[data-step-index='${stepIndex}']`);

  if (!oldElement) {
    return;
  }

  oldElement.replaceWith(createStepElement(stepIndex));
}


function renderAttackChoiceBox(stepIndex, toonIndex) {
  const oldElement = document.querySelector(
    `[data-step-index="${stepIndex}"] [data-toon-index="${toonIndex}"]`
  );

  if (!oldElement) {
    return;
  }

  oldElement.replaceWith(
    createAttackChoiceBoxElement(stepIndex, toonIndex)
  );
}


function createStepElement(stepIndex) {
  const stepType = getStep(stepIndex).type;
  const element = document.createElement('div');

  element.className = 'step';
  element.dataset.stepIndex = stepIndex;
  element.dataset.stepType = stepType;

  if (stepType === 'boiler-round') {
    const boilerRoundIndex = getBoilerRoundIndexFromStepIndex(stepIndex);

    element.dataset.boilerPhase =
      getBoilerPhaseFromBoilerRoundIndex(
        getBoilerStar(),
        boilerRoundIndex
      );
  }

  for (let toonIndex = 0; toonIndex < 4; toonIndex++) {
    element.append(createAttackChoiceBoxElement(stepIndex, toonIndex));
  }

  return element;
}


function createAttackChoiceBoxElement(stepIndex, toonIndex) {
  const stepType = getStep(stepIndex).type;
  const attackId = getStepAttackIds(stepIndex)[toonIndex];

  const isActive = stepIndex === getCurrentStep() && toonIndex === getCurrentToon();

  const box = document.createElement('div');

  box.classList.add('attack-choice-box');
  box.classList.toggle('active', isActive);
  box.dataset.toonIndex = toonIndex;

  if (attackId) {
    box.append(createAttackImageElement(attackId));

    if (stepType === 'boiler-round') {
      const isOrganic = isToonOrganicGag(attackId, toonIndex);
      box.append(createOrganicIndicatorElement(isOrganic));
    }
  }

  box.addEventListener('click', () => {
    onAttackChoiceBoxClick(stepIndex, toonIndex);
  });

  return box;
}


function createAttackImageElement(attackId) {
  const img = document.createElement('img');

  img.src = getAttackImagePath(attackId);
  img.draggable = false;

  return img;
}


function createOrganicIndicatorElement(isActive) {
  const indicator = document.createElement('div');

  indicator.className = 'organic-indicator';
  indicator.classList.toggle('active', isActive);

  return indicator;
}


function renderBoilerRoundAttackChoiceBoxesForToon(toonIndex) {
  const steps = getSteps();

  for (let stepIndex = 0; stepIndex < steps.length; stepIndex++) {
    if (getStep(stepIndex).type !== 'boiler-round') {
      continue;
    }

    renderAttackChoiceBox(stepIndex, toonIndex);
  }
}


export {
  initStepsRenderer,
  renderSteps,
  renderStepsGroup,
  renderStep,
  renderAttackChoiceBox,
  renderBoilerRoundAttackChoiceBoxesForToon,
};
