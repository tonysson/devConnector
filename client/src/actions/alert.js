import { SET_ALERT, REMOVE_ALERT  } from './types';
import { v4 as uuidv4 } from 'uuid';


/**
 *  uuidv4() nous donne un id o hasar
 * @param {le message qu'on va afficher} msg 
 * @param { le type d'alerte } alertType 
 */


export const setAlert = (msg , alertType , timeout = 3000) => dispatch => {

    const id = uuidv4();

    dispatch({
        type:SET_ALERT,
        payload: {msg, alertType, id}
    });

    setTimeout(() => dispatch({
        type:REMOVE_ALERT,
        payload: id
    }), timeout)
}

