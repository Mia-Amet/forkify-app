import { ModuleWithProviders } from '@angular/core';
import { AngularFireLiteApp } from './core.service';
export declare function AngularFireLiteAppFactory(config: FirebaseAppConfig): AngularFireLiteApp;
export declare class FirebaseAppConfig {
    apiKey?: string;
    authDomain?: string;
    databaseURL?: string;
    storageBucket?: string;
    messagingSenderId?: string;
    projectId?: string;
}
export declare class AngularFireLite {
    static forRoot(fireConfig: any): ModuleWithProviders;
}
