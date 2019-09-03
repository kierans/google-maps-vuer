import { PluginObject, VueConstructor } from "vue";

const DEFAULT_CALLBACK_NAME = "onGoogleMapsLoaded";
const DEFAULT_VERSION = "3.37";

export const GoogleMapVuer = {
	install: (vue: VueConstructor, options?: GoogleMapsAPIOptions) => {
		checkOptions(options);

		createGoogleMapLoadedHook(vue, options!);
		const qs = createQueryString(options!);

		const googleMapScript = document.createElement("script");
		googleMapScript.setAttribute("async", "");
		googleMapScript.setAttribute("defer", "");
		googleMapScript.setAttribute("src", `https://maps.googleapis.com/maps/api/js${qs}`);

		document.body.appendChild(googleMapScript);
	},
	DEFAULT_VERSION,
	DEFAULT_CALLBACK_NAME
} as PluginObject<GoogleMapsAPIOptions>;

export interface GoogleMapsAPIOptions {
	apiKey?: string;
	clientId?: string;
	version?: string;
	callback?: string;
}

/**
 * Details about the Google Maps API loaded into the window
 */
export interface GoogleMapsAPI {
	version: string;
}

function createGoogleMapLoadedHook(vue: VueConstructor, options: GoogleMapsAPIOptions) {
	vue.googleMaps = new Promise((resolve: (value: GoogleMapsAPI) => void) => {
		// @ts-ignore
		window[options.callback] = function() {
			resolve({
				version: options.version!
			});
		};
	});

	vue.googleMaps.then((api) => vue.prototype.$maps = api);
}

function checkOptions(options?: GoogleMapsAPIOptions) {
	if (!options) {
		throw new Error("Need GoogleMap options");
	}

	if (!options.apiKey && !options.clientId) {
		throw new Error("No API key or Client ID provided");
	}

	if (options.apiKey && options.clientId) {
		throw new Error("Specify only API key or Client ID not both");
	}

	options.callback = options.callback || DEFAULT_CALLBACK_NAME;
	options.version  = options.version || DEFAULT_VERSION;
}

function createQueryString(options: GoogleMapsAPIOptions) {
	return `?v=${options.version}&callback=${options.callback}${auth(options)}`;
}

function auth(options: GoogleMapsAPIOptions) {
	if (options.apiKey) {
		return `&key=${options.apiKey}`;
	}

	if (options.clientId) {
		return `&client=${options.clientId}`;
	}
}
