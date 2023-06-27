import request from "@/utils/request";
export function getRoutesByCode(code) {
  return request({
    url: "/role/findByCode/" + code,
    method: "get",
  });
}
export function getAllRoutes() {
  return request({
    url: "/role/getAllRoutes",
    method: "get",
  });
}
export function getRoles(data) {
  return request({
    url: "/role/all",
    method: "get",
    params: data,
  });
}
export function addRole(data) {
  return request({
    url: "/role/create",
    method: "post",
    data,
  });
}
export function updateRole(id, data) {
  return request({
    url: "/role/update/" + id,
    method: "put",
    data,
  });
}
export function deleteRole(id) {
  return request({
    url: "/role/delete/" + id,
    method: "delete",
  });
}
