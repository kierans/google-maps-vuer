import { mixins } from "vue-class-component";
import { Component, Prop, Vue } from "vue-property-decorator";

import MapElement from "@/components/MapElement";
import {
	bindComponentToMapObject,
	createMapObjectBinding,
	MabObjectBindingDefinition
} from "@/components/MapObjectBindings";
import GoogleMapComponent from "@/components/GoogleMapComponent";

const props: MabObjectBindingDefinition[] = [
	"animation", "clickable", "cursor", "draggable", "icon", "label", "opacity", "position", "shape", "title",
	"visible"
].map((prop) => createMapObjectBinding(prop));

props.push(createMapObjectBinding("options", null));
props.push(createMapObjectBinding("zindex", "getZIndex", "setZIndex"));

const events: string[] = [
	"click", "dblclick", "drag", "dragend", "dragstart", "idle", "mousedown", "mouseout", "mouseover", "rightclick"
];

const methods: string[] = [];

@Component
export default class GoogleMapMarker
		extends mixins(Vue, MapElement, bindComponentToMapObject(
			props,
			events,
			methods
		))
		implements GoogleMapComponent<google.maps.Marker> {
	@Prop()
	private readonly options!: google.maps.MarkerOptions;

	// noinspection JSUnusedGlobalSymbols
	public mounted() {
		const marker: google.maps.Marker = new window.google.maps.Marker(this.options);

		this.getMap().then((map: google.maps.Map) => {
			marker.setMap(map);
		});

		this.resolveMapObject(marker);
	}
}
