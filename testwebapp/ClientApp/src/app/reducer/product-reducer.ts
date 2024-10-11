import { product } from "../models/product";
import { Action } from "../action";
import {
    PRODUCT_LIST_FAILED,
    PRODUCT_LIST_REQUEST,
    PRODUCT_LIST_SUCCESS,
    ADD_PRODUCT,
    UPDATE_PRODUCT,
    DELETE_PRODUCT, 
    ProductListRequestAction,
    AddProductAction,
    UpdateProductAction,
    DeleteProductAction 
} from "../action/product-action";

export interface ProductReducerState {
    loading: boolean;
    loaded: boolean;
    products: product[];
}

const initialState: ProductReducerState = {
    loaded: false,
    loading: false,
    products: []
};

export function ProductReducer(state = initialState, action: Action): ProductReducerState {
    switch (action.type) {
        case PRODUCT_LIST_REQUEST: {
            return { ...state, loading: true };
        }

        case PRODUCT_LIST_SUCCESS: {
            const existingProductIds = new Set(state.products.map(product => product.id));
            const uniqueProducts = action.payload.data.filter((product: { id: string | undefined; }) => !existingProductIds.has(product.id));
            const updatedProducts = state.products.concat(uniqueProducts);
            
            return { ...state, loading: false, loaded: true, products: updatedProducts };
        }

        case ADD_PRODUCT: {
            return { ...state,loading: false, loaded: false,products:[] }; // Add the new product
        }

        case UPDATE_PRODUCT: {
            const updatedProducts = state.products.map(product =>
                product.id === action.payload.id ? action.payload : product // Update the product if IDs match
            );
            return { ...state, products: updatedProducts }; // Return the updated products list
        }

        // Handle the delete action
        case DELETE_PRODUCT: {
            debugger
            const filteredProducts = state.products.filter(product => product.id !== action.payload); // Remove the product by ID
            return { ...state, products: filteredProducts }; // Return the updated products list
        }

        case PRODUCT_LIST_FAILED: {
            return { ...state, loading: false }; // Handle loading state on failure
        }

        default: {
            return state;
        }
    }
}

// Selectors
export const getLoading = (state: ProductReducerState) => state.loading;
export const getLoaded = (state: ProductReducerState) => state.loaded;
export const getProducts = (state: ProductReducerState) => state.products;
