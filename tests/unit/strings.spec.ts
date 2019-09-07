import { assertThat, is } from "hamjest";

import { capitalise } from "@/strings";

describe("strings", function() {
	it("should capitalise string", function() {
		assertThat(capitalise("hello world"), is("Hello World"));
	});
});
