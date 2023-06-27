import { MockMethod } from "vite-plugin-mock";
const timeout = 1000;
const List: {
  sex: string;
  role: string;
  username: string;
  password: string;
  createdAt: string;
  updatedAt: string;
  name: string;
  avatar?: string;
  postionName?: string;
  departmentName?: string;
  roleList?: object[];
}[] = [
  {
    sex: "1",
    role: "admin",
    roleList: [
      {
        id: "admin",
        label: "系统管理员",
      },
      {
        id: "test",
        label: "测试员",
      },
    ],
    username: "admin",
    password: "123456",
    createdAt: "2021-04-22T02:12:37.070+00:00",
    updatedAt: "2021-04-22T02:12:37.070+00:00",
    name: "张津",
    avatar: "https://t10.baidu.com/it/u=3844842414,292040484&fm=58",
    postionName: "项目经理",
    departmentName: "人力资源部",
  },
  {
    sex: "1",
    role: "test",
    roleList: [
      {
        id: "test",
        label: "测试员",
      },
    ],
    username: "test",
    password: "123456",
    createdAt: "2021-04-22T02:12:37.070+00:00",
    updatedAt: "2021-04-22T02:12:37.070+00:00",
    name: "测试员",
  },
];
export default [
  // 列表接口
  {
    url: "/user/list",
    method: "get",
    response: ({ query }) => {
      const { username, pageIndex, pageSize } = query;
      const mockList = List.filter((item) => {
        if (username && item.username.indexOf(username) < 0) return false;
        return true;
      });
      const pageList = mockList.filter(
        (_, index) =>
          index < pageSize * pageIndex && index >= pageSize * (pageIndex - 1)
      );
      return {
        code: 200,
        data: {
          total: mockList.length,
          list: pageList,
        },
      };
    },
  },
  // 登录接口
  {
    url: "/user/login",
    method: "post",
    timeout,
    response: ({ body }) => {
      const data = body;
      let hasUser = false;
      for (const user of List) {
        if (
          user.username === data.username &&
          user.password === data.password
        ) {
          hasUser = true;
          return {
            code: 200,
            data: {
              token: "10086~~~",
            },
          };
        }
      }
      if (!hasUser) {
        return {
          code: 500,
          message: "账号或密码错误",
        };
      }
    },
  },
  {
    url: "/user/info",
    method: "get",
    timeout,
    response: ({ query }) => {
      const { token } = query;
      if (token != "10086~~~") {
        return {
          code: 403,
          message: "登录超时或token不对~",
        };
      } else {
        return {
          code: 200,
          data: {
            userInfo: List[0],
            menuTree: [
              // {
              //   path: "/work-bench",
              //   component: "dashboard/index",
              //   menuType: "static",
              //   icon: "money",
              //   label: "工作台",
              // },
              {
                path: "/system",
                menuType: "folder",
                icon: "search1",
                label: "系统管理",
                children: [
                  {
                    path: "/system/menu",
                    menuType: "static",
                    component: "system/menu",
                    label: "菜单管理",
                  },
                  {
                    path: "/system/user",
                    component: "system/user",
                    menuType: "static",
                    label: "用户管理",
                  },
                  {
                    path: "/system/role",
                    component: "system/role",
                    menuType: "static",
                    label: "角色管理",
                  },
                ],
              },
              {
                path: "/product",
                menuType: "folder",
                icon: "peoples",
                label: "产品管理",
                children: [
                  {
                    path: "/product/list",
                    component: "product/list",
                    menuType: "static",
                    label: "产品列表",
                  },
                ],
              },
              {
                path: "/form",
                menuType: "folder",
                icon: "shopping",
                label: "表单",
                children: [
                  {
                    path: "/form/demo",
                    component: "form/demo",
                    menuType: "static",
                    label: "表单组件示例",
                  },
                ],
              },
              // {
              //   path: "/test1",
              //   component: "test/1",
              //   menuType: "static",
              //   label: "测试菜单一一",
              // },
              // {
              //   path: "/test2",
              //   component: "test/2",
              //   menuType: "static",
              //   label: "测试菜单非常非常长的二号菜单",
              // },
              // {
              //   path: "/test3",
              //   component: "test/3",
              //   menuType: "static",
              //   label: "测试菜单三",
              // },
              // {
              //   path: "/test4",
              //   component: "test/4",
              //   menuType: "static",
              //   label: "测试非常非常长非常非常长非常非常长非常非常长非常非常长菜单四",
              // },
              // {
              //   path: "/test5",
              //   component: "test/5",
              //   menuType: "static",
              //   label: "测试菜单非常非常长非常非常长的五号菜单",
              // },
              // {
              //   path: "/test6",
              //   component: "test/6",
              //   menuType: "static",
              //   label: "测试菜单非常非常长非常非常长的六号菜单",
              // },
            ],
            param: {
              lang: "zh-CN",
            },
            i18n: {
              name: "张津",
              zjzj: "特别厉害",
              hello: "你好",
            },
          },
        };
      }
    },
  },
] as MockMethod[];
