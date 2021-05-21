import React, { Component } from 'react'
import { connect } from 'react-redux'

import Input from '../../../components/ui/input/Input'
import Button from '../../../components/ui/button/Button'
import classes from './Login.module.css'
import { checkValidity } from '../../../shared/utility'
import axios from '../../../axios/authentication'
import { Link } from 'react-router-dom';
import * as actionTypes from '../../../store/actions'
import { Typography } from '@material-ui/core'

class Login extends Component {

	state = {
		controls: {
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
					required: true
				},
				valid: false,
				touched: false
			}
		},
		formIsValid: false
	}


	loginHandler = async (event) => {
		event.preventDefault()
		const formData = {};
		for (let formEelementIndentifier in this.state.controls) {
			formData[formEelementIndentifier] = this.state.controls[formEelementIndentifier].value
		}
		console.log(formData)
		try {
			const response = await axios.post('/login', formData)
			this.props.onSuccessfulLogin(response.data.dataValues.name, response.data.token)
			this.props.history.push('/linksocialmedia')
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
		let { isValid, errorMessage } = checkValidity(updatedFormElement.value, updatedFormElement.validation)

		updatedFormElement.valid = isValid
		updatedFormElement.errorMessage = errorMessage
		updatedFormElement.touched = true
		updatedSignupForm[inputIdentifier] = updatedFormElement
		let formIsValid = true;
		for (let inputIdentifier in updatedSignupForm) {
			formIsValid = updatedSignupForm[inputIdentifier].valid && formIsValid
		}

		this.setState({
			controls: updatedSignupForm,
			formIsValid
		})
	}

	render() {

		const formElementsArray = []
		for (let key in this.state.controls) {
			formElementsArray.push({
				id: key,
				config: this.state.controls[key]
			})
		}
		return (
			<Typography>
				<div className={classes.Login}>
					<img src="./lurker-logo.png" className={classes.logo} alt={'Lurker'} />
					<form onSubmit={this.loginHandler}>
						{formElementsArray.map(formElement => (
							<Input
								key={formElement.id}
								elementType={formElement.config.elementType}
								elementConfig={formElement.config.elementConfig}
								value={formElement.config.value}
								invalid={!formElement.config.valid}
								shouldValidate={formElement.config.validation}
								touched={formElement.config.touched}
								errorMessage={formElement.config.errorMessage}
								changed={(event) => this.inputChangedHandler(event, formElement.id)} />
						))}
						<Button btnType="Success" disabled={!this.state.formIsValid}>LOGIN</Button>
					</form>
					<p style={{ color: 'rgb(17, 53, 116)' }}>Don't have an account? <Link to="/register">Sign up</Link></p>
				</div>
			</Typography>
		)
	}
}

const mapDispatchToProps = dispatch => {
	return {
		onSuccessfulLogin: (name, jwtToken) => dispatch({ type: actionTypes.AUTH_TOKEN, jwtToken, name, posts: [] })
	}
}

export default connect(null, mapDispatchToProps)(Login)