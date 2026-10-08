export interface PackageJson {
    name?: string;
    version?: string;
    description?: string;
    keywords?: string[];
    license?: string;
    licenses?: Array<{
        type?: string;
        url?: string;
    }>;
    files?: string[];
    type?: 'module' | 'commonjs';
    main?: string;
    'oh-exports'?: string[] | undefined;
    bin?: string | Partial<Record<string, string>>;
    man?: string | string[];
    repository?: string | {
        type: string;
        url: string;
        directory?: string;
    };
    config?: Record<string, unknown>;
    dependencies?: Partial<Record<string, string>>;
    devDependencies?: Partial<Record<string, string>>;
    optionalDependencies?: Partial<Record<string, string>>;
    peerDependencies?: Partial<Record<string, string>>;
    peerDependenciesMeta?: Partial<Record<string, {
        optional: true;
    }>>;
    bundledDependencies?: string[];
    bundleDependencies?: string[];
    engines?: {
        [EngineName in 'npm' | 'node' | string]?: string;
    };
    engineStrict?: boolean;
    types?: string;
    obfuscated?: boolean;
}
