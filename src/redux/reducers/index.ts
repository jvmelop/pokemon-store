import { combineReducers } from "redux";
import cartItems from "./cartItems";
import filters from "./filters";

const rootReducer = combineReducers({ filters, cartItems });

export type RootState = ReturnType<typeof rootReducer>;

export default rootReducer;
