const controls = {
  toonLeft: 'ArrowLeft',
  toonRight: 'ArrowRight',
  stepUp: 'ArrowUp',
  stepDown: 'ArrowDown',
  clearAttack: 'Backspace',
};

const modifierKeys = {
  skipDefenseRounds: 'Shift',
}


function isModifierPressed(event, modifier) {
  const modifiers = {
    Shift: event.shiftKey,
    Control: event.ctrlKey,
    Alt: event.altKey,
    Meta: event.metaKey,
  };

  return modifiers[modifier] ?? false;
}


function initKeyboardControls({
  toonLeft,
  toonRight,
  stepUp,
  stepDown,
  clearAttack,
}) {
  const navigationActions = {
    [controls.toonLeft]: toonLeft,
    [controls.toonRight]: toonRight,
    [controls.stepUp]: stepUp,
    [controls.stepDown]: stepDown,
  };

  const actions = {
    [controls.clearAttack]: clearAttack,
  };


  document.addEventListener('keydown', event => {
    const navigationAction = navigationActions[event.key];

    if (navigationAction) {
      event.preventDefault();

      navigationAction({
        skipDefenseRounds: isModifierPressed(event, modifierKeys.skipDefenseRounds),
      });

      return;
    }


    const action = actions[event.key];

    if (action) {
      event.preventDefault();
      action();
    }
  });
}


export { initKeyboardControls };