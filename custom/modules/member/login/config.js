"use strict";

var resetPwConfig = {
	formConf: {
		'name': 'resetPw',
		'label': "Reset Password",
		'msgs': {
			'header': "Please enter a new password",
			'footer': ''
		},
		'entries': [
			{
				'name': 'password',
				'hideLabel': true,
				'label': "New Password",
				'type': 'password',
				'placeholder': "Enter a new password",
				'value': '',
				'tooltip': "Passwords are alphanumeric and support _ character only",
				'required': true
			},
			{
				'name': 'confirmPassword',
				'hideLabel': true,
				'label': "Confirm Password",
				'type': 'password',
				'placeholder': "Re-Enter Password",
				'value': '',
				'tooltip': "Passwords are alphanumeric and support _ character only",
				'required': true
			}
		]
		
	}
};

var setPasswordConfig = {
	formConf: {
		'name': 'resetPw',
		'label': "Set your Password",
		'entries': [
			{
				'name': 'password',
				'label': "Password",
				'type': 'password',
				'placeholder': "Enter Password",
				'value': '',
				'tooltip': "Passwords are alphanumeric and support _ character only",
				'required': true
			},
			{
				'name': 'confirmPassword',
				'label': "Confirm Password",
				'type': 'password',
				'placeholder': "Re-Enter Password",
				'value': '',
				'tooltip': "Passwords are alphanumeric and support _ character only",
				'required': true
			}
		]
	}
};

var forgetPwConfig = {
	formConf: {
		'name': 'forgotPw',
		'label': "Forgot Password",
		'msgs': {
			'header': "Please enter your account email address or username to reset your password",
			'footer': ''
		},
		'entries': [
			{
				'name': 'username',
				'hideLabel': true,
				'label': 'Username or Email',
				'type': 'text',
				'placeholder': "Enter Username or E-mail",
				'value': '',
				'tooltip': 'Enter your Username or E-mail to ask for a password change',
				'required': true
			}
		]
		
	}
};

var changePwConfig = {
	formConf: {
		'name': 'Change Password',
		'label': '',
		'entries': [
			{
				'name': 'oldPassword',
				'label': "Old Password",
				'type': 'password',
				'placeholder': "Enter your Old Password",
				'value': '',
				'tooltip': "Passwords are alphanumeric and support _ character only",
				'required': true
			},
			{
				'name': 'password',
				'label': "New Password",
				'type': 'password',
				'placeholder': "Enter a new password",
				'value': '',
				'tooltip': "Passwords are alphanumeric and support _ character only",
				'required': true
			},
			{
				'name': 'confirmPassword',
				'label': "Confirm Password",
				'type': 'password',
				'placeholder': "Re-Enter Password",
				'value': '',
				'tooltip': "Passwords are alphanumeric and support _ character only",
				'required': true
			}
		]
	}
};

var changeEmailConfig = {
	formConf: {
		'name': '',
		'label': '',
		'entries': [
			{
				'name': 'email',
				'label': "New Email",
				'type': 'email',
				'placeholder': "Enter Email",
				'value': '',
				'tooltip': "myemail@example.domain",
				'required': true
			}
		]
	}
};

var registerConfig = {
	formConf: {
		'name': 'newProfile',
		'label': "Join",
		'entries': [
			{
				'name': 'firstName',
				'label': "First Name",
				'type': 'text',
				'placeholder': "Enter First Name",
				'value': '',
				'tooltip': "Enter the First Name of the User",
				'required': true
			},
			{
				'name': 'lastName',
				'label': "Last Name",
				'type': 'text',
				'placeholder': "Enter Last Name",
				'value': '',
				'tooltip': "Enter the Last Name of the User",
				'required': true
			},
			{
				'name': 'email',
				'label': "Email",
				'type': 'email',
				'placeholder': "Enter Email",
				'value': '',
				'tooltip': "myemail@example.domain",
				'required': true
			},
			{
				'name': 'username',
				'label': "Username",
				'type': 'text',
				'placeholder': "Enter Username",
				'value': '',
				'tooltip': "Usernames are alphanumeric and support  _ & -  character only",
				'required': true
			},
			{
				'name': 'password',
				'label': "Password",
				'type': 'password',
				'placeholder': "Enter Password",
				'value': '',
				'tooltip': "Passwords are alphanumeric and support _ character only",
				'required': true
			},
			{
				'name': 'confirmPassword',
				'label': "Confirm Password",
				'type': 'password',
				'placeholder': "Re-Enter Password",
				'value': '',
				'tooltip': "Passwords are alphanumeric and support _ character only",
				'required': true
			}
		]
	}
};