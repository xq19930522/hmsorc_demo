export interface TransformAbcConfig {
    isArkGuardEnabled: boolean;
}
export type TransformAbcCallback = (abcPath: string, config: TransformAbcConfig) => void | Promise<void>;
