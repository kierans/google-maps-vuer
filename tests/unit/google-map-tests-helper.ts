import { VueClass } from "@vue/test-utils";
import { Vue } from "vue/types/vue";
import { VueConstructor } from "vue";

import DeferredMapObject from "@/components/DeferredMapObject";

export type VueConstructorFactory = () => VueConstructor;
export type VueGoogleMapComponent<APIType extends google.maps.MVCObject> = VueClass<Vue & DeferredMapObject>;
export type VueGoogleMapComponentInstance<APIType extends google.maps.MVCObject> = Vue & DeferredMapObject;

export async function mapObjectToBeSettled(vm: VueGoogleMapComponentInstance<any>) {
	/*
	 * When we know that the underlying Maps API object has been settled we can run our test.
	 */
	// tslint:disable-next-line:no-empty
	await vm.getMapObject().finally(() => {});
}
