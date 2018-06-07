/**
* created by chengshun on 2017/11/12
*/
const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin'); //css 单独打包
const CleanWebpackPlugin = require('clean-webpack-plugin');
const merge = require('webpack-merge');
const env = process.env.npm_lifecycle_event;
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

const base = {
	entry: {
		app: './src/js/index.jsx'
	},
	module: {
		rules: [
			{
				test: /\.(jsx|js)?$/,
				exclude: /(node_modules)/,
				use: {
					loader: 'babel-loader'
				}
			},
			{
				test: /\.(css)/,
				use: [{
					loader: 'css-loader',
					options: {
						minimize: true
					}
				}]
			},
			{
				test: /\.less$/,
				use: ExtractTextPlugin.extract({
					use: [
						{
							loader: 'css-loader'
						},
						{
							loader: 'less-loader',
							options: {modifyVars: '#F505050;'}
						}
					],
					fallback: 'style-loader'
				})
			},
			{
				test: /\.(gif|png|jpe?g|svg)$/i,
				exclude: /node_modules/,
				use: ['file-loader', //image hash
					{
						loader: 'image-webpack-loader', //image zip
						query: {
							pngquant: {
								quality: '65-90',
								speed: 4
							},
							mozjpeg: {
								quality: 65,
								progressive: true
							}
						}
					}
				]
			},
			{
				test: /\.(woff|woff2|ttf|eot|svg|otf)/,
				use: ['url-loader'],
				exclude: [/node_modules/]
			}
		]
	},
	plugins: [
		new ExtractTextPlugin({filename: 'css/[name].css', disable: false, allChunks: true})
	],
	resolve: {
		alias: {
			'src': path.resolve(__dirname, 'src'),
			'components': path.resolve(__dirname, 'src/js/components'),
			'pages': path.resolve(__dirname, 'src/js/pages'),
			'css': path.resolve(__dirname, 'src/css'),
			'utils': path.resolve(__dirname, 'src/js/utils')
		},
		extensions: ['.js', '.jsx', '.less', '.css', '.json']
	}
}

//dev config
if (env === 'start' || env === 'dev') {
	module.exports = merge(base, {
		devtool: 'eval-source-map',
		output: {
			path: path.join(__dirname, 'dist'),
			publicPath: 'http://localhost:8000/',
			filename: '[name].js',
			chunkFilename: '[name].chunk.js'
		},
		plugins: [
			new webpack.HotModuleReplacementPlugin(), //热替换
			new webpack.DefinePlugin({
				'process.env.NODE_ENV': '"development"'
			}),
			new HtmlWebpackPlugin({
				template: path.resolve(__dirname, './template/devApp.html')
			}),
			new webpack.SourceMapDevToolPlugin({
				filename: '[file].map',
				columns: false
			})
		],
		devServer: {
			proxy: {
				//"/api": "http://cn-api.jtcool.com", 
				  "/api": {
				  	target: "http://api.bitdad.com",
				  	changeOrigin: true
				  }
			},
			historyApiFallback: true
		}
	})
}

//production
if (env === 'build_dev') {
    module.exports = merge(base, {
        output: {
            path: path.resolve(__dirname, './dev/'), 
            publicPath: '//cn-cdn.jtcool.com/dev/', 
            filename: '[name].js',
            chunkFilename: '[name].chunk.js'
        },
        plugins: [
            new CleanWebpackPlugin(['./dev/']), 
            new webpack.DefinePlugin({
                'process.env': {
                    NODE_ENV: JSON.stringify('development')
                }
            }),
            new webpack.IgnorePlugin(/^\.\/locale$/,/moment/),
            new webpack.optimize.CommonsChunkPlugin({
                name: 'vendor',
                filename: 'vendor.js', 
                minChunks(module){
                    if (module.resource && (/^.*\.(css|scss)$/).test(module.resource)){
                        return false
                    }
                    return module.context && module.context.indexOf('node_modules') >= 0;
                }
            }),
            // new HtmlWebpackPlugin({
            // 	title: 'OTC',
            //     filename: path.resolve(__dirname, '../application/views/home/index.html'),
            //     template: path.resolve(__dirname, './template/app.html')
            // }),
            new webpack.optimize.UglifyJsPlugin({
                beautify: false,
                comments: false,
                sourceMap: false,
                mangle: false,
                compress: {
                    warnings: false,
                    collapse_vars: true,
                    reduce_vars: true
                }
            })
        ]
    })
}

//build with cdn
if (env === 'build_cdn') {
    module.exports = merge(base, {
        output: { 
            path: path.resolve(__dirname, './static/'),
            publicPath: '//cn-cdn.jtcool.com/www/static/',   
            filename: '[name].js',
            chunkFilename: '[name].chunk.js'
        },
        plugins: [
            new CleanWebpackPlugin(['./static/']),
            new webpack.DefinePlugin({
                'process.env': {
                    NODE_ENV: JSON.stringify('production')
                }
            }),
            new webpack.IgnorePlugin(/^\.\/locale$/,/moment/),
            new webpack.optimize.CommonsChunkPlugin({
                name: 'vendor',
                filename: 'vendor.js',
                minChunks(module){
                    if (module.resource && (/^.*\.(css|scss)$/).test(module.resource)){
                        return false
                    }
                    return module.context && module.context.indexOf('node_modules') >= 0;
                }
            }),
            // new HtmlWebpackPlugin({
            // 	title: 'OTC',
            //     filename: path.resolve(__dirname, '../application/views/home/index.html'),
            //     template: path.resolve(__dirname, './template/app.html')
            // }),
            new webpack.optimize.UglifyJsPlugin({
                beautify: false,
                comments: false,
                sourceMap: false,
                mangle: false,
                compress: {
                    warnings: false,
                    collapse_vars: true,
                    reduce_vars: true
                }
            })
        ]
    })
}
