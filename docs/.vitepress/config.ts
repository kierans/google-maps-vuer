import vuetify from "vite-plugin-vuetify";

import { defineConfig } from 'vitepress'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  outDir: "./dist",
  srcDir: "./src",
  title: "Google Maps Vuer",
  description: "A Vue component to use Google Maps.",
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    nav: [
      { text: 'Home', link: '/' },
      { text: 'Examples', link: '/markdown-examples' }
    ],

    sidebar: [
      {
        text: 'Examples',
        items: [
          { text: 'Markdown Examples', link: '/markdown-examples' },
          { text: 'Runtime API Examples', link: '/api-examples' }
        ]
      }
    ],

    socialLinks: [
      { icon: 'github', link: 'https://github.com/vuejs/vitepress' }
    ]
  },

  /*
   * This config is merged with the default VitePress Vite configuration.
   * The merging is deep and additive for most fields
   */
  vite: {
    /*
     * This array is combined with the default; which is why vue() is not used here.
     */
    plugins: [
      vuetify()
    ],
    server: {
      port: 8080
    }
  }
})
