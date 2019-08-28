<template>
	<div :id="id" class="google-map-container" :data-google-maps-version="version"></div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";

/**
 * Do not instantiate directly.
 */
@Component
export default class GoogleMap extends Vue {
	private static generateId(): string {
		return `gmv-${Math.floor(Math.random() * Math.floor(1000))}`;
	}

	@Prop({ default: () => GoogleMap.generateId() })
	private readonly id!: string;

	@Prop()
	private readonly options!: google.maps.MapOptions;

	// noinspection JSUnusedGlobalSymbols
	public data() {
		const data: {
			[map: string]: google.maps.Map | undefined
		} = {};

		return data;
	}

	// noinspection JSUnusedGlobalSymbols
	public mounted() {
		this.$data.map = new window.google.maps.Map(document.getElementById(this.id), this.options);
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
