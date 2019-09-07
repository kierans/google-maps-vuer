export function capitalise(str: string): string {
	// tslint:disable-next-line:no-shadowed-variable
	return str.split(" ").map((str) => str.substring(0, 1).toUpperCase() + str.substring(1)).join(" ");
}
