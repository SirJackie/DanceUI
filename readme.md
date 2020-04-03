# DanceUI

一款强自适应布局框架，帮助你毫无顾虑的布局HTML页面，而不用担心各种盒模型溢出。

通过这个框架，你可以用几行代码实现这样的效果：

![Demo](./imagesForReadme/Demo.gif)

```html
<line>
    <dance width="4h" height="4h">Logo</dance>
    <dance width="1f" height="4h">User Infomation</dance>
</line>

<line>
    <dance width="1.5h" height="1.5h">A</dance>
    <dance width="1f" height="1.5h">Line</dance>
    <dance width="1.5h" height="1.5h">A</dance>
</line>
<!-- 重复四次 -->
```

# 新的盒模型

使用<line>标签创建一个行，然后就可以在里面自由地使用<dance>标签了！<dance>标签是特殊的div，它能保证宽度和高度就是你规定的值，完全不需要担心margin、border和padding！

![img1](./imagesForReadme/img1.png)

# 新的单位

DanceUI引入了两个新的单位：标准高度（h）和浮动宽度（f），你可以利用这两个单位创建极其复杂的布局。同一个布局在移动端和PC端都能兼容，变得不再是幻想！

![img2](./imagesForReadme/img2.png)

![img3](./imagesForReadme/img3.png)

这个框架目前仍在开发中，等待你的参与！