import { getBoilerStarCount, isValidBoilerStar } from './star.js';
import { initStarSelector, setSelectedStar } from './selector.js';


function initBoilerStarSelector(onSelect) {
  initStarSelector(getBoilerStarCount(), onSelect);
}


export { initBoilerStarSelector, setSelectedStar, isValidBoilerStar };
