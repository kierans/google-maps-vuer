import Q from "q";
import { Component, Vue } from "vue-property-decorator";

/**
 * A Component that eventually provides a Maps API object to work with.
 *
 * It allows users the ability to defer the moment when to resolve the Promise with a Map API object.
 */
@Component
export default class DeferredMapObject extends Vue {
	protected mapObject: Q.Deferred<any> = Q.defer();

	public getMapObject(): Q.Promise<any> {
		return this.mapObject.promise;
	}

	protected resolveMapObject(value: any) {
		this.mapObject.resolve(value);
	}
}
