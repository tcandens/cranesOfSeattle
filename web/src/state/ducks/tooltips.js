const assign = Object.assign;

const FINISH_TOOLTIPS = 'FINISH_TOOLTIPS';

export const initialState = {
  isFinished: false,
};

export default function reducer(state = initialState, action) {
  switch (action.type) {
    case FINISH_TOOLTIPS:
      return assign({}, state, {
        isFinished: true,
      });
    default:
      return state;
  }
}

export function finishTooltips() {
  return {
    type: FINISH_TOOLTIPS,
  };
}
