"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.openBrowserTab = void 0;
async function openBrowserTab(tabName, filter) {
    const browser = game.pf2e.compendiumBrowser;
    if (!filter) {
        browser.render(true);
        return;
    }
    const tab = browser.tabs[tabName];
    if (!tab.isInitialized) {
        await tab.getFilterData();
    }
    tab.open(filter);
}
exports.openBrowserTab = openBrowserTab;
