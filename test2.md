---
title: Ваш UI как дерево
---

<Intro>

Your React app is taking shape with many components being nested within each other. How does React keep track of your app's component structure?
React, and many other UI libraries, model UI as a tree. Thinking of your app as a tree is useful for understanding the relationship between components. This understanding will help you debug future concepts like performance and state management.
You will learn:

- How React "sees" component structures
- What a render tree is and what it is useful for
- What a module dependency tree is and what it is useful for

</Intro>

<YouWillLearn>

- Как React «видит» структуры компонентов
- Что такое дерево рендеринга и для чего оно полезно
- Что такое дерево зависимостей модулей и для чего оно полезно

</YouWillLearn>

## Ваш пользовательский интерфейс в виде дерева {/_your-ui-as-a-tree_/}

<b>Your UI as a tree</b>
Trees are a relationship model between items and UI is often represented using tree structures. For example, browsers use tree structures to model HTML ([DOM](https://developer.mozilla.org/docs/Web/API/Document_Object_Model/Introduction)) and CSS ([CSSOM](https://developer.mozilla.org/docs/Web/API/CSS_Object_Model)). Mobile platforms also use trees to represent their view hierarchy.

React creates a UI tree from your components. In this example, the UI tree is then used to render to the DOM.

<Diagram name="preserving_state_dom_tree" height={193} width={864} alt="Diagram with three sections arranged horizontally. In the first section, there are three rectangles stacked vertically, with labels 'Component A', 'Component B', and 'Component C'. Transitioning to the next pane is an arrow with the React logo on top labeled 'React'. The middle section contains a tree of components, with the root labeled 'A' and two children labeled 'B' and 'C'. The next section is again transitioned using an arrow with the React logo on top labeled 'React DOM'. The third and final section is a wireframe of a browser, containing a tree of 8 nodes, which has only a subset highlighted (indicating the subtree from the middle section).">

</Diagram>

Подобно браузерам и мобильным платформам, React также использует древовидные структуры для управления и моделирования отношений между компонентами в приложении React. Эти деревья являются полезными инструментами для понимания того, как данные проходят через приложение React и как оптимизировать рендеринг и размер приложения.

<details>
<summary><small>(eng)</small></summary>

Like browsers and mobile platforms, React also uses tree structures to manage and model the relationship between components in a React app. These trees are useful tools to understand how data flows through a React app and how to optimize rendering and app size.

</details>

## Дерево рендеринга {/_the-render-tree_/}

Важной особенностью компонентов является возможность составлять компоненты из других компонентов. По мере того как мы [вкладываем компоненты](/learn/your-first-component#nesting-and-organizing-components), у нас появляется концепция родительских и дочерних компонентов, где каждый родительский компонент может сам быть дочерним для другого компонента.

Когда мы рендерим React-приложение, мы можем моделировать эти отношения в дереве, известном как дерево рендеринга.

Здесь представлено приложение React, которое отображает вдохновляющие цитаты.

<details>
<summary><small>(eng)</small></summary>

<b>The Render Tree:</b>
A major feature of components is the ability to compose components of other components. As we [nest components](/learn/your-first-component#nesting-and-organizing-components), we have the concept of parent and child components, where each parent component may itself be a child of another component.
When we render a React app, we can model this relationship in a tree, known as the render tree.
Here is a React app that renders inspirational quotes.
React creates a _render tree_, a UI tree, composed of the rendered components.

</details>

```js src/App.js
import FancyText from "./FancyText";
import InspirationGenerator from "./InspirationGenerator";
import Copyright from "./Copyright";

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
export default function FancyText({ title, text }) {
  return title ? (
    <h1 className="fancy title">{text}</h1>
  ) : (
    <h3 className="fancy cursive">{text}</h3>
  );
}
```
