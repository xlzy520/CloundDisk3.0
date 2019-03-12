
### 代码目录
```js
+-- node_modules/                           ---npm下载文件目录
+-- src/                                    ---核心代码目录
|   +-- components                          ---各式各样的组件存放目录
|   |    +-- imgEditor                      ---图片预览组件
|   |    |    --- ...   
|   +-- icons                               ---图标组件
|   |    --- ...   
|   +-- plugins
|   |    --- element.js                     ---elemenet 全局提示
|   +-- mixins
|   |    --- fileType.js                    ---文件操作脚本
|   +--  utils                              ---自定义封装脚本
|   |    --- ...
|   +--  styles                             ---样式文件
|   |    --- ...
|   +--  views                              ---视图组件
|   |    --- ...
|   --- permission.jsx                      ---页面权限控制

--- vue.config.js                           ---启动项目自定义端口配置文件
--- package.json                                    
```


目前存在 用户退出 vuex内 用户相关信息 未清空, 登录其他账号 用户信息 未修改
解决方案 登录的时候 修改 用户信息