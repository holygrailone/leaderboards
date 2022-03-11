export const updateLegendFiltersReducer = (state: State, action: Action) => {
  if (
    action.payload.uniqueGenSelection &&
    action.payload.uniqueGenSelection.length > 0
  ) {
    state = {
      ...state,
      uniqueGenSelection: action.payload.uniqueGenSelection,
    };
  }

  if (
    action.payload.uniqueLegendClassSelection &&
    action.payload.uniqueLegendClassSelection.length > 0
  ) {
    state = {
      ...state,
      uniqueLegendClassSelection: action.payload.uniqueLegendClassSelection,
    };
  }

  return state;
};
