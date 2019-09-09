import { assertThat, is } from "hamjest";

import { capitalise, getter, setter } from "@/strings";

describe("strings", function() {
	it("should capitalise string", function() {
		assertThat(capitalise("hello world"), is("Hello World"));
	});

	it("should create getter from prop", function() {
		assertThat(getter("center"), is("getCenter"));
	});

	it("should create setter from prop", function() {
		assertThat(setter("center"), is("setCenter"));
	});
});
