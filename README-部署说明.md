# 个人设计网站部署说明

这个文件夹已经整理成适合用 GitHub Desktop 发布的版本，保留了：

- `src` 和 `public`：网站源码与素材
- `网站成品-dist`：已经构建好的静态网站文件
- `.github/workflows/deploy-pages.yml`：推送到 GitHub 后自动部署到 GitHub Pages
- `vite.config.js`：已设置为更适合静态托管的相对路径模式

## 用 GitHub Desktop 上线

1. 在 GitHub Desktop 里选择 `Add an Existing Repository`
2. 如果提示当前不是 Git 仓库，就先点 `Create a Repository`
3. 选择当前这个文件夹：`个人设计网站`
4. 提交全部文件并发布到 GitHub
5. 仓库发布后，进入 GitHub 网页端
6. 打开仓库 `Settings -> Pages`
7. 把 Source 设置为 `GitHub Actions`
8. 等待 Actions 跑完，网站就会自动上线

## 本地预览

```bash
npm install
npm run dev
```

## 本地构建

```bash
npm run build
```

## 说明

- 已经排除了原项目里那个体积过大的 `jiulonggang-source.mp4`，避免 GitHub 上传失败
- 原始开发项目 `portfolio-site` 没有被破坏，仍可继续正常运行
