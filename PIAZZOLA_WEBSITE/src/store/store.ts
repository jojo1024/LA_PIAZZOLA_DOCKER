import { Action, configureStore, ThunkAction } from "@reduxjs/toolkit";
import { combineReducers } from "redux";
import { persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";
import thunk from "redux-thunk";
import menuReducer, { IMenuState } from "./menuSlice";
import appReducer, { IAppState } from "./appSlice";
import cartReducer, { ICartState } from "./cartSlice";
import pizzaAccompagnementReducer, { IPizzaAccompagnementState } from "./pizzaAccompagnementSlice";
import pointLivraisonReducer, { pointLivraisonState } from "./pointLivraisonSlice";

export interface IReduxState {
    application: IAppState;
    menu: IMenuState;
    cart: ICartState;
    pizzaAccompagnement: IPizzaAccompagnementState;
    pointLivraison: pointLivraisonState;
}

const reducers = combineReducers({
    application: appReducer,
    menu: menuReducer,
    cart: cartReducer,
    pizzaAccompagnement: pizzaAccompagnementReducer,
    pointLivraison: pointLivraisonReducer,
});

const persistConfig = {
    key: "root",
    storage: storage,
    whitelist: ["application", "cart", "pizzaAccompagnement", "pointLivraison"], // liste des slices qui doivent etre persister
};

const persistedReducer = persistReducer(persistConfig, reducers);

export const store = configureStore({
    reducer: persistedReducer,
    devTools: process.env.NODE_ENV !== "production",
    middleware: [thunk],
});


export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<
    ReturnType,
    RootState,
    unknown,
    Action<string>
>;
