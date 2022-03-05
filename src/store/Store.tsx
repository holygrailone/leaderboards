import React, {
  createContext,
  Dispatch,
  PropsWithChildren,
  useContext,
  useReducer,
} from "react";
import { updateLegendsDataReducer } from "./reducers";

const initialState: State = {
  legendsData: [] as LegendData[],
};

const reducers = (state: State, action: Action) => {
  switch (action.type) {
    case "UPDATE_LEGENDS_DATA":
      return updateLegendsDataReducer(state, action);
    default:
      return state;
  }
};

interface ContextInterface {
  state: State;
  dispatch: Dispatch<Action>;
}

const Store = createContext<ContextInterface>({
  state: initialState,
  dispatch: () => null,
});

export const StoreProvider = ({ children }: PropsWithChildren<{}>) => {
  const [state, dispatch] = useReducer(reducers, initialState);

  return (
    <Store.Provider value={{ state, dispatch }}>{children}</Store.Provider>
  );
};

export const useStore = () => {
  return useContext(Store);
};
