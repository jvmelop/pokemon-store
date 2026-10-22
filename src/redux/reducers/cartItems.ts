export interface CartItem {
  code: number;
  name: string;
  quantity: number;
  shiny: boolean;
  priceNum: number;
  priceStr: string;
  types: string[];
}

export type NewCartItem = Omit<CartItem, "code">;

type CartAction =
  | { type: "ADD_ITEM"; newItem: NewCartItem }
  | { type: "DELETE_ITEM"; code: number }
  | { type: "CLEAR_LIST" };

export default function cartItems(
  state: CartItem[] = [],
  action: CartAction,
): CartItem[] {
  switch (action.type) {
    case "ADD_ITEM": {
      const newState = [...state, { ...action.newItem, code: Date.now() }];
      localStorage.setItem("cartItems", JSON.stringify(newState));
      return newState;
    }
    case "DELETE_ITEM": {
      const newState = state.filter((item) => item.code !== action.code);
      localStorage.setItem("cartItems", JSON.stringify(newState));
      return newState;
    }
    case "CLEAR_LIST":
      localStorage.setItem("cartItems", JSON.stringify([]));
      return [];
    default:
      return state;
  }
}
