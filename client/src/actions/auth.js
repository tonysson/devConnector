import axios from 'axios';
import { REGISTER_FAIL, REGISTER_SUCCESS, USER_LOADED , AUTH_ERROR , LOGIN_SUCCESS, LOGIN_FAIL,LOGOUT, CLEAR_PROFILE} from './types';
import { setAlert } from './alert';
import setAuthToken from './../utils/setAuthToken';




/**
 * @description : permet de bien authentifier un user, en gros verifie si le token est valide
 * 
 */

 export const loadUser = () => async dispatch => {

    // on verifie s'il y a un token ds le localStorage
     if (localStorage.token) setAuthToken(localStorage.token);

     try {

        // send a request
        const res = await axios.get('/api/auth');

        // send a response
        dispatch({
            type:USER_LOADED,
            payload: res.data
        });
         
     } catch (error) {
         dispatch({
             type:AUTH_ERROR
         });
     }
 };


/**
 * 
 * @description : Permet d'enregistrer un user sur le front
 */

export const register = ({name, email , password}) => async dispatch => {

    const config = {
        headers:{
            'Content-Type' : 'application/json'
        }
    } 

    const body = JSON.stringify({name, email, password});

    try {

        // send the request
        const res = await axios.post('/api/users', body, config);

        // if ok? we send the response
        dispatch({
            type: REGISTER_SUCCESS,
            payload: res.data 
        });
        
        dispatch(loadUser());
        
    } catch (error) {
        // here we want to shows errors if name, email , password are wrong( in our backend)
        const errors = error.response.data.errors
        if(errors){
            errors.forEach(err => dispatch(setAlert(err.msg , 'danger')))
        }
        dispatch({
            type:REGISTER_FAIL
        });
    }
};

/**
 * 
 * @description : Permet a un user de login 
 */

export const login = (  email, password ) => async dispatch => {

    const config = {
        headers: {
            'Content-Type': 'application/json'
        }
    }

    const body = JSON.stringify({ email, password });

    try {

        // send the request
        const res = await axios.post('/api/auth', body, config);

        // if ok? we send the response
        dispatch({
            type: LOGIN_SUCCESS,
            payload: res.data
        });

        dispatch(loadUser());

    } catch (error) {
        // here we want to shows errors if name, email , password are wrong( in our backend)
        const errors = error.response.data.errors
        if (errors) {
            errors.forEach(err => dispatch(setAlert(err.msg, 'danger')))
        }
        dispatch({
            type: LOGIN_FAIL
        });
    }
};

/**
 * @description permet de logout, clear the profile
 */
export const logout = () => dispatch => {
  dispatch({type : LOGOUT});
  dispatch({type: CLEAR_PROFILE})
}