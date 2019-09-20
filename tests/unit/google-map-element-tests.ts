import { shallowMount, ThisTypedShallowMountOptions, Wrapper } from "@vue/test-utils";
import { assertThat, is } from "hamjest";

import { MapObjectBindingData } from "./google-map-binding-tests";
import { mapObjectToBeSettled, VueConstructorFactory, VueGoogleMapComponentInstance } from "./google-map-tests-helper";
import * as sinon from "sinon";

export function generateComponentDestroyTests<APIType extends google.maps.MVCObject>(
		mapBindings: MapObjectBindingData<APIType>, vueFactory: VueConstructorFactory,
		options?: ThisTypedShallowMountOptions<any>): void {
	describe("destroy", function() {
		it("shall clear map", async function() {
			const wrapper: Wrapper<VueGoogleMapComponentInstance<APIType>> = shallowMount(mapBindings.component, {
				localVue: vueFactory(),
				...options
			});

			const vm = wrapper.vm;

			await mapObjectToBeSettled(vm);
			const mapObject = await vm.getMapObject();

			const spy: sinon.SinonSpy = sinon.spy(mapObject, "setMap");

			try {
				await wrapper.destroy();
				await mapObjectToBeSettled(vm);

				assertThat(spy.calledOnceWithExactly(null), is(true));
			}
			finally {
				spy.restore();
			}
		});
	});
}
