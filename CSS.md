### 垂直居中

- tanslate(-50%, -50%)法

```css
.parent {
    position: relative;
}
.box {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
}
```

- flex法

```css
.parent {
    display: flex;
    justify-content: center;
    align-items: center;
}
```

- grid 法

```css
.parent {
    display: grid;
}
.box {
    align-self: center;
    justify-self: center;
}
```



### Flex

`flex`: 0 1 auto, 分别代表 flex-grow, flex-shink, flex-basis, 即:

- 当剩余空间时, 则项目会自动占据剩余空间
- 当空间不足时, 项目会自动缩小, 即使有确定的宽高也会
- 代表项目的本来大小, 浏览器根据这个属性计算是否有剩余空间



### 盒模型

`box-sizing`: 有两个选项:

- 标准盒模型 content-box, 即 width = content
- 怪异盒模型 border-box, 即 width = content + border + padding



