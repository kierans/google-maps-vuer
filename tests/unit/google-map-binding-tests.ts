import Q, { Deferred } from "q";
import { VueConstructor } from "vue";
import { Vue } from "vue/types/vue";

import { getter, setter } from "@/strings";
import DeferredMapObject from "@/components/DeferredMapObject";

import { assertThat, equalTo, is } from "hamjest";
import * as sinon from "sinon";
import { SinonSpy, SinonStub } from "sinon";
import { shallowMount, VueClass, Wrapper } from "@vue/test-utils";

import { MVCObjectPolyfill } from "./google-map-stubs";

type VueConstructorFactory = () => VueConstructor;
type VueGoogleMapComponent<APIType extends google.maps.MVCObject> = VueClass<Vue & DeferredMapObject>;
type VueGoogleMapComponentInstance<APIType extends google.maps.MVCObject> = Vue & DeferredMapObject;

export interface MapObjectBindingData<APIType extends google.maps.MVCObject> {
	component: VueGoogleMapComponent<APIType>;
	objectClassName: string;
	props: string[];
	events: string[];
	methods: string[];
}

export function generateComponentBindingTests<APIType extends google.maps.MVCObject>(
		mapBindings: MapObjectBindingData<APIType>, vue: VueConstructorFactory): void {
	describe(`${mapBindings.component.name} bindings`, function() {
		generateConstructorTest(mapBindings, vue);
		generatePropsTests(mapBindings, vue);
		generateEventsTests(mapBindings, vue);
		generateMethodsTests(mapBindings, vue);
	});
}

function generateConstructorTest<APIType extends google.maps.MVCObject>(
		mapBindings: MapObjectBindingData<APIType>, vue: VueConstructorFactory): void {
	it("should pass options to the constructor", function() {
		const opts = { a: 1 };
		const spy: SinonSpy = spyOnConstructor(mapBindings.objectClassName);

		try {
			shallowMount(mapBindings.component, {
				localVue: vue(),
				propsData: {
					options: opts
				}
			});

			assertThat(spy.calledOnceWith(sinon.match.any, sinon.match(opts)), is(true));
		}
		finally {
			spy.restore();
		}
	});
}

function generatePropsTests<APIType extends google.maps.MVCObject>(
		mapBindings: MapObjectBindingData<APIType>, vue: VueConstructorFactory): void {
	describe("props", function() {
		this.timeout(200);

		mapBindings.props.forEach((prop: string) => {
			describe(`${prop}`, function() {
				it(`should reactively bind '${prop}' to setter`, async function() {
					const set = setter(prop);
					const spy: sinon.SinonSpy = spyOnMethod(mapBindings.objectClassName, set);
					const val = "value";
					const newVal = 123;

					const wrapper: Wrapper<VueGoogleMapComponentInstance<APIType>> = shallowMount(mapBindings.component, {
						localVue: vue(),
						propsData: {
							[prop]: val
						}
					});

					await mapObjectToBeSettled(wrapper.vm);

					try {
						assertThat(spy.firstCall.calledWithExactly(val), is(true));

						wrapper.setProps({ [prop]: newVal });
						assertThat(spy.secondCall.calledWithExactly(newVal), is(true));
					}
					finally {
						spy.restore();
					}
				});

				it(`should bind to '${prop}_changed' event`, function() {
					const get = getter(prop);
					const val = "123";
					const stub = stubMethod(mapBindings.objectClassName, get).returns(val);

					const wrapper: Wrapper<VueGoogleMapComponentInstance<APIType>> = shallowMount(mapBindings.component, {
						localVue: vue(),
						propsData: {
							[prop]: val
						}
					});

					const deferred: Deferred<void> = Q.defer();
					deferred.promise.finally(() => { sinon.restore(); });

					wrapper.vm.$on(`${prop}_changed`, (...params: any[]) => {
						assertThat(params[0], is(equalTo(val)));

						deferred.resolve();
					});

					wrapper.vm.getMapObject()
						.then((mapObject: MVCObjectPolyfill) => mapObject.emit(`${prop}_changed`));

					return deferred.promise;
				});
			});
		});
	});
}

