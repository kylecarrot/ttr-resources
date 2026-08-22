
import { getAttackTrack, getOrganicAdjustedAttackDamage } from '../../attacks/attacks.js';
import {
  getBoilerPhaseFromBoilerRoundIndex,
  getBoilerRoundPhaseDamagePercentBonus,
} from '../rounds.js';
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
  const adjustedAttacks = getOrganicAdjustedAttacks(attackIds);

  const trackDamageGroups = groupAttackDamagesByTrack(adjustedAttacks);

  const boilerRoundPhase = getBoilerPhaseFromBoilerRoundIndex(boilerStar, boilerRoundIndex);

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


export { calculateBoilerRoundsDamage };
