// import Cookies from 'js-cookie'
const TokenKey = "sys-token";
export function getToken(): string | null {
  //return Cookies.get(TokenKey)
  // return window.localStorage.getItem(TokenKey);
  return window.sessionStorage.getItem(TokenKey);
}
export function setToken(token) {
  //return Cookies.set(TokenKey, token)
  // return window.localStorage.setItem(TokenKey, token);
  return window.sessionStorage.setItem(TokenKey, token);
}
export function removeToken() {
  //return Cookies.remove(TokenKey)
  // return window.localStorage.removeItem(TokenKey)
  return window.sessionStorage.removeItem(TokenKey);
}
