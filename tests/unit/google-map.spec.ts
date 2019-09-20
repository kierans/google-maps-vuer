/* tslint:disable:max-classes-per-file */

import { VueConstructor } from "vue/types/vue";
import { Component, Inject, Vue } from "vue-property-decorator";

import { createLocalVue, mount, shallowMount } from "@vue/test-utils";
import { assertThat, defined, greaterThan, is, matchesPattern } from "hamjest";
import { generateComponentBindingTests, MapObjectBindingData } from "./google-map-binding-tests";
import "./google-map-stubs";

import GoogleMap from "@/components/GoogleMap.vue";
import Q from "q";
import { createMapObjectBinding, MabObjectBindingDefinition } from "@/components/MapObjectBindings";

const VERSION = "1.2.3";

describe("GoogleMap.vue", function() {
	let vue: VueConstructor;

	beforeEach(function() {
		vue = createNewVue();
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

		it("should create a Google Map deferral", function() {
			const wrapper = shallowMount(GoogleMap, { localVue: vue });

			assertThat(wrapper.vm.$data.mapObject, is(defined()));
		});
	});

	describe("being a parent", function() {
		it("should provide map for injection into child components", function() {
			// @ts-ignore
			const wrapper = mount(TestComponent, {
				localVue: createNewVue(),
				components: {
					GoogleMap,
					ChildComponent
				}
			});

			assertThat("injection failed", (wrapper.vm.$refs.childComponent as ChildComponent).getMap, is(defined()));
		});
	});

	const mapBindingData = {
		component: GoogleMap,
		objectClassName: "google.maps.Map",
		props: givenProps(),
		events: [
			"click", "dblclick", "drag", "dragend", "dragstart", "idle", "mousemove", "mouseout", "mouseover", "rightclick",
			"tilesloaded"
		],
		methods: [
			"fitBounds", "panBy", "panTo", "panToBounds",
		]
	} as MapObjectBindingData<google.maps.Map>;

	generateComponentBindingTests(mapBindingData, createNewVue);
});

function createNewVue(): VueConstructor {
	const vue = createLocalVue();
	vue.prototype.$maps = {
		version: VERSION
	};

	return vue;
}

function givenProps(): MabObjectBindingDefinition[] {
	const props = [ "center", "clickableIcons", "heading", "mapTypeId", "streetView", "tilt", "zoom" ]
		.map((prop: string) => createMapObjectBinding(prop));

	props.push(createMapObjectBinding("options", null));

	return props;
}

@Component({
	template: "<google-map><child-component ref=\"childComponent\"></child-component></google-map>"
})
class TestComponent extends Vue {
}

@Component({
	template: "<div></div>"
})
class ChildComponent extends Vue {
	@Inject()
	public readonly getMap!: () => Q.Promise<google.maps.Map>;
}
