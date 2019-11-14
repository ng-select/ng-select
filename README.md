This is the CommonApp fork of ng-select.

It was originally forked to work on improving the accessibility of the plugin through proper aria tags, improved screen reader support, and increased key command support.

Original and current documentation for ng-select can be found [in the parent repo](https://github.com/ng-select/ng-select).

The CommonApp version is what is used within all CommonApp products via a Github package. In order to update, release, and use the latest updates made to the forked version, follow these instructions:

1) Make whatever changes are required, commit them with a good message, and merge them into the `master` branch
2) Navigate to `src/ng-select` and update the `package.json` version accordingly using semantic versioning
3) Within `src/ng-select` run `ng build ng-select`
4) Navigate to `dist/ng-select` and run `npm publish`
5) Verify the version has updated in the [Github package](https://github.com/CommonApp/ng-select/packages/54416)
