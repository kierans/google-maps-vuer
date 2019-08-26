import { PluginObject, VueConstructor } from "vue";

const DEFAULT_CALLBACK_NAME = "onGoogleMapsLoaded";
const DEFAULT_VERSION = "3.37";

export const GoogleMapVuer = {
	install: (vue: VueConstructor, options?: GoogleMapOptions) => {
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
} as PluginObject<GoogleMapOptions>;

export interface GoogleMapOptions {
	apiKey?: string;
	clientId?: string;
	version?: string;
	callback?: string;
}

function createGoogleMapLoadedHook(vue: VueConstructor, options: GoogleMapOptions) {
	options.callback = options.callback || DEFAULT_CALLBACK_NAME;

	vue.prototype.$maps = {
		loaded: new Promise((resolve) => {
			// @ts-ignore
			window[options.callback] = function() {
				resolve();
			};
		})
	};
}

function checkOptions(options?: GoogleMapOptions) {
	if (!options) {
		throw new Error("Need GoogleMap options");
	}

	if (!options.apiKey && !options.clientId) {
		throw new Error("No API key or Client ID provided");
	}

	if (options.apiKey && options.clientId) {
		throw new Error("Specify only API key or Client ID not both");
	}
}

function createQueryString(options: GoogleMapOptions) {
	const version = options.version || DEFAULT_VERSION;

	return `?v=${version}&callback=${options.callback}${auth(options)}`;
}

function auth(options: GoogleMapOptions) {
	if (options.apiKey) {
		return `&key=${options.apiKey}`;
	}

	if (options.clientId) {
		return `&client=${options.clientId}`;
	}
}
