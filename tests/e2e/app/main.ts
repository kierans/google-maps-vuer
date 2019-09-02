/*
 * File to be used with vue-cli serve to test integration with Google Maps
 */
import Vue from "vue";
import App from "./TestApp.vue";
import { GoogleMapVuer } from "@/GoogleMapVuer";

import API_KEY from "./api-key";

Vue.config.productionTip = false;
Vue.use(GoogleMapVuer, {
	apiKey: API_KEY
});

new Vue({
	render: (h) => h(App),
}).$mount("#app");
