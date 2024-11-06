# Shiro

一个极简主义的个人网站，纸的纯净和雪的清新。

为 [Mix Space](https://github.com/mx-space) 服务的个人站点前端。

以下是一些使用 Shiro 的示例站点：

- [静かな森](https://innei.in)
- [可愛い松](https://blog.wibus.ren/)
- [启动台の博客](https://www.launchpadx.top/)

欢迎你来体验 Shiro 的魅力！

## :sparkles: 特征

1. :rocket: **SEO 100%，性能优秀**：在 LightHouse 中表现优秀，Performance > 90%，Best practice > 90%。
2. :art: **UI 现代化，简洁不简单**：用户界面设计现代化，简洁而不简单，让你的体验更加流畅。
3. :gem: **注重细节，UX 极致**：注重每一个细节，所有的动画都使用符合物理的 Spring 弹性动画，每一帧都是大自然的感觉。
4. :bell: **接入 WebSocket，实时获取最新的文章通知**：通过 WebSocket，访客能够实时获取最新的文章通知。
5. :computer: **实时活动状态展示**：配合 [ProcessReporter](https://github.com/mx-space/ProcessReporterMac)，可以在主页上显示实时活动状态。
6. :pencil: **Markdown 的扩展语法**：支持更多的 Markdown 扩展语法，等待你的发掘和使用。
7. :zap: **轻量级管理面板**：可以在管理面板中管理文章、评论等。

## :wrench: 技术栈

- NextJS (App Router)
- Jotai
- Framer motion
- Radix UI
- Socket.IO
- TailwindCSS

## 📄 使用文档

前往：https://mx-space.js.org/docs/themes/shiro/deploy

感谢 @wibus-wee 和 @wuhang2003 等其他社区贡献者编写。

## :camera: 截图

<img width="1471" alt="Live Demo" src="https://github.com/Innei/Shiro/assets/41265413/bf8af4ec-0f0c-441a-8c06-4b44e1649597">

轻管理面板：

![](https://github.com/Innei/Shiro/assets/41265413/4bb5b34a-3ce2-45da-bec7-4596ac87f849)
![](https://github.com/Innei/Shiro/assets/41265413/592941d0-2ebe-4d64-bd77-3171829bd896)

<details>
<summary>
点击查看部分完整页面截图
</summary>

![页面截图 1](https://github.com/Innei/Shiro/assets/41265413/1b85c9be-0cd3-46b5-a089-a9ab97fdfecb)
![页面截图 2](https://github.com/Innei/Shiro/assets/41265413/d808d288-c022-42f2-8d74-ad057a588771)

</details>

## :zap: 性能

在 M2 Macbook Air 环境中对逻辑最重的页面进行了测试。

![](https://github.com/Innei/Shiro/assets/41265413/f76152af-4a52-46a2-9b83-20567800ba75)

## :rocket: 部署

[看这里](https://mx-space.js.org/docs/themes/shiro/deploy).

## :whale: 运行

### :hammer: 通过预构建运行

首先在 `https://github.com/Innei/Shiro/releases` 中下载预构建好的 `release.zip`。然后解压它。

```sh
cd standalone
vim .env # 修改你的 ENV 变量
export PORT=2323
node server.js
```

### :books: 推荐使用 Docker Compose

```sh
mkdir shiro
cd shiro
wget https://raw.githubusercontent.com/Innei/Shiro/main/docker-compose.yml
wget https://raw.githubusercontent.com/Innei/Shiro/main/.env.template .env

vim .env # 修改你的 ENV 变量
docker compose up -d

docker compose pull # 后续更新镜像
```

## Markdown 扩展语法

请阅读 https://shiro.innei.in/#/markdown

## :heart: 鸣谢 & 许可

2024 © Innei，本软件遵循 AGPLv3 许可证，附加特定的商业使用条件。此外，使用本项目还需要遵循[附加条款和条件](ADDITIONAL_TERMS.md)。

部分代码参考自 GPT-4 和 [cali.so](https://github.com/CaliCastle/cali.so)。

感谢 Mix Space Team 和广大社区朋友们的贡献。

[赞助版](https://github.com/sponsors/Innei)：[白い](https://github.com/innei-dev/Shiroi)

> [个人网站](https://innei.in/) · GitHub [@Innei](https://github.com/innei/)
