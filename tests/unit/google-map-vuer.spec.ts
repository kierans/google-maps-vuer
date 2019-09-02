// tslint:disable:max-classes-per-file

import Vue, { VueConstructor } from "vue";

import { createLocalVue, createWrapper, Wrapper } from "@vue/test-utils";
import { assertThat, defined, instanceOf, is, throws } from "hamjest";
import merge from "deepmerge";
import URL from "url";

import { GoogleMapsAPIOptions, GoogleMapVuer } from "@/GoogleMapVuer";

const API_KEY: string = "abc123def";
const CLIENT_ID: string = "gme-foo";

describe("GoogleMapVuer", function() {
	const body = document.getElementsByTagName("body").item(0)!;
	let vue: VueConstructor;

	const loadingMaps: any = (opts: GoogleMapsAPIOptions): any => {
		return () => {
			vue.use(GoogleMapVuer, opts);
		};
	};

	beforeEach(function() {
		vue = createLocalVue();
	});

	afterEach(function() {
		const scripts = body.getElementsByTagName("script");
		for (let i = 0; i < scripts.length; i++) {
			const script = scripts.item(i)!;
			body.removeChild(script);
		}
	});

	it("should throw an error if no options given", function() {
		assertThat(loadingMaps(), throws(instanceOf(Error)));
	});

	it("should throw an error if no API key specified", function() {
		assertThat(loadingMaps({}), throws(instanceOf(Error)));
	});

	it("should throw an error if no Client ID specified", function() {
		assertThat(loadingMaps({}), throws(instanceOf(Error)));
	});

	it("should throw an error if both API key and Client ID specified", function() {
		const opts: GoogleMapsAPIOptions = {
			apiKey: API_KEY,
			clientId: CLIENT_ID
		};

		assertThat(loadingMaps(opts), throws(instanceOf(Error)));
	});

	describe("loading Google Maps into the DOM", function() {
		it("should load Google Maps API with API key", function() {
			const opts: GoogleMapsAPIOptions = {
				apiKey: API_KEY
			};

			vue.use(GoogleMapVuer, opts);

			assertThat(createWrapper(body), hasGoogleMapsScriptTag(withAPIKey(API_KEY)));
		});

		it("should load Google Maps API with Client ID", function() {
			const opts: GoogleMapsAPIOptions = {
				clientId: CLIENT_ID
			};

			vue.use(GoogleMapVuer, opts);

			assertThat(createWrapper(body), hasGoogleMapsScriptTag(withClientID(CLIENT_ID)));
		});

		it("should load Google Maps API with default version", function() {
			const opts: GoogleMapsAPIOptions = {
				apiKey: API_KEY
			};

			vue.use(GoogleMapVuer, opts);

			assertThat(createWrapper(body), hasGoogleMapsScriptTag(
				withAPIKey(API_KEY),
				withVersion(GoogleMapVuer.DEFAULT_VERSION))
			);
		});

		it("should load Google Maps API with specified version", function() {
			const version = "quartely";
			const opts: GoogleMapsAPIOptions = {
				apiKey: API_KEY,
				version
			};

			vue.use(GoogleMapVuer, opts);

			assertThat(createWrapper(body), hasGoogleMapsScriptTag(withAPIKey(API_KEY), withVersion(version)));
		});

		describe("API callback", function() {
			it("should register callback for Maps API", function() {
				const opts: GoogleMapsAPIOptions = {
					apiKey: API_KEY
				};

				vue.use(GoogleMapVuer, opts);
				assertThat(window[GoogleMapVuer.DEFAULT_CALLBACK_NAME], is(defined()));
			});

			it("should register maps callback promise", async function() {
				const opts: GoogleMapsAPIOptions = {
					apiKey: API_KEY
				};

				vue.use(GoogleMapVuer, opts);

				assertThat(vue.googleMaps, is(defined()));
			});

			it("should use callback name when provided", function() {
				const callback = "whatever";
				const opts: GoogleMapsAPIOptions = {
					apiKey: API_KEY,
					callback
				};

				vue.use(GoogleMapVuer, opts);
				// @ts-ignore
				assertThat(window[callback], is(defined()));
			});
		});
	});
});

