"use strict";

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