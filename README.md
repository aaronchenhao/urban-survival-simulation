<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# Run and deploy your AI Studio app

This contains everything you need to run your app locally.

View your app in AI Studio: https://ai.studio/apps/drive/1U6-L0_20gURXnL-Z2ORZJv4TFBsmsT1b

## Run Locally

**Prerequisites:**  Node.js


1. Install dependencies:
   `npm install`
2. Set the `GEMINI_API_KEY` in [.env.local](.env.local) to your Gemini API key
3. Run the app:
   `npm run dev`

## Deploy to GitHub Pages

这个项目已配置为自动部署到 GitHub Pages。

### 首次部署步骤：

1. **在 GitHub 仓库中启用 Pages**：
   - 进入仓库的 **Settings**（设置）
   - 点击左侧的 **Pages**
   - 在 **Source** 部分，选择 **GitHub Actions** 作为部署源

2. **推送代码到 main 或 master 分支**：
   - 当你推送代码到 `main` 或 `master` 分支时，GitHub Actions 会自动触发构建和部署
   - 也可以手动触发：在 **Actions** 标签页选择 **Deploy to GitHub Pages** workflow，点击 **Run workflow**

3. **等待部署完成**：
   - 在 **Actions** 标签页查看部署进度
   - 部署完成后，你的网站将在 `https://<your-username>.github.io/urban-survival-simulation/` 上可用

### 注意事项：

- 确保 `vite.config.ts` 中的 `base` 路径与你的仓库名一致
- 如果仓库名不同，请修改 `vite.config.ts` 中的 `base` 配置
- 部署是自动的，每次推送到 main/master 分支都会自动更新网站