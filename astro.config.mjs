// @ts-check

import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import { defineConfig, fontProviders } from 'astro/config';

// https://astro.build/config
export default defineConfig({
	site: 'https://stavshamir.github.io',
	integrations: [mdx(), sitemap()],
	// Post URLs from the old Jekyll site.
	redirects: {
		'/blog': '/',
		'/python/dockerizing-a-flask-mysql-app-with-docker-compose':
			'/blog/dockerizing-a-flask-mysql-app-with-docker-compose/',
		'/python/making-your-c-library-callable-from-python-by-wrapping-it-with-cython':
			'/blog/making-your-c-library-callable-from-python-by-wrapping-it-with-cython/',
		'/python/the-other-benefit-of-python-type-annotations':
			'/blog/the-other-benefit-of-python-type-annotations/',
	},
	fonts: [
		{
			provider: fontProviders.local(),
			name: 'Atkinson',
			cssVariable: '--font-atkinson',
			fallbacks: ['sans-serif'],
			options: {
				variants: [
					{
						src: ['./src/assets/fonts/atkinson-regular.woff'],
						weight: 400,
						style: 'normal',
						display: 'swap',
					},
					{
						src: ['./src/assets/fonts/atkinson-bold.woff'],
						weight: 700,
						style: 'normal',
						display: 'swap',
					},
				],
			},
		},
	],
});
