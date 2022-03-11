export const updateLegendsDataReducer = (state: State, action: Action) => {
  if (action.payload.legendsData && action.payload.legendsData.length > 0) {
    state = { ...state, legendsData: action.payload.legendsData };
  }
  return state;
};
