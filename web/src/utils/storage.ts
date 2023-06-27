export const useStorage = (type = "localStorage") => {
  const storage = window[type];
  return {
    set(key, value) {
      if (typeof value == "object") {
        value = JSON.stringify(value);
      }
      storage.setItem(key, value);
    },
    get(key) {
      let value = storage.getItem(key);
      try {
        let res = JSON.parse(value);
        return res;
      } catch (error) {
        return value;
      }
    },
  };
};
