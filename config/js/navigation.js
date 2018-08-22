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
		"id": "store-anchor",
		"label": "Store",
		"url": "/store",
		"topMenu": true,
		"title": "SOAJS.IO | Store",
		"description": " page meta description",
		"keywords": "page meta keywords",
		"tplPath": "custom/modules/store/directives/main.html",
		"scripts": ["custom/modules/store/controller.js"]
	},
	{
		"id": "member-area",
		"label": "Member Area",
		"url": "#",
		"topMenu": true,
		"title": "SOAJS.IO | Member Area",
		"description": " page meta description",
		"keywords": "page meta keywords",
		"children": [
			{
				"label": "User Area",
				"entries": [
					{
						"id": "member-join",
						"label": "Join",
						"url": "/join",
						"topMenu": true,
                        "title": "SOAJS.IO | Join",
						"tplPath": "custom/modules/member/directives/main.html",
						"scripts": ["custom/modules/member/controller.js"],
					},
					{
						"id": "member-login",
						"label": "Login",
						"url": "/login",
						"topMenu": true,
						"title": "SOAJS.IO | Login",
						"tplPath": "custom/modules/member/directives/main.html",
						"scripts": ["custom/modules/member/controller.js"],
					}
				]
			},
			{
				"label": "Billing Area",
				"entries": [
					{
						"id": "member-billing-area",
						"label": "My Billing",
						"url": "/member-billing",
						"topMenu": true,
						"title": "SOAJS.IO | Billing",
						"tplPath": "custom/modules/member/directives/main.html",
						"scripts": ["custom/modules/member/controller.js"],
					}
				]
			}
		]
	}
];