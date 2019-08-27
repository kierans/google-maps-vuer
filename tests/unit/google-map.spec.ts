import { VueConstructor } from "vue/types/vue";

import { createLocalVue, shallowMount } from "@vue/test-utils";
import { assertThat, defined, greaterThan, is, matchesPattern } from "hamjest";

import GoogleMap from "@/components/GoogleMap.vue";

import "./google-map-stubs";

const VERSION = "1.2.3";

describe("GoogleMap.vue", () => {
	let vue: VueConstructor;

	beforeEach(function() {
		vue = createLocalVue();
		vue.prototype.$maps = {
			version: VERSION
		};
	});

	describe("component initialisation", function() {
		it("should render an id tag", function() {
			const wrapper = shallowMount(GoogleMap, { localVue: vue });

			assertThat(wrapper.find("div").attributes().id, is(defined()));
			assertThat(wrapper.find("div").attributes().id, matchesPattern(/gmv-\d+/));
		});

		it("should render given id tag", function() {
			const wrapper = shallowMount(GoogleMap, {
				localVue: vue,
				propsData: {
					id: "maps"
				}
			});

			assertThat(wrapper.find("div#maps").exists(), is(true));
			assertThat(wrapper.find("div#maps").classes().indexOf("google-map-container"), is(greaterThan(-1)));
		});

		it("should render GM API version", function() {
			const wrapper = shallowMount(GoogleMap, { localVue: vue });

			assertThat(wrapper.find("div").attributes()["data-google-maps-version"], is(defined()));
			assertThat(wrapper.find("div").attributes()["data-google-maps-version"], is(VERSION));
		});

		it("should create a Google Map", function() {
			const wrapper = shallowMount(GoogleMap, { localVue: vue });

			assertThat(wrapper.vm.$data.map, is(defined()));
		});
	});
});
