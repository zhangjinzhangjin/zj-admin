import request from "@/utils/request";
export function login(data) {
  return request({
    url: "/auth/login",
    method: "post",
    data,
  });
}
export function getCurrentUserInfo() {
  return request({
    url: "/user/current",
    method: "get",
  });
}
export function getRoles() {
  return request({
    url: "/role/all",
    method: "get",
  });
}
export function getUserList(data) {
  let url = "/user/all";
  return request({
    url,
    method: "get",
    params: data,
  });
}
export function addUser(data) {
  return request({
    url: "/user/create",
    method: "post",
    data,
  });
}
export function updateUser(id, data) {
  return request({
    url: "/user/update/" + id,
    method: "put",
    data,
  });
}
export function deleteUser(id) {
  return request({
    url: "/user/delete/" + id,
    method: "delete",
  });
}
export function deleteUsers(ids) {
  return request({
    url: "/user/deleteMany",
    method: "delete",
    data: {
      ids,
    },
  });
}
export function changePwd(data) {
  return request({
    url: "/user/changePwd",
    method: "post",
    data,
  });
}
export function getRoutes(id) {
  return request({
    url: "/user/getRoutes/" + id,
    method: "get",
  });
}
export function resetPwd(id) {
  return request({
    url: "/user/resetPwd/" + id,
    method: "get",
  });
}
