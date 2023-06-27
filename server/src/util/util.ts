import * as moment from 'moment';
/**
 * @description list数组，每一项为obj，含有code，和parent标记父子关系，获取最终数组
 * @param {*} list
 * @returns treeNodeArray
 */
function getTreeData(list) {
  const objBuffer = { '0': { children: [] } };
  list = list.map((item) => item._doc);
  list.forEach((item) => {
    if (!item.pid) {
      //保障每项都有parent
      item.pid = '0';
    }
    objBuffer[item._id] = item;
  });
  list.forEach((item) => {
    // 添加层级关系
    const pid = item.pid;
    const target = objBuffer[pid]; // objBuffer中的code
    if (target) {
      if (!target.children) {
        target.children = [];
      }
      target.children.push(item);
    }
  });
  let nodes = null;
  Object.keys(objBuffer).some((key) => {
    if (key === '0') {
      nodes = objBuffer[key].children;
    }
  });
  return nodes;
}
/**
 * @description 把pageNo, pageSize字段以及值为空字符串或为-1的字段过滤掉
 * @param {*} payload
 * @param {*} exception 数组，不用添加到条件中，自行去处理逻辑如['stime', 'etime']
 * @returns searchPayload
 */
function filterSearch(payload, exception?): any {
  let params = {};
  if (!exception) {
    exception = [];
  }
  exception.push('pageNo');
  exception.push('pageSize');
  exception.push('orderName'); // 按哪个字段排序
  exception.push('orderDir'); // 怎么排 asc升序 desc降序
  Object.keys(payload).forEach((key) => {
    if (!exception.includes(key)) {
      // 排除不需要添加到结果中的key
      if (payload[key] && payload[key].length > 0 && payload[key] !== '-1') {
        // -1为select默认无值时
        params[key] = { $regex: payload[key] };
      }
    }
  });
  return params;
}
/**
 * @description 库时间格式化
 * @param {*} time
 * @returns format time
 */
function formatTime(time) {
  return moment(time).format('YYYY-MM-DD HH:mm:ss');
}
/**
 * @description 时间字符串转化为Date类型
 * @param {*} dateString
 * @returns Date
 */
function stringToDate(dateString) {
  if (typeof dateString == 'string') {
    return new Date(dateString.length ? dateString : '1970-01-01');
  } else {
    return dateString;
  }
}
export { getTreeData, filterSearch, formatTime, stringToDate };
