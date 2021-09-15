提纲：

- 背景
- 实践过程中思考、发现、解决的问题
  **技术方案升级后和生命周期方案的比对及一些深度思考：**
  问题1：对比class中的this.setState，useState的state是可以拆分的，那么到底需要拆分吗？拆分有啥好处 ？拆分粒度多大合适？
  问题2：对比class中的this.setState，useState没有的第二个回调函数合理吗？那数据变更后想执行回调怎么办？
  问题3：useState通常传入数据，也可以传入函数，那么传入函数是有什么不同？
  问题4：useState解构出来的第二个参数（e g. setXXX函数）调用也可以传入函数，那么传入函数有什么不一样的？
  问题5：看到陈旧的 props 和 state有可能的原因有什么 ？
  问题6：setEffect的第一个函数参数可以是async函数吗？如果有async需要怎么办？
  问题7：useEffect的依赖项应该包含什么？
  问题8：setEffect的第二个数组默认是浅比较，那如果其中有引用类型，会出现什么情况？该怎么处理？
  问题9：包含effect函数的组件的渲染过程是什么样的?
  问题10：包含effect函数的组件的清理过程是什么样的?
  问题11：对Hooks的渲染理解的不透彻？
  问题12：内置基础&高级Hook快速学习上手？
  **工程化实践：**
  （1）表单处理
  实践1：用Hooks规范表单处理方式
  （2）规则约束
  实践2：用工具统一约束使用Hooks开发需要遵循的规则
  （3）自定义Hook
  实践3：升级React Redux让React组件和Redux的数据连接更加便捷
  实践4：通过Hooks统一封装异步数据请求，附加上状态信息
  实践5：使用更多自定义Hooks提升开发效率
  （3）状态管理及中间件
  实践6：全局状态管理方案尝试脱离第三方，改用内置Hooks实现
  实践7：Hooks方案处理中间件
  **优化：**
  实践8：React.memo
  实践9：immer
- 总结



​    Hooks解决了React发布以来遇到的一系列问题，长远来看，有望成为人们编写 React 组件的主要方式。由此，我以之前的一个项目为起点(tcr)，开始了Hooks方案的探索之路，这里我根据自己对Hooks的学习了解及在项目中的实践作个总结。

# 背景

Hooks是React 16.8的新增特性。它可以让你在不编写 class 的情况下使用 state 以及其他的 React 特性。
**对于React之前的问题Hooks可以发挥的作用:**
\1. 跨组件复用包含状态的逻辑十分困难，Hook 使你在无需修改组件结构的情况下复用状态逻辑。
\2. 复杂的组件难以理解， Hook 将组件中相互关联的部分拆分成更小的函数，而并非强制按照生命周期划分。
\3. 不止是用户，机器也对class难以理解，而 Hook 则拥抱了函数。

# 实践过程中思考、发现、解决的问题

## 技术方案升级后和生命周期方案的比对及一些深度思考

**问题1：对比class中的this.setState，useState的state是可以拆分的，那么到底需要拆分吗？拆分有啥好处 ？拆分粒度多大合适？**

这里推荐在使用useState时把 state 拆分成多个 state 变量。

具体拆分state的好处如下：
\1. 我们不必手动把这些字段合并到之前的 state 对象（与 class 中的 this.setState 不同，useState更新状态变量总是替换它，而不是合并它。）
如下：

```javascript
// 不拆分的部分可以类似下边写法。展开 「...state」 以确保我们没有 「丢失」 width 和 height
setState(state => ({ ...state, left: e.pageX, top: e.pageY }));
```

\2. 把独立的 state 变量拆分开，可使得后期把一些相关的逻辑组织到一起，或者说抽取到一个自定义 Hook 中变得容易。

把所有 state 都放在同一个 useState 调用中，或是每一个字段都对应一个 useState 调用，这两方式都能跑通。你需要的是在这两个极端之间找到一个平衡，把相关 state 组合到几个独立的 state 变量时，这样组件就会更加可读。

------

**问题2：对比class中的this.setState，useState没有的第二个回调函数合理吗？那数据变更后想执行回调怎么办？**
合理，我们可以通过useEffect来实现，其实比起回调，使用useEffect使得代码更扁平，依赖项可定制性也更强，更合理些，这是一种开发思维模式的转变。

------

**问题3：useState通常传入数据，也可以传入函数，那么传入函数是有什么不同？**
如果初始 state 需要通过复杂计算获得，则可以传入一个函数。
如下第二种写法函数才只会被调用一次，才是我们想要的。第一种写法函数每次渲染都会调用，虽然只有第一次有效，不是我们想要的。

```javascript
function Table(props) {
// createRows() 每次渲染都会被调用
const [rows, setRows] = useState(createRows(props.count));
// ...
}

function Table(props) {
// createRows() 只会被调用一次，优秀
const [rows, setRows] = useState(() => createRows(props.count));
// ...
}
```

------

**问题4：useState解构出来的第二个参数（e g. setXXX函数）调用也可以传入函数，那么传入函数有什么不一样的？**
setXXX(pre => pre + X...)：根据上次的数据计算下次的数据，这是比较推荐的写法，好处是可以避免多个有数据依赖关系的setXXX顺序调用时后边的获取的不是最新的数据。其实就是减少了对上下文的依赖，写法更解耦。

```
function App() {
  const [count, setCount] = useState(0);
  return (
    <div className="App">
      <h2>You clicked {count} times!</h2>
      <button
        onClick={() => {
          /* 点击后上边展示的times每次增加3 */
          setCount((pre) => pre + 1);
          setCount((pre) => pre + 1);
          setCount((pre) => pre + 1);

          /* 点击后上边展示的times每次增加1 */
          // setCount(count + 1);
          // setCount(count + 1);
          // setCount(count + 1);
        }}
      >
        Increment
      </button>
    </div>
  );
}
```

------

 **问题5：看到陈旧的 props 和 state有可能的原因有什么 ？**
\1. 你看到陈旧的 props 和 state 的一个可能的原因，是你使用了「依赖数组」优化但没有正确地指定所有的依赖。
\2. 另一个原因如下注解

```javascript
  function Example() {
    const [count, setCount] = useState(0);

    function handleAlertClick() {
      setTimeout(() => {
        alert('You clicked on: ' + count); // alert中的count是第一步时count的值，而不是最新的。如果你刻意地想要从某些异步回调中读取 最新的 state，你可以用 一个 ref 来保存它，修改它，并从中读取。
      }, 3000);
    }

    return (
      <div>
        <p>You clicked {count} times</p>
        <button onClick={() => setCount(count + 1)}> // 第二步：再点击
          Click me
        </button>
        <button onClick={handleAlertClick}> // 第一步：先点击
          Show alert
        </button>
      </div>
    );
  }
```

