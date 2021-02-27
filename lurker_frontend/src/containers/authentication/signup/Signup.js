import React, { Component } from 'react';
// import classes from './Login.module.css';

import Input from '../../../components/ui/input/Input'
import Button from '../../../components/ui/button/Button'
import classes from './Signup.module.css'
import { checkValidity } from '../../../shared/utility'
import axios from '../../../axios/register'
// import axios from 'axios'

//TODO: Add Link to instead of href
class Signup extends Component {

    state = {
      controls: {
        name: {
          elementType: 'input',
          elementConfig: {
            type: 'text',
            placeholder: 'Name'
          },
          value: '',
          validation: {
            required: true,
            touched: false
          },
          valid: false
        },
        email: {
          elementType: 'input',
          elementConfig: {
            type: 'email',
            placeholder: 'Email Address'
          },
          value: '',
          validation: {
            required: true,
            isEmail: true
          },
          valid: false,
          touched: false
        },
        password: {
          elementType: 'input',
          elementConfig: {
            type: 'password',
            placeholder: 'Password'
          },
          value: '',
          validation: {
            required: true,
            minLength: 6,
            maxLength: 20
          },
          valid: false,
          touched: false
        },
        confirmPassword: {
          elementType: 'input',
          elementConfig: {
            type: 'password',
            placeholder: 'Confirm Password'
          },
          value: '',
          validation: {
            required: true
          },
          valid: false,
          touched: false
        }
      },
      formIsValid: false
    }


    signupHandler = async ( event ) => {
      event.preventDefault()
      const formData = {};
      for(let formEelementIndentifier in this.state.controls ) {
        if(formEelementIndentifier === 'confirmPassword')
          continue
        formData[formEelementIndentifier] = this.state.controls[formEelementIndentifier].value
      }
      console.log(formData)
      try{
      const response = await axios.post('/', formData)
      console.log(response)
    } catch (err) {
        console.log(err.response)
      }
    }

    inputChangedHandler = (event, inputIdentifier) => {
      const updatedSignupForm = {
        ...this.state.controls
      }
      const updatedFormElement = {
        ...updatedSignupForm[inputIdentifier]
      }
      updatedFormElement.value = event.target.value
      let {isValid, errorMessage} = checkValidity(updatedFormElement.value, updatedFormElement.validation)
      
      //TODO: Confirm password and password issue. Below are steps to regenerate:
      /*
      1. Enter password
      2. Enter confirm password
      3. Now change password
      4. Try changing confirm password now, it will not work properly
      */
      
      if(inputIdentifier === 'password') {
        if(updatedSignupForm.confirmPassword.touched && updatedSignupForm.confirmPassword.value !== updatedFormElement.value) {
          isValid = false;
          errorMessage = "Password and confirm password should be same!"
        }
      }
      if(inputIdentifier === 'confirmPassword') {
        if(updatedSignupForm.password.value !== updatedFormElement.value) {
          isValid = false;
          errorMessage = "Password and confirm password should be same!"
        }
      }
      updatedFormElement.valid = isValid
      updatedFormElement.errorMessage = errorMessage
      updatedFormElement.touched = true
      updatedSignupForm[inputIdentifier] = updatedFormElement
      let formIsValid = true;
      for(let inputIdentifier in updatedSignupForm) {
        formIsValid = updatedSignupForm[inputIdentifier].valid && formIsValid
      }
      
      this.setState({
        controls: updatedSignupForm,
        formIsValid
      })
    }

    render() {

        const formElementsArray = []
        for(let key in this.state.controls) {
          formElementsArray.push({
            id: key,
            config: this.state.controls[key]
          })
        }
        return (
          <div className  = {classes.Signup}>
              {/* //TODO: Change this heading to App logo */}
              <h1>LURKER</h1>
              <form onSubmit = {this.signupHandler}>
                  {formElementsArray.map(formElement => (
                    <Input 
                      key = {formElement.id}
                      elementType = {formElement.config.elementType}
                      elementConfig = {formElement.config.elementConfig}
                      value = {formElement.config.value} 
                      invalid = {!formElement.config.valid}
                      shouldValidate = {formElement.config.validation}
                      touched = {formElement.config.touched}
                      errorMessage = {formElement.config.errorMessage}
                      changed = {(event) => this.inputChangedHandler(event, formElement.id)}/>
                  ))}
                  <Button btnType = "Success" disabled = {!this.state.formIsValid}>REGISTER</Button>
              </form>
            </div>
        )
    }
}

export default Signup