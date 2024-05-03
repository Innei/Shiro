# 白い

这是 [Shiro](https://github.com/Innei/Shiro) 闭源迭代仓库。

## 手动部署方式（私有服务器）

参考：https://github.com/innei-dev/shiroi-deploy-action

## 新特征

相比 Shiro 开源版本上，增加了什么？

- 主人的状态设置
- 文章头部的渐变色和根据文章而改变的高主题色
- Post 列表无限加载
- 一言和思考的 RSS 订阅
- 一言的登录态直接发表的模态窗
- 评论区颜文字选择
- 签名动画
<!-- - 通知推送（基于 Service Worker） -->
- 文章内嵌 Thinking 解析
- Post 列表设置 (WIP)
- AI 摘要
- 一些细节和 UI 调整，或者你并不在意

## :whale: 运行

<!-- ### :hammer: 通过预构建运行

```sh
export GH_TOKEN=your_github_token # 你需要提供一个 GitHub Token 可以访问私有的仓库
# 下载预构建
bash ./scripts/download-latest-ci-build-artifact.sh
cd standalone
vim .env # 修改你的 ENV 变量
export PORT=2323
node server.js
``` -->
<!-- 
### :books: 推荐使用 Docker Compose

```sh
mkdir shiro
cd shiro
wget https://raw.githubusercontent.com/Innei-dev/Shiroi/main/docker-compose.yml
wget https://raw.githubusercontent.com/Innei-dev/Shiroi/main/.env.template .env

vim .env # 修改你的 ENV 变量
docker compose up -d

docker compose pull # 后续更新镜像
``` -->

## 许可

2024 Innei. 采用 [MIT](./LICENSE) 和附加条款。
