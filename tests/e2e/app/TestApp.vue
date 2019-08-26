<template>
	<div id="app" class="fill-window">
		<HelloWorld msg="Test App"></HelloWorld>
	</div>
</template>

<script>
	import HelloWorld from "@/components/HelloWorld.vue";

	export default {
		name: "TestApp",
		components: {
			HelloWorld
		},
		created() {
			// this.$maps.loaded.then(() => console.log("Maps loaded"));
		}
	};
</script>

<style>
	.fill-window {
		width: 100%;
		height: 100%;
	}
</style>
