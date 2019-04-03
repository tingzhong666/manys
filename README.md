#  manys

Light weight Asynchronous Concurrency Control.

轻量级的异步并发控制。



##  特点

- 轻量级的，无第三方依赖
- 异步并发控制



## 安装

```shell
npm install manys
```



## 使用参数

```
manys(array, number, callback(value, resolve, reject))
```

- `arrat` 进行异步操作的数组
- `number` 设置最大并发数量
- `callback` 对数组中的每一元素进行的操作
  - `value` 数组中的元素
  - `resolve` 异步操作处理完后进行返回 成功状态，并且传入参数可选
    - 传入的参数将会统一传入到所有异步并发任务完成后的 then 中处理
  - `reject` 异步操作处理出现错误时，进行返回错误信息
    - 传入的参数将会统一传入到所有异步并发任务完成后的 catch 中处理



## 例

通过抓取到`https://cnodejs.org/` 这个网站首页的 40 条文章链接后，再进行异步请求获取每个链接的页面。

由于并发过高，会导致返回503，这时需要控制异并发的数量。

- 使用`axios` 发起请求

- `cheerio` 用来获取指定的内容。（nodejs版 JQuery）

- 自豪的使用 `manys` 控制 异步并发数

````js
const axios = require('axios');
const cheerio = require('cheerio');
const url = require('url');
const manys = require('manys');

const href = 'https://cnodejs.org';

// 抓取url
axios.get(href)
      .then(res => {
        let $ = cheerio.load(res.data);
        let node = $('#topic_list a.topic_title');
        let list = [];
        node.each((index, value) => list.push(url.resolve(href, value.attribs.href)));
        // list 数组存放了首页的 40 条文章 url
        return list;
      })
      .then(list => {

        // 异步并发数设置为 10 ，防止并发过高造成请求失败
        manys(list, 10, (value, resolve, reject) => {
          // 进行的异步操作
          axios.get(value).then(res => {
                            // 我把文章页面的标题抓取下来，并传入 resolve 中
                            let $ = cheerio.load(res.data);
                            let title = $('.topic_full_title').text();
                            // 异步操作成功后，再对返回值进行处理，再统一传入到所有异步并发任务完成后的 then 中处理
                            resolve(title);
                          })
                          // 错误处理，可以就在当前处理，也可以统一传入到所有异步并发任务完成后的 catch 中处理
                          .catch(err => reject(err));
        })
        // 所有异步并发任务完成后，返回的值 或 错误信息，将以数组的形式，全部传入 then 或 catch中 
        .then(data => console.log(data))  // 打印出返回的所有文章标题的数组
        .catch(err => {throw err});

      })
      .catch(err => err);
````

