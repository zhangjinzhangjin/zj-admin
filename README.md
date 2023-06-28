# 说明：
- 全栈web开发解决方案，已集成docker并搭配代码生成脚手架工具，方便开发人员快速应用部署，高效开发
- 框架已提供完备的UI交互，以及用户、角色、菜单等基础功能，小而精，无冗余，开箱即用
## 技术栈
- 前端: vue3+ts+vite+elementplus
- 后端: nestjs+mongoose
- 数据库: mongodb
- node版本: 14及以上

# 安装：
- 可直接在docker中部署
```javascript
docker-compose up
```
- 单独运行前后端代码(进入server或web文件夹中)
```javascript
npm install
npm run dev
```
ps：由于无mock都是真接口，需要导入基础数据。docker需要在容器中自行导入，自行配置的mongodb可执行mongo\import.sh导入

# 脚手架使用
```javascript
npm install zhangjincli -g
```

## 指令说明
- zj --help 查看所有指令
- zj init templates初始化模板
- zj init models初始化测试数据
- zj config 参考npm的指令增改查脚手架的配置文件
- zj show logs 查看log
- zj compile ./models 编译指定目录，只编译前端vue文件
- zj compilefb ./models 编译指定目录，前后端都编译
- zj compile ./models -v3 指令中添加-v3，则输出为vue3版本

### PS
- 前端vue+element，后端nestjs
- .json为前端数据模型，_b.json为后端数据模型
- 前端编译vue版本通过设置-v2或--vue2指定为vue2版本，-v3或--vue3指定为vue3版本
- 数据模型只支持json格式，.json文件为前端模型，_b.json为后端数据模型，zj init models可以生成测试数据
- 支持递归编译
- 生成的后端代码，直接放到server\src\modules目录中，需要手动在app.module.ts中引入模块，需要配置swagger则自行在main.ts中添加
- 生成的前端代码，直接放到web\src\views目录中，在运行起来的项目页面中，系统管理->菜单管理中添加相应路由即可，别忘了去角色管理配置一下菜单权限