function hasTag(name: string) {
	return new TagMatcher(name);
}

function hasAttributes(atts: string[]) {
	return new AttributesMatcher(atts);
}

function hasSrcValue(props: object) {
	return new GoogleMapsAPIMatcher(props);
}

function hasGoogleMapsScriptTag(...queryStringProps: object[]) {
	let qsProps = merge.all(queryStringProps);

	// @ts-ignore
	if (!qsProps.v) {
		qsProps = merge(qsProps, withVersion(GoogleMapVuer.DEFAULT_VERSION));
	}

	return new GoogleMapScriptTagMatcher(qsProps);
}

function withAPIKey(key: string) {
	return {
		key
	};
}

function withClientID(id: string) {
	return {
		client: id
	};
}

function withVersion(version: string) {
	return {
		v: version
	};
}

class TagMatcher {
	private readonly tagName: string;

	constructor(tagName: string) {
		this.tagName = tagName;
	}

	public matches(actual: Wrapper<Vue>): boolean {
		const el = actual.find(this.tagName);

		return el.exists();
	}

	public describeTo(description: any): void {
		description.append(`A element with a <${this.tagName}> tag`);
	}

	public describeMismatch(actual: any, description: any): void {
		description.append(`No <${this.tagName}> found`);
	}
}

class AttributesMatcher {
	private readonly attrs: Map<string, boolean>;

	constructor(attrs: string[]) {
		// tslint:disable-next-line:no-shadowed-variable
		this.attrs = attrs.reduce((attrs: Map<string, boolean>, attr: string) => attrs.set(attr, false), new Map());
	}

	public matches(actual: Wrapper<Vue>): boolean {
		try {
			for (const attr of this.attrs.keys()) {
				assertThat(actual.attributes(attr), is(defined()));

				this.attrs.set(attr, true);
			}
		}
		catch (e) {
			return false;
		}

		return true;
	}

	public describeTo(description: any): void {
		description.append(`An element with attributes ${Array.from(this.attrs.keys()).sort()}`);
	}

	public describeMismatch(actual: any, description: any): void {
		const missing: string[] = [];

		this.attrs.forEach((val, key) => {
			if (!val) {
				missing.push(key);
			}
		});

		description.append(`Missing ${missing.sort()}`);
	}
}

class GoogleMapsAPIMatcher {
	private readonly props: object;
	private actual!: object;

	constructor(props: object) {
		this.props = props;
	}

	public matches(actual: Wrapper<Vue>): boolean {
		const url = URL.parse(actual.attributes("src"), true);
		this.actual = url;

		for (const prop in this.props) {
			if (this.props.hasOwnProperty(prop)) {
				try {
					// @ts-ignore
					assertThat(url[prop], is(this.props[prop]));
				}
				catch (e) {
					return false;
				}
			}
		}

		return true;
	}

	public describeTo(description: any): void {
		description.append("A <script> src attribute containing ");
		description.appendValue(this.props);
	}

	public describeMismatch(actual: any, description: any): void {
		description.append("But had ");

		/*
		 * Only show the properties we're interested in.
		 */
		const copy = {};

		for (const prop in this.props) {
			if (this.props.hasOwnProperty(prop)) {
				// @ts-ignore
				copy[prop] = this.actual[prop];
			}
		}

		description.appendValue(copy);
	}
}

class GoogleMapScriptTagMatcher {
	private readonly queryStringProps: object;

	constructor(queryStringProps: object) {
		this.queryStringProps = queryStringProps;
	}

	public matches(actual: Wrapper<Vue>): boolean {
		assertThat(actual, hasTag("script"));

		const scriptTag = actual.find("script");
		assertThat(scriptTag, hasAttributes([ "src", "async", "defer" ]));
		assertThat(scriptTag, hasSrcValue({
			protocol: "https:",
			hostname: "maps.googleapis.com",
			pathname: "/maps/api/js",
			query: {
				callback: "onGoogleMapsLoaded",
				...this.queryStringProps
			}
		}));

		return true;
	}

	public describeTo(description: any): void {
		description.append("A <body> with a <script> tag to load Google Maps");
	}

	public describeMismatch(actual: any, description: any): void {
		description.append("But didn't");
	}
}
