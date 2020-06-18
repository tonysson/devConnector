import { setAlert } from './alert';
import { GET_POSTS, POST_ERROR, UPDATE_LIKES, DELETE_POST, ADD_POST , GET_POST , ADD_COMMENT, REMOVE_COMMENT} from './types';
import axios from 'axios';


/**
 * @description GET All posts
 */

 export const getPosts = () => async dispatch => {

    try {

        //SEND REQUEST TO OUR API
        const res = await axios.get('/api/posts/');

        // DISPATCH OUR ACTION (reducer)
        dispatch({
            type:GET_POSTS,
            payload:res.data
        })
        
    } catch (error) {
        dispatch({
            type: POST_ERROR,
            payload: { msg: error.response.statusText, status: error.response.status }
        });
    }

 };

/**
* @description ADD LIKES 
id = postID
*/
export const addLike = id => async dispatch => {

    try {

        //SEND REQUEST TO OUR API
        const res = await axios.put(`/api/posts/like/${id}`)

        //Dipatch action( reducers)
        dispatch({
            type:UPDATE_LIKES,
            payload: {id , likes: res.data}
        })
        
    } catch (error) {
        dispatch({
            type: POST_ERROR,
            payload: { msg: error.response.statusText, status: error.response.status }
        });
    }
};

/**
* @description REMOVE LIKES
*id = postID
*/
export const removeLike = id => async dispatch => {

    try {

        //SEND REQUEST TO OUR API
        const res = await axios.put(`/api/posts/unlike/${id}`)

        //Dipatch action( reducers)
        dispatch({
            type: UPDATE_LIKES,
            payload: { id, likes: res.data }
        })

    } catch (error) {
        dispatch({
            type: POST_ERROR,
            payload: { msg: error.response.statusText, status: error.response.status }
        });
    }
}

/**
* @description DELETE A POST
* id = postID
*/
export const deletePost = id => async dispatch => {

    try {

        //SEND REQUEST TO OUR API
         await axios.delete(`/api/posts/${id}`)

        //Dipatch action( reducers)
        dispatch({
            type: DELETE_POST,
            payload: id
        })

        // dispatch setAlert
        dispatch(setAlert('Post Removed' , 'success'));

    } catch (error) {
        dispatch({
            type: POST_ERROR,
            payload: { msg: error.response.statusText, status: error.response.status }
        });
    }
}

/**
 * @description ADD A POST
 */

export const addPost = formData => async dispatch => {

    // config of the header 
    const config = {
        headers:{
            'Content-Type' : 'Application/json'
        }
    }

    try {

        //SEND REQUEST TO OUR API
        const res = await axios.post('/api/posts' , formData, config)

        //Dipatch action( reducers)
        dispatch({
            type:ADD_POST,
            payload: res.data
        })

        // dispatch setAlert
        dispatch(setAlert('Post Created', 'success'));

    } catch (error) {
        dispatch({
            type: POST_ERROR,
            payload: { msg: error.response.statusText, status: error.response.status }
        });
    }
}

/**
 * @description GET one post
 */

export const getPost = id => async dispatch => {

    try {

        //SEND REQUEST TO OUR API
        const res = await axios.get(`/api/posts/${id}`);

        // DISPATCH OUR ACTION (reducer)
        dispatch({
            type: GET_POST,
            payload: res.data
        })

    } catch (error) {
        dispatch({
            type: POST_ERROR,
            payload: { msg: error.response.statusText, status: error.response.status }
        });
    }

};

/**
 * @description ADD A COMMENT
 */

export const addComment = (postId, formData) => async dispatch => {

    // config of the header 
    const config = {
        headers: {
            'Content-Type': 'Application/json'
        }
    }

    try {

        //SEND REQUEST TO OUR API
        const res = await axios.post(`/api/posts/comment/${postId}`, formData, config)

        //Dipatch action( reducers)
        dispatch({
            type: ADD_COMMENT,
            payload: res.data
        })

        // dispatch setAlert
        dispatch(setAlert('Comment added', 'success'));

    } catch (error) {
        dispatch({
            type: POST_ERROR,
            payload: { msg: error.response.statusText, status: error.response.status }
        });
    }
};

/**
 * @description REMOVE A COMMENT
 */

export const removeComment = (postId, commentId) => async dispatch => {

    try {

        //SEND REQUEST TO OUR API
          await axios.delete(`/api/posts/comment/${postId}/${commentId}`)

        //Dipatch action( reducers)
        dispatch({
            type: REMOVE_COMMENT,
            payload: commentId
        })

        // dispatch setAlert
        dispatch(setAlert('Comment removed', 'success'));

    } catch (error) {
        dispatch({
            type: POST_ERROR,
            payload: { msg: error.response.statusText, status: error.response.status }
        });
    }
}