declare global {
    interface Game {
        pf2e: {
            system: {
                sluggify(text: string, options?: { camel?: "bactrian" | "dromedary" }): string;
            };
            compendiumBrowser: CompendiumBrowser;
            Modifier: typeof ModifierPF2e;
        };
    }
}

export type {};
