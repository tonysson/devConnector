import { GET_POSTS , POST_ERROR, UPDATE_LIKES, DELETE_POST, ADD_POST , GET_POST, ADD_COMMENT, REMOVE_COMMENT} from '../actions/types'

const initialState = {
    posts: [],
    post: null,
    loading: true,
    error:{}
}

export default function (state = initialState , action) {

    const {type , payload} = action

    switch(type){

        case ADD_POST:
            return{
                ...state,
                posts: [ payload, ...state.posts ],
                loading:false
            }

        case GET_POSTS:
            return {
                ...state,
                posts:payload,
                loading:false
            }
         
        case GET_POST:
            return{
                ...state,
                post:payload,
                loading:false
            }

        case DELETE_POST:
            return{
                ...state,
                // on filtre nos posts et on retourne tous les post sauf celui qu'on a supprimé
                // notons egalement que payload n'est que l'id du post suprimé(cf delePost ds action)
                posts: state.posts.filter(post => post._id !== payload),
                loading: false
            }    

        case POST_ERROR: 
            return{
                ...state,
                error:payload,
                loading: false
            }
         
        case UPDATE_LIKES:
            return{
                ...state,
                //on veut manipuler les likes , on map a travers les posts et on verifie si le post sur lequel on est match avec le post liké , si oui on retourne le post avec le like ou sinn on retourne le poste
                posts: state.posts.map(post => post._id === payload.id ? {
                    ...post,
                    likes: payload.likes
                } : post)
            }    
        
        case ADD_COMMENT:
            return{
                ...state,
                post:{...state.post , comments:payload},
                loading:false
            }   
            
        case REMOVE_COMMENT:
            return{
                ...state,
                post:{
                    ...state.post,
                    comments: state.post.comments.filter(comment => comment._id !== payload)
                },
                loading:false

            }    
        default :
            return state
    }
}