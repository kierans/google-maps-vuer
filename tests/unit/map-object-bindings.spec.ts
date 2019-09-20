import Q from "q";
import { VueConstructor } from "vue";

import { createLocalVue, shallowMount } from "@vue/test-utils";
import { assertThat, is } from "hamjest";
import * as sinon from "sinon";

import { MVCObjectPolyfill } from "./google-map-stubs";
import GoogleMapComponent from "@/components/GoogleMapComponent";
import { bindComponentToMapObject, createMapObjectBinding } from "@/components/MapObjectBindings";
import { Vue } from "vue-property-decorator";

interface DeferredComponent {
	resolve(value: google.maps.MVCObject): void;
}

type DeferredComponentInstance = Vue & GoogleMapComponent<any> & DeferredComponent;

const mapEventListener: google.maps.MapsEventListener = {
	remove(): void {
		// do nothing
	}
};

describe("MapObjectBindings", function() {
	describe("create map object binding", function() {
		it("should create default binding", function() {
			const name = "center";
			const binding = createMapObjectBinding(name);

			assertThat(binding.name, is(name));
			assertThat(binding.getter, is("getCenter"));
			assertThat(binding.setter, is("setCenter"));
		});

		it("should use args", function() {
			const name = "center";
			const getter = "GET_CENTER";
			const setter = "SET_CENTER";
			const binding = createMapObjectBinding(name, getter, setter);

			assertThat(binding.name, is(name));
			assertThat(binding.getter, is(getter));
			assertThat(binding.setter, is(setter));
		});
	});

	it("should store map object event registration", async function() {
		const events = [ "event" ];

		const vue: VueConstructor = createDeferredComponent(bindComponentToMapObject([], events, []));

		const vm: DeferredComponentInstance = shallowMount(vue, createLocalVue()).vm as DeferredComponentInstance;
		vm.resolve(new MVCObjectPolyfill() as unknown as google.maps.MVCObject);

		await vm.getMapObject();

		assertThat(vm.$data.subscriptions.length, is(1));
	});

	it("should store prop change event registration", async function() {
		const props = [ createMapObjectBinding("prop") ];

		const vue: VueConstructor = createDeferredComponent(bindComponentToMapObject(props, [], []));

		const vm: DeferredComponentInstance = shallowMount(vue, createLocalVue()).vm as DeferredComponentInstance;
		vm.resolve(new MVCObjectPolyfill() as unknown as google.maps.MVCObject);

		await vm.getMapObject();

		assertThat(vm.$data.subscriptions.length, is(1));
	});

	it("should not register for changed event when no getter", async function() {
		const props = [ createMapObjectBinding("prop", null) ];

		const vue: VueConstructor = createDeferredComponent(bindComponentToMapObject(props, [], []));

		const vm: DeferredComponentInstance = shallowMount(vue, createLocalVue()).vm as DeferredComponentInstance;
		vm.resolve(new MVCObjectPolyfill() as unknown as google.maps.MVCObject);

		await vm.getMapObject();

		assertThat(vm.$data.subscriptions.length, is(0));
	});

	it("should remove subscriptions on component destroy", async function() {
		const stub = sinon.stub(mapEventListener, "remove");

		const vue: VueConstructor = createDeferredComponent(bindComponentToMapObject([], [], []));

		const wrapper = shallowMount(vue, createLocalVue());
		const vm: DeferredComponentInstance = wrapper.vm as DeferredComponentInstance;
		vm.$data.subscriptions.push(mapEventListener);

		wrapper.destroy();

		try {
			assertThat(stub.calledOnce, is(true));
		}
		finally {
			stub.restore();
		}
	});
});

function createDeferredComponent(component: VueConstructor): VueConstructor {
	return Vue.extend({
		data() {
			return {
				deferred: Q.defer()
			};
		},
		template: "<div></div>",
		mixins: [ component ],
		methods: {
			getMapObject(): Q.Promise<any> {
				return this.$data.deferred.promise;
			},
			resolve(value: google.maps.MVCObject) {
				this.$data.deferred.resolve(value);
			}
		} as Vue & GoogleMapComponent<any> & DeferredComponent
	});
}
