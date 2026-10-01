# Beyond Intelligence Lab

React + TypeScript + Vite + React Router 的静态站点。

```bash
pnpm install
pnpm dev      # http://localhost:5173
pnpm build    # 类型检查 + 打包到 dist/
pnpm preview  # 本地预览生产构建
pnpm lint
```

内容数据：论文 `src/data/publications.toml`、团队成员 `src/data/group.toml`、首页动态 `src/data/news.toml`，字段说明都在文件头部注释里。改这些文件即可更新站点，构建时会校验，字段写错会直接失败。
