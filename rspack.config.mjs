import { dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { defineConfig } from "@rspack/cli";
import { rspack } from "@rspack/core";
import { ReactRefreshRspackPlugin } from "@rspack/plugin-react-refresh";

const __dirname = dirname(fileURLToPath(import.meta.url));
const isDev = process.env.NODE_ENV === "development";

// Target browsers, see: https://github.com/browserslist/browserslist
const targets = ["last 2 versions", "> 0.2%", "not dead", "Firefox ESR"];

export default defineConfig({
	context: __dirname,
	entry: {
		main: "./src/main.jsx"
	},
	resolve: {
		extensions: ["...", ".ts", ".tsx", ".jsx"] // .js está cubierto por "..."
	},
	module: {
		rules: [
			{
				// Regla para imágenes y SVGs
				test: /\.(png|jpg|jpeg|gif|svg|webp)$/i,
				type: "asset/resource", // Copia el archivo a la carpeta de salida y exporta la URL
			},
			{
				// Regla para videos y audio
				test: /\.(mp4|webm|ogg|mp3|wav|flac|aac)$/i,
				type: "asset/resource", // Copia el archivo a la carpeta de salida y exporta la URL
			},
			{
				// Regla para fuentes (si las usas localmente)
				test: /\.(woff|woff2|eot|ttf|otf)$/i,
				type: "asset/resource",
			},
			{
				test: /\.(jsx?|tsx?)$/,
				exclude: /node_modules/,
				use: [
					{
						loader: "builtin:swc-loader",
						options: {
							jsc: {
								parser: {
									syntax: "typescript",
									tsx: true
								},
								transform: {
									react: {
										runtime: "automatic",
										development: isDev,
										refresh: isDev
									}
								}
							},
							env: { targets }
						}
					}
				]
			},
			{
				// Regla CSS CORREGIDA para Tailwind
				test: /\.css$/,
				use: [
					{
						loader: 'postcss-loader',
					}
				],
				type: 'css',
			}
		]
	},
	plugins: [
		new rspack.HtmlRspackPlugin({
			template: "./index.html"
		}),
		isDev ? new ReactRefreshRspackPlugin() : null
	].filter(Boolean),
	optimization: {
		minimizer: [
			new rspack.SwcJsMinimizerRspackPlugin(),
			new rspack.LightningCssMinimizerRspackPlugin({
				minimizerOptions: { targets }
			})
		]
	},
	experiments: {
		css: true
	},
	devServer: {
		hot: true,
		port: 8080,
		historyApiFallback: true,
		static: {
			directory: './', // Servir estáticos desde la raíz
		},
	}
});
