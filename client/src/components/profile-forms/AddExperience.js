import React, { Fragment, useState } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux';
import { addExperience } from './../../actions/profile';
import { Link, withRouter } from 'react-router-dom';



// racfp
const AddExperience = ({addExperience , history}) => {

    // initial state
    const [formData , setFormData] = useState({
        company:'',
        title:'',
        location:'',
        from:'',
        to:'',
        current: false,
        description:''
    });


    // to disable the toDate field
    const [toDateDisabled , toggleDisabled] = useState(false);
    
    //destructuration
    const {
        company,
        title,
        location,
        from,
        to,
        current,
        description
    } = formData;


    // on change on any input
    const onChange = e => setFormData({
        ...formData,
        [e.target.name] : e.target.value
    });    

    // on submit of the form
    const onSubmit = e => {
        e.preventDefault();
        addExperience(formData , history)
    }

    return (
       <Fragment>
            <h1 className="large text-primary">
                Add An Experience
      </h1>
            <p className="lead">
                <i className="fas fa-code-branch"></i> Add any developer/programming
        positions that you have had in the past
      </p>
            <small>* = required field</small>
            <form className="form" onSubmit={ e => onSubmit(e)}>
                <div className="form-group">
                    <input 
                     value={title}
                     onChange = {e => onChange(e)}
                     type="text" 
                     placeholder="* Job Title"
                     name="title"
                      required />
                </div>
                <div className="form-group">
                    <input 
                    value={company}
                    onChange={e => onChange(e)}
                    type="text"
                    placeholder="* Company"
                    name="company" 
                    required />
                </div>
                <div className="form-group">
                    <input
                    value={location}
                    onChange={e => onChange(e)}
                    type="text"
                    placeholder="Location"
                    name="location" />
                </div>
                <div className="form-group">
                    <h4>From Date</h4>
                    <input 
                    value={from}
                    onChange={e => onChange(e)}
                    type="date"
                    name="from" />
                </div>
                <div className="form-group">
                    <p>
                        <input
                        value={current}
                        checked = {current}
                        onChange= {e => {
                            setFormData({ ...formData , current: !current});
                            toggleDisabled(!toDateDisabled)
                        }}
                         type="checkbox"
                         name="current"
                         /> 
                        {' '} Current Job
                    </p>
                </div>
                <div className="form-group">
                    <h4>To Date</h4>
                    <input
                    disabled = { toDateDisabled? 'disabled' : ''}
                    value={to}
                    onChange={e => onChange(e)}
                    type="date"
                    name="to" />
                </div>
                <div className="form-group">
                    <textarea
                        value={description}
                        onChange={e => onChange(e)}
                        name="description"
                        cols="30"
                        rows="5"
                        placeholder="Job Description"
                    ></textarea>
                </div>
                <input type="submit" className="btn btn-primary my-1" />
                <Link className="btn btn-light my-1" to="/dashboard">Go Back</Link>
            </form>
       </Fragment>
    )
}

AddExperience.propTypes = {
  addExperience: PropTypes.func.isRequired,
}

export default connect(null , {addExperience})(withRouter(AddExperience) )
