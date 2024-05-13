function getTabFilterData<
    N extends BrowserTabName,
    T extends CompendiumBrowserTab = BrowserTabs[N]
>(tabName: N) {
    const tab = game.pf2e.compendiumBrowser.tabs[tabName] as T;
    return foundry.utils.deepClone(tab.defaultFilterData ?? tab.filterData);
}

function filterTraits(
    traits: string[],
    selected: MultiselectData["selected"],
    condition: MultiselectData["conjunction"]
): boolean {
    const selectedTraits = selected.filter((s) => !s.not).map((s) => s.value);
    const notTraits = selected.filter((t) => t.not).map((s) => s.value);
    if (selectedTraits.length || notTraits.length) {
        if (notTraits.some((t) => traits.includes(t))) {
            return false;
        }
        const fullfilled =
            condition === "and"
                ? selectedTraits.every((t) => traits.includes(t))
                : selectedTraits.some((t) => traits.includes(t));
        if (!fullfilled) return false;
    }
    return true;
}

export { filterTraits, getTabFilterData };
