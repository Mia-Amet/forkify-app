// This file can be replaced during build by using the `fileReplacements` array.
// `ng build ---prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  config: {
    apiKey: "AIzaSyDAJcFR90fI_q5XsONx3LVydSHLYFuNp7Y",
    authDomain: "forkify-b3846.firebaseapp.com",
    databaseURL: "https://forkify-b3846.firebaseio.com",
    projectId: "forkify-b3846",
    storageBucket: "forkify-b3846.appspot.com",
    messagingSenderId: "226840341029"
  },
  apiKeyFood2Fork: "42b23ebb564fb3ffc1c1e10faafb3625",
  apiUrlFood2Fork: "https://www.food2fork.com/api",
  proxy: "https://cors-anywhere.herokuapp.com/"
};

/*
 * In development mode, for easier debugging, you can ignore zone related error
 * stack frames such as `zone.run`/`zoneDelegate.invokeTask` by importing the
 * below file. Don't forget to comment it out in production mode
 * because it will have a performance impact when errors are thrown
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
