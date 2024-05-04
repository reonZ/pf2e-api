declare global {
    interface Game {
        pf2e: {
            system: {
                sluggify(text: string, options?: { camel?: "bactrian" | "dromedary" }): string;
            };

            compendiumBrowser: CompendiumBrowser;
            effectPanel: EffectsPanel;

            RuleElements: typeof RuleElements;
            Modifier: typeof ModifierPF2e;
            Coins: typeof CoinsPF2e;
            Predicate: typeof Predicate;
            StatisticModifier: typeof StatisticModifier;

            settings: {
                automation: {
                    flanking: boolean;
                };
                // campaign: {
                //     feats: {
                //         enabled: boolean;
                //         sections: FeatGroupOptions[];
                //     };
                //     languages: LanguageSettings;
                // };
                critFumble: {
                    buttons: boolean;
                    cards: boolean;
                };
                encumbrance: boolean;
                gmVision: boolean;
                iwr: boolean;
                metagame: {
                    breakdowns: boolean;
                    dcs: boolean;
                    secretChecks: boolean;
                    partyStats: boolean;
                    partyVision: boolean;
                    results: boolean;
                };
                rbv: boolean;
                tokens: {
                    autoscale: boolean;
                    nameVisibility: boolean;
                    nathMode: boolean;
                };
                totm: boolean;
                variants: {
                    abp: "noABP" | "ABPFundamentalPotency" | "ABPRulesAsWritten";
                    fa: boolean;
                    gab: boolean;
                    pwol: {
                        enabled: boolean;
                        modifiers: [number, number, number, number, number];
                    };
                    stamina: boolean;
                };
            };
        };
    }
}

export type {};
