import { getStep } from '../state.js';
import { increaseByPercentCeil } from '../utils.js';


const attackData = {
  'gags': {
    'sound': [
      { id: 'bike-horn', damage: 4 },
      { id: 'whistle', damage: 7 },
      { id: 'bugle', damage: 11 },
      { id: 'aoogah', damage: 16 },
      { id: 'elephant-trunk', damage: 21 },
      { id: 'foghorn', damage: 50 },
      { id: 'opera-singer', damage: 90 },
    ],
    'throw': [
      { id: 'cupcake', damage: 6 },
      { id: 'fruit-pie-slice', damage: 10 },
      { id: 'cream-pie-slice', damage: 17 },
      { id: 'whole-fruit-pie', damage: 27 },
      { id: 'whole-cream-pie', damage: 40 },
      { id: 'birthday-cake', damage: 100 },
      { id: 'wedding-cake', damage: 120 },
    ],
    'squirt': [
      { id: 'squirting-flower', damage: 4 },
      { id: 'glass-of-water', damage: 8 },
      { id: 'squirt-gun', damage: 12 },
      { id: 'seltzer-bottle', damage: 21 },
      { id: 'fire-hose', damage: 30 },
      { id: 'storm-cloud', damage: 80 },
      { id: 'geyser', damage: 105 },
    ],
  },
  'sos-toons': [
    { id: 'barbara-seville', damage: 35, track: 'sound', tier: 3, gag: 'aoogah' },
    { id: 'sid-sonata', damage: 55, track: 'sound', tier: 4, gag: 'elephant-trunk' },
    { id: 'moe-zart', damage: 75, track: 'sound', tier: 5, gag: 'foghorn' },
    { id: 'rocky', damage: 132, track: 'throw', tier: 5, gag: 'wedding-cake' },
    { id: 'loopy-loopenloop', damage: 115, track: 'squirt', tier: 5, gag: 'geyser' },
  ],
};


const trackOrder = ['sound', 'throw', 'squirt'];


const attackRegistry = new Map();

for (const [type, entries] of Object.entries(attackData)) {
  switch (type) {
    case 'gags':
      for (const [track, gagList] of Object.entries(entries)) {
        for (const [index, attackDefinition] of gagList.entries()) {
          attackRegistry.set(attackDefinition.id, {
            ...attackDefinition,
            type: 'gag',
            track,
            level: index + 1,
          });
        }
      }
      break;

    case 'sos-toons':
      for (const attackDefinition of entries) {
        attackRegistry.set(attackDefinition.id, {
          ...attackDefinition,
          type: 'sos-toon',
        });
      }
      break;

    default:
      throw new Error(`Unknown attack type: ${type}`);
  }
}


const organicGagPercentBonus = {
  sound: 10,
  throw: 10,
  squirt: 15,
};


function getAttackImagePath(attackId) {
  const attack = attackRegistry.get(attackId);

  if (!attack) {
    throw new Error(`Unknown attack: ${attackId}`);
  }

  const imgFolder = 'assets/images';

  switch (attack.type) {
    case 'gag':
      return `${imgFolder}/gags/${attack.track}/${attackId}.png`;

    case 'sos-toon':
      return `${imgFolder}/sos-toons/${attackId}.png`;

    default:
      throw new Error(`No image path rule for type: ${attack.type}`);
  }
}


function getAttack(attackId) {
  return attackRegistry.get(attackId);
}


function getAttackTrack(attackId) {
  return getAttack(attackId).track;
}


function isOrganicGag(attackId, organicGagId) {
  if (!attackId || !organicGagId) {
    return false;
  }

  const attack = attackRegistry.get(attackId);
  const organicGag = attackRegistry.get(organicGagId);

  if (attack.type !== 'gag' || organicGag.type !== 'gag') {
    return false;
  }

  if (attack.track !== organicGag.track) {
    return false;
  }

  return attack.level <= organicGag.level;
}


function getOrganicGagId(toonIndex) {
  return getStep(0).attackIds[toonIndex];
}


function isToonOrganicGag(attackId, toonIndex) {
  const organicGagId = getOrganicGagId(toonIndex);

  return isOrganicGag(attackId, organicGagId);
}


function getOrganicAdjustedAttackDamage(attackId, toonIndex) {
  const attack = getAttack(attackId);

  if (!isToonOrganicGag(attackId, toonIndex)) {
    return attack.damage;
  }

  return applyOrganicGagBonus(attack.damage, attack.track);
}


function applyOrganicGagBonus(damage, track) {
  const percentBonus = organicGagPercentBonus[track];

  return increaseByPercentCeil(damage, percentBonus);
}


export {
  attackData,
  trackOrder,
  attackRegistry,
  getAttackTrack,
  getAttackImagePath,
  isToonOrganicGag,
  getOrganicAdjustedAttackDamage,
};
