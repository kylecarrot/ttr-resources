import { boilerStars } from '../star/star.js';
import { getPercentageOf } from '../../utils.js';


const HEALTH_BAR_LAYERS = [
  {
    color: 'green',
    percentage: 15,
  },
  {
    color: 'yellow',
    percentage: 20,
  },
  {
    color: 'orange',
    percentage: 35,
  },
  {
    color: 'red',
    percentage: 30,
  },
];


const HEALTH_BAR_LAYER_HEALTHS_BY_STAR = {};

for (const boilerStar of Object.keys(boilerStars)) {
  HEALTH_BAR_LAYER_HEALTHS_BY_STAR[boilerStar] = calculateHealthBarLayerHealths(boilerStar);
}


function getHealthBarLayerHealths(boilerStar) {
  return HEALTH_BAR_LAYER_HEALTHS_BY_STAR[boilerStar];
}


function calculateHealthBarLayerHealths(boilerStar) {
  const boilerHealth = boilerStars[boilerStar].health;

  return HEALTH_BAR_LAYERS.map(layer => {
    const layerHealth = getPercentageOf(boilerHealth, layer.percentage);

    console.assert(
      Number.isInteger(layerHealth),
      `Layer health must be an integer, got ${layerHealth}`
    );

    return layerHealth;
  });
}


function getHealthBarDisplayState(totalDamage, boilerStar) {
  const totalHealth = boilerStars[boilerStar].health;

  const remainingHealth = totalHealth - totalDamage;

  if (remainingHealth <= 0) {
    return {
      remainingHealth,
      activeLayerFillPercentage: 0,
      activeLayerColor: 'empty',
      backgroundLayerColor: 'empty',
    };
  }

  const layerHealths = getHealthBarLayerHealths(boilerStar);

  let damageBeforeActiveLayer = 0;

  for (let layerIndex = 0; layerIndex < layerHealths.length; layerIndex++) {
    const layerHealth = layerHealths[layerIndex];

    const damageAtLayerEnd = damageBeforeActiveLayer + layerHealth;

    if (totalDamage < damageAtLayerEnd) {
      const damageInActiveLayer = totalDamage - damageBeforeActiveLayer;

      const activeLayerRemainingHealth = layerHealth - damageInActiveLayer;

      return {
        remainingHealth,
        activeLayerFillPercentage: (activeLayerRemainingHealth / layerHealth) * 100,
        activeLayerColor: HEALTH_BAR_LAYERS[layerIndex].color,
        backgroundLayerColor: HEALTH_BAR_LAYERS[layerIndex + 1] ?.color ?? 'empty',
      };
    }

    damageBeforeActiveLayer += layerHealth;
  }

  throw new Error('Could not determine active health bar layer.');
}


export { getHealthBarDisplayState };
