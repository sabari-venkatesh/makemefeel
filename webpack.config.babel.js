import webpack from 'webpack';
import path from 'path';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import ExtractTextPlugin from 'extract-text-webpack-plugin';
import BrowserSyncPlugin from 'browser-sync-webpack-plugin';

const isProd = process.env.APP_ENV === 'prod';

const extractSass = new ExtractTextPlugin({
    filename: "css/[name].[contenthash].css",
});

module.exports = {
	context: path.resolve(__dirname, 'src'),
    devtool: (isProd ? 'source-map': 'eval-source-map'),
    devServer: {
		contentBase: path.join(__dirname, "dist"),
        hotOnly: true,
        port: 8008,
        watchContentBase: true,
    },
	entry: {
        app: './index.js'
    },    
    module: {
		rules: [
        	{
          		test: /\.js$/,
          		exclude: /node_modules/,
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
          		test: /\.(sass|scss)$/,
                exclude: /node_modules/,
	            use: extractSass.extract({
	                use: [{
	                    loader: "css-loader"
	                }, {
	                    loader: "sass-loader"
	                }],
	                // use style-loader in development
	                fallback: "style-loader",
                    publicPath: '../'
	            })
      		},
            {
                test: /\.css$/,
                include: /node_modules/,
                loader: extractSass.extract({
                    fallback: 'style-loader',
                    use: {
                        loader: 'css-loader',
                    },
                    publicPath: '../'
                }),
            },
            {
                test: /\.(png|jpg)$/,
                exclude: /node_modules/,
                loader: 'url-loader?limit=5000&name=img/img-[hash:6].[ext]',
            },
            {
                test: /\.html$/,
                loader: 'html-loader'
            }
    	]
    },
    output: {
		filename: 'js/[chunkhash].[name].js',
        path: path.resolve(__dirname, 'dist'),
        publicPath: '/'
    },
    plugins: [
    	extractSass,
        new HtmlWebpackPlugin({
            filename: 'index.html', //Name of file in ./dist/
            template: 'index.html', //Name of template in ./src
            hash: true,
            inject: 'body'
        }),
        new BrowserSyncPlugin({
            host: 'localhost',
            port: 3000,
            proxy: 'http://localhost:8008/',
        }, {
            reload: false
        })
    ]
}
