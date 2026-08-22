import { addStep, getSteps, getBoilerStar, setStepAttackId } from '../state.js';
import {
  getBoilerPhaseFromBoilerRoundIndex,
  getBoilerRoundIndexFromStepIndex
} from '../boiler/rounds.js';
import { disableSosToons, enableSosToons } from '../attacks/attack-grid.js';


const ORGANIC_SELECTIONS_GROUP_SIZE = 1;

const BOILER_ROUND_GROUP_SIZES = {
  neutral: 2,
  'fired-up': 6,
  meltdown: 3,
};

const INITIAL_GROUP_COUNT = 2;


function ensureInitialSteps() {
  while (!hasInitialSteps()) {
    extendStepsToGroupBoundary();
  }
}

function hasInitialSteps() {
  const groups = getExistingStepsGroups();

  if (groups.length < INITIAL_GROUP_COUNT) {
    return false;
  }

  return groups.at(-1).isComplete;
}


function extendStepsToGroupBoundary() {
  const groups = getExistingStepsGroups();
  const lastGroup = groups.at(-1);

  const affectedGroupIndex =
    lastGroup && !lastGroup.isComplete
      ? lastGroup.groupIndex
      : groups.length;

  const startStepIndex = getSteps().length;
  const count = getStepsToAddCount();
  const type = getStepTypeFromIndex(startStepIndex); // All steps in a group have the same type

  for (let i = 0; i < count; i++) {
    addStep(type);
  }

  return affectedGroupIndex;
}


function extendStepsIfNeeded(stepIndex) {
  if (stepIndex < getSteps().length) {
    return null;
  }

  return extendStepsToGroupBoundary();
}


function getExistingStepsGroups() {
  const groups = [];
  const stepCount = getSteps().length;

  let startStepIndex = 0; // Index of the group's first step

  while (startStepIndex < stepCount) {
    const groupSize = getStepsGroupSize(startStepIndex);

    // Only count steps belonging to this group; remaining steps may include later groups.
    const existingStepCount = Math.min(groupSize, stepCount - startStepIndex);

    groups.push({
      groupIndex: groups.length,
      startStepIndex,
      groupSize,
      existingStepCount,
      isComplete: existingStepCount === groupSize,
    });

    startStepIndex += groupSize;
  }

  return groups;
}


function getExistingStepsGroup(groupIndex) {
  return getExistingStepsGroups()[groupIndex] ?? null;
}


function getStepsToAddCount() {
  const groups = getExistingStepsGroups();
  const lastGroup = groups.at(-1);

  if (lastGroup && !lastGroup.isComplete) {
    return lastGroup.groupSize - lastGroup.existingStepCount;
  }

    // No groups or the last group is complete
  return getStepsGroupSize(getSteps().length);
}


function getStepsGroupSize(startStepIndex) {
  const stepType = getStepTypeFromIndex(startStepIndex);

  if (stepType === 'organic-selections') {
    return ORGANIC_SELECTIONS_GROUP_SIZE;
  }

  const boilerRoundIndex = getBoilerRoundIndexFromStepIndex(startStepIndex);
  console.log(`boiler star: ${getBoilerStar()}`);
  console.log(`boiler round index: ${boilerRoundIndex}`);
  console.log(`phase: ${getBoilerPhaseFromBoilerRoundIndex(getBoilerStar(), boilerRoundIndex)}`);

  const boilerPhase = getBoilerPhaseFromBoilerRoundIndex(getBoilerStar(), boilerRoundIndex);

  const groupSize = BOILER_ROUND_GROUP_SIZES[boilerPhase];

  return groupSize;
}


function getStepTypeFromIndex(stepIndex) {
  return stepIndex === 0 ? 'organic-selections' : 'boiler-round';
}


function isDefenseRound(stepIndex) {
  if (getStepTypeFromIndex(stepIndex) !== 'boiler-round') {
    return false;
  }

  const boilerRoundIndex = getBoilerRoundIndexFromStepIndex(stepIndex);

  return getBoilerPhaseFromBoilerRoundIndex(getBoilerStar(), boilerRoundIndex) === 'defense';
}


function updateSosToonInteraction(previousStep, currentStep) {
  if (previousStep === 0 && currentStep !== 0) {
    enableSosToons();
    return;
  }

  if (previousStep !== 0 && currentStep === 0) {
    disableSosToons();
  }
}


function getStepIndexFromBoilerRoundIndex(boilerRoundIndex) {
  return boilerRoundIndex + 1;
}


function clearStepAttack(stepIndex, toonIndex) {
  setStepAttackId(stepIndex, toonIndex, null);
}


export {
  ensureInitialSteps,
  extendStepsToGroupBoundary,
  extendStepsIfNeeded,
  getExistingStepsGroups,
  getExistingStepsGroup,
  getStepTypeFromIndex,
  isDefenseRound,
  updateSosToonInteraction,
  getStepIndexFromBoilerRoundIndex,
  clearStepAttack,
};
