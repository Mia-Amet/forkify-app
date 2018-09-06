(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('@angular/core'), require('firebase'), require('@angular/common/http'), require('rxjs/Subject'), require('rxjs/observable/fromPromise'), require('@angular/common'), require('rxjs/BehaviorSubject'), require('@angular/platform-browser'), require('rxjs/add/operator/map'), require('rxjs/add/operator/do'), require('firebase/firestore')) :
	typeof define === 'function' && define.amd ? define('angularfire-lite', ['exports', '@angular/core', 'firebase', '@angular/common/http', 'rxjs/Subject', 'rxjs/observable/fromPromise', '@angular/common', 'rxjs/BehaviorSubject', '@angular/platform-browser', 'rxjs/add/operator/map', 'rxjs/add/operator/do', 'firebase/firestore'], factory) :
	(factory((global['angularfire-lite'] = {}),global.ng.core,global.firebase,global.ng.common.http,global.Rx,global.Rx.Observable,global.ng.common,global.Rx,global.ng.platformBrowser));
}(this, (function (exports,core,firebase,http,Subject,fromPromise,common,BehaviorSubject,platformBrowser) { 'use strict';

/*! *****************************************************************************
Copyright (c) Microsoft Corporation. All rights reserved.
Licensed under the Apache License, Version 2.0 (the "License"); you may not use
this file except in compliance with the License. You may obtain a copy of the
License at http://www.apache.org/licenses/LICENSE-2.0
THIS CODE IS PROVIDED ON AN *AS IS* BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
KIND, EITHER EXPRESS OR IMPLIED, INCLUDING WITHOUT LIMITATION ANY IMPLIED
WARRANTIES OR CONDITIONS OF TITLE, FITNESS FOR A PARTICULAR PURPOSE,
MERCHANTABLITY OR NON-INFRINGEMENT.
See the Apache Version 2.0 License for specific language governing permissions
and limitations under the License.
***************************************************************************** */
/* global Reflect, Promise */









function __values(o) {
    var m = typeof Symbol === "function" && o[Symbol.iterator], i = 0;
    if (m) return m.call(o);
    return {
        next: function () {
            if (o && i >= o.length) o = void 0;
            return { value: o && o[i++], done: !o };
        }
    };
}
function __read(o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
    }
    catch (error) { e = { error: error }; }
    finally {
        try {
            if (r && !r.done && (m = i["return"])) m.call(i);
        }
        finally { if (e) throw e.error; }
    }
    return ar;
}
function __spread() {
    for (var ar = [], i = 0; i < arguments.length; i++)
        ar = ar.concat(__read(arguments[i]));
    return ar;
}

var AngularFireLiteApp = /** @class */ (function () {
    function AngularFireLiteApp(appConfig) {
        this.appConfig = appConfig;
    }
    AngularFireLiteApp.prototype.instance = function () {
        var firebaseApp;
        if (!firebase.apps.length) {
            firebaseApp = (firebase.initializeApp(this.appConfig));
        }
        else {
            firebaseApp = firebase.app();
        }
        return firebaseApp;
    };
    AngularFireLiteApp.prototype.config = function () {
        return this.appConfig;
    };
    return AngularFireLiteApp;
}());
AngularFireLiteApp.decorators = [
    { type: core.Injectable },
];
AngularFireLiteApp.ctorParameters = function () { return [
    { type: FirebaseAppConfig, },
]; };
var AngularFireLiteAuth = /** @class */ (function () {
    function AngularFireLiteAuth(app$$1, http$$1, platformId) {
        this.app = app$$1;
        this.http = http$$1;
        this.platformId = platformId;
        this.browser = common.isPlatformBrowser(this.platformId);
        this.server = common.isPlatformServer(this.platformId);
        this.auth = app$$1.instance().auth();
        this.config = app$$1.config();
    }
    AngularFireLiteAuth.prototype.uid = function () {
        var _this = this;
        var UID = new Subject.Subject();
        this.isAuthenticated().subscribe(function (isAuth) {
            if (isAuth) {
                _this.auth.onAuthStateChanged(function (user) {
                    UID.next(user.uid);
                });
            }
            else {
                UID.next(null);
            }
        });
        return UID;
    };
    AngularFireLiteAuth.prototype.isAuthenticated = function () {
        var IS_AUTHENTICATED = new Subject.Subject();
        this.auth.onAuthStateChanged(function (user) {
            IS_AUTHENTICATED.next(!!user);
        });
        return IS_AUTHENTICATED;
    };
    AngularFireLiteAuth.prototype.isAnonymous = function () {
        var IS_ANONYMOUS = new Subject.Subject();
        this.auth.onAuthStateChanged(function (user) {
            IS_ANONYMOUS.next(user.isAnonymous);
        });
        return IS_ANONYMOUS;
    };
    AngularFireLiteAuth.prototype.currentUser = function () {
        var CURRENT_USER = new Subject.Subject();
        CURRENT_USER.next(this.auth.currentUser);
        return CURRENT_USER;
    };
    AngularFireLiteAuth.prototype.userData = function () {
        var _this = this;
        if (this.server) {
            return fromPromise.fromPromise(this.auth.currentUser.getIdToken(true).then(function (idToken) {
                return _this.http.post("https://www.googleapis.com/identitytoolkit/v3/relyingparty/getAccountInfo?key=" + _this.config.apiKey, {
                    'idToken': idToken
                });
            }));
        }
        if (this.browser) {
            var USER_DATA_1 = new Subject.Subject();
            this.auth.onAuthStateChanged(function (user) {
                if (user) {
                    USER_DATA_1.next({
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
            return USER_DATA_1;
        }
    };
    AngularFireLiteAuth.prototype.providers = function (email) {
        if (this.server) {
            return this.http.post("https://www.googleapis.com/identitytoolkit/v3/relyingparty/createAuthUri?key=" + this.config.apiKey, {
                'identifier': email,
            });
        }
        if (this.browser) {
            var PROVIDERS_1 = new Subject.Subject();
            this.auth.fetchProvidersForEmail(email).then((function (providers) {
                PROVIDERS_1.next(providers);
            }));
            return PROVIDERS_1;
        }
    };
    AngularFireLiteAuth.prototype.signin = function (email, password) {
        if (this.server) {
            return this.http.post("https://www.googleapis.com/identitytoolkit/v3/relyingparty/verifyPassword?key=" + this.config.apiKey, {
                'email': email,
                'password': password,
                'returnSecureToken': true
            });
        }
        if (this.browser) {
            return fromPromise.fromPromise(this.auth.signInWithEmailAndPassword(email, password));
        }
    };
    AngularFireLiteAuth.prototype.signinAnonymously = function () {
        if (this.server) {
            return this.http.post("https://www.googleapis.com/identitytoolkit/v3/relyingparty/signupNewUser?key=" + this.config.apiKey, {
                'returnSecureToken': true
            });
        }
        if (this.browser) {
            return fromPromise.fromPromise(this.auth.signInAnonymously());
        }
    };
    AngularFireLiteAuth.prototype.signup = function (email, password) {
        if (this.server) {
            return this.http.post("https://www.googleapis.com/identitytoolkit/v3/relyingparty/signupNewUser?key=" + this.config.apiKey, {
                'email': email,
                'password': password,
                'returnSecureToken': true
            });
        }
        if (this.browser) {
            return fromPromise.fromPromise(this.auth.createUserWithEmailAndPassword(email, password));
        }
    };
    AngularFireLiteAuth.prototype.signout = function () {
        return fromPromise.fromPromise(this.auth.signOut());
    };
    AngularFireLiteAuth.prototype.updateProfile = function (data) {
        var _this = this;
        if (this.server) {
            var deleteAttribute_1;
            if (data.displayName === null && data.photoURL === null) {
                deleteAttribute_1 = '\'PHOTO_URL\' , \'DISPLAY_NAME\'';
            }
            else if (data.displayName === null) {
                deleteAttribute_1 = 'DISPLAY_NAME';
            }
            else if (data.photoURL === null) {
                deleteAttribute_1 = 'PHOTO_URL';
            }
            return this.auth.currentUser.getIdToken(true).then(function (idToken) {
                return _this.http.post("https://www.googleapis.com/identitytoolkit/v3/relyingparty/setAccountInfo?key=" + _this.config.apiKey, {
                    'idToken': idToken,
                    'displayName': data.displayName,
                    'photoUrl': data.photoURL,
                    'deleteAttribute': deleteAttribute_1,
                    'returnSecureToken': true
                });
            });
        }
        if (this.browser) {
            return fromPromise.fromPromise(this.auth.currentUser.updateProfile(data));
        }
    };
    AngularFireLiteAuth.prototype.updateEmail = function (newEmail) {
        var _this = this;
        if (this.server) {
            return this.auth.currentUser.getIdToken(true).then(function (idToken) {
                return _this.http.post("https://www.googleapis.com/identitytoolkit/v3/relyingparty/setAccountInfo?key=" + _this.config.apiKey, {
                    'idToken': idToken,
                    'email': newEmail,
                    'returnSecureToken': true
                });
            });
        }
        if (this.browser) {
            return fromPromise.fromPromise(this.auth.currentUser.updateEmail(newEmail));
        }
    };
    AngularFireLiteAuth.prototype.updatePassword = function (newPassword) {
        var _this = this;
        if (this.server) {
            return this.auth.currentUser.getIdToken(true).then(function (idToken) {
                return _this.http.post("https://www.googleapis.com/identitytoolkit/v3/relyingparty/setAccountInfo?key=" + _this.config.apiKey, {
                    'idToken': idToken,
                    'password': newPassword,
                    'returnSecureToken': true
                });
            });
        }
        if (this.browser) {
            return fromPromise.fromPromise(this.auth.currentUser.updatePassword(newPassword));
        }
    };
    AngularFireLiteAuth.prototype.verifyPasswordResetCode = function (code) {
        if (this.server) {
            return this.http.post("https://www.googleapis.com/identitytoolkit/v3/relyingparty/resetPassword?key=" + this.config.apiKey, {
                'oobCode': code
            });
        }
        if (this.browser) {
            return fromPromise.fromPromise(this.auth.verifyPasswordResetCode(code));
        }
    };
    AngularFireLiteAuth.prototype.confirmPasswordReset = function (code, newPassword) {
        if (this.server) {
            return this.http.post("https://www.googleapis.com/identitytoolkit/v3/relyingparty/resetPassword?key=" + this.config.apiKey, {
                'oobCode': code,
                'newPassword': newPassword
            });
        }
        if (this.browser) {
            return fromPromise.fromPromise(this.auth.confirmPasswordReset(code, newPassword));
        }
    };
    AngularFireLiteAuth.prototype.relogin = function (credentials) {
        return fromPromise.fromPromise(this.auth.currentUser.reauthenticateWithCredential(credentials));
    };
    AngularFireLiteAuth.prototype.deletePermanently = function () {
        var _this = this;
        if (this.server) {
            return fromPromise.fromPromise(this.auth.currentUser.getIdToken(true).then(function (idToken) {
                return _this.http.post("https://www.googleapis.com/identitytoolkit/v3/relyingparty/deleteAccount?key=" + _this.config.apiKey, {
                    'idToken': idToken
                });
            }));
        }
        if (this.browser) {
            return fromPromise.fromPromise(this.auth.currentUser.delete());
        }
    };
    AngularFireLiteAuth.prototype.sendEmailVerification = function () {
        var _this = this;
        if (this.server) {
            return fromPromise.fromPromise(this.auth.currentUser.getIdToken(true).then(function (idToken) {
                return _this.http
                    .post("https://www.googleapis.com/identitytoolkit/v3/relyingparty/getOobConfirmationCode?key=" + _this.config.apiKey, {
                    'requestType': 'VERIFY_EMAIL',
                    'idToken': idToken
                });
            }));
        }
        if (this.browser) {
            return fromPromise.fromPromise(this.auth.currentUser.sendEmailVerification());
        }
    };
    AngularFireLiteAuth.prototype.sendPasswordResetEmail = function (email) {
        if (this.server) {
            return this.http.post("https://www.googleapis.com/identitytoolkit/v3/relyingparty/getOobConfirmationCode?key=" + this.config.apiKey, {
                'requestType': 'PASSWORD_RESET',
                'email': email
            });
        }
        if (this.browser) {
            return fromPromise.fromPromise(this.auth.sendPasswordResetEmail(email));
        }
    };
    return AngularFireLiteAuth;
}());
AngularFireLiteAuth.decorators = [
    { type: core.Injectable },
];
AngularFireLiteAuth.ctorParameters = function () { return [
    { type: AngularFireLiteApp, },
    { type: http.HttpClient, },
    { type: Object, decorators: [{ type: core.Inject, args: [core.PLATFORM_ID,] },] },
]; };
var AngularFireLiteDatabase = /** @class */ (function () {
    function AngularFireLiteDatabase(app$$1, http$$1, state, platformId) {
        var _this = this;
        this.app = app$$1;
        this.http = http$$1;
        this.state = state;
        this.platformId = platformId;
        this.server = common.isPlatformServer(this.platformId);
        this.browser = common.isPlatformBrowser(this.platformId);
        this.ref = function (ref) { return _this.database.ref(ref); };
        this.database = app$$1.instance().database();
        this.config = app$$1.config();
    }
    AngularFireLiteDatabase.prototype.read = function (ref) {
        var dataStateKey = platformBrowser.makeStateKey(ref);
        if (this.server) {
            return this.SRH(ref, dataStateKey);
        }
        if (this.browser) {
            return this.BRH(ref, 'value', dataStateKey);
        }
    };
    AngularFireLiteDatabase.prototype.childAdded = function (ref) {
        var dataStateKey = platformBrowser.makeStateKey(ref);
        if (this.server) {
            return this.SRH(ref, dataStateKey);
        }
        if (this.browser) {
            return this.BRH(ref, 'child_added', dataStateKey);
        }
    };
    AngularFireLiteDatabase.prototype.childChanged = function (ref) {
        var dataStateKey = platformBrowser.makeStateKey(ref);
        if (this.server) {
            return this.SRH(ref, dataStateKey);
        }
        if (this.browser) {
            return this.BRH(ref, 'child_changed', dataStateKey);
        }
    };
    AngularFireLiteDatabase.prototype.childRemoved = function (ref) {
        var dataStateKey = platformBrowser.makeStateKey(ref);
        if (this.server) {
            return this.SRH(ref, dataStateKey);
        }
        if (this.browser) {
            return this.BRH(ref, 'child_removed', dataStateKey);
        }
    };
    AngularFireLiteDatabase.prototype.childMoved = function (ref) {
        var dataStateKey = platformBrowser.makeStateKey(ref);
        if (this.server) {
            return this.SRH(ref, dataStateKey);
        }
        if (this.browser) {
            return this.BRH(ref, 'child_moved', dataStateKey);
        }
    };
    AngularFireLiteDatabase.prototype.SRH = function (ref, DSK) {
        var _this = this;
        return this.http.get("https://" + this.config.projectId + ".firebaseio.com/" + ref + ".json")
            .map(function (payload) {
            if (!!payload && typeof payload === 'object') {
                var result = Object.keys(payload).map(function (key) {
                    return [payload[key]];
                });
                _this.state.set(DSK, result);
                return result;
            }
            else {
                _this.state.set(DSK, payload);
                return payload;
            }
        });
    };
    AngularFireLiteDatabase.prototype.BRH = function (ref, event, DSK) {
        if (this.browser) {
            var SSRedValue = this.state.get(DSK, []);
            var DATA_1 = new BehaviorSubject.BehaviorSubject(SSRedValue);
            this.ref(ref).on(event, function (snapshot) {
                if (!!snapshot.val() && typeof snapshot.val() === 'object') {
                    var result = Object.keys(snapshot.val()).map(function (key) {
                        return [snapshot.val()[key]];
                    });
                    DATA_1.next(result);
                }
                else {
                    DATA_1.next(snapshot.val());
                }
            });
            return DATA_1;
        }
    };
    AngularFireLiteDatabase.prototype.write = function (ref, data) {
        if (this.server) {
            return this.http.put("https://" + this.config.projectId + ".firebaseio.com/" + ref + ".json?print=silent", data);
        }
        if (this.browser) {
            return fromPromise.fromPromise(this.ref(ref).set(data));
        }
    };
    AngularFireLiteDatabase.prototype.push = function (ref, data) {
        if (this.server) {
            return this.http.post("https://" + this.config.projectId + ".firebaseio.com/" + ref + ".json?print=silent", data);
        }
        if (this.browser) {
            return fromPromise.fromPromise(this.ref(ref).push(data));
        }
    };
    AngularFireLiteDatabase.prototype.update = function (ref, data) {
        if (this.server) {
            return this.http.patch("https://" + this.config.projectId + ".firebaseio.com/" + ref + ".json?print=silent", data);
        }
        if (this.browser) {
            return fromPromise.fromPromise(this.ref(ref).update(data));
        }
    };
    AngularFireLiteDatabase.prototype.remove = function (ref) {
        if (this.server) {
            return this.http.delete("https://" + this.config.projectId + ".firebaseio.com/" + ref + ".json");
        }
        if (this.browser) {
            return fromPromise.fromPromise(this.ref(ref).remove());
        }
    };
    AngularFireLiteDatabase.prototype.query = function (ref) {
        var PID = this.platformId;
        var state = this.state;
        var db = this.database;
        var http$$1 = this.http;
        var config = this.config;
        var SQH = function (REF, FSQ, DSK) {
            return http$$1.get("https://" + config.projectId + ".firebaseio.com/" + REF + ".json?" + FSQ)
                .map(function (payload) {
                if (!!payload && typeof payload === 'object') {
                    var result = Object.keys(payload).map(function (key) {
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
        var BQH = function (BS) {
            return function (snapshot) {
                if (!!snapshot.val() && typeof snapshot.val() === 'object') {
                    var result = Object.keys(snapshot.val()).map(function (key) {
                        return [snapshot.val()[key]];
                    });
                    BS.next(result);
                }
                else {
                    BS.next(snapshot.val());
                }
            };
        };
        var SQ = '';
        var BQ = (this.ref(ref));
        return {
            startAt: function (value) {
                SQ += "&startAt=" + value;
                BQ = BQ.startAt(value);
                return this;
            },
            endAt: function (value) {
                SQ += "&endAt=" + value;
                BQ = BQ.endAt(value);
                return this;
            },
            equalTo: function (value) {
                SQ += "&equalTo=" + value;
                BQ = BQ.equalTo(value);
                return this;
            },
            isEqual: function (query) {
                if (common.isPlatformBrowser(PID)) {
                    return db.ref(ref).isEqual(query);
                }
            },
            limitToFirst: function (limit) {
                SQ += "&limitToFirst=" + limit;
                BQ = BQ.limitToFirst(limit);
                return this;
            },
            limitToLast: function (limit) {
                SQ += "&limitToLast=" + limit;
                BQ = BQ.limitToLast(limit);
                return this;
            },
            orderByChild: function (path) {
                SQ += "&orderBy=\"" + path + "\"";
                BQ = BQ.orderByChild(path);
                return this;
            },
            orderByKey: function () {
                SQ += "&orderBy=\"$key\"";
                BQ = BQ.orderByKey();
                return this;
            },
            orderByPriority: function () {
                SQ += "&orderBy=\"$priority\"";
                BQ = BQ.orderByPriority();
                return this;
            },
            orderByValue: function () {
                SQ += "&orderBy=\"$value\"";
                BQ = BQ.orderByValue();
                return this;
            },
            on: function (event) {
                var dataStateKey = platformBrowser.makeStateKey(ref);
                if (common.isPlatformServer(PID)) {
                    return SQH(ref, SQ, dataStateKey);
                }
                if (common.isPlatformBrowser(PID)) {
                    var SSRedValue = state.get(dataStateKey, []);
                    var VALUE = new BehaviorSubject.BehaviorSubject(SSRedValue);
                    BQ.on(event, BQH(VALUE));
                    return VALUE;
                }
            },
            once: function (event) {
                var dataStateKey = platformBrowser.makeStateKey(ref);
                if (common.isPlatformServer(PID)) {
                    return SQH(ref, SQ, dataStateKey);
                }
                if (common.isPlatformBrowser(PID)) {
                    var SSRedValue = state.get(dataStateKey, []);
                    var VALUE = new BehaviorSubject.BehaviorSubject(SSRedValue);
                    BQ.once(event, BQH(VALUE));
                    return VALUE;
                }
            }
        };
    };
    return AngularFireLiteDatabase;
}());
AngularFireLiteDatabase.decorators = [
    { type: core.Injectable },
];
AngularFireLiteDatabase.ctorParameters = function () { return [
    { type: AngularFireLiteApp, },
    { type: http.HttpClient, },
    { type: platformBrowser.TransferState, },
    { type: Object, decorators: [{ type: core.Inject, args: [core.PLATFORM_ID,] },] },
]; };
var AngularFireLiteFirestore = /** @class */ (function () {
    function AngularFireLiteFirestore(app$$1, http$$1, state, platformId) {
        this.app = app$$1;
        this.http = http$$1;
        this.state = state;
        this.platformId = platformId;
        this.browser = common.isPlatformBrowser(this.platformId);
        this.firestore = app$$1.instance().firestore();
        this.config = app$$1.config();
    }
    AngularFireLiteFirestore.prototype.read = function (ref) {
        var _this = this;
        var dataStateKey = platformBrowser.makeStateKey(ref);
        var refArray = ref.split('/');
        if (refArray[0] === '/') {
            refArray.shift();
        }
        if (refArray[refArray.length - 1] === '/') {
            refArray.pop();
        }
        var slashes = refArray.length - 1;
        if (common.isPlatformServer(this.platformId)) {
            return this.http
                .get("https://firestore.googleapis.com/v1beta1/projects/" + this.config.projectId + "/databases/(default)/documents/" + ref)
                .map(function (res) {
                var docData = {};
                if (slashes % 2 !== 0) {
                    Object.keys(res.fields)
                        .forEach(function (key) {
                        for (var keyValue in res.fields[key]) {
                            if (keyValue) {
                                docData[key] = res.fields[key][keyValue];
                            }
                        }
                    });
                    return docData;
                }
                else {
                    var colData_1 = [];
                    res.documents.forEach(function (doc) {
                        var singleDocData = {};
                        Object.keys(doc.fields)
                            .forEach(function (key) {
                            for (var keyValue in doc.fields[key]) {
                                if (keyValue) {
                                    singleDocData[key] = doc.fields[key][keyValue];
                                }
                            }
                        });
                        colData_1.push(singleDocData);
                    });
                    return colData_1;
                }
            })
                .do(function (pl) {
                _this.state.set(dataStateKey, pl);
            });
        }
        if (this.browser) {
            var data_1 = [];
            var SSRedValue = this.state.get(dataStateKey, []);
            var DATA_2 = new BehaviorSubject.BehaviorSubject(SSRedValue);
            if (slashes % 2 === 0) {
                this.firestore.collection(ref).onSnapshot(function (snapshot) {
                    snapshot.docs.forEach(function (doc) {
                        data_1.push(doc.data());
                    });
                    DATA_2.next(data_1);
                });
            }
            else {
                this.firestore.doc(ref).onSnapshot(function (snapshot) {
                    DATA_2.next(snapshot.data());
                });
            }
            return DATA_2;
        }
    };
    AngularFireLiteFirestore.prototype.write = function (ref, data, merge) {
        if (this.browser) {
            return fromPromise.fromPromise(this.firestore.doc(ref).set(data, { merge: merge }));
        }
    };
    AngularFireLiteFirestore.prototype.push = function (ref, data) {
        if (this.browser) {
            return fromPromise.fromPromise(this.firestore.collection(ref).add(data));
        }
    };
    AngularFireLiteFirestore.prototype.update = function (ref, data) {
        if (this.browser) {
            return fromPromise.fromPromise(this.firestore.doc(ref).update(data));
        }
    };
    AngularFireLiteFirestore.prototype.remove = function (DocumentRef) {
        if (common.isPlatformServer(this.platformId)) {
            return this.http
                .delete("https://firestore.googleapis.com/v1beta1/projects/" + this.config.projectId + "/databases/(default)/documents/" + DocumentRef);
        }
        if (this.browser) {
            return fromPromise.fromPromise(this.firestore.doc(DocumentRef).delete());
        }
    };
    AngularFireLiteFirestore.prototype.removeField = function (ref) {
        var fields = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            fields[_i - 1] = arguments[_i];
        }
        if (this.browser) {
            return fromPromise.fromPromise(this.firestore.doc(ref).update(fields));
        }
    };
    AngularFireLiteFirestore.prototype.removeCollection = function (collectionRef) {
        var _this = this;
        if (this.browser) {
            return fromPromise.fromPromise(this.firestore.collection(collectionRef).get().then(function (snapshot) {
                snapshot.docs.forEach(function (doc) {
                    _this.firestore.batch().delete(doc.ref);
                });
            }));
        }
    };
    AngularFireLiteFirestore.prototype.query = function (ref) {
        var PID = this.platformId;
        var HTTP = this.http;
        var CONFIG = this.config;
        var state = this.state;
        var fs = this.firestore;
        var SSQ = {
            'from': [{ 'collectionId': "" + ref }]
        };
        var SQHFS = function (DSK) {
            var data = [];
            return HTTP
                .post("https://firestore.googleapis.com/v1beta1/projects/" + CONFIG.projectId + "/databases/(default)/documents:runQuery", SQ)
                .map(function (res) {
                var _loop_1 = function (doc) {
                    var documentData = {};
                    Object.keys(doc.document.fields).forEach(function (fieldName) {
                        var fieldType = Object.keys(doc.document.fields[fieldName]);
                        documentData[fieldName] = doc.document.fields[fieldName][fieldType[0]];
                    });
                    data.push(documentData);
                };
                try {
                    for (var res_1 = __values(res), res_1_1 = res_1.next(); !res_1_1.done; res_1_1 = res_1.next()) {
                        var doc = res_1_1.value;
                        _loop_1(doc);
                    }
                }
                catch (e_1_1) { e_1 = { error: e_1_1 }; }
                finally {
                    try {
                        if (res_1_1 && !res_1_1.done && (_a = res_1.return)) _a.call(res_1);
                    }
                    finally { if (e_1) throw e_1.error; }
                }
                return data;
                var e_1, _a;
            })
                .do(function (pl) {
                state.set(DSK, pl);
            });
        };
        var SQ = {
            'structuredQuery': SSQ
        };
        var SQOB = [];
        var BQ = (fs.collection(ref));
        return {
            where: function (document, comparison, value) {
                var SOP = '';
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
            startAt: function () {
                var startValue = [];
                for (var _i = 0; _i < arguments.length; _i++) {
                    startValue[_i] = arguments[_i];
                }
                var SV = [];
                startValue.forEach(function (value) {
                    SV.push(FormatServerData(value));
                });
                SSQ.startAt = {};
                SSQ.startAt.before = true;
                SSQ.startAt.values = SV;
                BQ = BQ.startAt.apply(BQ, __spread(startValue));
                return this;
            },
            startAfter: function () {
                var startValue = [];
                for (var _i = 0; _i < arguments.length; _i++) {
                    startValue[_i] = arguments[_i];
                }
                var SV = [];
                startValue.forEach(function (value) {
                    SV.push(FormatServerData(value));
                });
                SSQ.startAt = {};
                SSQ.startAt.before = false;
                SSQ.startAt.values = SV;
                BQ = BQ.startAfter.apply(BQ, __spread(startValue));
                return this;
            },
            endAt: function () {
                var endValue = [];
                for (var _i = 0; _i < arguments.length; _i++) {
                    endValue[_i] = arguments[_i];
                }
                var SV = [];
                endValue.forEach(function (value) {
                    SV.push(FormatServerData(value));
                });
                SSQ.endAt = {};
                SSQ.endAt.before = false;
                SSQ.endAt.values = SV;
                BQ = BQ.endAt.apply(BQ, __spread(endValue));
                return this;
            },
            endBefore: function () {
                var endValue = [];
                for (var _i = 0; _i < arguments.length; _i++) {
                    endValue[_i] = arguments[_i];
                }
                var SV = [];
                endValue.forEach(function (value) {
                    SV.push(FormatServerData(value));
                });
                SSQ.endAt = {};
                SSQ.endAt.before = true;
                SSQ.endAt.values = SV;
                BQ = BQ.endBefore.apply(BQ, __spread(endValue));
                return this;
            },
            limit: function (limit) {
                SSQ.limit = limit;
                BQ = BQ.limit(limit);
                return this;
            },
            orderBy: function (path, order) {
                var orderBy = {
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
                SSQ.orderBy = (SQOB);
                return this;
            },
            on: function () {
                var ONDSK = platformBrowser.makeStateKey(ref + ':query');
                if (common.isPlatformServer(PID)) {
                    return SQHFS(ONDSK);
                }
                if (common.isPlatformBrowser(PID)) {
                    var SSRedValue = state.get(ONDSK, []);
                    var VALUE_1 = new BehaviorSubject.BehaviorSubject(SSRedValue);
                    BQ.onSnapshot(function (snapshot) {
                        var data = [];
                        snapshot.forEach(function (doc) {
                            data.push(doc.data());
                        });
                        VALUE_1.next(data);
                    });
                    return VALUE_1;
                }
            },
            get: function () {
                var GETDSK = platformBrowser.makeStateKey(ref + ':query');
                if (common.isPlatformServer(PID)) {
                    return SQHFS(GETDSK);
                }
                if (common.isPlatformBrowser(PID)) {
                    var data_2 = [];
                    var SSRedValue = state.get(GETDSK, []);
                    var VALUE_2 = new BehaviorSubject.BehaviorSubject(SSRedValue);
                    BQ.get().then(function (snapshot) {
                        snapshot.forEach(function (doc) {
                            data_2.push(doc);
                        });
                        VALUE_2.next(data_2);
                    });
                    return VALUE_2;
                }
            }
        };
    };
    AngularFireLiteFirestore.prototype.transaction = function () {
        if (this.browser) {
            var fs_1 = this.firestore;
            var transactionToRun_1;
            var readCount_1 = 0;
            var transactions_1 = {
                get: function (ref) {
                    return fs_1.doc(ref).get();
                },
                set: function (ref, data) {
                    return fs_1.doc(ref).set(data);
                }
            };
            return {
                set: function (ref, data) {
                    transactionToRun_1 = transactionToRun_1.then(function () {
                        transactions_1.set(ref, data);
                    });
                    return this;
                },
                get: function (ref) {
                    var _this = this;
                    var getSubject = new Subject.Subject();
                    if (readCount_1 > 0) {
                        transactionToRun_1 = transactionToRun_1.then(function () {
                            transactions_1.get(ref).then(function (value) {
                                getSubject.next({ data: value.data(), next: _this });
                            });
                        });
                    }
                    else if (readCount_1 === 0) {
                        transactionToRun_1 = transactions_1.get(ref).then(function (value) {
                            getSubject.next({ data: value.data(), next: _this });
                        });
                    }
                    readCount_1++;
                    return getSubject;
                },
                run: function () {
                    return fromPromise.fromPromise(fs_1.runTransaction(function () {
                        return transactionToRun_1;
                    }));
                }
            };
        }
        else {
            console.log('transactions SSR is not supported yet');
        }
    };
    AngularFireLiteFirestore.prototype.batch = function () {
        if (this.browser) {
            var fs_2 = this.firestore;
            var b_1 = this.firestore.batch();
            return {
                set: function (ref, data) {
                    b_1.set(fs_2.doc(ref), data);
                    return this;
                },
                update: function (ref, data) {
                    b_1.update(fs_2.doc(ref), data);
                    return this;
                },
                delete: function (ref) {
                    b_1.delete(fs_2.doc(ref));
                    return this;
                },
                commit: function () {
                    return fromPromise.fromPromise(b_1.commit());
                }
            };
        }
        else {
            console.log('batched writes SSR is not supported yet');
        }
    };
    return AngularFireLiteFirestore;
}());
AngularFireLiteFirestore.decorators = [
    { type: core.Injectable },
];
AngularFireLiteFirestore.ctorParameters = function () { return [
    { type: AngularFireLiteApp, },
    { type: http.HttpClient, },
    { type: platformBrowser.TransferState, },
    { type: Object, decorators: [{ type: core.Inject, args: [core.PLATFORM_ID,] },] },
]; };
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
var AngularFireLiteStorage = /** @class */ (function () {
    function AngularFireLiteStorage(app$$1, platformId) {
        this.app = app$$1;
        this.platformId = platformId;
        this.browser = common.isPlatformBrowser(this.platformId);
        this.storage = app$$1.instance().storage();
    }
    AngularFireLiteStorage.prototype.upload = function (ref, file, metadata) {
        if (this.browser) {
            return fromPromise.fromPromise(this.child(ref).put(file, metadata));
        }
    };
    AngularFireLiteStorage.prototype.uploadString = function (ref, string) {
        if (this.browser) {
            return fromPromise.fromPromise(this.child(ref).putString(string));
        }
    };
    AngularFireLiteStorage.prototype.download = function (ref) {
        if (this.browser) {
            return fromPromise.fromPromise(this.child(ref).getDownloadURL());
        }
    };
    AngularFireLiteStorage.prototype.remove = function (ref) {
        if (this.browser) {
            return fromPromise.fromPromise(this.child(ref).delete());
        }
    };
    AngularFireLiteStorage.prototype.getMetadata = function (ref) {
        if (this.browser) {
            var META_1 = new Subject.Subject();
            this.child(ref).getMetadata().then(function (meta) {
                META_1.next(meta);
            });
            return META_1;
        }
    };
    AngularFireLiteStorage.prototype.updateMetadata = function (ref, metadata) {
        if (this.browser) {
            return fromPromise.fromPromise(this.child(ref).updateMetadata(metadata));
        }
    };
    AngularFireLiteStorage.prototype.deleteMetadata = function (ref) {
        if (this.browser) {
            return fromPromise.fromPromise(this.child(ref).updateMetadata({
                customMetadata: null,
                cacheControl: null,
                contentEncoding: null,
                contentLanguage: null,
                contentType: null
            }));
        }
    };
    AngularFireLiteStorage.prototype.child = function (ref) {
        return this.storage.ref().child(ref);
    };
    return AngularFireLiteStorage;
}());
AngularFireLiteStorage.decorators = [
    { type: core.Injectable },
];
AngularFireLiteStorage.ctorParameters = function () { return [
    { type: AngularFireLiteApp, },
    { type: Object, decorators: [{ type: core.Inject, args: [core.PLATFORM_ID,] },] },
]; };
var AngularFireLiteMessaging = /** @class */ (function () {
    function AngularFireLiteMessaging(app$$1, platformId) {
        this.app = app$$1;
        this.platformId = platformId;
        this.browser = common.isPlatformBrowser(this.platformId);
        this.messaging = app$$1.instance().messaging();
    }
    AngularFireLiteMessaging.prototype.instance = function () {
        if (this.browser) {
            return this.messaging;
        }
    };
    AngularFireLiteMessaging.prototype.token = function () {
        if (this.browser) {
            return fromPromise.fromPromise(this.messaging.getToken());
        }
    };
    AngularFireLiteMessaging.prototype.tokenRefresh = function () {
        var _this = this;
        if (this.browser) {
            var REFRESH_TOKEN_1 = new Subject.Subject();
            this.messaging.onMessage(function () {
                _this.messaging.getToken().then(function (token) {
                    REFRESH_TOKEN_1.next(token);
                });
            });
            return REFRESH_TOKEN_1;
        }
    };
    AngularFireLiteMessaging.prototype.requestPermission = function () {
        if (this.browser) {
            return fromPromise.fromPromise(this.messaging.requestPermission());
        }
    };
    AngularFireLiteMessaging.prototype.deleteToken = function (token) {
        if (this.browser) {
            return fromPromise.fromPromise((this.messaging.deleteToken(token)));
        }
    };
    return AngularFireLiteMessaging;
}());
AngularFireLiteMessaging.decorators = [
    { type: core.Injectable },
];
AngularFireLiteMessaging.ctorParameters = function () { return [
    { type: AngularFireLiteApp, },
    { type: Object, decorators: [{ type: core.Inject, args: [core.PLATFORM_ID,] },] },
]; };
function AngularFireLiteAppFactory(config) {
    return new AngularFireLiteApp(config);
}
var FirebaseAppConfig = /** @class */ (function () {
    function FirebaseAppConfig() {
    }
    return FirebaseAppConfig;
}());
var AngularFireLite = /** @class */ (function () {
    function AngularFireLite() {
    }
    AngularFireLite.forRoot = function (fireConfig) {
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
    };
    return AngularFireLite;
}());
AngularFireLite.decorators = [
    { type: core.NgModule, args: [{
                imports: [
                    http.HttpClientModule,
                    common.CommonModule,
                    platformBrowser.BrowserTransferStateModule
                ]
            },] },
];

exports.AngularFireLiteAppFactory = AngularFireLiteAppFactory;
exports.FirebaseAppConfig = FirebaseAppConfig;
exports.AngularFireLite = AngularFireLite;
exports.AngularFireLiteApp = AngularFireLiteApp;
exports.AngularFireLiteDatabase = AngularFireLiteDatabase;
exports.AngularFireLiteStorage = AngularFireLiteStorage;
exports.AngularFireLiteMessaging = AngularFireLiteMessaging;
exports.AngularFireLiteFirestore = AngularFireLiteFirestore;
exports.FormatServerData = FormatServerData;
exports.AngularFireLiteAuth = AngularFireLiteAuth;

Object.defineProperty(exports, '__esModule', { value: true });

})));
//# sourceMappingURL=angularfire-lite.umd.js.map
