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



### Position

`sticky`: 

1. 设置为 sticky 的元素在达到特定的阈值之前, 也就是top、bottom、left、right4个值的其中之一, 是相对定位, 达到这个阈值之后, 就是固定定位, 所以必须指定top、bottom、left、right4个值的其中之一，否则只会处于相对定位

2. 父元素不能overflow:hidden或者overflow:auto属性
3. sticky 只在其父元素内生效, 不管这个父元素有没有设置定位

