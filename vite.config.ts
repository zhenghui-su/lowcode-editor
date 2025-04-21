import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import viteCompression from 'vite-plugin-compression';
import cdn from 'vite-plugin-cdn-import';

// https://vite.dev/config/
export default defineConfig({
	// build: {
	// 	rollupOptions: {
	// 		output: {
	// 			manualChunks: {
	// 				antd_icons: ['@ant-design/icons'],
	// 				monaco_editor: ['@monaco-editor/react', 'monaco-editor'],
	// 				react_dnd: ['react-dnd', 'react-dnd-html5-backend'],
	// 				hook: ['ahooks', 'react-use'],
	// 			},
	// 		},
	// 	},
	// },
	plugins: [
		react(),
		// viteCompression(),
		// cdn({
		// 	modules: [
		// 		{
		// 			name: 'echarts',
		// 			var: 'echarts',
		// 			path: 'https://cdn.jsdelivr.net/npm/echarts@5.6.0/dist/echarts.min.js',
		// 		},
		// 		{
		// 			name: 'vchart',
		// 			var: '@visactor/vchart',
		// 			path: 'https://cdn.jsdelivr.net/npm/@visactor/vchart@1.13.9/esm/index.min.js',
		// 		},
		// 		{
		// 			name: 'vmind',
		// 			var: '@visactor/vmind',
		// 			path: 'https://cdn.jsdelivr.net/npm/@visactor/vmind@2.0.5/esm/index.min.js',
		// 		},
		// 	],
		// }),
	],
	server: {
		proxy: {
			'/data-gl': {
				target: 'https://echarts.apache.org/examples',
				changeOrigin: true,
			},
		},
	},
});
