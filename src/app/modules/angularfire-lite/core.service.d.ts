import * as firebase from 'firebase';
import { FirebaseAppConfig } from './core.module';
export declare class AngularFireLiteApp {
    private appConfig;
    constructor(appConfig: FirebaseAppConfig);
    instance(): firebase.app.App;
    config(): FirebaseAppConfig;
}
