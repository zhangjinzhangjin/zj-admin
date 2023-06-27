/**
 * {
 *    path: '/aaa', title: ['你好', '我好']
 * }
 */
function Fuse(list) {
  this.list = list;
}
Fuse.prototype.search = function(query) {
  const list = this.list
  const res = []
  list.forEach(item => {
    let flag;
    if(item.title.some(titleItem => titleItem.trim().toLowerCase().indexOf(query?.toLowerCase()) > -1)){
      flag = true
    }
    if(flag){
      res.push(item)
    }
  })
  return res
}
Fuse.prototype.reset = function(){
  this.list = [];
}
Fuse.prototype.add = function(list){
  this.list = list;
}
export default Fuse;