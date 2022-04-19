# Helpers for package.json

[![Quality Gate Status](https://sonarcloud.io/api/project_badges/measure?project=Tom4U_package-json-worker&metric=alert_status)](https://sonarcloud.io/summary/new_code?id=Tom4U_package-json-worker)

---

## Description
This package provides a helper class with static methods used for working with package.json file.

Adding, updating and removing config entries is supported as well as type-safe functionality on package.json data.

---

## Customization
If you have further entries in package.json you like to be supported by code completion, extend the PackagJson interface with your own and use your custom interface with the generic method `getCustomPackageJson<T>()`.

---

## Available Methods
* `getPackageJson()`\
Returns content of package.json as type-safe PackageJson object.

* `getCustomPackageJson<T extends PackageJson>()`\
Returns content of custom package.json as type-safe custom PackageJson object.

* `getPackageJsonPath()`\
Gets the absolute path to project's package.json.

* `writeToPackageConfig(key: string, value: unknown, overwrite = false)`\
Writes data to package.json config object.

* `removeFromPackageJsonConfig(key: string)`\
Removes an entry from package.json config object.

* `writePackageJson(data: PackageJson)`\
Overwrites whole package.json file with a new JSON Object.

* `writeCustomPackageJson<T extends PackageJson>(data: T)`\
Overwrites whole custom package.json file with a new JSON Object.