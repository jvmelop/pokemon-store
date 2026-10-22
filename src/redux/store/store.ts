import { createStore } from "redux";
import reducer from "@/redux/reducers";
import type { RootState } from "@/redux/reducers";
import type { CartItem } from "@/redux/reducers/cartItems";

function readSavedCart(): CartItem[] {
  if (typeof window === "undefined") return [];

  try {
    const savedCart: unknown = JSON.parse(localStorage.getItem("cartItems") ?? "[]");
    return Array.isArray(savedCart) ? (savedCart as CartItem[]) : [];
  } catch {
    return [];
  }
}

const initialState: RootState = {
  filters: {
    type_1: null,
    type_2: null,
    region: null,
    searchName: null,
  },
  cartItems: readSavedCart(),
};

const store = createStore(reducer, initialState);

store.subscribe(() => {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem("cartItems", JSON.stringify(store.getState().cartItems));
  } catch {
    // Storage can be unavailable in private browsing or when its quota is full.
  }
});

export default store;
