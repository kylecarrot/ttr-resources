
import { getAttackTrack, getOrganicAdjustedAttackDamage } from '../../attacks/attacks.js';
import {
  getBoilerStar,
  getMeltdownStartBoilerRoundIndex,
  setMeltdownStartBoilerRoundIndex,
} from '../../state.js';
import {
  getBoilerRoundSteps,
  getBoilerPhaseFromBoilerRoundIndex,
  getBoilerPhaseIgnoringMeltdownFromBoilerRoundIndex,
  getBoilerRoundIndexFromStepIndex,
  getBoilerRoundPhaseDamagePercentBonus,
} from '../rounds.js';
import { getRedLayerStartDamage } from './health.js';
import { getPercentCeil } from '../../utils.js';


const GROUP_DAMAGE_PERCENT_BONUS = 20;


function calculateBoilerRoundsDamage(boilerRoundSteps, boilerStar) {
  let totalDamage = 0;

  for (const [boilerRoundIndex, boilerRoundStep] of boilerRoundSteps.entries()) {
    totalDamage += calculateBoilerRoundDamage(
      boilerRoundStep.attackIds,
      boilerRoundIndex,
      boilerStar,
    );
  }

  return totalDamage;
}


function calculateBoilerRoundDamage(attackIds, boilerRoundIndex, boilerStar) {
  const boilerRoundPhase = getBoilerPhaseFromBoilerRoundIndex(boilerStar, boilerRoundIndex);

  return calculateBoilerRoundDamageForPhase(attackIds, boilerRoundPhase);
}


function calculateBoilerRoundDamageForPhase(attackIds, boilerRoundPhase) {
  const adjustedAttacks = getOrganicAdjustedAttacks(attackIds);

  const trackDamageGroups = groupAttackDamagesByTrack(adjustedAttacks);

  const phasePercentBonus = getBoilerRoundPhaseDamagePercentBonus(boilerRoundPhase);

  const trackDamageBreakdown = getTrackDamageBreakdown(trackDamageGroups, phasePercentBonus);

  return getTotalDamage(trackDamageBreakdown);
}


function getOrganicAdjustedAttacks(attackIds) {
  const adjustedAttacks = [];

  for (let toonIndex = 0; toonIndex < attackIds.length; toonIndex++) {
    const attackId = attackIds[toonIndex];

    if (!attackId) {
      continue;
    }

    adjustedAttacks.push({
      track: getAttackTrack(attackId),
      damage: getOrganicAdjustedAttackDamage(attackId, toonIndex),
    });
  }

  return adjustedAttacks;
}


function groupAttackDamagesByTrack(attacks) {
  const trackDamageGroups = {};

  for (const attack of attacks) {
    trackDamageGroups[attack.track] ??= [];
    trackDamageGroups[attack.track].push(attack.damage);
  }

  return trackDamageGroups;
}


function getTrackDamageBreakdown(trackDamageGroups, phasePercentBonus) {
  const breakdown = {};

  for (const [track, damages] of Object.entries(trackDamageGroups)) {
    const baseDamage = calculateBaseDamage(damages);

    const groupBonus = calculateGroupDamageBonus(baseDamage, damages.length);

    const phaseBonus = calculatePhaseDamageBonus(baseDamage, phasePercentBonus);

    breakdown[track] = {
      damages,
      baseDamage,
      groupBonus,
      phaseBonus,
      totalDamage: baseDamage + groupBonus + phaseBonus,
    };
  }

  return breakdown;
}


function calculateBaseDamage(damages) {
  let totalDamage = 0;

  for (const damage of damages) {
    totalDamage += damage;
  }

  return totalDamage;
}


function calculateGroupDamageBonus(baseDamage, attackCount) {
  if (attackCount < 2) {
    return 0;
  }

  return getPercentCeil(baseDamage, GROUP_DAMAGE_PERCENT_BONUS);
}


function calculatePhaseDamageBonus(baseDamage, phasePercentBonus) {
  return getPercentCeil(baseDamage, phasePercentBonus);
}


function getTotalDamage(trackDamageBreakdown) {
  let totalDamage = 0;

  for (const trackDamage of Object.values(trackDamageBreakdown)) {
    totalDamage += trackDamage.totalDamage;
  }

  return totalDamage;
}


function getBoilerRoundIndexAtDamageThreshold(boilerStar, damageThreshold) {
  const boilerRoundSteps = getBoilerRoundSteps();

  let totalDamage = 0;

  for (let boilerRoundIndex = 0; boilerRoundIndex < boilerRoundSteps.length; boilerRoundIndex++) {
    const step = boilerRoundSteps[boilerRoundIndex];

    const phase = getBoilerPhaseIgnoringMeltdownFromBoilerRoundIndex(boilerStar, boilerRoundIndex);

    totalDamage += calculateBoilerRoundDamageForPhase(step.attackIds, phase);

    if (totalDamage >= damageThreshold) {
      return boilerRoundIndex;
    }
  }

  return null;
}


function calculateMeltdownStartBoilerRoundIndex() {
  const boilerStar = getBoilerStar();

  if (boilerStar !== 4) {
    return null;
  }

  const redLayerStartDamage = getRedLayerStartDamage(boilerStar);

  const thresholdBoilerRoundIndex =
    getBoilerRoundIndexAtDamageThreshold(boilerStar, redLayerStartDamage);

  if (thresholdBoilerRoundIndex === null) {
    return null;
  }

  return thresholdBoilerRoundIndex + 1;
}


function updateMeltdownStartBoilerRoundIndex() {
  const meltdownStartBoilerRoundIndex = calculateMeltdownStartBoilerRoundIndex();

  setMeltdownStartBoilerRoundIndex(meltdownStartBoilerRoundIndex);

  return meltdownStartBoilerRoundIndex;
}


function canAttackChangeAlterMeltdownStart(stepIndex) {
  if (getBoilerStar() !== 4) {
    return false;
  }

  // Organic selection changes can change the damage of attacks in all boiler rounds.
  if (stepIndex === 0) {
    return true;
  }

  const meltdownStartBoilerRoundIndex = getMeltdownStartBoilerRoundIndex();

  if (meltdownStartBoilerRoundIndex === undefined) {
    throw new Error('Meltdown start boiler round index has not been calculated.');
  }

  if (meltdownStartBoilerRoundIndex === null) {
    return true;
  }

  const boilerRoundIndex = getBoilerRoundIndexFromStepIndex(stepIndex);

  return boilerRoundIndex < meltdownStartBoilerRoundIndex;
}


function updateMeltdownStartAfterAttackChange(stepIndex) {
  if (!canAttackChangeAlterMeltdownStart(stepIndex)) {
    return false;
  }

  const previousMeltdownStartBoilerRoundIndex = getMeltdownStartBoilerRoundIndex();

  const meltdownStartBoilerRoundIndex = updateMeltdownStartBoilerRoundIndex();

  return previousMeltdownStartBoilerRoundIndex !== meltdownStartBoilerRoundIndex;
}


export {
  calculateBoilerRoundsDamage,
  updateMeltdownStartBoilerRoundIndex,
  updateMeltdownStartAfterAttackChange,
};