------

***\*问题6：\**setEffect的第一个函数参数可以是async函数吗？如果有async需要怎么办？
**不可以，使用异步函数会使回调函数返回Promise而不是cleanup函数。所以传入async函数会报错。
如有相关需求可以做类似下边的调整：

```javascript
// 直接用async...await是不对的
useEffect(async () => {
   await loadContent();
}, []);

// 可以调整为下边写法
useEffect(() => {
    async function anyNameFunction() {
      await loadContent();
    }

    anyNameFunction();
  }, []);

// 或者下边写法
useEffect(() => {
    // IIFE
    (async function anyNameFunction() {
      await loadContent();
    })();
}, []);
```

------

**问题7：** **useEffect的依赖项应该包含什么？**

如果你设置了依赖项，**effect中用到的所有组件内的值都要包含在依赖中。**这包括props，state，函数 —— 组件内的任何东西。

有两种诚实告知依赖的策略。你应该从第一种开始，然后在需要的时候应用第二种。
第一种策略是在依赖中包含所有effect中用到的组件内的值。
第二种策略是修改effect内部的代码以确保它包含的值只会在需要的时候发生变更。

如果某些函数仅在effect中调用，你可以把它们的定义移到effect中
函数作为依赖时可能要借助useCallback保证是否变动，[案例](https://github.com/taoyingsong/react-hooks-example/blob/master/src/examples/2-Additional-Hooks/2-useCallback.js)
到处使用useCallback是件挺笨拙的事（可以提取到父中用，上边案例中也有）

------

**问题8： setEffect的第二个数组默认是浅比较，那如果其中有引用类型，会出现什么情况？该怎么处理？**
情况1： 如果testObj为全局变量，通过testObj.a修改值后调用setApiOptions，useExample中useEffect不会执行，因为第二个参数中比较的是对象引用，前后两个对象的引用始终相同。

```javascript
const testObj = { a: 1 };
const useExample = apiOptions => {
  const [data, updateData] = useState([]);
  useEffect(() => {
    console.log("effect triggered");
  }, [apiOptions]);

  return {
    data
  };
};

function App() {
  const [apiOptions, setApiOptions] = useState(testObj);
  const { data } = useExample(apiOptions);

  return (
    <div>
      <button
        onClick={() => {
          console.log("before是：", apiOptions);
          testObj.a = 3;
          console.log("after是：", apiOptions);
          setApiOptions(testObj);
        }}
      >
        change apiOptions
      </button>
    </div>
  );
}
```

情况2： 如果设置state时直接使用对象，那么即便对象中的属性都相等，useEffect也会执行，因为useEffect的第二个参数比较时，对象的引用始终在变化。

```javascript
const useExample = apiOptions => {
  const [data, updateData] = useState([]);
  useEffect(() => {
    console.log("effect triggered");
  }, [apiOptions]);

  return {
    data
  };
};

function App() {
  const [apiOptions, setApiOptions] = useState({ a: 1 });
  const { data } = useExample(apiOptions);

  return (
    <div>
      <button
        onClick={() => {
          setApiOptions({ a: 1 });
        }}
      >
        change apiOptions
      </button>
    </div>
  );
}
```

优化1： 重写useEffect, 把useEffect的第二个参数改造为深比较

```
import React, { useEffect, useState, useRef } from "react";
import ReactDOM from "react-dom";
var _isEqual = require("lodash/isEqual");
function deepCompareEquals(a, b) {
  // TODO: implement deep comparison here
  // something like lodash
  return _isEqual(a, b);
}

function useDeepCompareMemoize(value) {
  const ref = useRef();
  // it can be done by using useMemo as well
  // but useRef is rather cleaner and easier

  if (!deepCompareEquals(value, ref.current)) {
    ref.current = value;
  }

  return ref.current;
}

function useDeepCompareEffect(callback, dependencies) {
  useEffect(callback, useDeepCompareMemoize(dependencies));
}

const useExample = apiOptions => {
  const [data, updateData] = useState([]);
  useDeepCompareEffect(() => {
    console.log("effect triggered");
  }, [apiOptions]);

  return {
    data
  };
};

function App() {
  const [apiOptions, setApiOptions] = useState({ a: 1 });
  const { data } = useExample(apiOptions);

  return (
    <div>
      <button
        onClick={() => {
          setApiOptions({ a: 1 });
        }}
      >
        change apiOptions
      </button>
    </div>
  );
}
```

 优化2：直接在useEffect中深比较

```
const usePrevious = value => {
  const ref = useRef();
  useEffect(() => {
    ref.current = value;
  });
  return ref.current;
};

const useExample = apiOptions => {
  const myPreviousState = usePrevious(apiOptions);
  const [data, updateData] = useState([]);
  useEffect(() => {
    if (myPreviousState && !_isEqual(myPreviousState, apiOptions)) {
      console.log("effect triggered");
      updateData(apiOptions);
    }
  }, [apiOptions,  myPreviousState]);
  return { data };
};

function App() {
  const [apiOptions, setApiOptions] = useState({ a: 1 });
  const { data } = useExample(apiOptions);

  return (
    <div>
      <button
        onClick={() => {
          setApiOptions({ a: 2 });
        }}
      >
        change apiOptions
      </button>
    </div>
  );
}
```

------

**问题9：** **包含effect函数的组件的渲染过程是什么样的?**

举例：

```
export default () => {
  const [count, setCount] = useState(0);
  useEffect(() => {
    document.title = `You clicked ${count} times`;
  });

  // prevCount为上次setCount的值
  return (
    <div>
      <p>You clicked {count} times</p>
      <button onClick={() => setCount(count + 1)}>
        Click me
      </button>
      <button onClick={() => setCount(preCount => preCount + 1)}>
        Click me 1
      </button>
    </div>
  );
}
```

 第一次的渲染过程：

- **React:** 给我状态为0时候的UI。
- **你的组件:**
  \* 给你需要渲染的内容: <p>You clicked 0 times</p>。
  \* 记得在渲染完了之后调用这个effect: () => { document.title = 'You clicked 0 times' }
- **React:** 没问题。开始更新UI，喂浏览器，我要给DOM添加一些东西。
- **浏览器:** 酷，我已经把它绘制到屏幕上了。
- **React:** 好的， 我现在开始运行给我的effect
  \* 运行 () => { document.title = 'You clicked 0 times' }。

设置新的state之后发生了什么：

- **你的组件:** 喂 React, 把我的状态设置为1。
- **React:** 给我状态为 1时候的UI。
- **你的组件:**
  \* 给你需要渲染的内容: <p>You clicked 1 times</p>。
  \* 记得在渲染完了之后调用这个effect： () => { document.title = 'You clicked 1 times' }。
- **React:** 没问题。开始更新UI，喂浏览器，我修改了DOM。
- **Browser:** 酷，我已经将更改绘制到屏幕上了。
- **React:** 好的， 我现在开始运行属于这次渲染的effect
  \* 运行 () => { document.title = 'You clicked 1 times' }。

------

**问题10：****包含effect函数的组件的清理过程是什么样的?**

假设第一次渲染的时候props是{id: 10}，第二次渲染的时候是{id: 20}。你*可能*会认为发生了下面的这些事：

- React 清除了 {id: 10}的effect。
- React 渲染{id: 20}的UI
- React 运行{id: 20}的effect。

(事实并不是这样。)

React只会在浏览器绘制后运行effects。这使得你的应用更流畅因为大多数effects并不会阻塞屏幕的更新。Effect的清除同样被延迟了。**上一次的effect会在重新渲染后被清除：**

- React 渲染{id: 20}的UI。
- 浏览器绘制。我们在屏幕上看到{id: 20}的UI。
- React 清除{id: 10}的effect （effect的清除并不会读取“最新”的props。它只能读取到定义它的那次渲染中的props值）
- React 运行{id: 20}的effect。

**整个渲染和清理的过程：**

```javascript
// Mount with { friend: { id: 100 } } props
ChatAPI.subscribeToFriendStatus(100, handleStatusChange); // 运行第一个 effect

// Update with { friend: { id: 200 } } props
ChatAPI.unsubscribeFromFriendStatus(100, handleStatusChange); // 清除上一个 effect
ChatAPI.subscribeToFriendStatus(200, handleStatusChange); // 运行下一个 effect

// Update with { friend: { id: 300 } } props
ChatAPI.unsubscribeFromFriendStatus(200, handleStatusChange); // 清除上一个 effect
ChatAPI.subscribeToFriendStatus(300, handleStatusChange); // 运行下一个 effect

// Unmount
ChatAPI.unsubscribeFromFriendStatus(300, handleStatusChange); // 清除最后一个 effect
```

 小试牛刀：

由上边问题9、10，看看下边代码的输出：

```javascript
function App() {
  const [title, setTitle] = useState("个人中心");
  useEffect(() => {
    console.log("执行 useEffect.....!!", title, Date.now()); // 2
    document.title = title;
    setTimeout(() => { // 3 看结果异步会执行2次
      console.log("begin", title);
      setTitle("前端不精读"); // setTitle应该是发现值有变更进行render, 发现 无变更结束。如果这里这样设置setTitle({title: "前端不精读"})对象，会造成无限循环(当然上边初始化时结构也对应的对象) -- 就是effect发生在每次渲染之后
      console.log("end", title);
    }, 1000);
    return () => { // 4
      console.log("卸载", title);
      document.title = "前端精读";
    };
  });
  return ( // 1
    <div>
      test!!{Date.now()} - {title}
    </div>
  );
}

const rootElement = document.getElementById("root");
ReactDOM.render(<App />, rootElement);
```

执行结果：1 -> 2 -> 3 -> 1 -> 4 -> 2 -> 3 

------

**问题11: 对Hooks的渲染理解的不透彻？**

这里我做一个Hooks渲染的总结

使用Hooks要理解每一次的渲染：

- 每一次渲染都有它自己的 Props and State
- 每一次渲染都有它自己的事件处理函数 —— 函数也是数据流的一部分（对比class中的函数就不会因为内部状态的改变而不同）
- 每一次渲染都有它自己的Effects

**在 hooks 组件里面，每一次的渲染，都相当于记录当前次的『快照』**

​    在class组件生命周期的思维模型中，副作用的行为和渲染输出是不同的。UI渲染是被props和state驱动的，并且能确保步调一致，但副作用并不是这样。这是一类常见问题的来源。
​    在useEffect的思维模型中，默认都是同步的。副作用变成了React数据流的一部分。对于每一个useEffect调用，一旦你处理正确，你的组件能够更好地处理边缘情况。当然用好useEffect的前期学习成本更高。不过随着业务的发展，当你有了更多的自定义Hooks工具箱时，就不会那么频繁的直接使用useEffect了。

------

**问题12: 内置基础&高级Hook快速学习上手？**
我总结了一份Hooks的[使用指南](https://github.com/taoyingsong/react-hooks-example/tree/master/src/examples)，里边对基础Hook和高级Hook都有详尽的使用场景案例及注释。

------

## 工程化实践

**实践1: 用Hooks规范表单处理方式**
升级路线：手撸React Redux Form -> react-final-form-hooks -> React Hook Form
写3个demo进行对比
这里先不说复杂表单就说正常的普通表单，甚至我拿了一个很简单的表单来说事。
如图看看这样一个表单在最近接手的项目中是怎么实现的：
![img](http://km.oa.com/files/photos/pictures/202008/1597771325_60_w788_h802.png)
项目的组件库统一使用的tea，这里我就保留前两项实现：

```
/**
 * BaseInfoPanel.tsx -- 组件核心页面
 */
import * as React from 'react';
import { connect } from 'react-redux';
import { t, Trans } from '@tencent/tea-app/lib/i18n';
import { bindActionCreators, insertCSS, OperationState, isSuccessWorkflow } from '@tencent/ff-redux';
import { allActions } from '../../../actions';
import { RootProps } from '../GroupApp';
import { Button } from '@tea/component';
import { Group } from '../../../models/Group';
import { router } from '../../../router';
import { FormPanel } from '@tencent/ff-component';
import { isValid } from '@tencent/ff-validator';

const mapDispatchToProps = dispatch =>
  Object.assign({}, bindActionCreators({ actions: allActions }, dispatch), {
    dispatch
  });

@connect(state => state, mapDispatchToProps)
export class BaseInfoPanel extends React.Component<RootProps, {}> {

  render() {
    let { actions, route, groupCreation, groupValidator } = this.props;
    let action = actions.group.create.addGroupWorkflow;
    const { groupAddWorkflow } = this.props;
    const workflow = groupAddWorkflow;

    /** 提交 */
    const perform = () => {
      actions.group.create.validator.validate(null, async r => {
        if (isValid(r)) {
          let group: Group = Object.assign({}, groupCreation);
          action.start([group]);
          action.perform();
        }
      });
    };
    /** 取消 */
    const cancel = () => {
      if (workflow.operationState === OperationState.Done) {
        action.reset();
      }
      if (workflow.operationState === OperationState.Started) {
        action.cancel();
      }
      router.navigate({ module: 'group', sub: '' }, route.queries);
    };
    const failed = workflow.operationState === OperationState.Done && !isSuccessWorkflow(workflow);

    return (
      <FormPanel vactions={actions.group.create.validator} formvalidator={groupValidator}>
        <FormPanel.Item
          label={t('用户组名称')}
          vkey="spec.displayName"
          input={{
            placeholder: t('请输入用户组名称，不超过60个字符'),
            value: groupCreation.spec.displayName,
            onChange: value => actions.group.create.updateCreationState({ spec: Object.assign({}, groupCreation.spec, { displayName: value }) })
          }}
        />
        <FormPanel.Item
          label={t('用户组描述')}
          vkey="spec.description"
          input={{
            multiline: true,
            placeholder: t('请输入用户组描述，不超过255个字符'),
            value: groupCreation.spec.description,
            onChange: value => actions.group.create.updateCreationState({ spec: Object.assign({}, groupCreation.spec, { description: value }) })
          }}
        />
        <FormPanel.Footer>
          <Button
            className="m"
            type="primary"
            disabled={workflow.operationState === OperationState.Performing}
            onClick={e => { e.preventDefault(); perform() }}>
            {failed ? t('重试') : t('提交')}
          </Button>
          <Button type="weak" onClick={e => { e.preventDefault(); cancel() }}>
            {t('取消')}
          </Button>
        </FormPanel.Footer>
      </FormPanel>
    );
  }
}
```

眨一看好像还行，还挺简洁的，这是我看到代码后的第一感受。进一步分析，首先TKEStack的组件库用的是tea, 看组件构成的时候很明显的我看到了FormPanel组件，这个不是tea组件库的组件，点进去源码大概看下，哦～原来这个组件来源@tencent/ff-component是对tea的相关表单组件做了二次封装（简单说明下@tencent/ff-component封装不是tea团队的作品，是项目之前的人搞的封装）。大概知道了，接着看，先看下表单有没有初始值，发现没看到类似initialValue或者defaultValue这样的数据，这个表单好像没有做初始化。不过我看到FormPanel.Item里边有个value属性是有赋值的，定位一下，看到这个值是从组件的props中获取的，那props数据从哪儿来的？这里我先查看了下组件调用的地方 [因为redux传过来的数据没有过滤所以查找起来会比较麻烦]，没发现有传props，那么看来这个数据有可能是redux数据，然后我去reducer中搜查了一番，果然查到了，如图，映入眼帘还有initGroupCreationState这个参数, 看了参数内容，我确定了原来不是表单没有初始化，而是初始化工作是在reducer中做的，原来这个表单是通过redux来做状态管理的，有点落伍啊。行吧，接着看下下边的onChange，明白了，这里边做的事就是通过action操作value所在的redux数据，因为redux中使用的一个字段存储的整个表单的数据，所以这里新值需要手动合并进去，挺麻烦的。继续吧，校验呢？FormPanel.Item中没有看到校验相关的逻辑，return的上下文中也没有看到校验相关的逻辑，但是实际操作时是有校验的，奇怪了，反复确认后我发现只有FormPanel的属性有和校验相关的内容，再点进去FormPanel的源码，查看了一些列封装代码之后算是搞明白了，vactions和formvalidator会传给每一个子元素，校验结果也是通过redux管理的，校验结果存储在groupValidator中，表单数据变更后会触发封装的onBlur事件，然后会调用vactions中的action，这个action经过了一系列的封装，最终会校验对应表单元素的值，而校验规则则配置在action定义的地方。表单提交时会通过另外一个封装的方法isValid对整个表单校验结果进行check,if为true时再发送真正的表单请求。好了这个组件的核心内容大概就是这些，不过最终页面的UI效果吧有点差强人意，必填项没有相关标示，校验结果必须鼠标hover到最后的叹号才会弹出来（显示出来）。

做个总结：
\1. 项目自身组织封装了一套规范表单状态管理及表单校验的方案，这套封基于tea组件库，依赖于redux。
\2. 这套封装没有提供文档，对新人不友好，增加理解、学习成本。
\3. 依赖redux的方案，社区很早就有成熟封装，这里选择自己封装，可封装的却并不好。
  3.1 使用这套封装组织代码时，表单主体、初始值、校验规则分散在三个不同地方，不利于代码理解，修改需要来回切换文件，不利于代码编写和维护。
  3.2 表单元素值改动后，调用action传入的新值需要手动合并到redux的表单数据中，书写繁琐。
  3.3 UI效果不友好，必填项没有标注，校验信息必须hover到叹号上去才能看到。
\4. form状态本质上是短暂的且局部的，因此在redux中跟踪form状态是不必要的。

这个时候我还挺好奇项目其他部分的表单是怎么处理的，于是我做了一番查看
![img](http://km.oa.com/files/photos/pictures/202008/1598242675_50_w309_h298.png)
然后，我看到了更多情况的写法：
这是表单中的一个元素，其中FormItem和InputField都不依赖于tea组件库，追根溯源我看到了一系列基于原生表单元素的封装，也是没有文档。这里InputField元素通过value&onChange这一对属性管理自身的值，通过validator&onBlur这一对属性管理自身的校验结果，通过tipMode管理自身的UI展示。
疯狂就此开始
![img](http://km.oa.com/files/photos/pictures/202008/1597813332_68_w494_h384.png)![img](http://km.oa.com/files/photos/pictures/202008/1597813333_16_w1320_h1098.png)

![img](http://km.oa.com/files/photos/pictures/202008/1598242766_86_w192_h187.png)

![img](http://km.oa.com/files/photos/pictures/202008/1598242780_6_w332_h156.png)

这里我截取了项目中一个模块部分表单校验相关的截图和表单redux数据管理截图。
截图1我们可以看到模块中有很多和校验相关的独立文件；截图2是表单提交时进行的前置校验，这里调用了每个字段的校验action；截图3是每个字段校验action的大概内容；截图4reducer截图中能够看出来一个表单元素对应着一个数据字段和一个验证信息字段，初始化也是在这里做的。
这个太疯狂了。

总结：
\7. 表单状态和校验数据仍然通过redux管理。但抛弃tea组件库，自己封装基础UI组件， 加入校验逻辑（难以扩展）。
\8. 失控的校验和数据管理。
  8.1 写表单时，**每个表单元素**都需要定义一个单独的数据处理action和校验action，分别对应redux中单独的数据字段存储。这种写法**提高不了人效，增加了开发成本**，写出来的代码之后反而会成为负担，**增大维护成本**。

当然，问题不止于此，但是我已经意识到这个项目的表单处理问题非常大了，必须进行改进。

改进1:
时间的原因，我首选了以前用过的一个方案的Hooks版本react-final-form-hooks来进行快速改进，为什么使用Hooks下文会有详细内容。
这里我也是提取出了核心代码。
大概看下，首先这个方案基于tea组件库，tea组件库和react-final-form-hooks库都有文档可查；不依赖redux，不牵扯额外的action方法和redux数据；初始化在这里，校验在这里，都在组件主体中；受控组件，这里会解构出来value，数据改动后不需要额外的手动合并；提交时不需要前置校验，验证不通过提交操作默认不会执行。

```
/**
 * BaseInfoPanel.tsx -- 组件核心页面
 */
import * as React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useForm, useField } from 'react-final-form-hooks';
import { Button, Text, Form, Input, Affix, Card } from '@tencent/tea-component';
// ...

const { useState, useEffect, useRef } = React;

export const BaseInfoPanel = React.memo(props => {
  const state = useSelector(state => state);
  const dispatch = useDispatch();
  const { actions } = bindActionCreators({ actions: allActions }, dispatch);

  // 处理外层滚动
  const bottomAffixRef = useRef(null);
  useEffect(() => {
    const body = document.querySelector('.tea-web-body');
    if (!body) {
      return () => null;
    }
    const handleScroll = () => {
      bottomAffixRef.current.update();
    };
    body.addEventListener('scroll', handleScroll);
    return () => body.removeEventListener('scroll', handleScroll);
  }, []);

  function onSubmit(values, form) {
    const { displayName, description } = values;
    actions.group.create.addGroupWorkflow.start([
      {
        id: uuid(),
        spec: {
          displayName,
          description,
        }
      }
    ]);
    actions.group.create.addGroupWorkflow.perform();
  }

  const { form, handleSubmit, validating, submitting } = useForm({
    onSubmit,
    initialValuesEqual: () => true,
    initialValues: { displayName: '', description: '' },
    validate: ({ displayName, description }) => {
      const errors = {
        displayName: undefined,
        description: undefined,
      };
      if (!displayName) {
        errors.displayName = t('请输入用户账号');
      } else if (displayName.length > 60) {
        errors.displayName = t('请输入用户组名称，不超过60个字符');
      }

      if (description.length > 255) {
        errors.description = t('请输入用户组描述，不超过255个字符');
      }

      return errors;
    }
  });

  const displayName = useField('displayName', form);
  const description = useField('description', form);

  return (
    <form onSubmit={handleSubmit}>
      <Card>
        <Card.Body>
          <Form>
            <Form.Item
              label={t('用户组名称')}
              required
              status={getStatus(displayName.meta, validating)}
              message={getStatus(displayName.meta, validating) === 'error' ? displayName.meta.error : ''}
            >
              <Input
                {...displayName.input}
                size="l"
                autoComplete="off"
                placeholder={t('请输入用户组名称，不超过60个字符')}
              />
            </Form.Item>
            <Form.Item
              label={t('用户组描述')}
              status={getStatus(description.meta, validating)}
              message={getStatus(description.meta, validating) === 'error' ? description.meta.error : ''}
            >
              <Input
                {...description.input}
                multiline
                size="l"
                autoComplete="off"
                placeholder={t('请输入用户组描述，不超过255个字符')}
              />
            </Form.Item>
          </Form>
        </Card.Body>
      </Card>
      <Affix ref={bottomAffixRef} offsetBottom={0} style={{ zIndex: 5 }}>
        <Card>
          <Card.Body style={{ borderTop: '1px solid #ddd' }}>
            <Form.Action style={{ borderTop: 0, marginTop: 0, paddingTop: 0 }}>
              <Button type="primary">保存</Button>
              <Button
                onClick={e => {
                  e.preventDefault();
                  router.navigate({ module: 'user', sub: 'group' });
                }}
              >
                取消
              </Button>
            </Form.Action>
          </Card.Body>
        </Card>
      </Affix>
    </form>
  );
});
```

结果：这个改进解决了最初实现中我发现的所有问题

新的问题：快速支撑完业务需要之后，我仔细阅读了下react-final-form-hooks的文档，看到官方文档有一段大概是这么说的——react-final-form-hooks是一种轻巧，简单的解决方案，用于快速建立表单并在单个渲染函数中运行，不能进行性能优化。如果你的表单比较简单，你也没有自定义可重用表单输入组件的需求，那么你可以选择使用react-final-form-hook。 但是，如果你的应用程序很大，很复杂，或者需要针对性能进行优化，则不建议使用。


改进2:
使用了当前社区最新、最优质的表单状态管理及校验方案。
和上次改造一样解决了最初实现我发现的所有问题。
官方介绍react-hook-form是一个高性能、灵活、易扩展、易于校验的表单库。所以这个库应该能处理复杂表单的组件拆分复用需求。

```
/**
 * BaseInfoPanel.tsx -- 组件核心页面
 */
import * as React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Controller, useForm } from 'react-hook-form';
import { Button, Text, Form, Input, Affix, Card } from '@tencent/tea-component';
// ...

const { useState, useEffect, useRef } = React;

export const BaseInfoPanel = React.memo(props => {
  const state = useSelector(state => state);
  const dispatch = useDispatch();
  const { actions } = bindActionCreators({ actions: allActions }, dispatch);

  // 处理外层滚动
  const bottomAffixRef = useRef(null);
  useEffect(() => {
    const body = document.querySelector('.tea-web-body');
    if (!body) {
      return () => null;
    }
    const handleScroll = () => {
      bottomAffixRef.current.update();
    };
    body.addEventListener('scroll', handleScroll);
    return () => body.removeEventListener('scroll', handleScroll);
  }, []);

  function onSubmit(data, e) {
    const { displayName, description } = data;
    actions.group.create.addGroupWorkflow.start([
      {
        id: uuid(),
        spec: {
          displayName,
          description,
        }
      }
    ]);
    actions.group.create.addGroupWorkflow.perform();
  }

  const { register, watch, handleSubmit, reset, control, errors } = useForm({
    mode: 'onBlur',
    defaultValues: {
      displayName: '',
      description: ''
    }
  });

  return (
    <form onSubmit={handleSubmit}>
      <Card>
        <Card.Body>
          <Form>
            <Form.Item
              label={t('用户组名称')}
              required
              status={errors.displayName ? 'error' : 'success'}
              message={errors.displayName ? errors.displayName.message : '' }
            >
              <Controller
                as={<Input
                      size="l"
                      autoComplete="off"
                      placeholder={t('请输入用户组名称，不超过60个字符')}
                    />}
                name="displayName"
                control={control}
                rules={{
                  required: t('请输入用户账号'),
                  maxLength: {
                    value: 60,
                    message: '请输入用户组名称，不超过60个字符'
                  }
                }}
              />
            </Form.Item>
            <Form.Item
              label={t('用户组描述')}
              required
              status={errors.description ? 'error' : 'success'}
              message={errors.description ? errors.description.message : '' }
            >
              <Controller
                as={<Input
                      multiline
                      size="l"
                      autoComplete="off"
                      placeholder={t('请输入用户组描述，不超过255个字符')}
                    />}
                name="description"
                control={control}
                rules={{
                  maxLength: {
                    value: 255,
                    message: '请输入用户组描述，不超过255个字符'
                  }
                }}
              />
            </Form.Item>
          </Form>
        </Card.Body>
      </Card>
      <Affix ref={bottomAffixRef} offsetBottom={0} style={{ zIndex: 5 }}>
        <Card>
          <Card.Body style={{ borderTop: '1px solid #ddd' }}>
            <Form.Action style={{ borderTop: 0, marginTop: 0, paddingTop: 0 }}>
              <Button type="primary" htmlType="submit" onClick={handleSubmit(onSubmit)}>保存</Button>
              <Button
                onClick={e => {
                  e.preventDefault();
                  router.navigate({ module: 'user', sub: 'group' });
                }}
              >
                取消
              </Button>
            </Form.Action>
          </Card.Body>
        </Card>
      </Affix>
    </form>
  );
});
```

 总结制订表单状态管理及校验规格表：为以后不同技术栈、不同项目的相关功能升级建立了一个评判标准，如果有实现相关功能的需要，这也是一个指引。

易用性：

1. 要有良好的文档指引，以降低理解、学习成本
2. 表单的初始值定义、校验逻辑、表单主体不应分散在不同的地方，要让人能够更好的阅读代码、理解代码，降低代码的编码和维护成本。
3. 如果是受控组件，应该能够优雅的给单个表单元素赋值
4. 校验出错后应该自动聚焦第一个报错元素

绑定、依赖：

1. 不应该绑定UI，应该能够适配UI
2. 不应依赖状态管理工具(比如redux等)，因为form的状态和校验结果本质上是短暂的且局部的，但是如果有分步表单的需要，要能够支持集成状态管理工具
3. 要尽量减少对第三方的依赖或绑定，以更好的应对未来的变化

功能：

1. 要能处理表单提交，在校验不通过时默认不会执行提交方法
2. 应该提供手动触发表单校验的方法，以在需要的时候可以手动触发
3. 应该提供表单初始化及reset的能力

校验：

1. 应该能结合 HTML标准表单校验（https://developer.mozilla.org/en-US/docs/Learn/Forms/Form_validation），使表单校验变得简单
2. 应该允许使用外部校验库，例如Yup, Joi，Superstruct等

性能：

1. 非受控组件可以减少表单渲染次数、受控组件能够进行更好的数据追踪，应该让用户能够自主选择
2. 应该做到表单字段可伸缩，在表单字段的数量从 5 个增长到 50 个、100 个、200 个的时候性能不应该有明显的变化



------

**实践2: 用工具统一约束使用Hooks开发需要遵循的规则**
Hook 在使用时需要遵循两条规则:
(1) 只在最顶层使用 Hook
不要在循环，条件或嵌套函数中调用 Hook
(2) 只在 React 函数中调用 Hook
不要在普通的 JavaScript 函数中调用 Hook。你可以：

- 在 React 的函数组件中调用 Hook
- 在自定义 Hook 中调用其他 Hook

eslint-plugin-react-hooks 的 ESLint 插件来强制执行这两条规则。

```javascript
npm install eslint-plugin-react-hooks --save-dev
```

 

```javascript
// 你的 ESLint 配置
{
  "plugins": [
    // ...
    "react-hooks"
  ],
  "rules": {
    // ...
    "react-hooks/rules-of-hooks": "error", // 检查 Hook 的规则
    "react-hooks/exhaustive-deps": "warn" // 检查 effect 的依赖
  }
}
```

------

**实践3：升级React Redux让React组件和Redux的数据连接更加便捷**

19年中旬，React Redux v7.1.0 出来后提供了一组自定义Hooks API，可以用来取代之前connect()高阶组件的工作。[[文档介绍](https://react-redux.js.org/api/hooks)]
下边为项目中使用React Redux Hooks的代码片段：

```javascript
import { useSelector, useDispatch } from 'react-redux';
export const WebhookTablePanel = props => {
  const state = useSelector(state => state);
  const dispatch = useDispatch();
  const { actions } = bindActionCreators({ actions: allActions }, dispatch);
// ...
}
```

------

 

------

**实践4：通过Hooks统一封装异步数据请求，附加上状态信息**

下边是封装接口请求自定义Hook的完整代码，注意不能在常规的Javascript函数中调用。只能在 React 的函数组件 及 自定义 Hook 中调用（这是自定义Hook的规范）。

```javascript
const useDataApi = (initialUrl, initialData) => {
  const [url, setUrl] = useState(initialUrl);

  const [state, dispatch] = useReducer(dataFetchReducer, {
    isLoading: false,
    isError: false,
    data: initialData,
  });

  useEffect(() => {
    let didCancel = false; 

    const fetchData = async () => {
      dispatch({ type: 'FETCH_INIT' });

      try {
        const result = await axios(url);

        if (!didCancel) {
          dispatch({ type: 'FETCH_SUCCESS', payload: result.data });
        }
      } catch (error) {
        if (!didCancel) {
          dispatch({ type: 'FETCH_FAILURE' });
        }
      }
    };

    fetchData();

    return () => {
      didCancel = true;
    };
  }, [url]);

  return [state, setUrl];
};
const dataFetchReducer = (state, action) => {
  switch (action.type) {
    case 'FETCH_INIT':
      return {
        ...state,
        isLoading: true,
        isError: false
      };
    case 'FETCH_SUCCESS':
      return {
        ...state,
        isLoading: false,
        isError: false,
        data: action.payload,
      };
    case 'FETCH_FAILURE':
      return {
        ...state,
        isLoading: false,
        isError: true,
      };
    default:
      throw new Error();
  }
};
```

------

**实践5：使用更多自定义Hooks提升开发效率**

Hooks方案一个伟大的地方就在于我们可以把状态逻辑抽离出自定义Hook，让状态逻辑的便捷复用成为可能。我们通过自定义Hook的丰富可以极大的提高开发效率，从长远看不仅能让当前项目团队受益，扩展出来合适的库之后甚至能让公司、React技术使用团体受益。

举例：弹窗的开关功能
下图左侧为我们之前的做法，在需要用到弹窗的每个组件中定义state，定义开关方法；
下图右侧为抽离自定义Hook后的实现。
总结：到处像左侧代码一样处理状态逻辑不仅增加了代码量，更是一种时间的浪费，而在状态逻辑提取出来之后代码的编写变简洁了，代码看上去也更清爽了。
![img](http://km.oa.com/files/photos/pictures/202008/1597803414_22_w2474_h1150.png)

时至今日市面上已经浮现出了一些React Hooks库可以供我们武装团队，或者参考学习，比如：
[react-use](https://github.com/streamich/react-use)
现状：当前社区最流行的Hooks库，即便不使用也是很好的灵感源泉；版本迭代很快，需要及时频繁的跟进升级；API设计规范不够，同类Hooks相比比较杂乱。
[ahooks](https://ahooks.js.org/zh-CN)
现状：阿里几个团队共建的，有相应的API规范；刚出1.0版本没多久，不过稳定性上应该有所保障。

------

**实践6****：全局状态管理方案尝试脱离第三方，改用内置Hooks实现**

以下为我在某个项目中的实践。

```javascript
/* provider文件 */

import React, { useContext } from "react";
import useInstance from "../state/useInstance";
import useRegion from "../state/useRegion";
import useRouter from '../state/useRouter';
const StateContext = React.createContext(undefined);

export const StateProvider = ({ children }) => {

  // 下边调用的时候可以进行初始化
  const stateHooks = {
    instance: useInstance({
      getInstanceListResult: {},
      createInstanceResult: {},
    }),
    region: useRegion(),
    router: useRouter()
  };
  return (
    <StateContext.Provider value={stateHooks}>{children}</StateContext.Provider>
  );
};

export const useStateHooks = () => {
  return useContext(StateContext);
};
```



```javascript
/* 实例相关state（包括数据、操作--针对异步数据）的封装 */

import { useReducer } from "react"
import {
  instanceReducer,
} from "../reducers"
import { newInstanceActions } from '../actions/instanceActions'
import { getFetchInitialData } from '../../common/hooks'

export default function useInstance({getInstanceListResult, createInstanceResult}) {
  const [instance, instanceDispatch] = useReducer(instanceReducer, {
    getInstanceListResult: getFetchInitialData(getInstanceListResult),
    createInstanceResult: getFetchInitialData(createInstanceResult)
  })
  const { getInstanceList, createInstance } = newInstanceActions(instanceDispatch)

  return {
    instance,
    getInstanceList,
    createInstance,
  };
}
```

 

```javascript
/* reducer文件 */

import { GET_INSTANCE_LIST, CREATE_INSTANCE } from '../constants/ActionTypes';
const instanceReducer = (state = {}, action) => {
  switch (action.type) {
    case GET_INSTANCE_LIST:
      return {...state, getInstanceListResult: action.payload};
    case CREATE_INSTANCE:
      return {...state, createInstanceResult: action.payload};
    default:
      return state;
  }
};

export default instanceReducer;
```

 

```javascript
/* action 文件 */

import {dataFetch} from '@src/modules/common/hooks';
import { GET_INSTANCE_LIST, CREATE_INSTANCE } from '../constants/ActionTypes'
export function newInstanceActions(dispatch) {
  function createInstance(params) {
    const initialData = {}
    dataFetch({
      actionType: CREATE_INSTANCE,
      actionDispatch: dispatch,
      initialData,
      requestFunc: () => WebAPI.editInstanceNew(params)
    })
  }

  function getInstanceList(params) {
    // ...
  }

  return { getInstanceList, createInstance };
}
```


**那么是说hooks 现在就可以取代 redux 吗？**
我们稍作**比对**后会发现：
\1.  redux 有非常成熟的状态跟踪调试工具，也就是 chrome 浏览器的 redux-devtools 插件，通常开发中很多的错误都可以通过它发现。换而言之，它能够协助我们写出更利于维护的代码，并且在出现故障时快速找到问题的根源。
\2. redux 有非常成熟的数据模块化方案，不同模块的 reducer 直接导出，在全局的 store 中，调一下 redux 自带的 combineReducer 即可，目前从官方的角度看 hooks 这方面并不成熟。
\3. redux 拥有成熟且强大的中间件功能，如 redux-logger, redux-thunk, redux-saga，用 hooks 实现中间件的功能就只能靠自己手动实现了。
\4. redux 被人吐槽的是繁重的模板代码，需要 react-redux 等包的引入徒增项目包大小等等。

综上最终我们还需要结合自己项目的实际情况做出取舍，比如对于比较简单的没什么顾忌的项目就可以选择使用hooks方案来探索更多可能，对于复杂的各方面要求都很高的项目就可以保留之前的最佳实践。

------

**实践7****：Hooks方案处理中间件**

```javascript
/* state 文件 */

import { useReducer } from "react";
import {
  visibilityFilter as visibilityFilterReducer
} from "../reducers";
import { visibilityFilterActions } from "../actions/visibilityFilterActionCreators";
import { withMiddleware, logger1, logger2 } from "../middleware";

export default function useDemo() {
  const [filter, vfDispatch] = useReducer(
    visibilityFilterReducer,
    'SHOW_ALL'
  );
  const wrappedVfDispatch = withMiddleware(filter, vfDispatch)(
    logger1,
    logger2
  );
  const { setVisibilityFilter } = visibilityFilterActions(wrappedVfDispatch);
  return {
    filter,
    setFilter: setVisibilityFilter,
  };
} 
```



```javascript
/* middleware 文件内容 */

import { compose } from "ramda";

export const withMiddleware = (state, dispatch) => (...middlewares) =>
  compose(...middlewares.map(mf => mf(state)))(dispatch);

export const logger1 = state => next => action => {
  console.log("Middleware logger1 logs before dispatch", state, action);
  next(action);
};

export const logger2 = state => next => action => {
  next(action);
  console.log("Middleware logger2 logs after dispatch", state, action);
};
```

# 优化

Hooks方案的函数组件我们可以怎么做优化。

**实践8: React.memo** 

问题：如果数据变更，节点类型不相同的时候会怎样呢？
React 的做法非常简单粗暴，直接将 原 VDOM 树上该节点以及该节点下所有的后代节点 全部删除，然后替换为新 VDOM 树上同一位置的节点，当然这个节点的后代节点也全都跟着过来了。这样的话非常浪费性能，父组件数据一变化，子组件全部都移除，再换新的，所以才有了shouldComponentUpdate这个生命周期，这个函数如果返回false的话子组件就不会更新，但是每次在这个函数里面写对比会很麻烦，所以有了PureComponent。但使用PureComponent我们必须把组件实现为 Class组件，不能用函数来实现组件。所以在React v16.6.0 之后就有了React.memo。

**React.memo 为高阶组件。它与 React.PureComponent 非常相似，但只适用于函数组件，而不适用 class 组件。**

如果你的函数组件在给定相同 props 的情况下渲染相同的结果，那么你可以通过将其包装在 React.memo 中调用，以此通过记忆组件渲染结果的方式来提高组件的性能表现。这意味着在这种情况下，React 将跳过渲染组件的操作并直接复用最近一次渲染的结果。

React.memo检查的是 props 变更。如果函数组件被 React.memo 包裹，且其实现中拥有 useState 或 useContext 的 Hook，当 context 发生变化时，它仍会重新渲染。

默认情况下其只会对复杂对象做浅层对比，如果你想要控制对比过程，那么请将自定义的比较函数通过第二个参数传入来实现。

写法如下：

```javascript
function MyComponent(props) {
  /* 使用 props 渲染 */
}
function areEqual(prevProps, nextProps) {
  /*
  如果把 nextProps 传入 render 方法的返回结果与
  将 prevProps 传入 render 方法的返回结果一致则返回 true，
  否则返回 false
  */
}
export default React.memo(MyComponent, areEqual);
```

------

**实践9: immer** 

先简单聊聊不可变数据、immutable.js及immer：
不可变数据主要是说一次更新过程中，不应该改变原有对象，而需要新创建一个对象用来承载新的数据状态（不了解这个概念的网上搜下，身边确实有人现在还不太了解）。新的对象应该如何创建可以参看下边immutable.js的图：【[点我看动图展示](https://user-gold-cdn.xitu.io/2018/12/5/1677dc8dba33def4?imageslim)】
![img](http://km.oa.com/files/photos/pictures/202008/1597571619_75_w1188_h1160.png)
图中可以看出返回值并不是一份深拷贝内容，而是共享了未被修改的数据，**这样的好处就是避免了深拷贝带来的极大的性能开销问题，**并且更新后返回了一个全新的引用，即使是浅比对也能感知到数据的改变。**而上边的PureComponent和Memo刚好只提供了浅比较，**所以这时候不可变数据就派上用场了，这样每次修改数据和原数据不相等的话，就可以精确的控制更新。

immutable.js是Facebook历时3年针对上边说React缺陷打造的不可变数据结构的库。
Immer 是 mobx 的作者写的一个 immutable 库。
相比之下immutable.js有2个较大的不足：

- 需要使用者学习它的数据结构操作方式，没有 Immer 提供的使用原生对象的操作方式简单、易用；
- 它的操作结果需要通过toJS方法才能得到原生对象，这使得在操作一个对象的时候，时刻要注意操作的是原生对象还是 Immutable.js 的返回结果，稍不注意，就会产生意想不到的 bug。

基本东西聊完了下边主要介绍应用：
使用的npm包有2个——immer use-immer。基本安装和API就不说了（新手不友好了，快去翻文档），直接说可以实操的地方。下边主要列出了3个，更多扩展大家可以结合实际情况来搞。
（1）如下**设置组件状态的时候可以使用useImmer。**发现没有，这里给开篇问题1拆分出来引用类型的情况开阔出了更友好的写法。

```javascript
import React from "react";
import { useImmer } from "use-immer";


export default function () {
  const [person, setPerson] = useImmer({
    name: "小马哥",
    salary: '我要当首富'
  });

  function setName(name) {
    setPerson(draft => {
      draft.name = name;
    });
  }

  function becomeRicher() {
    setPerson(draft => {
      draft.salary += '增加1000亿';
    });
  }

  return (
    <div className="App">
      <h1>
        {person.name} ({person.salary})
      </h1>
      <input
        onChange={e => {
          setName(e.target.value);
        }}
        value={person.name}
      />
      <br />
      <button onClick={becomeRicher}>变富</button>
    </div>
  );
}
```

（2）**useEffect的第二个参数数据可以使用immer处理。**这个也是上边问题8的终极优化方案。

```javascript
const useExample = apiOptions => {
  const [data, updateData] = useState([]);
  useEffect(() => {
    console.log("effect triggered");
  }, [apiOptions]);

  return {
    data
  };
};

function App() {
  const [apiOptions, setApiOptions] = useImmer({ a: 1 });
  const { data } = useExample(apiOptions);
  function setA(a) {
    setApiOptions(draft => {
      draft.a = a;
    })
  }
  return (
    <div>
      <button
        onClick={() => {
          setA(2)
        }}
      >
        change apiOptions
      </button>
    </div>
  );
}
```

 （3）**全局状态管理也可以使用immer处理。**下边第一段代码是使用use-immer中的useImmerReducer（对useReducer的加强封装）实现的状态管理代码，第二段代码是用immer对原来reducer的优化，看需要选择使用。

```javascript
import React from "react";
import { useImmerReducer } from "use-immer";

const initialState = { salary: 0 };

function reducer(draft, action) {
  switch (action.type) {
    case "reset":
      return initialState;
    case "increment":
      return void draft.salary++;
    case "decrement":
      return void draft.salary--;
  }
}

export default function () {
  const [state, dispatch] = useImmerReducer(reducer, initialState);
  return (
    <>
      期待工资: {state.salary}K
      <button onClick={() => dispatch({ type: "increment" })}>+</button>
      <button onClick={() => dispatch({ type: "decrement" })}>-</button>
      <button onClick={() => dispatch({ type: "reset" })}>重置</button>
    </>
  );
}
```

 

```
/*
 * 对原有reducer的优化
 */
// 原有普通reducer
const reducer = (state, action) => {
  switch (action.type) {
    case 'ADD_AGE':
      const { members } = state;
      return {
        ...state,
        members: [
          {
            ...members[0],
            age: members[0].age + 1,
          },
          ...members.slice(1),
        ]
      }
    default:
      return state
  }
}

// 用immer初步改写
const reducer = (state, action) => produce(state, draftState => {
  switch (action.type) {
    case 'ADD_AGE':
      draftState.members[0].age++;
  }
})

// 用immer进一步改写
const reducer = produce((draftState, action) => {
  switch (action.type) {
    case 'ADD_AGE':
      draftState.members[0].age++;
  }
})
```

 综上，**可以看出来使用immer既可以做优化，又在一定程度上可以简化书写。**怎么样心动了吗～





# 总结

​    使用React Hook方案开发React项目需要对思维模式进行比较大的转变，思维模式的转变通常是比较困难的，大多数人会表现出不适甚至抵抗，但是技术在不断变革，新的东西还是要先以接受的心态尝试比对，或许这里别有洞天呢。希望上边的实践总结能对阅读到这里的你有所帮助，也欢迎一起探讨React Hook方案各方面的问题，在新技术的浪潮中大伙一起成长。