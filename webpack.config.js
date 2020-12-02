module.exports = {
	// pwa: {
	// 	name: 'My App',
	// 	themeColor: '#4DBA87',
	// 	msTileColor: '#000000',
	// 	appleMobileWebAppCapable: 'yes',
	// 	appleMobileWebAppStatusBarStyle: 'black',

	// 	// configure the workbox plugin
	// 	workboxPluginMode: 'InjectManifest',
	// 	workboxOptions: {
	// 		// swSrc is required in InjectManifest mode.
	// 		swSrc: 'dev/sw.js',
	// 		// ...other Workbox options...
	// 	}
	// },
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