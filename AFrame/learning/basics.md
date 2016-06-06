#### 记录

A-Frame is based on an [entity-component-system](https://aframe.io/docs/0.2.0/core/) pattern,
most logic should be implemented within components.
The development workflow within A-Frame should try to revolve around components.
The component documentation goes into much more detail on what a component looks like and how to write one.
A-Frame 是在 threeJS 之上的抽象。
使用 A-Frame 组件（跟 Web 组件无关），我们可以完成所有 threeJs 能做的事。

components 组件，除了原生框架提供的之外，还可以加载第三方，或者自己实现。

* 基于 entity、primitive、component
* 右手坐标系
* 单位：米
* 图形变换操作：position, rotation, scale 组件
* 纹理（texture）：除了默认的 flat color，还可以使用 src 设置 image 或 vidow 作为纹理。
* 资源管理系统：缓存、预加载资源，使用 <a-assets>
* 动画系统：将 <a-animation> 作为对应 entity 的子元素
* 灯光系统
