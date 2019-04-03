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



## 例

通过抓取到`https://cnodejs.org/` 这个网站首页的 40 条文章链接后，再进行异步请求获取每个链接的页面。

由于并发过高，会导致返回503，这时需要控制异并发的数量。

- 使用`axios` 发起请求

- `cheerio` 用来获取指定的内容。（nodejs版 JQuery）

- 自豪的使用 `manys` 控制 异步并发数