import webpack from 'webpack';
import path from 'path';
import ExtractTextPlugin from 'extract-text-webpack-plugin';

const extractSass = new ExtractTextPlugin({
    filename: "css/[name].[contenthash].css",
    disable: process.env.NODE_ENV === "development"
})


module.exports = {
	context: path.resolve(__dirname, 'src'),
	entry: './index',
	output: {
		path: path.resolve(__dirname, 'dist'),
      	filename: 'js/[name].js'
    },
    devServer: {
		contentBase: path.join(__dirname, "dist"),
      	watchContentBase: true
    },
    module: {
		rules: [
        	{
          		test: /\.js$/,
          		include: path.resolve(__dirname, 'src/scripts'),
				use: [
					{
				  		loader: 'babel-loader',
				  		options: {
				    		cacheDirectory: true,
				  		}
					}
          		]
        	},

        	{
          		test: /\.scss$/,
	            use: extractSass.extract({
	                use: [{
	                    loader: "css-loader"
	                }, {
	                    loader: "sass-loader"
	                }],
	                // use style-loader in development
	                fallback: "style-loader"
	            })
      		},
    	]
    }, 

    plugins: [
    	extractSass
    ]
}