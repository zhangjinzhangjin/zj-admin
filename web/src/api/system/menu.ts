import request from "@/utils/request";
export function getMenuList() {
  return request({
    url: "/menu/all",
    method: "get",
  });
}
export function addMenu(data) {
  return request({
    url: "/menu/create",
    method: "post",
    data,
  });
}
export function deleteMenu(id) {
  return request({
    url: "/menu/delete/" + id,
    method: "delete",
  });
}
export function updateMenu(id, data) {
  return request({
    url: "/menu/update/" + id,
    method: "put",
    data,
  });
}
export function sortMenu(data) {
  return request({
    url: "/menu/sort",
    method: "put",
    data,
  });
}
export function getMenuInfo(id) {
  return request({
    url: "/api/menu/" + id,
    method: "get",
  });
}
