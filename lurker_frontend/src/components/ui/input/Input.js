import React from 'react';

import classes from './Input.module.css'

const input = (props) => {
    
    let inputElement = null
    let validationError = null
    const inputClasses = [classes.InputElement]

    if(props.invalid && props.shouldValidate && props.touched) {
        inputClasses.push(classes.Invalid);
        if(props.errorMessage !== null)
            validationError = <p className = {classes.ErrorMessage}>{props.errorMessage}</p>
    }

    switch(props.elementType) {
        case ('input'):
            inputElement = <input 
            className = {inputClasses.join(' ')} 
            {... props.elementConfig} 
            value = {props.value}
            onChange = {props.changed}/>
            break;
        case ('textarea'):
            inputElement = <textarea 
            className = {inputClasses.join(' ')} 
            {...props.elementConfig}
            value = {props.value}
            onChange = {props.changed}/>
            break;
        default:
            inputElement = <input 
            className = {inputClasses.join(' ')} 
            {...props.elementConfig}
            value = {props.value}
            onChange = {props.changed}/>
    }

    return ( 
        <div className = {classes.Input}>
            <label className = {classes.Label}>
                {props.label}
            </label>
            { inputElement }
            { validationError }
        </div>
    )   
}

export default input