<template>
	<div :id="id" class="google-map-container" :data-google-maps-version="version">
		<slot></slot>
	</div>
</template>

<script lang="ts">
import Q from "q";
import { mixins } from "vue-class-component";
import { Component, Prop, Provide, Vue } from "vue-property-decorator";

import DeferredMapObject from "@/components/DeferredMapObject";
import { bindComponentToMapObject } from "@/components/MapObjectBindings";
import GoogleMapComponent from "@/components/GoogleMapComponent";

const props: string[] = [
	"center", "clickableIcons", "heading", "mapTypeId", "options", "streetView", "tilt", "zoom"
];

const events: string[] = [
	"click", "dblclick", "drag", "dragend", "dragstart", "idle", "mousemove", "mouseout", "mouseover", "rightclick",
	"tilesloaded"
];

const methods: string[] = [
	"fitBounds", "panBy", "panTo", "panToBounds",
];

// TODO: Map properties: [ controls, data, mapTypes, overlayMapTypes ]

@Component
export default class GoogleMap
		extends mixins(Vue, DeferredMapObject, bindComponentToMapObject(
			props,
			events,
			methods
		))
		implements GoogleMapComponent<google.maps.Map> {

	private static generateId(): string {
		return `gmv-${Math.floor(Math.random() * Math.floor(1000))}`;
	}

	@Prop({ default: () => GoogleMap.generateId() })
	private readonly id!: string;

	@Prop()
	private readonly options!: google.maps.MapOptions;

	public mounted() {
		this.resolveMapObject(new window.google.maps.Map(document.getElementById(this.id), this.options));
	}

	@Provide()
	public getMap(): Q.Promise<google.maps.Map> {
		return this.getMapObject();
	}

	get version(): string {
		return this.$maps.version;
	}
}
</script>

<style>
.google-map-container {
	width: 100%;
	height: 100%;
}
</style>
