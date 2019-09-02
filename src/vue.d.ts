/**
 * Extends interfaces in Vue.js
 */

import { GoogleMapsAPI } from "@/GoogleMapVuer";

// noinspection ES6UnusedImports
import Vue from "vue";

declare module "vue/types/vue" {
	interface VueConstructor {
		/** Resolves when the API is loaded into the window */
		googleMaps: Promise<GoogleMapsAPI>;
	}

	interface Vue {
		/** API data resolved from {@link VueConstructor.googleMaps} */
		$maps: GoogleMapsAPI;
	}
}
