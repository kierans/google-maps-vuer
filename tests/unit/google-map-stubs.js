/**
 * @extends google.maps.Map
 */
class MapPolyfill {

}

window.google = {
	maps: {
		Map: MapPolyfill
	}
};
