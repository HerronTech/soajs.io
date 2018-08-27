let navigation = [
	{
		"id": "home",
		"label": "home",
		"title": "SOAJS.IO - Enterprise Microservices Management Platform-as-a-Service",
		"description": " page meta description",
		"keywords": "page meta keywords",
		"url": "/",
		"tplPath": "custom/modules/home/directives/main.html",
		"scripts": ["custom/modules/home/controller.js", "custom/modules/home/services/service.js"]
	},
	{
		"id": "product-anchor",
		"label": "Our Product",
		"title": "SOAJS.IO | Our Product",
		"url": "/#product",
		"topMenu": true,
	},
	{
		"id": "why-anchor",
		"label": "Why Us",
		"title": "SOAJS.IO | Why Us",
		"url": "/#why",
		"topMenu": true,
	},
	/*
	 {
	 "id": "contact-anchor",
	 "label": "Contact Us",
	 "title": "SOAJS | Contact Us",
	 "url": "/#contact",
	 "topMenu": true,
	 },
	 */
	{
		"id": "terms",
		"label": "Terms & Conditions",
		"url": "/legal/terms",
		"title": "SOAJS.IO | Terms & Conditions",
		"tplPath": "custom/modules/legal/directives/terms.tmpl",
		"scripts": ["custom/modules/legal/controller.js"]
	},
	{
		"id": "disclaimer",
		"label": "Legal Disclaimer",
		"url": "/legal/disclaimer",
		"title": "SOAJS.IO | Legal Disclaimer",
		"tplPath": "custom/modules/legal/directives/disclaimer.tmpl",
		"scripts": ["custom/modules/legal/controller.js"]
	},
	{
		"id": "privacy",
		"label": "Privacy Policy",
		"url": "/legal/privacy",
		"title": "SOAJS.IO | Privacy Policy",
		"tplPath": "custom/modules/legal/directives/privacy.tmpl",
		"scripts": ["custom/modules/legal/controller.js"]
	},
	{
		"id": "store-anchor",
		"label": "Store",
		"url": "/store",
		"topMenu": true,
		"title": "SOAJS.IO | Store",
		"tplPath": "custom/modules/store/directives/main.html",
		"scripts": ["custom/modules/store/controller.js", "custom/modules/store/services/store.js"]
	},
	{
		"id": "store-ci-anchor",
		"label": "Continuous Integration Recipes",
		"url": "/store/ci",
		"title": "SOAJS.IO | Continuous Integration Recipes",
		"tplPath": "custom/modules/store/directives/ci.html",
		"scripts": ["custom/modules/store/controller.js", "custom/modules/store/services/store.js"]
	},
	{
		"id": "store-catalogs-anchor",
		"label": "Catalog Deployment Recipes",
		"url": "/store/catalogs",
		"title": "SOAJS.IO | Catalog Deployment Recipes",
		"tplPath": "custom/modules/store/directives/catalogs.html",
		"scripts": ["custom/modules/store/controller.js", "custom/modules/store/services/store.js"]
	},
	{
		"id": "store-envtmpl-anchor",
		"label": "Environment Templates",
		"url": "/store/env",
		"title": "SOAJS.IO | Environment Templates",
		"tplPath": "custom/modules/store/directives/env.html",
		"scripts": ["custom/modules/store/controller.js", "custom/modules/store/services/store.js"]
	},
	{
		"id": "store-iac-anchor",
		"label": "Infra as Code Templates",
		"url": "/store/iac",
		"title": "SOAJS.IO | Infra as Code Templates",
		"tplPath": "custom/modules/store/directives/iac.html",
		"scripts": ["custom/modules/store/controller.js", "custom/modules/store/services/store.js"]
	},
	
	{
		"id": "forget-pw",
		"url": "/forgetPw",
		"title": "SOAJS.IO | Password",
		"tplPath": "custom/modules/member/login/directives/forgetPw.html",
		"scripts": [
			"custom/modules/member/login/config.js",
			"custom/modules/member/login/controller.js"
		],
	},
	{
		"id": "addProject",
		"label": "Add Project",
		"url": "/member/project/add",
		"title": "SOAJS.IO | Add Project",
		"tplPath": "custom/modules/member/project/directives/add.html",
		"scripts": ["custom/modules/member/project/controller.js"],
	},
	{
		"id": "member-area-login",
		"label": "Member Area",
		"url": "/member/login",
		"topMenu": true,
		"title": "SOAJS.IO | Login to Member Area",
		"tplPath": "custom/modules/member/login/directives/main.html",
		"scripts": ["custom/modules/member/login/controller.js"],
	},
	{
		"id": "member-area",
		"label": "Member Area",
		"url": "#",
		"topMenu": false,
		"title": "SOAJS.IO | Member Area",
		"children": [
			{
				"label": "",
				"id": "user-area",
				"entries": [
					{
						"id": "profile",
						"label": "Profile",
						"url": "/member/profile",
						"topMenu": true,
						"title": "SOAJS.IO | Profile",
						"tplPath": "custom/modules/member/account/directives/profile.html",
						"scripts": ["custom/modules/member/account/controller.js"],
					},
					{
						"id": "member-logout",
						"label": "Logout",
						"url": "/logout",
						"topMenu": true,
						"title": "SOAJS.IO | Login",
						"tplPath": "custom/modules/member/login/directives/logout.html",
						"scripts": ["custom/modules/member/login/controller.js"],
					}
				]
			},
			{
				"label": "",
				"id": "user-projects",
				"entries": [
					{
						"id": "projects",
						"label": "My Projects",
						"url": "/member/projects",
						"topMenu": true,
						"title": "SOAJS.IO | Projects",
						"tplPath": "custom/modules/member/project/directives/list.html",
						"scripts": [
							"custom/modules/member/config.js",
							"custom/modules/member/project/controller.js"
						]
					},
					{
						"id": "chart",
						"label": "My Organization",
						"url": "/member/orgChart",
						"topMenu": true,
						"title": "SOAJS.IO | Chart",
						"tplPath": "custom/modules/member/account/directives/orgChart.html",
						"scripts": [
							"custom/modules/member/config.js",
							"custom/modules/member/account/services/groups.js",
							"custom/modules/member/account/services/members.js",
							"custom/modules/member/account/controller.js"
						]
					}
				]
			}
		]
	}
];