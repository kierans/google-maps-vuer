export function capitalise(str: string): string {
	// tslint:disable-next-line:no-shadowed-variable
	return str.split(" ").map((str) => str.substring(0, 1).toUpperCase() + str.substring(1)).join(" ");
}

export function getter(prop: string) {
	return `get${capitalise(prop)}`;
}

export function setter(prop: string) {
	return `set${capitalise(prop)}`;
}
