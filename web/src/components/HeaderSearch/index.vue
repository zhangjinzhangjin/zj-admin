<template>
  <div :class="{ show: show }" class="header-search primaryHoverBg">
    <el-tooltip placement="top">
      <template #content> 搜索 </template>
      <svg-icon class="search-icon" icon-class="search1" @click.stop="click" />
    </el-tooltip>
    <el-select ref="headerSearchSelect" v-model="search" :remote-method="querySearch" filterable default-first-option
      remote placeholder="请输入菜单名称" class="header-search-select" @change="change"
      :popper-append-to-body='false'>
      <el-option v-for="item in options" :key="item.path" :value="item" :label="item.title.join(' > ')" />
    </el-select>
  </div>
</template>
<script>
import Fuse from "./fuse";
import { isUrl } from '@/utils/is'
import { usePermissionStore } from '@/store/modules/permission'
export default {
  name: "HeaderSearch",
  data() {
    return {
      search: "",
      options: [],
      searchPool: [],
      show: false,
      fuse: new Fuse(this.searchPool),
    };
  },
  computed: {
    routes() {
      const permissionStore = usePermissionStore();
      return permissionStore.getRoutes;
    },
  },
  watch: {
    routes() {
      this.searchPool = this.generateRoutes(this.routes);
    },
    searchPool(list) {
      this.initFuse(list);
    },
    show(value) {
      if (value) {
        document.body.addEventListener("click", this.close);
      } else {
        document.body.removeEventListener("click", this.close);
      }
    },
  },
  mounted() {
    this.searchPool = this.generateRoutes(this.routes);
  },
  methods: {
    pathResolve(parentPath, path) {
      if (isUrl(path)) return path
      if (path.startsWith("/")) return path
      const childPath = path.startsWith('/') || !path ? path : `/${path}`
      return `${parentPath}${childPath}`.replace(/\/\//g, '/')
    },
    click() {
      this.show = !this.show;
      if (this.show) {
        this.$refs.headerSearchSelect && this.$refs.headerSearchSelect.focus();
      }
    },
    close() {
      this.$refs.headerSearchSelect && this.$refs.headerSearchSelect.blur();
      this.options = [];
      this.show = false;
    },
    change(val) {
      this.$router.push(val.path);
      this.search = "";
      this.options = [];
      this.$nextTick(() => {
        this.show = false;
      });
    },
    initFuse(list) {
      this.fuse.reset();
      this.fuse.add(list);
    },
    generateRoutes(routes, basePath = "/", prefixTitle = []) {
      let res = [];
      for (const router of routes) {
        // skip hidden router
        if (router.hidden || router.hidden) {
          continue;
        }
        const data = {
          path: this.pathResolve(basePath, router.path),
          title: [...prefixTitle],
        };
        if (router.label && router.label.length > 0) {
          data.title = [...data.title, router.label];
        }
        if (data.title.length) {
          res.push(data);
        }
        // recursive child routes
        if (router.children) {
          const tempRoutes = this.generateRoutes(
            router.children,
            data.path,
            data.title
          );
          if (tempRoutes.length >= 1) {
            res = [...res, ...tempRoutes];
          }
        }
      }
      return res;
    },
    querySearch(query) {
      if (query !== "") {
        this.options = this.fuse.search(query);
      } else {
        this.options = [];
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.header-search {
  font-size: 0 !important;
  margin-right: 20px;

  .search-icon {
    cursor: pointer;
    font-size: 20px;
    vertical-align: middle;
  }

  .header-search-select {
    font-size: 18px;
    transition: width 0.2s;
    width: 0;
    overflow: hidden;
    background: transparent;
    border-radius: 0;
    display: inline-block;
    vertical-align: middle; 

    :deep(.el-input__inner) {
      border-radius: 0;
      border: 0;
      padding-left: 5px !important;
      padding-right: 5px;
      box-shadow: none !important;
      border-bottom: 1px solid #d9d9d9;
      vertical-align: middle;
    }
  }

  &.show {
    .header-search-select {
      width: 170px;
      margin-left: 10px;
    }
  }
}
</style>
