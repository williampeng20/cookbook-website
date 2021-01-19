import Cookies from 'universal-cookie';

const cookies = new Cookies();

export type UserInfo = {
    uid: string,
    displayName: string,
};
const USER_INFO_COOKIE = 'userInfo'
const COOKIE_MAX_AGE = 604800;

export function setUserCookie(uid: string, displayName: string) {
    const userInfo: UserInfo = {
        uid: uid,
        displayName: displayName,
    };
    cookies.set(USER_INFO_COOKIE, userInfo, { path: '/', maxAge: COOKIE_MAX_AGE })
};

export function getUserCookie() {
    return cookies.get(USER_INFO_COOKIE);
}

export function userLoggedIn(): boolean {
    return cookies.get(USER_INFO_COOKIE) ? true : false;
}

export function logUserOut() {
    cookies.remove(USER_INFO_COOKIE);
}

export function getUserId() {
    const userInfo: UserInfo | undefined = cookies.get(USER_INFO_COOKIE);
    if (userInfo) {
        return userInfo.uid;
    }
    return '-';
}

export function getUserDisplayName() {
    const userInfo: UserInfo | undefined = cookies.get(USER_INFO_COOKIE);
    if (userInfo) {
        return userInfo.displayName;
    }
    return '-';
}