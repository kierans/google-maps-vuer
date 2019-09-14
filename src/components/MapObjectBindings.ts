import Vue, { VueConstructor } from "vue";
import {
	DefaultComputed,
	DefaultData,
	DefaultMethods,
	ThisTypedComponentOptionsWithArrayProps,
} from "vue/types/options";

import { getter, setter } from "@/strings";
import GoogleMapComponent from "@/components/GoogleMapComponent";

// TODO: Figure out how to define and ExtendedVue type properly
type VueBoundGoogleMapComponent = VueConstructor;
type VueBoundGoogleMapComponentInstance = GoogleMapComponent<any> & MapObjectBindingsData;
type BindingFunction = (this: VueBoundGoogleMapComponentInstance, names: string[], mapObject: any) => void;

interface MapObjectBindingsData {
	subscriptions: google.maps.MapsEventListener[];
}

/**
 * Binds the Maps API object and the component together.
 *
 * @param props Props to bind to. For example, google.map.Maps has a "center" and a "changed" event.
 * @param events Events to proxy.
 * @param methods Methods to proxy.
 *
 * @return A Vue mixin.
 */
export function bindComponentToMapObject(props: string[], events: string[], methods: string[]):
		VueBoundGoogleMapComponent {
	return Vue.extend({
		data(): MapObjectBindingsData {
			return {
				subscriptions: []
			} as MapObjectBindingsData;
		},
		props,
		mounted() {
			(bindLater.bind(this,
				bindProps.bind(this, props),
				bindEvents.bind(this, events)
			)());
		},
		methods: {
			...createMethodProxies(methods)
		},
		destroyed(): void {
			this.subscriptions.forEach((subscription: google.maps.MapsEventListener) => subscription.remove());
		}
	} as ThisTypedComponentOptionsWithArrayProps<
		VueBoundGoogleMapComponentInstance,
		DefaultData<MapObjectBindingsData>,
		DefaultMethods<GoogleMapComponent<any>>,
		DefaultComputed,
		string>);
}

/*
 * Runs the provided functions when the Map API object is available.
 */
function bindLater(this: VueBoundGoogleMapComponentInstance, ...fns: BindingFunction[]) {
	this.getMapObject().then((mapObject: any) => {
		fns.forEach((fn: any) => fn.call(this, mapObject));
	});
}

// TODO: Think about type validation for props
// TODO: Deep watching
function bindProps(this: VueBoundGoogleMapComponentInstance, props: string[], mapObject: any): void {
	props.forEach((prop: string) => {
		const set: string = setter(prop);
		const get: string = getter(prop);
		const event: string = `${prop}_changed`;

		this.$watch(prop, (newVal) => {
			// TODO: What if there is no getter?
			const existingVal = mapObject[get].call(mapObject);

			// TODO: Vue might do this out of the box
			if (existingVal !== newVal) {
				mapObject[set].call(mapObject, newVal);
			}
		}, {
			immediate: this.$props[prop] !== undefined
		});

		this.subscriptions.push(mapObject.addListener(event, () => {
			const val: any = mapObject[get].call(mapObject);

			this.$emit(event, val);
		}));
	});
}

function bindEvents(this: VueBoundGoogleMapComponentInstance, events: string[], mapObject: any): void {
	events.forEach((event) => {
		this.subscriptions.push(mapObject.addListener(event, (...args: any[]) => {
			this.$emit(event, ...args);
		}));
	});
}

function createMethodProxies(methods: string[]): DefaultMethods<GoogleMapComponent<any>> {
	return methods.reduce((proxies: DefaultMethods<GoogleMapComponent<any>>, method: string) => {
		/*
		 * The proxy function can be awaited for a value if the underlying Maps API function returns one.
		 */
		proxies[method] = async function() {
			const mapObject: any = await this.getMapObject();

			return mapObject[method].apply(method, arguments);
		};

		return proxies;
	}, {});
}
