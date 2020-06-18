import { SET_ALERT, REMOVE_ALERT } from './../actions/types';

const initialState = [];

/**
 * payload can be anything: data , id or smthing else
 * --------------------------------------------------
 * we use filter beacause we want to remove a specific alert so we check for it ID
 * --------------------------------------------------------------------------------
 * 
 */

export default function(state = initialState , action) {
    
    // DESTRUCTURING
    const {type , payload} = action;

    switch(type){
        case SET_ALERT :
            return [...state, payload];
        case REMOVE_ALERT:
            return state.filter(alert => alert.id !==  payload);
        default:
            return state        
    }
}