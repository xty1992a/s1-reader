# s1-reader
一个[stage1st论坛](https://bbs.saraba1st.com/2b/forum.php)的小程序阅读器

# 运行
```bash
# node版本见nvmrc

# 安装依赖
pnpm install

# 开发
pnpm dev:weapp

# 构建
pnpm build:weapp
```

# 简介
项目基于taro3+vue3+pinia+nut-ui.  
接口来源如下
1. 抓包黑球、saralin等客户端
2. 直接调用网页版php接口，靠cheerio解析获得

