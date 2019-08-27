/**
 * Extends interfaces in Vue.js
 */

import { GoogleMapsAPI } from "@/components/GoogleMapVuer";

// noinspection ES6UnusedImports
import Vue from "vue";

declare module "vue/types/vue" {
	interface Vue {
		$maps: GoogleMapsAPI;
	}
}
