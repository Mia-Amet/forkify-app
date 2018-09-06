import { Injectable, Inject, PLATFORM_ID, NgModule } from '@angular/core';
import { apps, initializeApp, app } from 'firebase';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Subject } from 'rxjs';
import { fromPromise } from 'rxjs/observable/fromPromise';
import { isPlatformBrowser, isPlatformServer, CommonModule } from '@angular/common';
import { BehaviorSubject } from 'rxjs';
import { makeStateKey, TransferState, BrowserTransferStateModule } from '@angular/platform-browser';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/do';
import 'firebase/firestore';

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */
class AngularFireLiteApp {
    /**
     * @param {?} appConfig
     */
    constructor(appConfig) {
        this.appConfig = appConfig;
    }
    /**
     * @return {?}
     */
    instance() {
        let /** @type {?} */ firebaseApp;
        if (!apps.length) {
            firebaseApp = /** @type {?} */ (initializeApp(this.appConfig));
        }
        else {
            firebaseApp = app();
        }
        return firebaseApp;
    }
    /**
     * @return {?}
     */
    config() {
        return this.appConfig;
    }
}
AngularFireLiteApp.decorators = [
    { type: Injectable },
];
/** @nocollapse */
AngularFireLiteApp.ctorParameters = () => [
    { type: FirebaseAppConfig, },
];

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */
class AngularFireLiteAuth {
    /**
     * @param {?} app
     * @param {?} http
     * @param {?} platformId
     */
    constructor(app$$1, http, platformId) {
        this.app = app$$1;
        this.http = http;
        this.platformId = platformId;
        this.browser = isPlatformBrowser(this.platformId);
        this.server = isPlatformServer(this.platformId);
        this.auth = app$$1.instance().auth();
        this.config = app$$1.config();
    }
    /**
     * @return {?}
     */
    uid() {
        const /** @type {?} */ UID = new Subject();
        this.isAuthenticated().subscribe((isAuth) => {
            if (isAuth) {
                this.auth.onAuthStateChanged((user) => {
                    UID.next(user.uid);
                });
            }
            else {
                UID.next(null);
            }
        });
        return UID;
    }
    /**
     * @return {?}
     */
    isAuthenticated() {
        const /** @type {?} */ IS_AUTHENTICATED = new Subject();
        this.auth.onAuthStateChanged((user) => {
            IS_AUTHENTICATED.next(!!user);
        });
        return IS_AUTHENTICATED;
    }
    /**
     * @return {?}
     */
    isAnonymous() {
        const /** @type {?} */ IS_ANONYMOUS = new Subject();
        this.auth.onAuthStateChanged((user) => {
            IS_ANONYMOUS.next(user.isAnonymous);
        });
        return IS_ANONYMOUS;
    }
    /**
     * @return {?}
     */
    currentUser() {
        const /** @type {?} */ CURRENT_USER = new Subject();
        CURRENT_USER.next(this.auth.currentUser);
        return CURRENT_USER;
    }
    /**
     * @return {?}
     */
    userData() {
        if (this.server) {
            return fromPromise(this.auth.currentUser.getIdToken(true).then((idToken) => {
                return this.http.post(`https://www.googleapis.com/identitytoolkit/v3/relyingparty/getAccountInfo?key=${this.config.apiKey}`, {
                    'idToken': idToken
                });
            }));
        }
        if (this.browser) {
            const /** @type {?} */ USER_DATA = new Subject();
            this.auth.onAuthStateChanged((user) => {
                if (user) {
                    USER_DATA.next({
                        displayName: user.displayName,
                        email: user.email,
                        emailVerified: user.emailVerified,
                        photoURL: user.photoURL,
                        isAnonymous: user.isAnonymous,
                        uid: user.uid,
                        providerData: user.providerData,
                        phoneNumber: user.phoneNumber
                    });
                }
            });
            return USER_DATA;
        }
    }
    /**
     * @param {?} email
     * @return {?}
     */
    providers(email) {
        if (this.server) {
            return this.http.post(`https://www.googleapis.com/identitytoolkit/v3/relyingparty/createAuthUri?key=${this.config.apiKey}`, {
                'identifier': email,
            });
        }
        if (this.browser) {
            const /** @type {?} */ PROVIDERS = new Subject();
            this.auth.fetchProvidersForEmail(email).then(((providers) => {
                PROVIDERS.next(providers);
            }));
            return PROVIDERS;
        }
    }
    /**
     * @param {?} email
     * @param {?} password
     * @return {?}
     */
    signin(email, password) {
        if (this.server) {
            return this.http.post(`https://www.googleapis.com/identitytoolkit/v3/relyingparty/verifyPassword?key=${this.config.apiKey}`, {
                'email': email,
                'password': password,
                'returnSecureToken': true
            });
        }
        if (this.browser) {
            return fromPromise(this.auth.signInWithEmailAndPassword(email, password));
        }
    }
    /**
     * @return {?}
     */
    signinAnonymously() {
        if (this.server) {
            return this.http.post(`https://www.googleapis.com/identitytoolkit/v3/relyingparty/signupNewUser?key=${this.config.apiKey}`, {
                'returnSecureToken': true
            });
        }
        if (this.browser) {
            return fromPromise(this.auth.signInAnonymously());
        }
    }
    /**
     * @param {?} email
     * @param {?} password
     * @return {?}
     */
    signup(email, password) {
        if (this.server) {
            return this.http.post(`https://www.googleapis.com/identitytoolkit/v3/relyingparty/signupNewUser?key=${this.config.apiKey}`, {
                'email': email,
                'password': password,
                'returnSecureToken': true
            });
        }
        if (this.browser) {
            return fromPromise(this.auth.createUserWithEmailAndPassword(email, password));
        }
    }
    /**
     * @return {?}
     */
    signout() {
        return fromPromise(this.auth.signOut());
    }
    /**
     * @param {?} data
     * @return {?}
     */
    updateProfile(data) {
        if (this.server) {
            let /** @type {?} */ deleteAttribute;
            if (data.displayName === null && data.photoURL === null) {
                deleteAttribute = '\'PHOTO_URL\' , \'DISPLAY_NAME\'';
            }
            else if (data.displayName === null) {
                deleteAttribute = 'DISPLAY_NAME';
            }
            else if (data.photoURL === null) {
                deleteAttribute = 'PHOTO_URL';
            }
            return this.auth.currentUser.getIdToken(true).then((idToken) => {
                return this.http.post(`https://www.googleapis.com/identitytoolkit/v3/relyingparty/setAccountInfo?key=${this.config.apiKey}`, {
                    'idToken': idToken,
                    'displayName': data.displayName,
                    'photoUrl': data.photoURL,
                    'deleteAttribute': deleteAttribute,
                    'returnSecureToken': true
                });
            });
        }
        if (this.browser) {
            return fromPromise(this.auth.currentUser.updateProfile(data));
        }
    }
    /**
     * @param {?} newEmail
     * @return {?}
     */
    updateEmail(newEmail) {
        if (this.server) {
            return this.auth.currentUser.getIdToken(true).then((idToken) => {
                return this.http.post(`https://www.googleapis.com/identitytoolkit/v3/relyingparty/setAccountInfo?key=${this.config.apiKey}`, {
                    'idToken': idToken,
                    'email': newEmail,
                    'returnSecureToken': true
                });
            });
        }
        if (this.browser) {
            return fromPromise(this.auth.currentUser.updateEmail(newEmail));
        }
    }
    /**
     * @param {?} newPassword
     * @return {?}
     */
    updatePassword(newPassword) {
        if (this.server) {
            return this.auth.currentUser.getIdToken(true).then((idToken) => {
                return this.http.post(`https://www.googleapis.com/identitytoolkit/v3/relyingparty/setAccountInfo?key=${this.config.apiKey}`, {
                    'idToken': idToken,
                    'password': newPassword,
                    'returnSecureToken': true
                });
            });
        }
        if (this.browser) {
            return fromPromise(this.auth.currentUser.updatePassword(newPassword));
        }
    }
    /**
     * @param {?} code
     * @return {?}
     */
    verifyPasswordResetCode(code) {
        if (this.server) {
            return this.http.post(`https://www.googleapis.com/identitytoolkit/v3/relyingparty/resetPassword?key=${this.config.apiKey}`, {
                'oobCode': code
            });
        }
        if (this.browser) {
            return fromPromise(this.auth.verifyPasswordResetCode(code));
        }
    }
    /**
     * @param {?} code
     * @param {?} newPassword
     * @return {?}
     */
    confirmPasswordReset(code, newPassword) {
        if (this.server) {
            return this.http.post(`https://www.googleapis.com/identitytoolkit/v3/relyingparty/resetPassword?key=${this.config.apiKey}`, {
                'oobCode': code,
                'newPassword': newPassword
            });
        }
        if (this.browser) {
            return fromPromise(this.auth.confirmPasswordReset(code, newPassword));
        }
    }
    /**
     * @param {?} credentials
     * @return {?}
     */
    relogin(credentials) {
        return fromPromise(this.auth.currentUser.reauthenticateWithCredential(credentials));
    }
    /**
     * @return {?}
     */
    deletePermanently() {
        if (this.server) {
            return fromPromise(this.auth.currentUser.getIdToken(true).then((idToken) => {
                return this.http.post(`https://www.googleapis.com/identitytoolkit/v3/relyingparty/deleteAccount?key=${this.config.apiKey}`, {
                    'idToken': idToken
                });
            }));
        }
        if (this.browser) {
            return fromPromise(this.auth.currentUser.delete());
        }
    }
    /**
     * @return {?}
     */
    sendEmailVerification() {
        if (this.server) {
            return fromPromise(this.auth.currentUser.getIdToken(true).then((idToken) => {
                return this.http
                    .post(`https://www.googleapis.com/identitytoolkit/v3/relyingparty/getOobConfirmationCode?key=${this.config.apiKey}`, {
                    'requestType': 'VERIFY_EMAIL',
                    'idToken': idToken
                });
            }));
        }
        if (this.browser) {
            return fromPromise(this.auth.currentUser.sendEmailVerification());
        }
    }
    /**
     * @param {?} email
     * @return {?}
     */
    sendPasswordResetEmail(email) {
        if (this.server) {
            return this.http.post(`https://www.googleapis.com/identitytoolkit/v3/relyingparty/getOobConfirmationCode?key=${this.config.apiKey}`, {
                'requestType': 'PASSWORD_RESET',
                'email': email
            });
        }
        if (this.browser) {
            return fromPromise(this.auth.sendPasswordResetEmail(email));
        }
    }
}
AngularFireLiteAuth.decorators = [
    { type: Injectable },
];
// ------------- Linking Accounts and Providers -----------------//
// TODO: Link with email/password
// TODO: Unlink provider
/** @nocollapse */
AngularFireLiteAuth.ctorParameters = () => [
    { type: AngularFireLiteApp, },
    { type: HttpClient, },
    { type: Object, decorators: [{ type: Inject, args: [PLATFORM_ID,] },] },
];

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */
class AngularFireLiteDatabase {
    /**
     * @param {?} app
     * @param {?} http
     * @param {?} state
     * @param {?} platformId
     */
    constructor(app$$1, http, state, platformId) {
        this.app = app$$1;
        this.http = http;
        this.state = state;
        this.platformId = platformId;
        this.server = isPlatformServer(this.platformId);
        this.browser = isPlatformBrowser(this.platformId);
        this.ref = (ref) => this.database.ref(ref);
        this.database = app$$1.instance().database();
        this.config = app$$1.config();
    }
    /**
     * @param {?} ref
     * @return {?}
     */
    read(ref) {
        const /** @type {?} */ dataStateKey = makeStateKey(ref);
        if (this.server) {
            return this.SRH(ref, dataStateKey);
        }
        if (this.browser) {
            return this.BRH(ref, 'value', dataStateKey);
        }
    }
    /**
     * @param {?} ref
     * @return {?}
     */
    childAdded(ref) {
        const /** @type {?} */ dataStateKey = makeStateKey(ref);
        if (this.server) {
            return this.SRH(ref, dataStateKey);
        }
        if (this.browser) {
            return this.BRH(ref, 'child_added', dataStateKey);
        }
    }
    /**
     * @param {?} ref
     * @return {?}
     */
    childChanged(ref) {
        const /** @type {?} */ dataStateKey = makeStateKey(ref);
        if (this.server) {
            return this.SRH(ref, dataStateKey);
        }
        if (this.browser) {
            return this.BRH(ref, 'child_changed', dataStateKey);
        }
    }
    /**
     * @param {?} ref
     * @return {?}
     */
    childRemoved(ref) {
        const /** @type {?} */ dataStateKey = makeStateKey(ref);
        if (this.server) {
            return this.SRH(ref, dataStateKey);
        }
        if (this.browser) {
            return this.BRH(ref, 'child_removed', dataStateKey);
        }
    }
    /**
     * @param {?} ref
     * @return {?}
     */
    childMoved(ref) {
        const /** @type {?} */ dataStateKey = makeStateKey(ref);
        if (this.server) {
            return this.SRH(ref, dataStateKey);
        }
        if (this.browser) {
            return this.BRH(ref, 'child_moved', dataStateKey);
        }
    }
    /**
     * @param {?} ref
     * @param {?} DSK
     * @return {?}
     */
    SRH(ref, DSK) {
        return this.http.get(`https://${this.config.projectId}.firebaseio.com/${ref}.json`)
            .map((payload) => {
            if (!!payload && typeof payload === 'object') {
                const /** @type {?} */ result = Object.keys(payload).map((key) => {
                    return [payload[key]];
                });
                this.state.set(DSK, result);
                return result;
            }
            else {
                this.state.set(DSK, payload);
                return payload;
            }
        });
    }
    /**
     * @param {?} ref
     * @param {?} event
     * @param {?} DSK
     * @return {?}
     */
    BRH(ref, event, DSK) {
        if (this.browser) {
            const /** @type {?} */ SSRedValue = this.state.get(DSK, []);
            const /** @type {?} */ DATA = new BehaviorSubject(SSRedValue);
            this.ref(ref).on(event, (snapshot) => {
                if (!!snapshot.val() && typeof snapshot.val() === 'object') {
                    const /** @type {?} */ result = Object.keys(snapshot.val()).map(function (key) {
                        return [snapshot.val()[key]];
                    });
                    DATA.next(result);
                }
                else {
                    DATA.next(snapshot.val());
                }
            });
            return DATA;
        }
    }
    /**
     * @param {?} ref
     * @param {?} data
     * @return {?}
     */
    write(ref, data) {
        if (this.server) {
            return this.http.put(`https://${this.config.projectId}.firebaseio.com/${ref}.json?print=silent`, data);
        }
        if (this.browser) {
            return fromPromise(this.ref(ref).set(data));
        }
    }
    /**
     * @param {?} ref
     * @param {?} data
     * @return {?}
     */
    push(ref, data) {
        if (this.server) {
            return this.http.post(`https://${this.config.projectId}.firebaseio.com/${ref}.json?print=silent`, data);
        }
        if (this.browser) {
            return fromPromise(this.ref(ref).push(data));
        }
    }
    /**
     * @param {?} ref
     * @param {?} data
     * @return {?}
     */
    update(ref, data) {
        if (this.server) {
            return this.http.patch(`https://${this.config.projectId}.firebaseio.com/${ref}.json?print=silent`, data);
        }
        if (this.browser) {
            return fromPromise(this.ref(ref).update(data));
        }
    }
    /**
     * @param {?} ref
     * @return {?}
     */
    remove(ref) {
        if (this.server) {
            return this.http.delete(`https://${this.config.projectId}.firebaseio.com/${ref}.json`);
        }
        if (this.browser) {
            return fromPromise(this.ref(ref).remove());
        }
    }
    /**
     * @param {?} ref
     * @return {?}
     */
    query(ref) {
        const /** @type {?} */ PID = this.platformId;
        const /** @type {?} */ state = this.state;
        const /** @type {?} */ db = this.database;
        const /** @type {?} */ http = this.http;
        const /** @type {?} */ config = this.config;
        const /** @type {?} */ SQH = function (REF, FSQ, DSK) {
            return http.get(`https://${config.projectId}.firebaseio.com/${REF}.json?${FSQ}`)
                .map((payload) => {
                if (!!payload && typeof payload === 'object') {
                    const /** @type {?} */ result = Object.keys(payload).map((key) => {
                        return [payload[key]];
                    });
                    state.set(DSK, result);
                    return result;
                }
                else {
                    state.set(DSK, payload);
                    return payload;
                }
            });
        };
        const /** @type {?} */ BQH = function (BS) {
            return (snapshot) => {
                if (!!snapshot.val() && typeof snapshot.val() === 'object') {
                    const /** @type {?} */ result = Object.keys(snapshot.val()).map(function (key) {
                        return [snapshot.val()[key]];
                    });
                    BS.next(result);
                }
                else {
                    BS.next(snapshot.val());
                }
            };
        };
        let /** @type {?} */ SQ = '';
        let /** @type {?} */ BQ = /** @type {?} */ (this.ref(ref));
        return {
            /**
             * @param {?} value
             * @return {?}
             */
            startAt(value) {
                SQ += `&startAt=${value}`;
                BQ = BQ.startAt(value);
                return this;
            },
            /**
             * @param {?} value
             * @return {?}
             */
            endAt(value) {
                SQ += `&endAt=${value}`;
                BQ = BQ.endAt(value);
                return this;
            },
            /**
             * @param {?} value
             * @return {?}
             */
            equalTo(value) {
                SQ += `&equalTo=${value}`;
                BQ = BQ.equalTo(value);
                return this;
            },
            /**
             * @param {?} query
             * @return {?}
             */
            isEqual(query) {
                if (isPlatformBrowser(PID)) {
                    return db.ref(ref).isEqual(query);
                }
            },
            /**
             * @param {?} limit
             * @return {?}
             */
            limitToFirst(limit) {
                SQ += `&limitToFirst=${limit}`;
                BQ = BQ.limitToFirst(limit);
                return this;
            },
            /**
             * @param {?} limit
             * @return {?}
             */
            limitToLast(limit) {
                SQ += `&limitToLast=${limit}`;
                BQ = BQ.limitToLast(limit);
                return this;
            },
            /**
             * @param {?} path
             * @return {?}
             */
            orderByChild(path) {
                SQ += `&orderBy="${path}"`;
                BQ = BQ.orderByChild(path);
                return this;
            },
            /**
             * @return {?}
             */
            orderByKey() {
                SQ += `&orderBy="$key"`;
                BQ = BQ.orderByKey();
                return this;
            },
            /**
             * @return {?}
             */
            orderByPriority() {
                SQ += `&orderBy="$priority"`;
                BQ = BQ.orderByPriority();
                return this;
            },
            /**
             * @return {?}
             */
            orderByValue() {
                SQ += `&orderBy="$value"`;
                BQ = BQ.orderByValue();
                return this;
            },
            /**
             * @param {?} event
             * @return {?}
             */
            on(event) {
                const /** @type {?} */ dataStateKey = makeStateKey(ref);
                if (isPlatformServer(PID)) {
                    return SQH(ref, SQ, dataStateKey);
                }
                if (isPlatformBrowser(PID)) {
                    const /** @type {?} */ SSRedValue = state.get(dataStateKey, []);
                    const /** @type {?} */ VALUE = new BehaviorSubject(SSRedValue);
                    BQ.on(event, BQH(VALUE));
                    return VALUE;
                }
            },
            /**
             * @param {?} event
             * @return {?}
             */
            once(event) {
                const /** @type {?} */ dataStateKey = makeStateKey(ref);
                if (isPlatformServer(PID)) {
                    return SQH(ref, SQ, dataStateKey);
                }
                if (isPlatformBrowser(PID)) {
                    const /** @type {?} */ SSRedValue = state.get(dataStateKey, []);
                    const /** @type {?} */ VALUE = new BehaviorSubject(SSRedValue);
                    BQ.once(event, BQH(VALUE));
                    return VALUE;
                }
            }
        };
    }
}
AngularFireLiteDatabase.decorators = [
    { type: Injectable },
];
/** @nocollapse */
AngularFireLiteDatabase.ctorParameters = () => [
    { type: AngularFireLiteApp, },
    { type: HttpClient, },
    { type: TransferState, },
    { type: Object, decorators: [{ type: Inject, args: [PLATFORM_ID,] },] },
];
/**
 * @record
 */

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */
class AngularFireLiteFirestore {
    /**
     * @param {?} app
     * @param {?} http
     * @param {?} state
     * @param {?} platformId
     */
    constructor(app$$1, http, state, platformId) {
        this.app = app$$1;
        this.http = http;
        this.state = state;
        this.platformId = platformId;
        this.browser = isPlatformBrowser(this.platformId);
        this.firestore = app$$1.instance().firestore();
        this.config = app$$1.config();
    }
    /**
     * @param {?} ref
     * @return {?}
     */
    read(ref) {
        const /** @type {?} */ dataStateKey = makeStateKey(ref);
        const /** @type {?} */ refArray = ref.split('/');
        if (refArray[0] === '/') {
            refArray.shift();
        }
        if (refArray[refArray.length - 1] === '/') {
            refArray.pop();
        }
        const /** @type {?} */ slashes = refArray.length - 1;
        if (isPlatformServer(this.platformId)) {
            return this.http
                .get(`https://firestore.googleapis.com/v1beta1/projects/${this.config.projectId}/databases/(default)/documents/${ref}`)
                .map((res) => {
                const /** @type {?} */ docData = {};
                if (slashes % 2 !== 0) {
                    Object.keys(res.fields)
                        .forEach((key) => {
                        for (const /** @type {?} */ keyValue in res.fields[key]) {
                            if (keyValue) {
                                docData[key] = res.fields[key][keyValue];
                            }
                        }
                    });
                    return docData;
                }
                else {
                    const /** @type {?} */ colData = [];
                    res.documents.forEach((doc) => {
                        const /** @type {?} */ singleDocData = {};
                        Object.keys(doc.fields)
                            .forEach((key) => {
                            for (const /** @type {?} */ keyValue in doc.fields[key]) {
                                if (keyValue) {
                                    singleDocData[key] = doc.fields[key][keyValue];
                                }
                            }
                        });
                        colData.push(singleDocData);
                    });
                    return colData;
                }
            })
                .do((pl) => {
                this.state.set(dataStateKey, pl);
            });
        }
        if (this.browser) {
            const /** @type {?} */ data = [];
            const /** @type {?} */ SSRedValue = this.state.get(dataStateKey, []);
            const /** @type {?} */ DATA = new BehaviorSubject(SSRedValue);
            if (slashes % 2 === 0) {
                this.firestore.collection(ref).onSnapshot((snapshot) => {
                    snapshot.docs.forEach((doc) => {
                        data.push(doc.data());
                    });
                    DATA.next(data);
                });
            }
            else {
                this.firestore.doc(ref).onSnapshot((snapshot) => {
                    DATA.next(snapshot.data());
                });
            }
            return DATA;
        }
    }
    /**
     * @param {?} ref
     * @param {?} data
     * @param {?=} merge
     * @return {?}
     */
    write(ref, data, merge) {
        if (this.browser) {
            return fromPromise(this.firestore.doc(ref).set(data, { merge: merge }));
        }
    }
    /**
     * @param {?} ref
     * @param {?} data
     * @return {?}
     */
    push(ref, data) {
        if (this.browser) {
            return fromPromise(this.firestore.collection(ref).add(data));
        }
    }
    /**
     * @param {?} ref
     * @param {?} data
     * @return {?}
     */
    update(ref, data) {
        if (this.browser) {
            return fromPromise(this.firestore.doc(ref).update(data));
        }
    }
    /**
     * @param {?} DocumentRef
     * @return {?}
     */
    remove(DocumentRef) {
        if (isPlatformServer(this.platformId)) {
            return this.http
                .delete(`https://firestore.googleapis.com/v1beta1/projects/${this.config.projectId}/databases/(default)/documents/${DocumentRef}`);
        }
        if (this.browser) {
            return fromPromise(this.firestore.doc(DocumentRef).delete());
        }
    }
    /**
     * @param {?} ref
     * @param {...?} fields
     * @return {?}
     */
    removeField(ref, ...fields) {
        if (this.browser) {
            return fromPromise(this.firestore.doc(ref).update(fields));
        }
    }
    /**
     * @param {?} collectionRef
     * @return {?}
     */
    removeCollection(collectionRef) {
        if (this.browser) {
            return fromPromise(this.firestore.collection(collectionRef).get().then((snapshot) => {
                snapshot.docs.forEach((doc) => {
                    this.firestore.batch().delete(doc.ref);
                });
            }));
        }
    }
    /**
     * @param {?} ref
     * @return {?}
     */
    query(ref) {
        const /** @type {?} */ PID = this.platformId;
        const /** @type {?} */ HTTP = this.http;
        const /** @type {?} */ CONFIG = this.config;
        const /** @type {?} */ state = this.state;
        const /** @type {?} */ fs = this.firestore;
        const /** @type {?} */ SSQ = {
            'from': [{ 'collectionId': `${ref}` }]
        };
        const /** @type {?} */ SQHFS = function (DSK) {
            const /** @type {?} */ data = [];
            return HTTP
                .post(`https://firestore.googleapis.com/v1beta1/projects/${CONFIG.projectId}/databases/(default)/documents:runQuery`, SQ)
                .map((res) => {
                for (const /** @type {?} */ doc of res) {
                    const /** @type {?} */ documentData = {};
                    Object.keys(doc.document.fields).forEach((fieldName) => {
                        const /** @type {?} */ fieldType = Object.keys(doc.document.fields[fieldName]);
                        documentData[fieldName] = doc.document.fields[fieldName][fieldType[0]];
                    });
                    data.push(documentData);
                }
                return data;
            })
                .do((pl) => {
                state.set(DSK, pl);
            });
        };
        const /** @type {?} */ SQ = {
            'structuredQuery': SSQ
        };
        const /** @type {?} */ SQOB = [];
        let /** @type {?} */ BQ = /** @type {?} */ (fs.collection(ref));
        return {
            /**
             * @param {?} document
             * @param {?} comparison
             * @param {?} value
             * @return {?}
             */
            where(document, comparison, value) {
                let /** @type {?} */ SOP = '';
                switch (comparison) {
                    case '<':
                        SOP = 'LESS_THAN';
                        break;
                    case '<=':
                        SOP = 'LESS_THAN_OR_EQUAL';
                        break;
                    case '>':
                        SOP = 'GREATER_THAN';
                        break;
                    case '>=':
                        SOP = 'GREATER_THAN_OR_EQUAL';
                        break;
                    case '==':
                        SOP = 'EQUAL';
                        break;
                }
                SSQ['where'] = {};
                SSQ['where'].fieldFilter = {};
                SSQ['where'].fieldFilter.field = {};
                SSQ['where'].fieldFilter.field.fieldPath = ref;
                SSQ['where'].fieldFilter.op = SOP;
                SSQ['where'].fieldFilter.value = FormatServerData(value);
                BQ = BQ.where(document, comparison, value);
                return this;
            },
            /**
             * @param {...?} startValue
             * @return {?}
             */
            startAt(...startValue) {
                const /** @type {?} */ SV = [];
                startValue.forEach((value) => {
                    SV.push(FormatServerData(value));
                });
                SSQ.startAt = {};
                SSQ.startAt.before = true;
                SSQ.startAt.values = SV;
                BQ = BQ.startAt(...startValue);
                return this;
            },
            /**
             * @param {...?} startValue
             * @return {?}
             */
            startAfter(...startValue) {
                const /** @type {?} */ SV = [];
                startValue.forEach((value) => {
                    SV.push(FormatServerData(value));
                });
                SSQ.startAt = {};
                SSQ.startAt.before = false;
                SSQ.startAt.values = SV;
                BQ = BQ.startAfter(...startValue);
                return this;
            },
            /**
             * @param {...?} endValue
             * @return {?}
             */
            endAt(...endValue) {
                const /** @type {?} */ SV = [];
                endValue.forEach((value) => {
                    SV.push(FormatServerData(value));
                });
                SSQ.endAt = {};
                SSQ.endAt.before = false;
                SSQ.endAt.values = SV;
                BQ = BQ.endAt(...endValue);
                return this;
            },
            /**
             * @param {...?} endValue
             * @return {?}
             */
            endBefore(...endValue) {
                const /** @type {?} */ SV = [];
                endValue.forEach((value) => {
                    SV.push(FormatServerData(value));
                });
                SSQ.endAt = {};
                SSQ.endAt.before = true;
                SSQ.endAt.values = SV;
                BQ = BQ.endBefore(...endValue);
                return this;
            },
            /**
             * @param {?} limit
             * @return {?}
             */
            limit(limit) {
                SSQ.limit = limit;
                BQ = BQ.limit(limit);
                return this;
            },
            /**
             * @param {?} path
             * @param {?=} order
             * @return {?}
             */
            orderBy(path, order) {
                const /** @type {?} */ orderBy = {
                    field: {
                        fieldPath: ''
                    }
                };
                orderBy.field.fieldPath = path;
                switch (order) {
                    case 'asc':
                        orderBy['direction'] = 'ASCENDING';
                        break;
                    case 'desc':
                        orderBy['direction'] = 'DESCENDING';
                        break;
                }
                SQOB.push(orderBy);
                BQ = BQ.orderBy(path, order);
                SSQ.orderBy = /** @type {?} */ (SQOB);
                return this;
            },
            /**
             * @return {?}
             */
            on() {
                const /** @type {?} */ ONDSK = makeStateKey(ref + ':query');
                if (isPlatformServer(PID)) {
                    return SQHFS(ONDSK);
                }
                if (isPlatformBrowser(PID)) {
                    const /** @type {?} */ SSRedValue = state.get(ONDSK, []);
                    const /** @type {?} */ VALUE = new BehaviorSubject(SSRedValue);
                    BQ.onSnapshot((snapshot) => {
                        const /** @type {?} */ data = [];
                        snapshot.forEach((doc) => {
                            data.push(doc.data());
                        });
                        VALUE.next(data);
                    });
                    return VALUE;
                }
            },
            /**
             * @return {?}
             */
            get() {
                const /** @type {?} */ GETDSK = makeStateKey(ref + ':query');
                if (isPlatformServer(PID)) {
                    return SQHFS(GETDSK);
                }
                if (isPlatformBrowser(PID)) {
                    const /** @type {?} */ data = [];
                    const /** @type {?} */ SSRedValue = state.get(GETDSK, []);
                    const /** @type {?} */ VALUE = new BehaviorSubject(SSRedValue);
                    BQ.get().then((snapshot) => {
                        snapshot.forEach((doc) => {
                            data.push(doc);
                        });
                        VALUE.next(data);
                    });
                    return VALUE;
                }
            }
        };
    }
    /**
     * @return {?}
     */
    transaction() {
        if (this.browser) {
            const /** @type {?} */ fs = this.firestore;
            let /** @type {?} */ transactionToRun;
            let /** @type {?} */ readCount = 0;
            const /** @type {?} */ transactions = {
                /**
                 * @param {?} ref
                 * @return {?}
                 */
                get(ref) {
                    return fs.doc(ref).get();
                },
                /**
                 * @param {?} ref
                 * @param {?} data
                 * @return {?}
                 */
                set(ref, data) {
                    return fs.doc(ref).set(data);
                }
            };
            return {
                /**
                 * @param {?} ref
                 * @param {?} data
                 * @return {?}
                 */
                set(ref, data) {
                    transactionToRun = transactionToRun.then(() => {
                        transactions.set(ref, data);
                    });
                    return this;
                },
                /**
                 * @param {?} ref
                 * @return {?}
                 */
                get(ref) {
                    const /** @type {?} */ getSubject = new Subject();
                    if (readCount > 0) {
                        transactionToRun = transactionToRun.then(() => {
                            transactions.get(ref).then((value) => {
                                getSubject.next({ data: value.data(), next: this });
                            });
                        });
                    }
                    else if (readCount === 0) {
                        transactionToRun = transactions.get(ref).then((value) => {
                            getSubject.next({ data: value.data(), next: this });
                        });
                    }
                    readCount++;
                    return getSubject;
                },
                /**
                 * @return {?}
                 */
                run() {
                    return fromPromise(fs.runTransaction(() => {
                        return transactionToRun;
                    }));
                }
            };
        }
        else {
            console.log('transactions SSR is not supported yet');
        }
    }
    /**
     * @return {?}
     */
    batch() {
        if (this.browser) {
            const /** @type {?} */ fs = this.firestore;
            const /** @type {?} */ b = this.firestore.batch();
            return {
                /**
                 * @param {?} ref
                 * @param {?} data
                 * @return {?}
                 */
                set(ref, data) {
                    b.set(fs.doc(ref), data);
                    return this;
                },
                /**
                 * @param {?} ref
                 * @param {?} data
                 * @return {?}
                 */
                update(ref, data) {
                    b.update(fs.doc(ref), data);
                    return this;
                },
                /**
                 * @param {?} ref
                 * @return {?}
                 */
                delete(ref) {
                    b.delete(fs.doc(ref));
                    return this;
                },
                /**
                 * @return {?}
                 */
                commit() {
                    return fromPromise(b.commit());
                }
            };
        }
        else {
            console.log('batched writes SSR is not supported yet');
        }
    }
}
AngularFireLiteFirestore.decorators = [
    { type: Injectable },
];
/** @nocollapse */
AngularFireLiteFirestore.ctorParameters = () => [
    { type: AngularFireLiteApp, },
    { type: HttpClient, },
    { type: TransferState, },
    { type: Object, decorators: [{ type: Inject, args: [PLATFORM_ID,] },] },
];
/**
 * @param {?} value
 * @return {?}
 */
