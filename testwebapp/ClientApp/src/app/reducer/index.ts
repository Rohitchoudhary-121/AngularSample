import { ActionReducerMap, createSelector } from "@ngrx/store";
import * as fromUser from "./user-reducer";
import * as fromProduct from "./product-reducer";

export interface RootReducerState{
    users:fromUser.UserReducerState;
    products: fromProduct.ProductReducerState;
}

export const rootReducer : ActionReducerMap<RootReducerState> = {
    users:fromUser.UserReducer,
    products:fromProduct.ProductReducer
    
}


export const getUserState = (state:RootReducerState) => {
   return state.users;
};

export const getProductState = (state:RootReducerState) => {
    return state.products;
 };

export const getUserLoading = createSelector(getUserState,fromUser.getLoading);
export const getUserLoaded = createSelector(getUserState,fromUser.getLoaded);
export const getUsers = createSelector(getUserState,fromUser.getUsers);

export const getProductLoading = createSelector(getProductState,fromProduct.getLoading);
export const getProductLoaded = createSelector(getProductState,fromProduct.getLoaded);
export const getProducts = createSelector(getProductState,fromProduct.getProducts);