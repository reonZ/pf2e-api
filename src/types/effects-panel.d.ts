declare global {
    class EffectsPanel extends Application {
        get token(): TokenDocumentPF2e | null;
        get actor(): ActorPF2e | null;

        refresh: () => void;
    }
}

export type {};
