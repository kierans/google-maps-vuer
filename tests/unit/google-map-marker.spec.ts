import Q from "q";

import { createLocalVue, ThisTypedShallowMountOptions } from "@vue/test-utils";
import { generateComponentBindingTests, MapObjectBindingData } from "./google-map-binding-tests";
import "./google-map-stubs";

import GoogleMapMarker from "@/components/GoogleMapMarker";
import { createMapObjectBinding, MabObjectBindingDefinition } from "@/components/MapObjectBindings";
import { generateComponentDestroyTests } from "./google-map-element-tests";

describe("GoogleMapMarker.vue", function() {
	const mapBindingData = {
		component: GoogleMapMarker,
		objectClassName: "google.maps.Marker",
		props: givenProps(),
		events: [
			"click", "dblclick", "drag", "dragend", "dragstart", "idle", "mousedown", "mouseout", "mouseover", "rightclick"
		],
		methods: []
	} as MapObjectBindingData<google.maps.Marker>;

	const mountingOptions: ThisTypedShallowMountOptions<any> = {
		provide: {
			getMap(): Q.Promise<google.maps.Map> {
				return Q.defer<google.maps.Map>().promise;
			}
		}
	};

	generateComponentBindingTests(mapBindingData, createLocalVue, mountingOptions);

	describe("lifecycle", function() {
		generateComponentDestroyTests(mapBindingData, createLocalVue, mountingOptions);
	});
});

function givenProps(): MabObjectBindingDefinition[] {
	const props = [
		"animation", "clickable", "cursor", "draggable", "icon", "label", "opacity", "position", "shape", "title", "visible"
	].map((prop: string) => createMapObjectBinding(prop));

	props.push(createMapObjectBinding("options", null));
	props.push(createMapObjectBinding("zindex", "getZIndex", "setZIndex"));

	return props;
}
