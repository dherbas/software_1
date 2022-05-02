// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  // apiUrl: 'https://stagingapivalidador.multipago.com/v1/',
  // urlServicio: 'http://localhost/mpago-clientphp7/public/api/v2/',

  apiUrl: 'https://stagingapivalidador.multipago.com/v1/',
  urlServicio: 'https://stagingmultipago.multipago.com/api/v2/',
  serviceURL: 'https://stagingmultipago.multipago.com/api/',
  posServiceURL: 'https://stagingapivalidador.multipago.com/api/v1/POS/',

  clientId: 'CuzvO98IQBiA8cytJerKKA',
  client_secret: 'mF6BZLICSryki0Ln94PyLtsHpKSblHqG',
  url_redirect: 'https://www.uagrm.edu.bo/',
  zoom_backend: 'http://localhost:5001/api/v1/',
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related errodr stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Includgited with Angular CLI.
