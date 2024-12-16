import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
	css: {
		preprocessorOptions: {
			scss: {
				api: 'modern-compiler',
			},
		},
	},
	plugins: [react()],
	base: '',
	resolve: {
		alias: {
			components: '/src/components',
			assets: '/src/assets',
			types: '/src/types',
			constants: '/src/constants',
			helpers: '/src/helpers',
			feature: '/src/feature',
			hooks: '/src/hooks',
		},
	},
	build: {
		rollupOptions: {
			output: {
				assetFileNames: (assetInfo) => {
					let extType = assetInfo.name?.split('.').at(1);
					if (extType && /webp|jpe?g|svg|gif|tiff|bmp|ico|mp4/i.test(extType)) {
						extType = 'img';
					}
					return `assets/${extType}/[name]-[hash][extname]`;
				},
				chunkFileNames: 'assets/js/[name]-[hash].js',
				entryFileNames: 'assets/js/[name]-[hash].js',
			},
		},
	},
});
