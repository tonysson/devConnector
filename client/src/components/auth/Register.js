import React, {Fragment, useState} from 'react';
import { Link, Redirect } from 'react-router-dom';
import { connect } from 'react-redux' // allow us to coonect a component to redux
import { setAlert } from './../../actions/alert';
import {register} from './../../actions/auth';
import PropTypes from 'prop-types';

/**
 * Pour utuliser connect() on le passe au niveau du export default
 *  pour utiliser une action on la passe au connect() 
 * il nous donne access à props.setAlert par exemple,
 * Mais ds notre cas on a fait de la desctructuration dc pas besoin de faire props.setAlert
 */

const Register = ({ setAlert, register, isAuthenticated}) => {

    //statemanagement with useState
    const [formData, setState] = useState({
        name:'',
        email:'',
        password:'',
        password2:''
    });

    // destructuration
    const { name, email, password, password2} = formData

    // pull out the value of our input
    const onChange = e => setState({...formData , [e.target.name]: e.target.value});

    // manage the submit
    const onSubmit = async e => {
        e.preventDefault();

        if(password !== password2){
            setAlert('Both passwords do not match', 'danger');
            
        }else{
           register({name, email, password})
        }

    }

    if(isAuthenticated){
        return <Redirect to="/dashboard" />
    }

    return (
        <Fragment>
            <h1 className="large text-primary">Sign Up</h1>
            <p className="lead"><i className="fas fa-user"></i> Create Your Account</p>
            <form className="form" onSubmit = {e => onSubmit(e)}>
                <div className="form-group">
                    <input 
                     type="text"
                     placeholder="Name"
                     name="name"
                     value={name}
                     onChange={e => onChange(e)}
                    />
                </div>
                <div className="form-group">
                    <input 
                     type="email"
                     placeholder="Email Address"
                     name="email" 
                     value={email}
                     onChange={e => onChange(e)}
                   
                     />
                    <small className="form-text"
                    >This site uses Gravatar so if you want a profile image, use a
                     Gravatar email</small>
                </div>
                <div className="form-group">
                    <input
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={e => onChange(e)}
                        name="password"
                       
                    />
                </div>
                <div className="form-group">
                    <input
                        type="password"
                        placeholder="Confirm Password"
                        value={password2}
                        onChange={e => onChange(e)}
                        name="password2"
                     
                    />
                </div>
                <input type="submit" className="btn btn-primary" value="Register" />
            </form>
            <p className="my-1">
                Already have an account? <Link to="/login">Sign In</Link>
            </p>
        </Fragment>
    )
};

Register.propTypes = {
    setAlert : PropTypes.func.isRequired,
    register: PropTypes.func.isRequired,
    isAuthenticated: PropTypes.bool,
}

const mapStateToProps = (state) => ({
    isAuthenticated: state.auth.isAuthenticated
});



export default connect(mapStateToProps  , {setAlert, register})(Register)
