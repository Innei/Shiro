# Shiro

> **重要声明：** 由于个人精力有限，开源版本的 Shiro 后续将不再积极维护，仅会在发现重要安全漏洞时进行修复。我将把主要精力投入到赞助版 [白い](https://github.com/innei-dev/Shiroi) 的维护和功能迭代中。开源版本依然可以正常使用，感谢大家的理解和支持。

一个极简主义的个人网站主题，如纸的纯净，似雪的清新。

专为 [Mix Space](https://github.com/mx-space) 生态系统设计的现代化个人站点前端。

## :sparkles: 示例站点

以下是一些使用 Shiro 主题的精美站点：

- [静かな森](https://innei.in)
- [可愛い松](https://blog.wibus.ren/)
- [启动台の博客](https://www.launchpadx.top/)

欢迎体验 Shiro 带来的极简之美！

## :rocket: 核心特性

- **:zap: 极致性能**：在 LightHouse 测试中表现卓越，Performance 和 Best Practice 均超过 90%
- **:art: 现代设计**：简洁而不简单的用户界面，提供流畅优雅的用户体验
- **:gem: 细节至上**：采用符合物理学的 Spring 弹性动画，每一帧都如自然般舒适
- **:bell: 实时通知**：通过 WebSocket 连接，访客可实时接收最新文章推送
- **:computer: 活动状态**：结合 [ProcessReporter](https://github.com/Innei/ProcessReporter)，在主页展示实时活动状态
- **:pencil: 扩展语法**：支持丰富的 Markdown 扩展语法，满足多样化写作需求
- **:wrench: 轻量管理**：内置轻量级管理面板，便于内容管理

## :gear: 技术架构

基于现代化的前端技术栈构建：

- **NextJS** (App Router) - React 全栈框架
- **Jotai** - 原子化状态管理
- **Framer Motion** - 流畅动画库
- **Radix UI** - 无障碍组件库
- **Socket.IO** - 实时通信
- **TailwindCSS** - 原子化 CSS 框架

## 📖 部署指南

详细的部署教程请参考：https://mx-space.js.org/docs/themes/shiro/deploy

感谢 @wibus-wee、@wuhang2003 等社区贡献者编写的详细文档。

## :camera: 界面预览

<img width="1471" alt="Live Demo" src="https://github.com/Innei/Shiro/assets/41265413/bf8af4ec-0f0c-441a-8c06-4b44e1649597">

**轻量级管理面板：**

![管理面板 1](https://github.com/Innei/Shiro/assets/41265413/4bb5b34a-3ce2-45da-bec7-4596ac87f849)
![管理面板 2](https://github.com/Innei/Shiro/assets/41265413/592941d0-2ebe-4d64-bd77-3171829bd896)

<details>
<summary>
点击查看更多完整页面截图
</summary>

![页面截图 1](https://github.com/Innei/Shiro/assets/41265413/1b85c9be-0cd3-46b5-a089-a9ab97fdfecb)
![页面截图 2](https://github.com/Innei/Shiro/assets/41265413/d808d288-c022-42f2-8d74-ad057a588771)

</details>

## :zap: 性能测试

在 M2 MacBook Air 环境下对重负载页面的性能测试结果：

![性能测试结果](https://github.com/Innei/Shiro/assets/41265413/f76152af-4a52-46a2-9b83-20567800ba75)

## :whale: 快速开始

### :package: 预构建版本

从 [Releases](https://github.com/Innei/Shiro/releases) 页面下载最新的 `release.zip` 压缩包并解压：

```bash
cd standalone
vim .env # 配置环境变量
export PORT=2323
node server.js
```

### :docker: Docker Compose（推荐）

```bash
mkdir shiro && cd shiro
wget https://raw.githubusercontent.com/Innei/Shiro/main/docker-compose.yml
wget https://raw.githubusercontent.com/Innei/Shiro/main/.env.template .env

vim .env # 配置环境变量
mkdir public # 放置自定义 Favicon
docker compose up -d

# 后续更新
docker compose pull
```

## :memo: Markdown 扩展

了解更多 Markdown 扩展语法，请访问：https://shiro.innei.in/#/markdown

## :heart: 致谢与许可

**© 2024 Innei** - 本项目采用 AGPLv3 许可证，并附加特定的商业使用条件。

使用本项目需要遵循 [附加条款和条件](ADDITIONAL_TERMS.md)。

**特别鸣谢：**
- 部分代码参考了 GPT-4 和 [cali.so](https://github.com/CaliCastle/cali.so)
- 感谢 Mix Space Team 和社区贡献者们的持续支持

**赞助版本：** [白い (Shiroi)](https://github.com/innei-dev/Shiroi) - 获得更多功能和持续更新

---

> [个人网站](https://innei.in/) · GitHub [@Innei](https://github.com/innei/)
