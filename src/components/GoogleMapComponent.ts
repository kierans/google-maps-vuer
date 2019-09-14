import Q from "q";
import { Vue } from "vue/types/vue";

export default interface GoogleMapComponent<APIType> extends Vue {
	/**
	 * Every component must implement mounted as that's where the Maps API objects should be created (not `created()`)
	 */
	mounted(): void;

	/**
	 * Because we can't guarantee that all components have been mounted when we want access to the underlying Maps API
	 * objects, we have to wait until they become available.
	 *
	 * @return The underlying Google Maps object that the component is wrapping.
	 */
	getMapObject(): Q.Promise<APIType>;
}
