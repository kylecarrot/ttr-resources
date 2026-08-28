import {
  addStep,
  removeStepsFromEnd,
  getSteps,
  getBoilerStar,
  setStepAttackId,
  getStepAttackIds,
  getMeltdownStartBoilerRoundIndex,
} from '../state.js';
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

const INITIAL_STEPS_GROUP_COUNT = 2;


function ensureInitialStepsGroups() {
  completeLastStepsGroup();

  while (getExistingStepsGroups().length < INITIAL_STEPS_GROUP_COUNT) {
    addNextStepsGroup();
  }
}


function ensureNextStepsGroupForLoadedAttacks() {
  const lastStepIndex = getSteps().length - 1;

  if (lastStepIndex < 0) {
    return;
  }

  const lastStepHasAttack = getStepAttackIds(lastStepIndex).some(attackId => attackId !== null);

  if (lastStepHasAttack) {
    addNextStepsGroup();
  }
}


function completeLastStepsGroup() {
  const groups = getExistingStepsGroups();
  const lastGroup = groups.at(-1);

  if (!lastGroup || lastGroup.isComplete) {
    return null;
  }

  const fillCount = lastGroup.groupSize - lastGroup.existingStepCount;

  addSteps(fillCount);

  return lastGroup.groupIndex;
}


function addNextStepsGroup() {
  const groups = getExistingStepsGroups();
  const lastGroup = groups.at(-1);

  if (lastGroup && !lastGroup.isComplete) {
    throw new Error(
      'Cannot add a new steps group while the last group is incomplete.'
    );
  }

  const groupIndex = groups.length;
  const groupSize = getStepsGroupSize(getSteps().length);

  addSteps(groupSize);

  return groupIndex;
}


function addSteps(count) {
  for (let i = 0; i < count; i++) {
    const stepIndex = getSteps().length;
    const stepType = getStepTypeFromIndex(stepIndex);

    addStep(stepType);
  }
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


function getStepsGroupSize(startStepIndex) {
  const stepType = getStepTypeFromIndex(startStepIndex);

  if (stepType === 'organic-selections') {
    return ORGANIC_SELECTIONS_GROUP_SIZE;
  }

  const boilerRoundIndex = getBoilerRoundIndexFromStepIndex(startStepIndex);

  return getBoilerRoundsGroupSize(boilerRoundIndex);
}


function getBoilerRoundsGroupSize(boilerRoundIndex) {
  const boilerStar = getBoilerStar();

  const boilerPhase = getBoilerPhaseFromBoilerRoundIndex(boilerStar, boilerRoundIndex);

  const groupSize = BOILER_ROUND_GROUP_SIZES[boilerPhase];

  if (boilerStar !== 4 || boilerPhase === 'meltdown') {
    return groupSize;
  }

  const meltdownStartBoilerRoundIndex = getMeltdownStartBoilerRoundIndex();

  if (meltdownStartBoilerRoundIndex === undefined) {
    throw new Error(
      'Meltdown start boiler round index has not been calculated.'
    );
  }

  if (meltdownStartBoilerRoundIndex === null) {
    return groupSize;
  }

  const roundsUntilMeltdown = meltdownStartBoilerRoundIndex - boilerRoundIndex;

  return Math.min(groupSize, roundsUntilMeltdown);
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


function clearStepAttack(stepIndex, toonIndex) {
  setStepAttackId(stepIndex, toonIndex, null);
}


function removeEmptyPartialLastStepsGroup() {
  const groups = getExistingStepsGroups();

  if (groups.length <= INITIAL_STEPS_GROUP_COUNT) {
    return;
  }

  const lastGroup = groups.at(-1);

  if (lastGroup.isComplete || !areExistingStepsInGroupEmpty(lastGroup)) {
    return;
  }

  removeStepsFromEnd(lastGroup.existingStepCount);
}


function areExistingStepsInGroupEmpty(group) {
  for (
    let stepIndex = group.startStepIndex;
    stepIndex < group.startStepIndex + group.existingStepCount;
    stepIndex++
  ) {
    if (getStepAttackIds(stepIndex).some(attackId => attackId !== null)) {
      return false;
    }
  }

  return true;
}


function prepareStepsForGroupingChange() {
  removeEmptyPartialLastStepsGroup();
  completeLastStepsGroup();
}


function getExistingStepsGroupFromStepIndex(stepIndex) {
  const groups = getExistingStepsGroups();

  return groups.find(group => {
    const endStepIndex = group.startStepIndex + group.existingStepCount;

    return stepIndex >= group.startStepIndex && stepIndex < endStepIndex;
  }) ?? null;
}


export {
  ensureInitialStepsGroups,
  ensureNextStepsGroupForLoadedAttacks,
  completeLastStepsGroup,
  addNextStepsGroup,
  getExistingStepsGroups,
  getExistingStepsGroup,
  getStepTypeFromIndex,
  isDefenseRound,
  updateSosToonInteraction,
  clearStepAttack,
  prepareStepsForGroupingChange,
  getExistingStepsGroupFromStepIndex,
};
