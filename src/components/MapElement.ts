import Q from "q";
import { Component, Inject } from "vue-property-decorator";

import DeferredMapObject from "@/components/DeferredMapObject";

/**
 * A MapElement is a component that is rendered on a {@link GoogleMap}
 */
@Component
export default class MapElement extends DeferredMapObject {
	@Inject()
	protected readonly getMap!: () => Q.Promise<google.maps.Map>;

	/*
	 * A MapElement has no template as is it rendered by the MapsAPI
	 */
	// noinspection JSUnusedGlobalSymbols
	public render() {
		// this isn't used
	}

	// noinspection JSUnusedGlobalSymbols
	public destroyed() {
		this.getMapObject().then((mapObject: google.maps.MapElement) => mapObject.setMap(null));
	}
}
