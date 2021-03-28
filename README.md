> V2版本正在开发，请耐心等待
# QuickSite
> 这是一篇中文自述，其他语言请耐心等候翻译。

QuickSite是一个基于Node.JS的静态网站生成器,

具有安全、高效、美观的特点。

# 安装
从[Release](https://github.com/LiangYin233/QuickSite/releases)页面下载QuickSite-**Version**.7z

然后解压它！

# 使用
Windows平台作为示例:

`$ qs new` 来创建一篇新博文

`$ qs build` 来构建你的网站

`$ qs clean` 用于清理Public文件夹

如果你想创建属于你自己的模板,我已经在自带的文章中提到。

# 构建
从此页面克隆本仓库,解压后通过`$ npm install`安装依赖

最后`$ node .`运行本程序

# 使用的库
相比Node.JS原生fs模块更强大的fs-extra
[fs-extra](https://github.com/jprichardson/node-fs-extra)

模板引擎支持
[EJS](https://github.com/mde/ejs)

用于将文章转换为HTML
[markdown-it](https://github.com/markdown-it/markdown-it)

用于将Json转换为XML 
[jsontoxml](https://github.com/ken-franken/node-jsontoxml)

# 感谢

ForkKILLET为本项目的部分正则表达式做出的贡献。

𝓓𝓇𝑒𝒶𝓂𝓛𝓘𝓝第一个使用并提出相当大的建议。

# 如何贡献
欢迎你的PR与ISSUES！

另外,在提交PR时,请务必描述你所做的改动。

# 许可证
MIT License © [LiangYin](https://github.com/LiangYin233)
