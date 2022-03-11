import React, {
  createContext,
  Dispatch,
  PropsWithChildren,
  useContext,
  useReducer,
} from "react";
import {
  updateLegendsDataReducer,
  updateUniqueLegendClassSelectionReducer,
} from "./reducers";

const initialState: State = {
  legendsData: [] as LegendData[],
  uniqueLegendClassSelection: [] as FilterLegendClassSelection[],
};

const allReducers: Record<Action["type"], Reducer> = {
  UPDATE_LEGENDS_DATA: updateLegendsDataReducer,
  UPDATE_CLASS_FILTERS: updateUniqueLegendClassSelectionReducer,
};

const reducers: Reducer = (state: State, action: Action) => {
  const calledReducer = allReducers[action.type];
  return calledReducer(state, action);
};

interface ContextProps {
  state: State;
  dispatch: Dispatch<Action>;
}

const Store = createContext({} as ContextProps);

export const StoreProvider = ({ children }: PropsWithChildren<{}>) => {
  const [state, dispatch] = useReducer(reducers, initialState);

  const value = { state, dispatch };

  return <Store.Provider value={value}>{children}</Store.Provider>;
};

export const useStore = (): ContextProps => {
  return useContext(Store);
};
