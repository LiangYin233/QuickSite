<!-- 制作属于您自己的QS模板 -->

感谢您选择QuickSite 静态网站生成框架！
现在，本手册将教您如何制作QuickSite Beta的模板。
在您阅读本手册前,您需要掌握:

- HTML

- CSS

- JavaScript

- EJS模板引擎

  Index.ejs中,我们会向本文件传输

- site对象

- 配置文件JSON对象 config

- 站点配置文件JSON对象 sconfig
  Site对象拥有了

- titles 标题数组

- contents 内容数组

- filename 文件名称数组

- birthtime 文件创建日期数组

-	mtime 文件修改日期数组
三个对象属性
您可以创建一个for循环对每个文章进行遍历，如这样：
```
    <% for(let i = 0;i < Object.keys(site.titles).length;i++) { %>
<%= site.titles[i] %></a>
<%-  site.contents[i] %></p>
    <% } %>
```
因为博文标题与博文文件名称不同,所以请使用site.filename这个数组设置超链接，而不是site.title
如果您需要从配置文件中取配置内容，可以这样:
配置JSON内容:

```
{
"title": "QuickSite"
}
```
这样获取:
`<title><%= config.title %></title>`

在posts.ejs中，我们会向本文件传输
- posts对象
- 配置文件JSON对象 config
- 站点配置文件JSON对象 sconfig
posts对象拥有了
- title 标题变量
- content 内容变量
- next与previou对象[上一篇文章或下一篇文章]
- birthtime 文件创建日期变量
- mtime 文件修改日期变量
next和previou对象中,只会有
- title 标题变量
- filename 文件名变量
使用方法同index.ejs,不过不同的是，我们会发送对应的标题和博文，而不是需要遍历的数组。
博文实例:
`<%= posts.title %>`
`<%- posts.content %>`
上下篇文章实例:
```
    <% if (posts.next != null) { %>
        <a href="<%= posts.next.filename %>.html"><%= posts.next.title %></a>
<% } %>

    <% if (posts.previou != null) { %>
        <a href="<%= posts.previou.filename %>.html"><%= posts.previou.title %></a>
    <% } %>
```


在 任意.ejs 中，我们会传输与index.ejs相同的内容。
使用方法同上，在任意的ejs的文件中，编译后的HTML文件名为您ejs文件的名称。
如果您不需要该EJS文件被编译[如使用include引用的页面],请在该文件名前添加”-”

Source策略:
我们不会将template文件夹中的除ejs文件外的文件移动到Public文件夹，请您将需要引用的文件放在Source文件夹内，我们会在编译时将该文件夹内的文件复制进Public文件夹。

PS：随QS版本更新，本文件内容随时可能变动。
	
