<template>
	<div id="app" class="fill-window">
		<GoogleMap
			id="map"
			:options="{
				center: { lat: -37.814218, lng: 144.963161 },
				zoom: 12,
			}">
		</GoogleMap>
	</div>
</template>

<script>
import { createComponent } from "@/components/AsyncGoogleMapComponent";
import GoogleMap from "@/components/GoogleMap.vue";

export default {
	name: "TestApp",
	components: {
		GoogleMap: createComponent(GoogleMap)
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
