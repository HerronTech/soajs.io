"use strict";

var membersConfig = {
	grid: {
		recordsPerPageArray: [5, 10, 50, 100],
		'columns': [
			{ 'label': 'Username', 'field': 'username' },
			{ 'label': 'First Name', 'field': 'firstName' },
			{ 'label': 'Last Name', 'field': 'lastName' },
			{ 'label': 'Email', 'field': 'email' },
			{ 'label': 'Status', 'field': 'status' }
			// { 'label': 'Groups', 'field': 'grpsArr' },
			// { 'label': 'Projects', 'field': 'projectsArr' }
		],
		'leftActions': [],
		'topActions': [],
		'defaultSortField': '',
		'defaultLimit': 10
	},
	
	form: {
		'name': '',
		'label': '',
		'actions': {},
		'entries': [
			{
				'name': 'username',
				'label': 'Username',
				'type': 'text',
				'placeholder': "Enter Username",
				'value': '',
				'tooltip': "Usernames are alphanumeric and support  _ & -  character only",
				'required': true
			},
			{
				'name': 'email',
				'label': 'Email',
				'type': 'email',
				'placeholder': "Enter Email",
				'value': '',
				'tooltip': "myemail@example.domain",
				'required': true
			},
			{
				'name': 'firstName',
				'label': 'First Name',
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
			}
		]
	},
	
	permissions: {
		"adminAll": ['urac', '/admin/all', 'get'],
		'adminUser': {
			'list': ['urac', '/admin/listUsers', 'get'],
			'changeStatusAccess': ['urac', '/admin/changeUserStatus', 'get'],
			'editUser': ['urac', '/admin/editUser', 'post'],
			'addUser': ['urac', '/admin/addUser', 'post']
		},
		'adminGroup': {
			'list': ['urac', '/admin/group/list', 'get'],
			'add': ['urac', '/admin/group/add', 'post'],
			'edit': ['urac', '/admin/group/edit', 'post'],
			'delete': ['urac', '/admin/group/delete', 'delete'],
			'addUsers': ['urac', '/admin/group/addUsers', 'post']
		}
	}
};

var groupsConfig = {
	grid: {
		recordsPerPageArray: [5, 10, 50, 100],
		'columns': [
			{ 'label': "Code", 'field': 'code' },
			{ 'label': "Name", 'field': 'name' },
			{
				'label': "Description", 'field': 'description'
			}
		],
		'leftActions': [],
		'topActions': [],
		'defaultSortField': '',
		'defaultLimit': 10
	},
	form: {
		'name': '',
		'label': '',
		'actions': {},
		'entries': [
			{
				'name': 'code',
				'label': 'Code',
				'type': 'text',
				'placeholder': "Enter the Code of the group",
				'value': '',
				'tooltip': "Group codes are alphanumeric. Maximum length 20 characters",
				'required': true
			},
			{
				'name': 'name',
				'label': "Name",
				'type': 'text',
				'placeholder': "Enter the Name of the group",
				'value': '',
				'tooltip': '',
				'required': true
			},
			{
				'name': 'description',
				'label': "Description",
				'type': 'textarea',
				'rows': 2,
				'placeholder': "Enter the Description of the Group",
				'value': '',
				'tooltip': '',
				'required': true
			}
		]
	},
	users: {
		'name': '',
		'label': '',
		'msgs': {},
		'actions': {},
		'entries': [
			{
				'name': 'users',
				'label': "Users",
				'type': 'checkbox',
				'placeholder': '',
				'value': [],
				'tooltip': "Check to add user to group",
				'required': true
			}
		]
	}
};