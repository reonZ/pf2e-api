declare function getTabFilterData<N extends BrowserTabName, T extends CompendiumBrowserTab = BrowserTabs[N]>(tabName: N): T["filterData"];
declare function filterTraits(traits: string[], selected: MultiselectData["selected"], condition: MultiselectData["conjunction"]): boolean;
export { filterTraits, getTabFilterData };
