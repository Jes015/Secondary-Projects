/** @type {import('tailwindcss').Config} */
module.exports = {
	content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
	theme: {
		colors: {
			'links': '#4589ee',
			'backgroundbody': '#0f0f0f',
			'backgroundmain': '#222',
			'backgroundinput': '#222',
			'textColor': '#efefef',
			'border': '#444',
			'focus-highlight': '#888',
			'shadow-color': '#bebebe',
			'table-highlight': '#222',
		},
		extend: {},
	},
	plugins: [],
}
