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
			favicon32: 'favicon.ico',
			favicon16: 'favicon.ico',
			appleTouchIcon: 'favicon.ico',
			maskIcon: 'favicon.ico',
			msTileImage: 'favicon.ico'
		},

		// configure the workbox plugin
		workboxPluginMode: 'InjectManifest',
		workboxOptions: {
			// swSrc is required in InjectManifest mode.
			swSrc: 'dev/sw.js',
			// ...other Workbox options...
		}
	},
	module: {
		rules: [
			// ... other rules omitted

			// this will apply to both plain `.scss` files
			// AND `<style lang="scss">` blocks in `.vue` files
			{
				test: /\.scss$/,
				// use: [
				// 	'vue-style-loader',
				// 	'css-loader',
				// 	'sass-loader'
				// ]
				// 
				use: [
					{
						loader: 'vue-style-loader',
					},
					{
						loader: 'css-loader',
						options: {
							sourceMap: true
						}
					},
					{
						loader: 'resolve-url-loader'
					},
					{
						loader: 'sass-loader',
						options: {
							sourceMap: true,
							sourceMapContents: false
						}
					},
					{
						loader: 'file-loader',
						options: {
							name: '[path][name].[ext]',
						}
					}

				]
				// 
			}
		]
	},
	// plugin omitted
}