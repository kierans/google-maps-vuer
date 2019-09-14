/*
 * Stop tsc complaining that window doesn't have a google property.
 */
// noinspection JSUnusedGlobalSymbols
interface Window {
	google: any;
}
