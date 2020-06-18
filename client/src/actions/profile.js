import axios from 'axios'
import { PROFILE_ERROR, GET_PROFILE, UPDATE_PROFILE, ACCOUNT_DELETED, CLEAR_PROFILE, GET_PROFILES, GET_REPOS} from './types';
import { setAlert } from './alert';



/**
 * @description  Get current user profile
 */
export const getCurrentProfile = () => async dispatch => {
  
    try {
        const res = await axios.get('/api/profile/me');

        dispatch({
            type: GET_PROFILE,
            payload: res.data
        });
    } catch (error) {
        dispatch({
            type: PROFILE_ERROR,
            payload: { msg: error.response.statusText, status: error.response.status }
        });
    }
};

/**
 * @description get all profiles
 */
export const getProfiles = () => async dispatch =>{
    // avoid to have a flash of the last profile visited in the browser
    dispatch({ type: CLEAR_PROFILE });


    try {
        const res = await axios.get('/api/profile');

        dispatch({
            type: GET_PROFILES,
            payload: res.data
        });
    } catch (error) {
        dispatch({
            type: PROFILE_ERROR,
            payload: { msg: error.response.statusText, status: error.response.status }
        });
    }

};



/**
 * @description get profile by ID
 */
export const getProfileById = userId => async dispatch => {

    try {
        const res = await axios.get(`/api/profile/user/${userId}`);

        dispatch({
            type: GET_PROFILE,
            payload: res.data
        });
    } catch (error) {
        dispatch({
            type: PROFILE_ERROR,
            payload: { msg: error.response.statusText, status: error.response.status }
        });

    }

};


/**
 * @description get GITHUB REPOS
 */
export const getGithubRepos = username => async dispatch => {
   
    try {

        const res = await axios.get(`/api/profile/github/${username}`);
        dispatch({
            type: GET_REPOS,
            payload: res.data
        });
    } catch (error) {
        dispatch({
            type: PROFILE_ERROR,
            payload: { msg: error.response.statusText, status: error.response.status }
        });
    }

}




/**
 * @description Create and update profile
 */
export const createProfile = (formData, history, edit = false ) => async dispatch => {

    try {

        //config du header
        const config = {
            headers: {
                'Content-Type' : 'application/json'
            }
        }
        
        // send the request
        const res = await axios.post('/api/profile' , formData , config );

        // action
        dispatch({
            type: GET_PROFILE,
            payload: res.data
        });

        //set alert message
        dispatch(setAlert( !edit? 'Profile Updated successfully' : 'Profile created successfully' , 'success'));

        // redirect 
        if(!edit){
            history.push('/dashboard')
        }
    } catch (error) {

        // here we want to shows errors in alert
        const errors = error.response.data.errors
        if (errors) {
            errors.forEach(err => dispatch(setAlert(err.msg, 'danger')))
        }
      
        dispatch({
            type: PROFILE_ERROR,
            payload: { msg: error.response.statusText, status: error.response.status }
        });
    };
};

/**
 * @description ADD EXPERIENCE
 */

export const addExperience = (formData, history) => async dispatch => {
    try {

        //config du header
        const config = {
            headers: {
                'Content-Type': 'application/json'
            }
        }

        // SEND REQUEST TO THE API
        const res = await axios.put('/api/profile/experience', formData, config);

        // ACTION
        dispatch({
            type: UPDATE_PROFILE,
            payload: res.data
        });

        //ALERT MESSAGE
        dispatch(setAlert('Experience Added', 'success'));

        // REDIRECT
        history.push('/dashboard');

    } catch (error) {
        const errors = error.response.data.errors;

        if (errors) {
            errors.forEach(err => dispatch(setAlert(err.msg, 'danger')));
        }

        dispatch({
            type: PROFILE_ERROR,
            payload: { msg: error.response.statusText, status: error.response.status }
        });
    }
};

/**
 * @description add education
 */

export const addEducation = (formData, history) => async dispatch => {
    try {

        //config du header
        const config = {
            headers: {
                'Content-Type': 'application/json'
            }
        }
 
        // send request to the api
        const res = await axios.put('/api/profile/education', formData, config);

        // set the action to call
        dispatch({
            type: UPDATE_PROFILE,
            payload: res.data
        });

        // set an alert
        dispatch(setAlert('Education Added', 'success'));

        // redirect
        history.push('/dashboard');
        
    } catch (error) {
        const errors = error.response.data.errors;

        if (errors) {
            errors.forEach(err => dispatch(setAlert(err.msg, 'danger')));
        }

        dispatch({
            type: PROFILE_ERROR,
            payload: { msg: error.response.statusText, status: error.response.status }
        });
    }
};

/**
 * @description delete experience
 */
export const deleteExperience = id => async dispatch => {

    try {

        // send request to our API
        const res = await axios.delete(`/api/profile/experience/${id}`)
        
        // set our dispatch
        dispatch({
            type:UPDATE_PROFILE,
            payload: res.data
        });

        // set an alert
        dispatch(setAlert('Experience Removed', 'success'));

    } catch (error) {
        dispatch({
            type: PROFILE_ERROR,
            payload: { msg: error.response.statusText, status: error.response.status }
        });
    }
};

/**
 * @description delete education
 */
export const deleteEducation = id => async dispatch => {

    try {

        // send request to our API
        const res = await axios.delete(`/api/profile/education/${id}`)

        // set our dispatch
        dispatch({
            type: UPDATE_PROFILE,
            payload: res.data
        });

        // set an alert
        dispatch(setAlert('Education Removed', 'success'));

    } catch (error) {
        dispatch({
            type: PROFILE_ERROR,
            payload: { msg: error.response.statusText, status: error.response.status }
        });
    }
};

/**
 * @description delete account and profile
 */

export const deleteAccount = () => async dispatch => {
    if (window.confirm('Are you sure? This can NOT be undone!')) {
        try {

            await axios.delete('/api/profile');
            dispatch({ type: CLEAR_PROFILE });
            dispatch({ type: ACCOUNT_DELETED });
            dispatch(setAlert('Your account has been permanently deleted'));

        } catch (error) {
            dispatch({
                type: PROFILE_ERROR,
                payload: { msg: error.response.statusText, status: error.response.status }
            });
        }
    }
};