function FormatServerData(value) {
    switch (value) {
        case (typeof value === 'boolean'):
            return { 'booleanValue': value };
        case (typeof value === 'string'):
            return { 'stringValue': value };
        case (typeof value === 'number'):
            return { 'doubleValue': value };
        case (typeof value === 'object') && (value):
            return { 'arrayValue': value };
    }
}
/**
 * @record
 */

/**
 * @record
 */

/**
 * @record
 */

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */
class AngularFireLiteStorage {
    /**
     * @param {?} app
     * @param {?} platformId
     */
    constructor(app$$1, platformId) {
        this.app = app$$1;
        this.platformId = platformId;
        this.browser = isPlatformBrowser(this.platformId);
        this.storage = app$$1.instance().storage();
    }
    /**
     * @param {?} ref
     * @param {?} file
     * @param {?=} metadata
     * @return {?}
     */
    upload(ref, file, metadata) {
        if (this.browser) {
            return fromPromise(this.child(ref).put(file, metadata));
        }
    }
    /**
     * @param {?} ref
     * @param {?} string
     * @return {?}
     */
    uploadString(ref, string) {
        if (this.browser) {
            return fromPromise(this.child(ref).putString(string));
        }
    }
    /**
     * @param {?} ref
     * @return {?}
     */
    download(ref) {
        if (this.browser) {
            return fromPromise(this.child(ref).getDownloadURL());
        }
    }
    /**
     * @param {?} ref
     * @return {?}
     */
    remove(ref) {
        if (this.browser) {
            return fromPromise(this.child(ref).delete());
        }
    }
    /**
     * @param {?} ref
     * @return {?}
     */
    getMetadata(ref) {
        if (this.browser) {
            const /** @type {?} */ META = new Subject();
            this.child(ref).getMetadata().then((meta) => {
                META.next(meta);
            });
            return META;
        }
    }
    /**
     * @param {?} ref
     * @param {?} metadata
     * @return {?}
     */
    updateMetadata(ref, metadata) {
        if (this.browser) {
            return fromPromise(this.child(ref).updateMetadata(metadata));
        }
    }
    /**
     * @param {?} ref
     * @return {?}
     */
    deleteMetadata(ref) {
        if (this.browser) {
            return fromPromise(this.child(ref).updateMetadata({
                customMetadata: null,
                cacheControl: null,
                contentEncoding: null,
                contentLanguage: null,
                contentType: null
            }));
        }
    }
    /**
     * @param {?} ref
     * @return {?}
     */
    child(ref) {
        return this.storage.ref().child(ref);
    }
}
AngularFireLiteStorage.decorators = [
    { type: Injectable },
];
/** @nocollapse */
AngularFireLiteStorage.ctorParameters = () => [
    { type: AngularFireLiteApp, },
    { type: Object, decorators: [{ type: Inject, args: [PLATFORM_ID,] },] },
];

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */
class AngularFireLiteMessaging {
    /**
     * @param {?} app
     * @param {?} platformId
     */
    constructor(app$$1, platformId) {
        this.app = app$$1;
        this.platformId = platformId;
        this.browser = isPlatformBrowser(this.platformId);
        this.messaging = app$$1.instance().messaging();
    }
    /**
     * @return {?}
     */
    instance() {
        if (this.browser) {
            return this.messaging;
        }
    }
    /**
     * @return {?}
     */
    token() {
        if (this.browser) {
            return fromPromise(this.messaging.getToken());
        }
    }
    /**
     * @return {?}
     */
    tokenRefresh() {
        if (this.browser) {
            const /** @type {?} */ REFRESH_TOKEN = new Subject();
            this.messaging.onMessage(() => {
                this.messaging.getToken().then((token) => {
                    REFRESH_TOKEN.next(token);
                });
            });
            return REFRESH_TOKEN;
        }
    }
    /**
     * @return {?}
     */
    requestPermission() {
        if (this.browser) {
            return fromPromise(this.messaging.requestPermission());
        }
    }
    /**
     * @param {?} token
     * @return {?}
     */
    deleteToken(token) {
        if (this.browser) {
            return fromPromise((this.messaging.deleteToken(token)));
        }
    }
}
AngularFireLiteMessaging.decorators = [
    { type: Injectable },
];
/** @nocollapse */
AngularFireLiteMessaging.ctorParameters = () => [
    { type: AngularFireLiteApp, },
    { type: Object, decorators: [{ type: Inject, args: [PLATFORM_ID,] },] },
];

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */
/**
 * @param {?} config
 * @return {?}
 */
