import { PackageJson } from './package-json';
import { resolve as resolvePath } from 'path';
import { exec } from 'child_process';
import { writeFileSync } from 'fs';

/**
 * Modify project's package.json on a type-safe way.
 */
export class PackageJsonWorker {
    /**
     * Returns content of package.json as type-safe PackageJson object.
     * @returns A promise resolving to a PackageJson object.
     */
    static async getPackageJson(): Promise<PackageJson> {
        const path = await this.getPackageJsonPath();
        const packageJsonObject = await import(path);

        return packageJsonObject;
    }

    /**
     * Returns content of custom package.json as type-safe custom PackageJson object.
     * @returns A promise resolving custom PackageJson object.
     */
    static async getCustomPackageJson<T extends PackageJson>(): Promise<T> {
        const path = await this.getPackageJsonPath();
        const packageJsonObject = await import(path);

        return packageJsonObject;
    }

    /**
     * Gets the absolute path to project's package.json.
     * @returns A string containing the absolute path.
     */
    static async getPackageJsonPath(): Promise<string> {
        const promise = new Promise<string>((resolve, reject) => {
            exec('npm root --project', async (err, stdout, stderr) => {
                if (err) reject(err.message);
                else if (stderr) reject(err);
                else {
                    const path = resolvePath(stdout, '..', 'package.json');

                    resolve(path);
                }
            });
        });

        return promise;
    }

    /**
     * Writes data to package.json config object.
     * @param key The key to set in package.json config object.
     * @param value The value for the key.
     * @param overwrite If true, will overwrite any exising value(s).
     */
    static async writeToPackageConfig(key: string, value: unknown, overwrite = false): Promise<void> {
        const data = await this.getPackageJson();

        if (!data.config) data['config'] = {};

        if (data.config[key] && !overwrite) return;

        data.config[key] = value;

        await this.writePackageJson(data);
    }

    /**
     * Removes an entry from package.json config object.
     * @param key The key that's supposed to be deleted.
     */
    static async removeFromPackageJsonConfig(key: string): Promise<void> {
        const packageData = await this.getPackageJson();

        if (!packageData.config || packageData.config[key] === undefined) return;

        delete packageData.config[key];

        console.log('typeof', packageData.config[key]);

        this.writePackageJson(packageData);
    }

    /**
     * Overwrites whole package.json file with a new JSON Object.
     * @param data The new JSON Object.
     */
    static async writePackageJson(data: PackageJson): Promise<void> {
        const path = await this.getPackageJsonPath();
        writeFileSync(path, JSON.stringify(data, null, 2));
    }

    /**
     * Overwrites whole custom package.json file with a new JSON Object.
     * @param data The new JSON Object.
     */
    static async writeCustomPackageJson<T extends PackageJson>(data: T): Promise<void> {
        const path = await this.getPackageJsonPath();
        writeFileSync(path, JSON.stringify(data, null, 2));
    }
}
