# Integration App

This is a simplified version of https://github.com/angular/quickstart used to test the built lib.

## npm scripts

We've captured many of the most useful commands in npm scripts defined in the `package.json`:

* `npm start` - runs the compiler and a server at the same time, both in "watch mode".
* `npm run e2e` - compiles the app and run e2e tests.
* `npm run e2e:aot` - compiles and the app with AOT and run e2e tests.


If you need to manually test a library build, follow these steps:
```
# starting at the project root, build the library
npm run build
# clean the integration app
npm run preintegration
cd integration
npm install
```

Now the library is installed in your integration app. 

You can use `npm start` to start a live reload server running the app in JIT mode, or `npm run build && npm run serve:aot` to run a static server in AOT mode.
