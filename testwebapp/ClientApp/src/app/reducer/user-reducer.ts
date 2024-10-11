import { user } from "../models/user";
import { Action } from "../action";
import { USER_LIST_FAILED, USER_LIST_REQUEST, USER_LIST_SUCCESS, UserListRequestAction } from "../action/user-action";

export  interface UserReducerState{
    loading:boolean;
    loaded:boolean;
    users:user[];
}

const initialState : UserReducerState = {
loaded:false,
loading : false,
users : []
};

export function UserReducer(state = initialState , action:Action):UserReducerState{
    debugger
    switch(action.type){
        case USER_LIST_REQUEST:{
            return {...state,loading:true};
        }

        case USER_LIST_SUCCESS:{
            const updatedUsers = state.users.concat(action.payload.data);
            return {...state,loading:false,loaded:true,users:updatedUsers};
        }

        default:{
            return state;
        }

    }
}


//selectors

export const getLoading = (state:UserReducerState) => state.loading;
export const getLoaded = (state:UserReducerState) => state.loaded;
export const getUsers = (state:UserReducerState) => state.users;

