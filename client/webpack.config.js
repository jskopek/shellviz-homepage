const path = require('path');

module.exports = {
    entry: {
        shellviz: './shellviz.js'
    },
    output: {
        path: path.resolve(__dirname, '..', 'static'),
        filename: '[name].bundle.js'
	},
	module: {
		rules: [
		{
			test: /\.js$/,
			exclude: [/node_modules/],
			use: [{
				loader: 'babel-loader',
				options: { presets: ['es2015'] },
			}],
		},
        {
            test: /\.scss$/,
            exclude: [/node_modules/],
            use: [{
                loader: 'style-loader' // creates style nodes from js strings
            }, {
                loader: 'css-loader' // translates css into commonjs
            }, {
                loader: 'sass-loader' // compile sass to css
            }]
        },
        {
            test: /\.css$/,
            exclude: [/node_modules/],
            use: [{
                loader: 'style-loader' // creates style nodes from js strings
            }, {
                loader: 'css-loader' // translates css into commonjs
            }]
        },
        { test: /\.(png|woff|woff2|eot|ttf|svg)$/, loader: 'url-loader?limit=100000' }  // https://github.com/webpack-contrib/css-loader/issues/38
		// Loaders for other file types can go here
		],
	},
    watch: true
};