function AngularFireLiteAppFactory(config) {
    return new AngularFireLiteApp(config);
}
class FirebaseAppConfig {
}
class AngularFireLite {
    /**
     * @param {?} fireConfig
     * @return {?}
     */
    static forRoot(fireConfig) {
        return {
            ngModule: AngularFireLite,
            providers: [
                { provide: FirebaseAppConfig, useValue: fireConfig },
                {
                    provide: AngularFireLiteApp,
                    useFactory: AngularFireLiteAppFactory,
                    deps: [FirebaseAppConfig]
                },
                AngularFireLiteDatabase,
                AngularFireLiteAuth,
                AngularFireLiteFirestore,
                AngularFireLiteStorage,
                AngularFireLiteMessaging
            ]
        };
    }
}
AngularFireLite.decorators = [
    { type: NgModule, args: [{
                imports: [
                    HttpClientModule,
                    CommonModule,
                    BrowserTransferStateModule
                ]
            },] },
];

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */
/**
 * Generated bundle index. Do not edit.
 */

export { AngularFireLiteAppFactory, FirebaseAppConfig, AngularFireLite, AngularFireLiteApp, AngularFireLiteDatabase, AngularFireLiteStorage, AngularFireLiteMessaging, AngularFireLiteFirestore, FormatServerData, AngularFireLiteAuth };
//# sourceMappingURL=angularfire-lite.js.map
