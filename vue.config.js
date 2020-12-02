module.exports = {
	pwa: {
		name: 'My App',
		themeColor: '#4DBA87',
		msTileColor: '#000000',
		appleMobileWebAppCapable: 'yes',
		appleMobileWebAppStatusBarStyle: 'black',
		iconPaths: {
			// favicon32: 'img/icons/favicon-32x32.png',
			// favicon16: 'img/icons/favicon-16x16.png',
			// appleTouchIcon: 'img/icons/apple-touch-icon-152x152.png',
			// maskIcon: 'img/icons/safari-pinned-tab.svg',
			// msTileImage: 'img/icons/msapplication-icon-144x144.png'
			favicon32: 'img/icons/favicon.ico',
			favicon16: 'img/icons/favicon.ico',
			appleTouchIcon: 'img/icons/favicon.ico',
			maskIcon: 'img/icons/favicon.ico',
			msTileImage: 'img/icons/favicon.ico'
		},

		// configure the workbox plugin
		workboxPluginMode: 'InjectManifest',
		// workboxOptions: {
		// 	// swSrc is required in InjectManifest mode.
		// 	swSrc: 'dev/sw.js',
		// 	// ...other Workbox options...
		// }
	},
}