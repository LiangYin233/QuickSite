var fs = require('fs-extra');
var ejs = require('ejs');
var MarkdownIt = require('markdown-it');
const readline = require('readline');
var jsonxml = require('jsontoxml');
md = new MarkdownIt();

var data = {
    titles: [

    ],
    contents: [

    ],
    birthtime: [

    ],
    mtime: [

    ],
    filename: [

    ]

};

if (process.argv[2] == "build") {
    try {
        var templatefiles = new Array(), postfiles = new Array();
        templatefiles = fs.readdirSync(process.cwd() + "/template/"), postfiles = fs.readdirSync(process.cwd() + "/posts/");

        // 去JSON注释 正则源于:CSDN - 静思映雪
        var reg = /("([^\\\"]*(\\.)?)*")|('([^\\\']*(\\.)?)*')|(\/{2,}.*?(\r|\n))|(\/\*(\n|.)*?\*\/)/g, json = fs.readFileSync(process.cwd() + "/config.json", "utf8"),sitejson = fs.readFileSync(process.cwd() + "/site.json", "utf8");
        json = json.replace(reg, function (word) {
            return /^\/{2,}/.test(word) || /^\/\*/.test(word) ? "" : word;
        });
        json = JSON.parse(json);
        sitejson = sitejson.replace(reg, function (word) {
            return /^\/{2,}/.test(word) || /^\/\*/.test(word) ? "" : word;
        });
        sitejson = JSON.parse(sitejson);

        // 赋值
        for (let i = 0; i < postfiles.length; i++) {
            data.contents[i] = md.render(fs.readFileSync(process.cwd() + "/posts/" + postfiles[i], "utf8"))
            data.filename[i] = String(postfiles[i]).split(".")[0].split(";")[0];
            data.titles[i] = String(postfiles[i]).split(".")[0].split(";")[1];
            data.birthtime[i] = new Date(fs.statSync(process.cwd() + '/posts/' + postfiles[i]).birthtime).toLocaleDateString();
            data.mtime[i] = new Date(fs.statSync(process.cwd() + '/posts/' + postfiles[i]).mtime).toLocaleDateString();
        }

        // 移动Source文件夹的所有内容
        fs.copySync(process.cwd() + '/source/', process.cwd() + '/public/');

        // 渲染index页面
        var compiled = ejs.compile(fs.readFileSync(process.cwd() + '/template/index.ejs', 'utf8'));
        var html = compiled(
            {
                config: json,
                site: data
            }
        );

        // 写index文件
        fs.writeFile(process.cwd() + '/public/' + 'index.html', html, function (err) {
            if (err) {
                return console.error("QuickSite Error:" + err);
            }
        });

        //渲染Posts页面
        for (let i = 0; i < data.filename.length; i++) {
            if (i == 0 && (data.filename.length == 2)) {// 判断是否是第一个博文且有>两篇文章的情况
                var data_posts = {
                    content: data.contents[i],
                    title: data.titles[i],
                    birthtime: data.birthtime[i],
                    mtime: data.mtime[i],
                    next: {
                        title: data.titles[i + 1],
                        filename: data.filename[i + 1]
                    }
                };
            }
            else if (i != data.filename.length - 1 && i > 0) {// 既不是第一篇,又不是最后一篇文章的情况
                var data_posts = {
                    content: data.contents[i],
                    title: data.titles[i],
                    birthtime: data.birthtime[i],
                    mtime: data.mtime[i],
                    next: {
                        title: data.titles[i + 1],
                        filename: data.filename[i + 1]
                    },
                    previou: {
                        title: data.titles[i - 1],
                        filename: data.filename[i - 1]
                    }
                };
            }
            else if (i == data.filename.length - 1 && (data.filename.length > 1)) { // 最后一篇文章的情况
                var data_posts = {
                    content: data.contents[i],
                    title: data.titles[i],
                    birthtime: data.birthtime[i],
                    mtime: data.mtime[i],
                    previou: {
                        title: data.titles[i - 1],
                        filename: data.filename[i - 1]
                    }
                };
            }
            else { // 只有一篇文章的情况
                var data_posts = {
                    content: data.contents[i],
                    title: data.titles[i],
                    birthtime: data.birthtime[i],
                    mtime: data.mtime[i]
                };
            }

            compiled = ejs.compile(fs.readFileSync(process.cwd() + '/template/posts.ejs', 'utf8'));
            html = compiled(
                {
                    config: json,
                    posts: data_posts
                }
            );
            fs.writeFile(process.cwd() + '/public/' + data.filename[i] + '.html', html, function (err) {
                if (err) {
                    return console.error("QuickSite Error:" + err);
                }
            });
        }

        // 渲染自定义页面
        for (let i = 0; i < fs.readdirSync(process.cwd() + "/template/").length; i++) {
            if (templatefiles[i] != "index.ejs" && templatefiles[i] != "posts.ejs") {
                compiled = ejs.compile(fs.readFileSync(process.cwd() + '/template/' + templatefiles[i], 'utf8'));
                html = compiled(
                    {
                        config: json,
                        site: data
                    }
                );
                fs.writeFile(process.cwd() + '/public/' + String(templatefiles[i]).split(".")[0] + '.html', html, function (err) {
                    if (err) {
                        return console.error("QuickSite Error:" + err);
                    }
                });
            }
        }

        // 生成Sitemap
        var Sitemap = [];
        for (let i = 0; i < data.filename.length; i++) {
            Sitemap.push({
                "url": {
                    "loc": sitejson.url + data.filename[i] + ".html",
                    "lastmod": new Date(data.birthtime[i]).toISOString()
                }
            });
        }
        fs.writeFile(process.cwd() + '/public/' + 'sitemap.xml','<?xml version="1.0" encoding="UTF-8"?>' + jsonxml({
            "urlset": Sitemap
        }), function (err) {
            if (err) {
                return console.error("QuickSite Error:" + err);
            }
        });

        console.log("Static pages have been built")
    }
    catch (err) {
        console.error("Encountered a fatal error!\n" + err)
    }
}
else if (process.argv[2] == null) {
    console.log("QuickSite Alpha4");
    console.log("Quickly generate efficient, safe and beautiful static websites")
    console.log("Usage: qs [command]");
    console.log("Command:\n  build - Generate static pages\n  new - Create new post\n  clean - Delete the public folder");
    console.log("What has been updated in QuickSite Alpha4?");
    console.log("- Support sitemap\n- Add public folder delete function")
}
else if (process.argv[2] == "new") {
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    });

    rl.question('Your Post ID and Post Title:\nID,Title', (TEXT) => {
        fs.writeFile(process.cwd() + '/posts/' + TEXT.split(",")[0] + ";" + TEXT.split(",")[1] + '.md', html, function (err) {
            if (err) {
                return console.error("QuickSite Error:" + err);
            }
        });
        rl.close();
    });

    rl.on("close", function () {
        console.log("A new post has been created")
    });
}
else if (process.argv[2] == "clean") {
    fs.removeSync(process.cwd() + "/public")
    console.log("public folder deleted")
}
else {
    console.info("Unknown commands and parameters");
}