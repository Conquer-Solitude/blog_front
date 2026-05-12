# blog_front restored source project

这个目录原本只有部署产物（`dist/`、`Dockerfile`、`nginx.conf`）。
当前版本是在构建产物基础上逆向恢复出的一个可维护 Vue 前端工程。

## 已恢复的技术栈

- Vue 3
- Vue Router
- Pinia
- Element Plus
- Axios
- Vite

## 目录说明

- `dist/`：原始部署产物，保留不动
- `src/`：恢复出的前端源码
- `public/`：恢复时复制的 favicon 和图片资源
- `Dockerfile` / `nginx.conf`：原部署文件

## 运行方式

```bash
npm install
npm run dev
```

开发环境默认把 `/api` 代理到：

```bash
http://localhost:8084
```

可以通过 `.env` 自定义：

```bash
VITE_API_PROXY_TARGET=http://your-backend:8084
```

## 构建方式

为了避免覆盖原来的 `dist/` 目录，默认构建输出到：

```bash
npm run build
# => dist-restored/
```

如果你确认要直接生成新的部署目录，可以运行：

```bash
npm run build:dist
```

## 说明

这不是 100% 精确还原的原作者源码，而是基于打包结果尽量恢复出的结构化项目，包含：

- 页面与路由
- 登录/注册弹窗
- 接口调用逻辑
- 主要样式
- 上传、留言、树洞、评论等业务页面

以下部分属于“近似恢复”而非“精确原文件还原”：

- 组件命名与目录划分
- 部分样式的排版细节
- 构建前是否使用过更多工具链配置
- 少量构建期丢失的源码注释与局部实现细节
