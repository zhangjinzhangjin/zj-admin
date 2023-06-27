import type { Slots } from "vue";
import { isFunction } from "@/utils/is";
/* 
slots setup函数的slots，所有的一级插槽
slot 具体的插槽名，template #aaa='scope'中的aaa
data 上面模板中的scope，比如el-table-column中template指定的scope，里面有row,column,$index这些
*/
export const getSlot = (slots: Slots, slot = "default", data?: Recordable) => {
  // Reflect.has 判断一个对象是否存在某个属性
  if (!slots || !Reflect.has(slots, slot)) {
    return null;
  }
  // slots[slot]必须是函数
  if (!isFunction(slots[slot])) {
    console.error(`${slot} is not a function!`);
    return null;
  }
  const slotFn = slots[slot];
  if (!slotFn) return null;
  return slotFn(data);
};
