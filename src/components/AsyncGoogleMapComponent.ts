import { AsyncComponentPromise, Component } from "vue/types/options";
import { Vue } from "vue-property-decorator";

export function createComponent<T extends Component>(component: T): AsyncComponentPromise {
	return (resolve: (value: T) => void) => {
		Vue.googleMaps.then(() => resolve(component));
	};
}
