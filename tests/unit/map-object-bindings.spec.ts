import Q from "q";
import { VueConstructor } from "vue";

import { createLocalVue, shallowMount } from "@vue/test-utils";
import { assertThat, is } from "hamjest";
import * as sinon from "sinon";

import { MVCObjectPolyfill } from "./google-map-stubs";
import GoogleMapComponent from "@/components/GoogleMapComponent";
import { bindComponentToMapObject } from "@/components/MapObjectBindings";
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
	it("should store map object event registration", async function() {
		const events = [ "event" ];

		const vue: VueConstructor = createDeferredComponent(bindComponentToMapObject([], events, []));

		const vm: DeferredComponentInstance = shallowMount(vue, createLocalVue()).vm as DeferredComponentInstance;
		vm.resolve(new MVCObjectPolyfill() as unknown as google.maps.MVCObject);

		await vm.getMapObject();

		assertThat(vm.$data.subscriptions.length, is(1));
	});

	it("should store prop change event registration", async function() {
		const props = [ "prop" ];

		const vue: VueConstructor = createDeferredComponent(bindComponentToMapObject(props, [], []));

		const vm: DeferredComponentInstance = shallowMount(vue, createLocalVue()).vm as DeferredComponentInstance;
		vm.resolve(new MVCObjectPolyfill() as unknown as google.maps.MVCObject);

		await vm.getMapObject();

		assertThat(vm.$data.subscriptions.length, is(1));
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