function generateEventsTests<APIType extends google.maps.MVCObject>(
		mapBindings: MapObjectBindingData<APIType>, vue: VueConstructorFactory): void {
	describe("events", function() {
		this.timeout(200);

		mapBindings.events.forEach((event: string) => {
			it(`should emit '${event}'`, function(done) {
				const wrapper: Wrapper<VueGoogleMapComponentInstance<APIType>> = shallowMount(mapBindings.component, {
					localVue: vue()
				});

				const args = [ 1, "foo", false ];

				wrapper.vm.$on(event, (...params: any[]) => {
					assertThat(params, is(equalTo(args)));

					done();
				});

				/*
				 * Because we're stubbing out the underlying Maps API, the types of the arguments don't actually
				 * matter. What we're interested in is the *behaviour* of the binding, ie: is the event emitted with the
				 * arguments given from the Maps API event.
				 */
				wrapper.vm.getMapObject()
					.then((mapObject: MVCObjectPolyfill) => mapObject.emit(event, ...args));
			});
		});
	});
}

function generateMethodsTests<APIType extends google.maps.MVCObject>(
		mapBindings: MapObjectBindingData<APIType>, vue: VueConstructorFactory): void {
	describe("methods", function() {
		mapBindings.methods.forEach((method: string) => {
			it(`should proxy call to '${method}'`, async function() {
				const spy: sinon.SinonSpy = spyOnMethod(mapBindings.objectClassName, method);

				const wrapper: Wrapper<VueGoogleMapComponentInstance<APIType>> = shallowMount(mapBindings.component, {
					localVue: vue()
				});

				await mapObjectToBeSettled(wrapper.vm);

				try {
					const args = [ 1, "foo", false ];

					/*
					 * Because we're stubbing out the underlying Maps API, the types of the arguments don't actually
					 * matter. What we're interested in is the *behaviour* of the proxy, ie: does it call the method
					 * on the Maps API target with the arguments given;
					 */
					// @ts-ignore
					await wrapper.vm[method].apply(wrapper.vm, args);

					assertThat(spy.calledOnceWith(...args), is(true));
				}
				finally {
					spy.restore();
				}
			});
		});
	});
}

async function mapObjectToBeSettled(vm: VueGoogleMapComponentInstance<any>) {
	/*
	 * When we know that the underlying Maps API object has been settled we can run our test.
	 */
	// tslint:disable-next-line:no-empty
	await vm.getMapObject().finally(() => {});
}

/*
 * To spy on a constructor, we find the namespace the class is in and then we
 * have Sinon spy on the "class" (function)
 */
function spyOnConstructor(fqn: string): SinonSpy {
	const pos: number = fqn.lastIndexOf(".");
	const namespace: any = findObject(fqn.substring(0, pos));
	const className: string = fqn.substring(pos + 1);

	return sinon.spy(namespace, className);
}

function spyOnMethod(fqn: string, method: string): SinonSpy {
	const cls = findObject(fqn);

	return sinon.spy(cls.prototype, method);
}

function stubMethod(fqn: string, method: string): SinonStub {
	const cls = findObject(fqn);

	return sinon.stub(cls.prototype, method);
}

/*
 * Recurses through objects/namespaces until we find the namespace that holds the "class" we want.
 */
function findObject(path: string, root = window): any {
	const pos: number = path.indexOf(".");

	if (pos >= 0) {
		const name: string = path.substring(0, pos);
		const rest: string = path.substring(pos + 1);

		// @ts-ignore
		const ns: any = root[name];

		return findObject(rest, ns);
	}
	else {
		// @ts-ignore
		return root[path];
	}
}
