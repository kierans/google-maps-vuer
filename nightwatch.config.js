const path = require("chromedriver").path;

console.log(`Chromedriver path: ${path}`);

module.exports = {
	/*
	 * Need to fix the path to Chromedriver so that the one that's installed in the top level
	 * is used instead of the version that is provided by @vue/cli-plugin-e2e-nightwatch as it's too old.
	 */
	selenium: {
		cli_args: {
			'webdriver.chrome.driver': path
		}
	}
};
