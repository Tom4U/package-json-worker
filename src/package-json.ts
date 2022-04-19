/**
 * Supporting NPM v8
 */
export interface PackageJson {
    name: string;
    version: string;
    author?: string | PackageJsonPeople;
    contributors?: string[] | PackageJsonPeople[];
    license?: string;
    description?: string;
    main?: string;
    browser?: string;
    private?: boolean;
    files?: string[];
    keywords?: string[];
    repository?: string | PackageJsonRepository;
    bugs?: string | { url?: string; email?: string };
    homepage?: string;
    scripts?: Record<string, string>;
    config?: Record<string, unknown>;
    bin?:
        | { bin: Record<string, string> }
        | { name: string; version: string; bin: string }
        | { name: string; version: string; bin: Record<string, string> };
    man?: string | Record<string, string>;
    dependencies?: Record<string, string>;
    devDependencies?: Record<string, string>;
    peerDependencies?: Record<string, string>;
    peerDependenciesMeta?: Record<string, { optional: boolean }>;
    bundledDependencies?: string[];
    optionalDependencies?: Record<string, string>;
    overrides?: PackageJsonOverridesTree;
    engines?: { node?: string; npm?: string };
    os?: string[];
    cpu?: string[];
    publishConfig?: Record<string, string>;
    workspaces?: string[];
    funding?: string | string[] | PackageJsonFunding | Array<string | PackageJsonFunding>;
}

export interface PackageJsonPeople {
    name?: string;
    email?: string;
    url?: string;
}

export interface PackageJsonRepository {
    type: string;
    url: string;
    direcory?: string;
}

export interface PackageJsonFunding {
    type: string;
    url: string;
}

export type PackageJsonOverridesTree = {
    [key: string]: PackageJsonOverridesTree | string;
};
