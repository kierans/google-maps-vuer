/**
 * Extends interfaces in Vue.js
 */

// noinspection ES6UnusedImports
import Vue from "vue";

declare module "vue/types/vue" {
	interface Vue {
		$maps: any;
	}
}
