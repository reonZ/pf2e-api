declare global {
    type TokenSource = {
        _id: string;
        name: string;
        displayName: string;
        actorId: string;
        actorLink: string;
        delta: any;
        appendNumber: boolean;
        prependAdjective: boolean;
        texture: string;
        width: number;
        height: number;
        x: number;
        y: number;
        elevation: number;
        lockRotation: boolean;
        rotation: any;
        effects: any;
        overlayEffect: string;
        alpha: number;
        hidden: boolean;
        disposition: number;
        displayBars: number;
        bar1: {
            attribute: string;
        };
        bar2: {
            attribute: string;
        };
        light: any;
        sight: {
            enabled: boolean;
            range: number;
            angle: any;
            visionMode: string;
            color: any;
            attenuation: number;
            brightness: number;
            saturation: number;
            contrast: number;
        };
        detectionModes: {
            id: string;
            enabled: boolean;
            range: number;
        };
        flags: object;
    };

    type TokenDocumentUUID = string;

    class TokenDocumentPF2e<TActor extends ActorPF2e = ActorPF2e> extends TokenDocument {
        get actor(): TActor | null;
        get scene(): Scene;
        get playersCanSeeName(): boolean;

        simulateUpdate(actorUpdates?: Record<string, unknown>): void;
    }

    class TokenPF2e<TActor extends ActorPF2e = ActorPF2e> extends Token {
        get actor(): TActor | null;
    }

    interface TokenPF2e {
        document: TokenDocumentPF2e;
    }
}

export type {};
