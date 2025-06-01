---
title: Ваш UI как дерево
---

<Intro>

Ваше приложение React приобретает форму, в нем много компонентов, вложенных друг в друга. Как React отслеживает структуру компонентов вашего приложения?

React, как и многие другие библиотеки пользовательского интерфейса, моделирует пользовательский интерфейс в виде дерева. Представление о вашем приложении как о дереве полезно для понимания взаимосвязи между компонентами. Это понимание поможет вам отладить такие будущие концепции, как производительность и управление состояниями.

<details>
<summary><small>(eng)</small></summary>

Your React app is taking shape with many components being nested within each other. How does React keep track of your app's component structure?
React, and many other UI libraries, model UI as a tree. Thinking of your app as a tree is useful for understanding the relationship between components. This understanding will help you debug future concepts like performance and state management.
You will learn:
* How React "sees" component structures
* What a render tree is and what it is useful for
* What a module dependency tree is and what it is useful for

</details>


</Intro>

<YouWillLearn>

* Как React «видит» структуры компонентов
* Что такое дерево рендеринга и для чего оно полезно
* Что такое дерево зависимостей модулей и для чего оно полезно

</YouWillLearn>

## Ваш пользовательский интерфейс в виде дерева {/*your-ui-as-a-tree*/}

Деревья - это модель отношений между элементами, и пользовательский интерфейс часто представляют с помощью древовидных структур. Например, браузеры используют древовидные структуры для моделирования HTML ([DOM](https://developer.mozilla.org/docs/Web/API/Document_Object_Model/Introduction)) и CSS ([CSSOM](https://developer.mozilla.org/docs/Web/API/CSS_Object_Model)). Мобильные платформы также используют деревья для представления иерархии представлений.

<details>
<summary><small>(eng)</small></summary>

<b>Your UI as a tree</b>
Trees are a relationship model between items and UI is often represented using tree structures. For example, browsers use tree structures to model HTML ([DOM](https://developer.mozilla.org/docs/Web/API/Document_Object_Model/Introduction)) and CSS ([CSSOM](https://developer.mozilla.org/docs/Web/API/CSS_Object_Model)). Mobile platforms also use trees to represent their view hierarchy.

React creates a UI tree from your components. In this example, the UI tree is then used to render to the DOM.

</details>


<Diagram name="preserving_state_dom_tree" height={193} width={864} alt="Diagram with three sections arranged horizontally. In the first section, there are three rectangles stacked vertically, with labels 'Component A', 'Component B', and 'Component C'. Transitioning to the next pane is an arrow with the React logo on top labeled 'React'. The middle section contains a tree of components, with the root labeled 'A' and two children labeled 'B' and 'C'. The next section is again transitioned using an arrow with the React logo on top labeled 'React DOM'. The third and final section is a wireframe of a browser, containing a tree of 8 nodes, which has only a subset highlighted (indicating the subtree from the middle section).">

React создает дерево пользовательского интерфейса из ваших компонентов. В этом примере дерево пользовательского интерфейса используется для рендеринга в DOM.

</Diagram>

Подобно браузерам и мобильным платформам, React также использует древовидные структуры для управления и моделирования отношений между компонентами в приложении React. Эти деревья являются полезными инструментами для понимания того, как данные проходят через приложение React и как оптимизировать рендеринг и размер приложения.

<details>
<summary><small>(eng)</small></summary>

Like browsers and mobile platforms, React also uses tree structures to manage and model the relationship between components in a React app. These trees are useful tools to understand how data flows through a React app and how to optimize rendering and app size.

</details>


## Дерево рендеринга {/*the-render-tree*/}

Важной особенностью компонентов является возможность составлять компоненты из других компонентов. По мере того как мы [вкладываем компоненты](/learn/your-first-component#nesting-and-organizing-components), у нас появляется концепция родительских и дочерних компонентов, где каждый родительский компонент может сам быть дочерним для другого компонента.

Когда мы рендерим React-приложение, мы можем моделировать эти отношения в дереве, известном как дерево рендеринга.

Здесь представлено приложение React, которое отображает вдохновляющие цитаты.

<details>
<summary><small>(eng)</small></summary>

<b>The Render Tree:</b>
A major feature of components is the ability to compose components of other components. As we [nest components](/learn/your-first-component#nesting-and-organizing-components), we have the concept of parent and child components, where each parent component may itself be a child of another component.
When we render a React app, we can model this relationship in a tree, known as the render tree.
Here is a React app that renders inspirational quotes.
React creates a *render tree*, a UI tree, composed of the rendered components.

</details>


<Sandpack>

```js src/App.js
import FancyText from './FancyText';
import InspirationGenerator from './InspirationGenerator';
import Copyright from './Copyright';

export default function App() {
  return (
    <>
      <FancyText title text="Get Inspired App" />
      <InspirationGenerator>
        <Copyright year={2004} />
      </InspirationGenerator>
    </>
  );
}

```

```js src/FancyText.js
export default function FancyText({title, text}) {
  return title
    ? <h1 className='fancy title'>{text}</h1>
    : <h3 className='fancy cursive'>{text}</h3>
}
```

```js src/InspirationGenerator.js
import * as React from 'react';
import quotes from './quotes';
import FancyText from './FancyText';

export default function InspirationGenerator({children}) {
  const [index, setIndex] = React.useState(0);
  const quote = quotes[index];
  const next = () => setIndex((index + 1) % quotes.length);

  return (
    <>
      <p>Your inspirational quote is:</p>
      <FancyText text={quote} />
      <button onClick={next}>Inspire me again</button>
      {children}
    </>
  );
}
```

```js src/Copyright.js
export default function Copyright({year}) {
  return <p className='small'>©️ {year}</p>;
}
```

```js src/quotes.js
export default [
  "Don’t let yesterday take up too much of today.” — Will Rogers",
  "Ambition is putting a ladder against the sky.",
  "A joy that's shared is a joy made double.",
  ];
```

```css
.fancy {
  font-family: 'Georgia';
}
.title {
  color: #007AA3;
  text-decoration: underline;
}
.cursive {
  font-style: italic;
}
.small {
  font-size: 10px;
}
```

</Sandpack>

<Diagram name="render_tree" height={250} width={500} alt="Tree graph with five nodes. Each node represents a component. The root of the tree is App, with two arrows extending from it to 'InspirationGenerator' and 'FancyText'. The arrows are labelled with the word 'renders'. 'InspirationGenerator' node also has two arrows pointing to nodes 'FancyText' and 'Copyright'.">

React создает *дерево рендеринга*, дерево пользовательского интерфейса, состоящее из отрендеренных компонентов.

</Diagram>

Из примера приложения мы можем построить дерево рендеринга.

Дерево состоит из узлов, каждый из которых представляет компонент. `App`, `FancyText`, `Copyright` и другие являются узлами в нашем дереве.

Корневым узлом в дереве рендеринга React является [корневой компонент](/learn/importing-and-exporting-components#the-root-component-file) приложения. В данном случае корневым компонентом является `App`, и это первый компонент, который рендерит React. Каждая стрелка в дереве указывает от родительского компонента к дочернему.

<details>
<summary><small>(eng)</small></summary>

From the example app, we can construct the above render tree.

The tree is composed of nodes, each of which represents a component. `App`, `FancyText`, `Copyright`, to name a few, are all nodes in our tree.

The root node in a React render tree is the [root component](/learn/importing-and-exporting-components#the-root-component-file) of the app. In this case, the root component is `App` and it is the first component React renders. Each arrow in the tree points from a parent component to a child component.

</details>


<DeepDive>

#### Где находятся HTML-теги в дереве рендеринга? {/*where-are-the-html-elements-in-the-render-tree*/}

Вы можете заметить, что в приведенном выше дереве рендеринга нет упоминания о HTML-тегах, которые отображает каждый компонент. Это потому, что дерево рендеринга состоит только из React-[компонентов](learn/your-first-component#components-ui-building-blocks).

React, как фреймворк пользовательского интерфейса, не зависит от платформы. На react.dev мы показываем примеры, которые выводятся в веб, где в качестве примитивов пользовательского интерфейса используется HTML-разметка. Но приложение React с такой же вероятностью может быть создано для мобильной или настольной платформы, которая может использовать другие примитивы пользовательского интерфейса, такие как [UIView](https://developer.apple.com/documentation/uikit/uiview) или [FrameworkElement](https://learn.microsoft.com/en-us/dotnet/api/system.windows.frameworkelement?view=windowsdesktop-7.0).

Эти платформенные примитивы пользовательского интерфейса не являются частью React. Деревья рендеринга React могут дать представление о нашем приложении React независимо от того, на какую платформу рендерится ваше приложение.

<details>
<summary><small>(eng)</small></summary>

<b>Where are the HTML tags in the render tree?:</b>
You'll notice in the above render tree, there is no mention of the HTML tags that each component renders. This is because the render tree is only composed of React [components](learn/your-first-component#components-ui-building-blocks).

React, as a UI framework, is platform agnostic. On react.dev, we showcase examples that render to the web, which uses HTML markup as its UI primitives. But a React app could just as likely render to a mobile or desktop platform, which may use different UI primitives like [UIView](https://developer.apple.com/documentation/uikit/uiview) or [FrameworkElement](https://learn.microsoft.com/en-us/dotnet/api/system.windows.frameworkelement?view=windowsdesktop-7.0).

These platform UI primitives are not a part of React. React render trees can provide insight to our React app regardless of what platform your app renders to.

</details>

Дерево рендеринга представляет собой один проход рендеринга в приложении React. С помощью [условного рендеринга](/learn/conditional-rendering) родительский компонент может рендерить разные дочерние компоненты в зависимости от переданных данных.

Мы можем обновить приложение, чтобы оно условно отображало либо вдохновляющую цитату, либо цвет.

</DeepDive>

<details>
<summary><small>(eng)</small></summary>

A render tree represents a single render pass of a React application. With [conditional rendering](/learn/conditional-rendering), a parent component may render different children depending on the data passed.

We can update the app to conditionally render either an inspirational quote or color.

With conditional rendering, across different renders, the render tree may render different components.

</details>


<Sandpack>

```js src/App.js
import FancyText from './FancyText';
import InspirationGenerator from './InspirationGenerator';
import Copyright from './Copyright';

export default function App() {
  return (
    <>
      <FancyText title text="Get Inspired App" />
      <InspirationGenerator>
        <Copyright year={2004} />
      </InspirationGenerator>
    </>
  );
}

```

```js src/FancyText.js
export default function FancyText({title, text}) {
  return title
    ? <h1 className='fancy title'>{text}</h1>
    : <h3 className='fancy cursive'>{text}</h3>
}
```

```js src/Color.js
export default function Color({value}) {
  return <div className="colorbox" style={{backgroundColor: value}} />
}
```

```js src/InspirationGenerator.js
import * as React from 'react';
import inspirations from './inspirations';
import FancyText from './FancyText';
import Color from './Color';

export default function InspirationGenerator({children}) {
  const [index, setIndex] = React.useState(0);
  const inspiration = inspirations[index];
  const next = () => setIndex((index + 1) % inspirations.length);

  return (
    <>
      <p>Your inspirational {inspiration.type} is:</p>
      {inspiration.type === 'quote'
      ? <FancyText text={inspiration.value} />
      : <Color value={inspiration.value} />}

      <button onClick={next}>Inspire me again</button>
      {children}
    </>
  );
}
```

```js src/Copyright.js
export default function Copyright({year}) {
  return <p className='small'>©️ {year}</p>;
}
```

```js src/inspirations.js
export default [
  {type: 'quote', value: "Don’t let yesterday take up too much of today.” — Will Rogers"},
  {type: 'color', value: "#B73636"},
  {type: 'quote', value: "Ambition is putting a ladder against the sky."},
  {type: 'color', value: "#256266"},
  {type: 'quote', value: "A joy that's shared is a joy made double."},
  {type: 'color', value: "#F9F2B4"},
];
```

```css
.fancy {
  font-family: 'Georgia';
}
.title {
  color: #007AA3;
  text-decoration: underline;
}
.cursive {
  font-style: italic;
}
.small {
  font-size: 10px;
}
.colorbox {
  height: 100px;
  width: 100px;
  margin: 8px;
}
```
</Sandpack>

<Diagram name="conditional_render_tree" height={250} width={561} alt="Tree graph with six nodes. The top node of the tree is labelled 'App' with two arrows extending to nodes labelled 'InspirationGenerator' and 'FancyText'. The arrows are solid lines and are labelled with the word 'renders'. 'InspirationGenerator' node also has three arrows. The arrows to nodes 'FancyText' and 'Color' are dashed and labelled with 'renders?'. The last arrow points to the node labelled 'Copyright' and is solid and labelled with 'renders'.">

При условном рендеринге в разных рендерах дерево рендеринга может отображать разные компоненты.

</Diagram>

В этом примере, в зависимости от типа `inspiration.type`, мы можем отобразить `<FancyText>` или `<Color>`. Дерево рендеринга может быть разным для каждого прохода рендеринга.

Хотя деревья рендеринга могут отличаться в разных проходах рендеринга, эти деревья в целом полезны для определения того, что такое *верхний уровень* и *листовые компоненты* в приложении React. Компоненты верхнего уровня - это ближайшие к корневому компоненту компоненты, которые влияют на производительность рендеринга всех расположенных под ними компонентов и часто содержат наибольшую сложность. Листовые компоненты находятся в нижней части дерева, не имеют дочерних компонентов и часто перерисовываются.

Определение этих категорий компонентов полезно для понимания потока данных и производительности вашего приложения.

<details>
<summary><small>(eng)</small></summary>

In this example, depending on what `inspiration.type` is, we may render `<FancyText>` or `<Color>`. The render tree may be different for each render pass.

Although render trees may differ across render passes, these trees are generally helpful for identifying what the *top-level* and *leaf components* are in a React app. Top-level components are the components nearest to the root component and affect the rendering performance of all the components beneath them and often contain the most complexity. Leaf components are near the bottom of the tree and have no child components and are often frequently re-rendered.

Identifying these categories of components are useful for understanding data flow and performance of your app.

</details>


## Дерево зависимостей модулей {/*the-module-dependency-tree*/}

Еще одна связь в приложении React, которую можно смоделировать с помощью дерева, - это зависимости модуля приложения. Когда мы [разбиваем наши компоненты](/learn/importing-and-exporting-components#exporting-and-importing-a-component) и логику на отдельные файлы, мы создаем [JS-модули](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Modules), куда мы можем экспортировать компоненты, функции или константы.

Каждый узел в дереве зависимостей модуля - это модуль, а каждая ветвь представляет собой оператор `импорта` в этом модуле.

Если мы возьмем предыдущее приложение Inspirations, то сможем построить дерево зависимостей модулей, или дерево зависимостей для краткости.

<details>
<summary><small>(eng)</small></summary>

<b>The Module Dependency Tree</b>

Another relationship in a React app that can be modeled with a tree are an app's module dependencies. As we [break up our components](/learn/importing-and-exporting-components#exporting-and-importing-a-component) and logic into separate files, we create [JS modules](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Modules) where we may export components, functions, or constants.

Each node in a module dependency tree is a module and each branch represents an `import` statement in that module.

If we take the previous Inspirations app, we can build a module dependency tree, or dependency tree for short.

<small>Image caption: The module dependency tree for the Inspirations app.</small>

</details>


<Diagram name="module_dependency_tree" height={250} width={658} alt="A tree graph with seven nodes. Each node is labelled with a module name. The top level node of the tree is labelled 'App.js'. There are three arrows pointing to the modules 'InspirationGenerator.js', 'FancyText.js' and 'Copyright.js' and the arrows are labelled with 'imports'. From the 'InspirationGenerator.js' node, there are three arrows that extend to three modules: 'FancyText.js', 'Color.js', and 'inspirations.js'. The arrows are labelled with 'imports'.">

Дерево зависимостей модулей для приложения Inspirations.

</Diagram>

Корневым узлом дерева является корневой модуль, также известный как файл точки входа. Часто именно этот модуль содержит корневой компонент.

При сравнении с деревом рендеринга того же приложения можно отметить схожие структуры, но есть и заметные отличия:

* Узлы, составляющие дерево, представляют модули, а не компоненты.
* Некомпонентные модули, такие как `inspirations.js`, также представлены в этом дереве. Дерево рендеринга содержит только компоненты.
* `Copyright.js` отображается под `App.js`, но в дереве рендеринга `Copyright`, компонент, отображается как дочерний элемент `InspirationGenerator`. Это происходит потому, что `InspirationGenerator` принимает JSX в качестве [дочерних параметров](/learn/passing-props-to-a-component#passing-jsx-as-children), поэтому он рендерит `Copyright` как дочерний компонент, но не импортирует модуль.

Деревья зависимостей полезны для определения того, какие модули необходимы для работы вашего React-приложения. При создании React-приложения для производства, как правило, есть шаг сборки, который собирает весь необходимый JavaScript для отправки клиенту. Инструмент, отвечающий за это, называется [bundler](https://developer.mozilla.org/en-US/docs/Learn/Tools_and_testing/Understanding_client-side_tools/Overview#the_modern_tooling_ecosystem), и для определения того, какие модули должны быть включены, bundlers использует дерево зависимостей.

По мере роста вашего приложения часто увеличивается и размер пакета. Большие размеры пакета требуют от клиента больших затрат на загрузку и запуск. Большие размеры пакета могут задерживать время отрисовки пользовательского интерфейса. Понимание дерева зависимостей вашего приложения может помочь в отладке этих проблем.


<details>
<summary><small>(eng)</small></summary>

The root node of the tree is the root module, also known as the entrypoint file. It often is the module that contains the root component.

Comparing to the render tree of the same app, there are similar structures but some notable differences:

* The nodes that make-up the tree represent modules, not components.
* Non-component modules, like `inspirations.js`, are also represented in this tree. The render tree only encapsulates components.
* `Copyright.js` appears under `App.js` but in the render tree, `Copyright`, the component, appears as a child of `InspirationGenerator`. This is because `InspirationGenerator` accepts JSX as [children props](/learn/passing-props-to-a-component#passing-jsx-as-children), so it renders `Copyright` as a child component but does not import the module.

Dependency trees are useful to determine what modules are necessary to run your React app. When building a React app for production, there is typically a build step that will bundle all the necessary JavaScript to ship to the client. The tool responsible for this is called a [bundler](https://developer.mozilla.org/en-US/docs/Learn/Tools_and_testing/Understanding_client-side_tools/Overview#the_modern_tooling_ecosystem), and bundlers will use the dependency tree to determine what modules should be included.

As your app grows, often the bundle size does too. Large bundle sizes are expensive for a client to download and run. Large bundle sizes can delay the time for your UI to get drawn. Getting a sense of your app's dependency tree may help with debugging these issues.

</details>


[comment]: <> (perhaps we should also deep dive on conditional imports)

<Recap>

* Деревья - распространенный способ представления отношений между сущностями. Они часто используются для моделирования пользовательского интерфейса.
* Деревья рендеринга представляют вложенные отношения между компонентами React в течение одного рендера.
* При условном рендеринге дерево рендеринга может меняться при разных рендерах. При использовании различных параметров компоненты могут рендерить различные дочерние компоненты.
* Деревья рендеринга помогают определить, что является компонентами верхнего уровня и листьями. Компоненты верхнего уровня влияют на производительность рендеринга всех компонентов, расположенных под ними, а компоненты листьев часто перерисовываются. Их идентификация полезна для понимания и отладки производительности рендеринга
* Деревья зависимостей представляют зависимости модулей в приложении React.
* Деревья зависимостей используются инструментами сборки для компоновки кода, необходимого для поставки приложения.
* Деревья зависимостей полезны для отладки больших размеров пакетов, которые замедляют время отрисовки и открывают возможности для оптимизации кода.

<details>
<summary><small>(eng)</small></summary>

* Trees are a common way to represent the relationship between entities. They are often used to model UI.
* Render trees represent the nested relationship between React components across a single render.
* With conditional rendering, the render tree may change across different renders. With different prop values, components may render different children components.
* Render trees help identify what the top-level and leaf components are. Top-level components affect the rendering performance of all components beneath them and leaf components are often re-rendered frequently. Identifying them is useful for understanding and debugging rendering performance.
* Dependency trees represent the module dependencies in a React app.
* Dependency trees are used by build tools to bundle the necessary code to ship an app.
* Dependency trees are useful for debugging large bundle sizes that slow time to paint and expose opportunities for optimizing what code is bundled.

</details>


</Recap>

[TODO]: <> (Add challenges)
