import Vue, { VueConstructor } from "vue";
import {
	DefaultComputed,
	DefaultData,
	DefaultMethods,
	ThisTypedComponentOptionsWithArrayProps,
} from "vue/types/options";

import { capitalise } from "@/strings";
import GoogleMapComponent from "@/components/GoogleMapComponent";

// TODO: Figure out how to define an ExtendedVue type properly
type VueBoundGoogleMapComponent = VueConstructor;
type VueBoundGoogleMapComponentInstance = GoogleMapComponent<any> & MapObjectBindingsData;
type BindingFunction = (this: VueBoundGoogleMapComponentInstance, names: string[], mapObject: any) => void;

interface MapObjectBindingsData {
	subscriptions: google.maps.MapsEventListener[];
}

/**
 * Defines how to bind a Vue prop to Maps API property.
 *
 * In order to bind to the Maps API property, there must be a setter on the Maps API object to call.
 *
 * If a getter is present then a listener is placed for the 'changed' event on the Maps API object.
 *
 * The default getter and setter names are made by capitalising the first letter of the Maps API property
 * eg: 'center' becomes 'getCenter' and 'setCenter'. However some properties like 'zindex' don't fit that convention,
 * so callers will have to override the getter and setter names with the correct values.
 */
export interface MabObjectBindingDefinition {
	/** The name that the prop will be available by on the Vue component */
	readonly name: string;
	readonly getter: string | null;
	readonly setter: string | null;
}

/**
 * Create a default {@link MabObjectBindingDefinition} with a getter and setter
 */
// tslint:disable-next-line:no-shadowed-variable
export function createMapObjectBinding(name: string, getter?: string | null, setter?: string | null):
		MabObjectBindingDefinition {
	return {
		name,
		getter: getter !== undefined ? getter : `get${capitalise(name)}`,
		setter: setter !== undefined ? setter : `set${capitalise(name)}`
	} as MabObjectBindingDefinition;
}

/**
 * Binds the Maps API object and the component together.
 *
 * @param props Props to bind to. For example, google.map.Maps has a "center" and a "center changed" event.
 * @param events Events to proxy.
 * @param methods Methods to proxy.
 *
 * @return A Vue mixin.
 */
export function bindComponentToMapObject(props: MabObjectBindingDefinition[], events: string[], methods: string[]):
		VueBoundGoogleMapComponent {
	return Vue.extend({
		data(): MapObjectBindingsData {
			return {
				subscriptions: []
			} as MapObjectBindingsData;
		},
		props: props.map((prop: MabObjectBindingDefinition) => prop.name),
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
function bindProps(this: VueBoundGoogleMapComponentInstance, props: MabObjectBindingDefinition[],
		mapObject: any): void {
	props.forEach((prop: MabObjectBindingDefinition) => {
		const event: string = `${prop.name}_changed`;

		this.$watch(prop.name, (newVal) => {
			const existingVal = getter(mapObject, prop);

			// TODO: Vue might do this out of the box
			if (existingVal !== newVal && prop.setter) {
				setter(mapObject, prop, newVal);
			}
		}, {
			immediate: this.$props[prop.name] !== undefined
		});

		if (prop.getter) {
			this.subscriptions.push(mapObject.addListener(event, () => {
				const val: any = getter(mapObject, prop);

				this.$emit(event, val);
			}));
		}
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

function getter(mapObject: any, prop: MabObjectBindingDefinition): any | undefined {
	return prop.getter ? mapObject[prop.getter].call(mapObject) : undefined;
}

function setter(mapObject: any, prop: MabObjectBindingDefinition, value: any): void {
	if (prop.setter) {
		mapObject[prop.setter].call(mapObject, value);
	}
}
