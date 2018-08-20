let navigation = [
	{
		"id": "home",
		"label": "home",
		"title": "SOAJS",
		"description": " page meta description",
		"keywords": "page meta keywords",
		"url": "/",
		"tplPath": "custom/modules/home/directives/main.html",
		"scripts": ["custom/modules/home/controller.js", "custom/modules/home/services/service.js"]
	},
	{
		"id": "product-anchor",
		"label": "Our Product",
		"title": "SOAJS | Our Product",
		"url": "/#product",
		"topMenu": true,
	},
	{
		"id": "why-anchor",
		"label": "Why Us",
		"title": "SOAJS | Why Us",
		"url": "/#why",
		"topMenu": true,
	},
	{
		"id": "contact-anchor",
		"label": "Contact Us",
		"title": "SOAJS | Contact Us",
		"url": "/#contact",
		"topMenu": true,
	},
	{
		"id": "store-anchor",
		"label": "Store",
		"url": "/store",
		"topMenu": true,
		"title": "SOAJS | Store",
		"description": " page meta description",
		"keywords": "page meta keywords",
		"tplPath": "custom/modules/store/directives/main.html",
		"scripts": ["custom/modules/store/controller.js"]
	},
	{
		"id": "member",
		"label": "Member Area",
		"url": "/member",
		"topMenu": true,
		"title": "SOAJS | Member Area",
		"description": " page meta description",
		"keywords": "page meta keywords",
		"tplPath": "custom/modules/member/directives/main.html",
		"scripts": ["custom/modules/member/controller.js"]
	}
];