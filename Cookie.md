## 嘛叫`Cookie`

> `Cookie`是存储在浏览器里的一小串数据

## 几个比较重要的`Cookie`字段

#### `domain`

> 默认情况下, `cookie`只有在设置它的域名下才能被访问到, 一般情况下, 这是个很好的安全策略, 但尴尬的是, 处于这个限制, 该域名的子域也访问不到

**即**: 当`cookie`设置在`site.com`下时, `forum.site.com`是访问不到的

如果要让它的子域能访问到, 就要将这个`domain`选项显式的设置为它的根域名, 即`domain=site.com`

#### `secure`

> `cookie`只能通过HTTPS传输

默认情况下，如果我们在 `HTTPS`上设置了`cookie`，那么该 `cookie`也会出现在 `HTTP`上，反之亦然

但使用此选项，如果一个`cookie`是在 `HTTPS`上设置的，那么它不会在相同域名的`HTTP`协议下出现，

#### `samesite`

> `samesite`是防御各种通过利用`cookie`发起网络攻击的最好的方式(csrf和点击劫持)

了解`samesite`之前, 先回顾下`csrf`攻击:

**例如**: 用户登录了`a.com`并用`cookie`存储下了身份信息, 然后用户再登录了危险网站`b.com`, 然后b网站发送了一个通往`a.com`的攻击请求, 此时浏览器会自动携带在`a.com`下设置的`cookie`, 从而骗取服务器的信任

`samesite`有两个可能的值: 

- `samesite=strict`或者直接`samesite` 如果这个请求来自第三方网站, 那么设置了`samesite=strict`的`cookie`将永远不会被发送

- `samesite=lax`

  `samesite=lax`相较于`samesite=strict`来说多了一个例外, **即**: 当

  - `HTTP`方法是安全的, 即用于向服务器读取数据而不是写入数据的方法, 例如使用`GET`方法而不是`POST`方法
  - 该操作为**顶级导航**, 所谓顶级导航就是: 如果是通过更改浏览器地址栏的`URL`进行访问的话, 那它就是顶级导航, 如果是通过一个`iframe`去访问的话, 那它就不是顶级导航, 这个主要是用于防御基于`iframe`进行的点击劫持攻击

  如果该请求满足上述两个条件的话, 浏览器就会在请求里携带上这个`cookie`

#### `httpOnly`

> ```
> httpOnly`禁止任何`JavaScript`去访问这个`cookie
> ```

比如使用`document.cookie`是访问不到此类`cookie`的, 主要用于防御`XSS`攻击(跨站脚本攻击)

### Same-Party

https://blog.csdn.net/weixin_40906515/article/details/120030218