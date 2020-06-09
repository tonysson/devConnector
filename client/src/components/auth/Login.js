import React, { Fragment, useState } from 'react';
import { Link } from 'react-router-dom';

export const Login = () => {

    //statemanagement with useState
    const [formData, setState] = useState({

        email: '',
        password: ''
    });

    // destructuration
    const {  email, password } = formData

    // pull out the value of our input
    const onChange = e => setState({ ...formData, [e.target.name]: e.target.value });

    // manage the submit
    const onSubmit = async e => {
        e.preventDefault();
        console.log('SUCCESS');
    }

    return (
        <Fragment>
            <h1 className="large text-primary">Sign In</h1>
            <p className="lead"><i className="fas fa-user"></i> Sign Into Your Account</p>
            <form className="form" onSubmit={e => onSubmit(e)}>
                <div className="form-group">
                    <input
                        type="email"
                        placeholder="Email Address"
                        name="email"
                        value={email}
                        onChange={e => onChange(e)}
                        required
                    /> 
                </div>
                <div className="form-group">
                    <input
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={e => onChange(e)}
                        name="password"
                        minLength="6"
                    />
                </div>

                <input type="submit" className="btn btn-primary" value="Login" />
            </form>
            <p className="my-1">
                Don't have an account? <Link to="/register">Sign Up</Link>
            </p>
        </Fragment>
    )
}
