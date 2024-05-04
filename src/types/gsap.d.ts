declare global {
    namespace gsap {
        type TweenTarget = string | object | null;

        type FunctionBasedValue<T> = (index: number, target: any, targets: any[]) => T;

        type ArrayValue = any[] | FunctionBasedValue<any[]>;

        type BooleanValue = boolean | FunctionBasedValue<boolean>;

        type NumberValue = number | FunctionBasedValue<number>;

        type StringValue = string | FunctionBasedValue<string>;

        type TweenValue = NumberValue | StringValue;

        interface EaseFunction {
            (progress: number): number;
        }

        type Callback = (...args: any[]) => void | null;

        interface CallbackVars {
            callbackScope?: object;
            onComplete?: Callback;
            onCompleteParams?: any[];
            onRepeat?: Callback;
            onRepeatParams?: any[];
            onReverseComplete?: Callback;
            onReverseCompleteParams?: any[];
            onStart?: Callback;
            onStartParams?: any[];
            onUpdate?: Callback;
            onUpdateParams?: any[];
        }

        interface AnimationVars extends CallbackVars {
            [key: string]: any;
            data?: any;
            id?: string | number;
            inherit?: boolean;
            paused?: boolean;
            repeat?: number;
            repeatDelay?: number;
            repeatRefresh?: boolean;
            reversed?: boolean;
            yoyo?: boolean;
        }

        interface StaggerVars extends CallbackVars {
            repeat?: number;
            repeatDelay?: number;
            yoyo?: boolean;
            yoyoEase?: boolean | string | EaseFunction;
        }

        interface TweenVars extends AnimationVars {
            delay?: TweenValue;
            duration?: TweenValue;
            ease?: string | EaseFunction;
            endArray?: any[];
            immediateRender?: boolean;
            lazy?: boolean;
            keyframes?: TweenVars[] | object;
            onInterrupt?: Callback;
            onInterruptParams?: any[];
            overwrite?: "auto" | boolean;
            runBackwards?: boolean;
            stagger?: NumberValue | StaggerVars;
            startAt?: TweenVars;
            yoyoEase?: boolean | string | EaseFunction;
        }

        class Tween extends Animation {}

        function fromTo(targets: TweenTarget, fromVars: TweenVars, toVars: TweenVars): Tween;
        function to(targets: TweenTarget, vars: TweenVars): Tween;
    }
}

export type {};
