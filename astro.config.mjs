// @ts-check

import starlight from "@astrojs/starlight";
import { defineConfig } from "astro/config";
import starlightBlog from "starlight-blog";
import starlightThemeFlexoki from "starlight-theme-flexoki";

// https://astro.build/config
export default defineConfig({
	site: "https://crnvl96.dev",
	integrations: [
		starlight({
			plugins: [
				starlightBlog({
					title: "thoughts",
					authors: {
						crnvl96: {
							name: "Adran Carnavale",
							title: "Full stack programmer",
							picture: "https://avatars.githubusercontent.com/u/84354013?v=4",
							url: "mailto:adran@hey.com",
						},
					},
				}),
				starlightThemeFlexoki(),
			],
			title: "Crnvl96",
			logo: {
				light: "./src/assets/light-logo.svg",
				dark: "./src/assets/dark-logo.svg",
				replacesTitle: true,
			},
			social: [
				{
					icon: "github",
					label: "GitHub",
					href: "https://github.com/crnvl96",
				},
			],
		}),
	],
});
