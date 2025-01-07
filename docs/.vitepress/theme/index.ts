import DefaultTheme from "vitepress/theme";
import vuetify from "../plugins/vuetify";

export default {
  ...DefaultTheme,
  enhanceApp({ app }) {
    app.use(vuetify);
  },
};
