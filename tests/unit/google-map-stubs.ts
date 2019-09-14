/* tslint:disable:max-classes-per-file */
/* tslint:disable:no-empty */

type EventHandler = (...args: any[]) => void;

export class MVCObjectPolyfill {
	private readonly listeners: {
		[key: string]: EventHandler[];
	};

	constructor() {
		this.listeners = {};
	}

	public addListener(eventName: string, handler: EventHandler): google.maps.MapsEventListener {
		if (this.listeners[eventName]) {
			const listeners = this.listeners[eventName];
			listeners.push(handler);

			const pos = listeners.length - 1;

			return {
				remove: () => {
					listeners.splice(pos, 1);
				}
			} as google.maps.MapsEventListener;
		}
		else {
			this.listeners[eventName] = [];

			return this.addListener(eventName, handler);
		}
	}

	public emit(eventName: string, ...args: any): void {
		const listeners: any[] = this.listeners[eventName] || [];

		listeners.forEach((listener) => {
			listener.call(this, ...args);
		});
	}
}

export class MapPolyfill extends MVCObjectPolyfill {
	public fitBounds() {}
	public panBy() {}
	public panTo() {}
	public panToBounds() {}

	public getCenter() {}
	public getClickableIcons() {}
	public getHeading() {}
	public getMapTypeId() {}
	public getOptions() {}
	public getStreetView() {}
	public getTilt() {}
	public getZoom() {}

	public setCenter() {}
	public setClickableIcons() {}
	public setHeading() {}
	public setMapTypeId() {}
	public setOptions() {}
	public setStreetView() {}
	public setTilt() {}
	public setZoom() {}
}

window.google = {
	maps: {
		Map: MapPolyfill
	}
};
