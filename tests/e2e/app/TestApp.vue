<template>
	<div id="app" class="fill-window">
		<google-map
			id="map"
			:center="{ lat: -37.814218, lng: 144.963161 }"
			:options="{
				zoom: 12,
			}">
			<google-map-marker
				v-for="(marker, index) in markers"
				:key="index"
				:options="{
					position: marker.position,
					title: marker.title
				}">
			</google-map-marker>
		</google-map>
	</div>
</template>

<script>
import { createAsyncComponent } from "@/components/AsyncGoogleMapComponent";
import GoogleMap from "@/components/GoogleMap";
import GoogleMapMarker from "@/components/GoogleMapMarker";

export default {
	name: "TestApp",
	components: {
		GoogleMapMarker: createAsyncComponent(GoogleMapMarker),
		GoogleMap: createAsyncComponent(GoogleMap)
	},
	data() {
		return {
			markers: [
				{
					position: { lat: -37.814218, lng: 144.963161 },
					title: "Most Liveable City"
				}
			]
		};
	}
};
</script>

<style>
html, body {
	height: 100%;
}

.fill-window {
	width: 100%;
	height: 100%;
}
</style>
