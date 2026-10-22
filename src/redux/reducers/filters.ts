export interface FilterState {
  type_1: string | null;
  type_2: string | null;
  region: string | null;
  searchName: string | null;
}

type FilterAction =
  | { type: "LOAD_FILTER"; filters: FilterState }
  | { type: "SET_TYPE_1_FILTER"; type_1: string | null }
  | { type: "SET_TYPE_2_FILTER"; type_2: string | null }
  | { type: "SET_REGION_FILTER"; region: string | null }
  | { type: "SET_SEARCH_NAME"; searchName: string | null }
  | { type: "RESET_REGION_FILTER" }
  | { type: "RESET_TYPE_FILTER" }
  | { type: "RESET_SEARCH_NAME" };

const initialState: FilterState = {
  type_1: null,
  type_2: null,
  region: null,
  searchName: null,
};

export default function filters(
  state: FilterState = initialState,
  action: FilterAction,
): FilterState {
  switch (action.type) {
    case "LOAD_FILTER":
      return action.filters;
    case "SET_TYPE_1_FILTER":
      return { ...state, type_1: action.type_1 };
    case "SET_TYPE_2_FILTER":
      return { ...state, type_2: action.type_2 };
    case "SET_REGION_FILTER":
      return { ...state, region: action.region };
    case "SET_SEARCH_NAME":
      return { ...state, searchName: action.searchName };
    case "RESET_REGION_FILTER":
      return { ...state, region: null };
    case "RESET_TYPE_FILTER":
      return { ...state, type_1: null, type_2: null };
    case "RESET_SEARCH_NAME":
      return { ...state, searchName: null };
    default:
      return state;
  }
}
