import { defineConfig, PluginOption } from 'vite';
import libCss from 'vite-plugin-libcss';

import react from '@vitejs/plugin-react-swc';

const path = require('path');

const plugins = Array<PluginOption | PluginOption[]>();

// add react support
plugins.push(react());

// add libCss support
// This plugin will inject css into bundled js file using import statement
plugins.push(libCss());

const isProduction = process.env.NODE_ENV === 'production';

// https://vitejs.dev/config/
export default defineConfig({
	plugins,
	resolve: {
		alias: [{ find: '@', replacement: path.resolve(__dirname, './src') }]
	},
	build: {
		lib: {
			entry: path.resolve(__dirname, 'src/index.ts'),
			name: 'index',
			fileName: 'index',
			formats: ['umd', 'es']
		},
		emptyOutDir: false,
		rollupOptions: {
			// make sure to externalize deps that shouldn't be bundled into your library
			external: ['react'],
			output: {
				// Provide global variables to use in the UMD build for externalized deps
				globals: {
					react: 'React'
				}
			}
		}
	},
	css: {
		devSourcemap: true
	}
});
