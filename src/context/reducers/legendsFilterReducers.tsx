export const updateLegendFiltersReducer = (state: State, action: Action) => {
  // gen
  if (
    action.payload.uniqueLegendGenSelection &&
    action.payload.uniqueLegendGenSelection.length > 0
  ) {
    state = {
      ...state,
      uniqueLegendGenSelection: action.payload.uniqueLegendGenSelection,
    };
  }

  // title
  if (
    action.payload.uniqueLegendTitleSelection &&
    action.payload.uniqueLegendTitleSelection.length > 0
  ) {
    state = {
      ...state,
      uniqueLegendTitleSelection: action.payload.uniqueLegendTitleSelection,
    };
  }

  // class
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
