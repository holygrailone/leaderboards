type Reducer = (state: State, action: Action) => State;

type Action = { type: "UPDATE_LEGENDS_DATA"; payload: Payload };
