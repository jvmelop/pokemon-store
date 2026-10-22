import { useDispatch, useSelector, type TypedUseSelectorHook } from "react-redux";
import type { RootState } from "@/redux/reducers";
import store from "@/redux/store/store";

export type AppDispatch = typeof store.dispatch;

export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
