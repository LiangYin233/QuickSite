var fs = require('fs-extra');
var ejs = require('ejs');
var MarkdownIt = require('markdown-it');
const readline = require('readline');
md = new MarkdownIt();

var data = {
    titles: [

    ],
    contents: [

    ],
    filename: [

    ]
};

if (process.argv[2] == "build") {
    try {

        //去JSON注释 正则源于:CSDN - 静思映雪
        var reg = /("([^\\\"]*(\\.)?)*")|('([^\\\']*(\\.)?)*')|(\/{2,}.*?(\r|\n))|(\/\*(\n|.)*?\*\/)/g, json = fs.readFileSync(process.cwd() + "/config.json", "utf8");
        json = json.replace(reg, function (word) {
            return /^\/{2,}/.test(word) || /^\/\*/.test(word) ? "" : word;
        });
        json = JSON.parse(json);

        //赋值
        for (let i = 0; i < fs.readdirSync(process.cwd() + "/posts/").length; i++) {
            data.contents[i] = md.render(fs.readFileSync(process.cwd() + "/posts/" + fs.readdirSync(process.cwd() + "/posts/")[i], "utf8"))
            data.filename[i] = String(fs.readdirSync(process.cwd() + "/posts/")[i]).split(".")[0].split(";")[0];
            data.titles[i] = String(fs.readdirSync(process.cwd() + "/posts/")[i]).split(".")[0].split(";")[1];
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
        fs.writeFile(process.cwd() + '/public/' + 'index.html', html, function (err) {
            if (err) {
                return console.error("QuickSite Error:" + err);
            }
        });

        //渲染Posts页面
        for (let i = 0; i < data.filename.length; i++) {
            if (i == 0 && (data.filename.length == 2)) {
                var data_posts = {
                    content: data.contents[i],
                    title: data.titles[i],
                    next: {
                        title: data.titles[i + 1],
                        filename: data.filename[i + 1]
                    }
                };
            }
            else if (i != data.filename.length - 1 && i > 0) {
                var data_posts = {
                    content: data.contents[i],
                    title: data.titles[i],
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
            else if (i == data.filename.length - 1) {
                var data_posts = {
                    content: data.contents[i],
                    title: data.titles[i],
                    previou: {
                        title: data.titles[i - 1],
                        filename: data.filename[i - 1]
                    }
                };
            }
            else {
                var data_posts = {
                    content: data.contents[i],
                    title: data.titles[i]
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

        //渲染自定义页面
        for (let i = 0; i < fs.readdirSync(process.cwd() + "/template/").length; i++) {
            if (fs.readdirSync(process.cwd() + "/template/")[i] != "index.ejs" && fs.readdirSync(process.cwd() + "/template/")[i] != "posts.ejs") {
                compiled = ejs.compile(fs.readFileSync(process.cwd() + '/template/' + fs.readdirSync(process.cwd() + "/template/")[i], 'utf8'));
                html = compiled(
                    {
                        config: json,
                        site: data
                    }
                );
                fs.writeFile(process.cwd() + '/public/' + String(fs.readdirSync(process.cwd() + "/template/")[i]).split(".")[0] + '.html', html, function (err) {
                    if (err) {
                        return console.error("QuickSite Error:" + err);
                    }
                });
            }
        }

        console.log("Static pages have been built")
    }
    catch (err) {
        console.error("Encountered a fatal error!\n" + err)
    }
}
else if (process.argv[2] == null) {
    console.log("QuickSite Alpha2");
    console.log("Quickly generate efficient, safe and beautiful static websites")
    console.log("Usage: qs [command]");
    console.log("Command:\n  build - Generate static pages\n  new - Create new post");
    console.log("What has been updated in QuickSite Alpha2?");
    console.log("- JSON annotation support\n- Updated posts object\n- Replace the variables passed to the template file with objects\n- 'Site' objects can also be obtained on non-main pages")
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
else {
    console.info("Unknown commands and parameters");
}