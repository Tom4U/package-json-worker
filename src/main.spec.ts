import { expect } from 'chai';
import { resolve } from 'path';
import Sinon, { SinonSandbox } from 'sinon';
import { PackageJsonWorker } from './main';
import { PackageJson } from './package-json';

class PackageJsonWorkerMock {
    private sandbox: SinonSandbox;

    private packageJsonMock: PackageJson = {
        name: 'mock-module',
        version: '1.0.0'
    };

    constructor() {
        this.sandbox = Sinon.createSandbox();
        this.stubMethods();
    }

    getPackageJsonMock(): PackageJson {
        return this.packageJsonMock;
    }

    restore() {
        this.sandbox.restore();
    }

    private stubMethods(): void {
        this.stubGetPackageJson();
        this.stubWritePackageJson();
    }

    private stubGetPackageJson(): void {
        this.sandbox.stub(PackageJsonWorker, 'getPackageJson').returns(Promise.resolve(this.packageJsonMock));
    }

    private stubWritePackageJson(): void {
        this.sandbox.stub(PackageJsonWorker, 'writePackageJson').callsFake((data) => {
            this.packageJsonMock = data;
            return Promise.resolve();
        });
    }
}

describe('getPackageJsonPath()', () => {
    it('returns full path to package.json', async () => {
        const path = await PackageJsonWorker.getPackageJsonPath();
        const testPath = resolve('package.json');

        expect(path).to.be.equal(testPath);
    });
});

describe('getPackageJson()', () => {
    it('returns truthy result', () => {
        const result = PackageJsonWorker.getPackageJson();
        expect(result).to.be.ok;
    });

    it('contains name property', async () => {
        const packageJson = await PackageJsonWorker.getPackageJson();

        expect(packageJson).contains.any.keys('name');
    });
});

describe('writeToPackageConfig()', () => {
    let mock: PackageJsonWorkerMock;

    before(() => {
        mock = new PackageJsonWorkerMock();
    });

    after(() => {
        mock.restore();
    });

    context('overwrite is false', () => {
        it('writes new config value', async () => {
            await PackageJsonWorker.writeToPackageConfig('myKey1', 'myValue1');

            expect(mock.getPackageJsonMock().config?.myKey1).to.be.equal('myValue1');
        });

        it('does not overwrite existing value', async () => {
            await PackageJsonWorker.writeToPackageConfig('myKey2', 'myValue1');
            await PackageJsonWorker.writeToPackageConfig('myKey2', 'myValue2');

            expect(mock.getPackageJsonMock().config?.myKey2).to.be.equal('myValue1');
        });
    });

    context('overwrite is true', () => {
        it('writes new config value', async () => {
            await PackageJsonWorker.writeToPackageConfig('myKey3', 'myValue1', true);

            expect(mock.getPackageJsonMock().config?.myKey3).to.be.equal('myValue1');
        });

        it('does overwrite existing value', async () => {
            await PackageJsonWorker.writeToPackageConfig('myKey4', 'myValue1', true);
            await PackageJsonWorker.writeToPackageConfig('myKey4', 'myValue2', true);

            expect(mock.getPackageJsonMock().config?.myKey4).to.be.equal('myValue2');
        });
    });
});

describe('removeFromPackageJson()', () => {
    let mock: PackageJsonWorkerMock;

    before(() => {
        mock = new PackageJsonWorkerMock();
    });

    after(() => {
        mock.restore();
    });

    context('key exists', () => {
        it('deletes existing config value', async () => {
            const keyName = 'myKey1';

            await PackageJsonWorker.writeToPackageConfig(keyName, 'myValue1');

            expect(mock.getPackageJsonMock().config?.myKey1).to.be.equal('myValue1');

            await PackageJsonWorker.removeFromPackageJsonConfig(keyName);

            expect(mock.getPackageJsonMock().config?.myKey1).to.be.undefined;
        });
    });

    context('key does not exist', () => {
        it('does not throw an error', async () => {
            const keyName = 'myKey1';

            await PackageJsonWorker.removeFromPackageJsonConfig(keyName);

            expect(mock.getPackageJsonMock().config?.myKey1).to.be.undefined;
        });
    });
});
