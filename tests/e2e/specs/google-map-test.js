// For authoring Nightwatch tests, see
// http://nightwatchjs.org/guide#usage

console.log(`Vue dev server: ${process.env.VUE_DEV_SERVER_URL}`);

module.exports = {
  "render map": (browser) => {
    browser
      .url(process.env.VUE_DEV_SERVER_URL)
      .waitForElementVisible("#app", 5000);

    browser.expect.element("#map").to.be.present;
    browser.expect.element("#map").to.have.attribute("data-google-maps-version").equals("3.37");

    // this tells us that Google Maps has loaded.
    browser.expect.element("#map div.gm-style").to.be.present;
    browser.end();
  },

  "render marker": (browser) => {
    browser
    .url(process.env.VUE_DEV_SERVER_URL)
    .waitForElementVisible("#app", 5000)
    .waitForElementPresent("#map", 5000);

    browser.expect.element("#map area[title='Most Liveable City']").to.be.present;
    browser.end();
  }
};
