import { attackRegistry, trackOrder } from './attacks.js';


/* 
 * 00 is reserved for no attack
*/

const attackIdToEncoding = new Map();
const encodingToAttackId = new Map();


for (const [attackId, attack] of attackRegistry) {
  let encoding;
  switch (attack.type) {
    case 'gag':
      encoding = getGagEncoding(attack);
      break;

    case 'sos-toon':
      encoding = getSosToonEncoding(attack);
      break;

    default:
      throw new Error(`Unknown attack type: ${attack.type}`);
  }

  attackIdToEncoding.set(attackId, encoding);
  encodingToAttackId.set(encoding, attackId);
}


function getGagEncoding(attack) {
  return gagCode(attack.track, attack.level);
}

function getSosToonEncoding(attack) {
  const gag = attackRegistry.get(attack.gag);
  return sosCode(attack.track, gag.level);
}

function getTrackPrefix(track, offset) {
  const trackIndex = trackOrder.indexOf(track);

  if (trackIndex === -1) {
    throw new RangeError(`Unknown gag track: "${track}"`);
  }

  return trackIndex * 2 + offset;
}

function gagCode(track, level) {
  return getTrackPrefix(track, 1) * 10 + level;
}

function sosCode(track, gagLevel) {
  return getTrackPrefix(track, 2) * 10 + gagLevel;
}


function encodeAttacks(steps) {
  let result = '';
  let pending = '';

  for (const step of steps) {
    for (const attackId of step.attackIds) {
      if (attackId === null) {
        pending += '00';
      } else {
        const encoding = attackIdToEncoding.get(attackId);

        if (encoding === undefined) {
          throw new Error(`Unknown attack ID: ${attackId}`);
        }

        result += pending + encoding;
        pending = '';
      }
    }
  }

  return result;
}


function decodeAttacks(attacksString) {
  const attackIds = [];

  for (let i = 0; i < attacksString.length; i += 2) {
    const encoding = Number(attacksString.slice(i, i + 2));

    attackIds.push(
      encodingToAttackId.get(encoding) ?? null // Invalid encodings should be null
    );
  }

  return attackIds;
}


export { encodeAttacks, decodeAttacks };