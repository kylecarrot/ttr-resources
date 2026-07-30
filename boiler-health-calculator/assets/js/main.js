import { initBoilerPanel } from './boiler-panel/index.js';


const state = {
  isBoilerInitialized: false,  // boiler is initialized when a star is chosen
  computedLayerHealths: [],  // based on current star, updated on star select
  boilerStar: null,

  steps: [  // Navigatable steps
    // First 2 steps:
    /* {
      type: 'organic-selection',
    },
    {
      type: 'boiler-round',
    } */
  ],
  currentToon: 0,
  currentStep: 0,
};


init(state);


function init(state) {
  initBoilerPanel();
  // populateAttackGrid();
  
  // document.addEventListener('keydown', ({ key }) => handleKeyboardInput(key));

  // const starSelector = document.querySelector('.star-select');

  // starSelector.addEventListener('change', (e) => {
    // state.boilerStar = e.target.value;

    // computeLayerHealths();
    // state.isBoilerInitialized = true;
    // renderHealthBar(state);
  // });

  // addStep(0);  // Add organic selections step
  // addStep(1);  // Add first boiler round step

  // renderSteps(state);
}
