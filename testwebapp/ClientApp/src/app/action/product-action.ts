import { product } from "../models/product";

export const PRODUCT_LIST_REQUEST = 'product list request';
export const PRODUCT_LIST_SUCCESS = 'product list success';
export const PRODUCT_LIST_FAILED = 'product list failed';
export const ADD_PRODUCT = 'add product';
export const UPDATE_PRODUCT = 'update product';
export const DELETE_PRODUCT = 'delete product';

export class ProductListRequestAction {
    readonly type = PRODUCT_LIST_REQUEST;
}

export class ProductListSuccessAction {
    readonly type = PRODUCT_LIST_SUCCESS;

    constructor(public payload?: { data: product[] }) { }
}

export class AddProductAction {
    readonly type = ADD_PRODUCT;

    constructor(public payload: product) { }
}

export class UpdateProductAction {
    readonly type = UPDATE_PRODUCT;

    constructor(public payload: product) { }
}

export class DeleteProductAction {
    readonly type = DELETE_PRODUCT;

    constructor(public payload: string) { } 
}
