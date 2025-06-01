---
title: Описание пользовательского интерфейса
---

<Sandpack>

```js
let guest = 0;

function Cup() {
  // Bad: changing a preexisting variable!
  guest = guest + 1;
  return <h2>Tea cup for guest #{guest}</h2>;
}

export default function TeaSet() {
  return (
    <>
      <Cup />
      <Cup />
      <Cup />
    </>
  );
}
```

</Sandpack>

Вы можете сделать этот компонент чистым, передав ему prop, а не модифицируя уже существующую переменную:


<details>
<summary><small>(eng)</small></summary>

You can make this component pure by passing a prop instead of modifying a preexisting variable:

</details>

<Sandpack>

```js
function Cup({ guest }) {
  return <h2>Tea cup for guest #{guest}</h2>;
}

export default function TeaSet() {
  return (
    <>
      <Cup guest={1} />
      <Cup guest={2} />
      <Cup guest={3} />
    </>
  );
}
```

</Sandpack>

<LearnMore path="/learn/keeping-components-pure">

Прочитайте **[Keeping Components Pure](/learn/keeping-components-pure)**, чтобы узнать, как писать компоненты как чистые, предсказуемые функции.


<details>
<summary><small>(eng)</small></summary>

Read **[Keeping Components Pure](/learn/keeping-components-pure)** to learn how to write components as pure, predictable functions.

</details>

</LearnMore>

## Your UI as a tree {/_your-ui-as-a-tree_/}

React использует деревья для моделирования отношений между компонентами и модулями.

Дерево рендеринга React - это представление родительских и дочерних отношений между компонентами.


<details>
<summary><small>(eng)</small></summary>

<b>Your UI as a tree :</b>
React uses trees to model the relationships between components and modules.

A React render tree is a representation of the parent and child relationship between components.

</details>

<Diagram name="generic_render_tree" height={250} width={500} alt="A tree graph with five nodes, with each node representing a component. The root node is located at the top the tree graph and is labelled 'Root Component'. It has two arrows extending down to two nodes labelled 'Component A' and 'Component C'. Each of the arrows is labelled with 'renders'. 'Component A' has a single 'renders' arrow to a node labelled 'Component B'. 'Component C' has a single 'renders' arrow to a node labelled 'Component D'.">

Пример дерева рендеринга React.


<details>
<summary><small>(eng)</small></summary>

An example React render tree.

</details>

</Diagram>

Компоненты, расположенные в верхней части дерева, рядом с корневым компонентом, считаются компонентами верхнего уровня. Компоненты, не имеющие дочерних компонентов, являются листовыми компонентами. Такая классификация компонентов полезна для понимания потока данных и производительности рендеринга.

Моделирование отношений между модулями JavaScript - еще один полезный способ понять работу приложения. Мы называем это деревом зависимостей модулей.


<details>
<summary><small>(eng)</small></summary>

Components near the top of the tree, near the root component, are considered top-level components. Components with no child components are leaf components. This categorization of components is useful for understanding data flow and rendering performance.

Modelling the relationship between JavaScript modules is another useful way to understand your app. We refer to it as a module dependency tree.

</details>

<Diagram name="generic_dependency_tree" height={250} width={500} alt="A tree graph with five nodes. Each node represents a JavaScript module. The top-most node is labelled 'RootModule.js'. It has three arrows extending to the nodes: 'ModuleA.js', 'ModuleB.js', and 'ModuleC.js'. Each arrow is labelled as 'imports'. 'ModuleC.js' node has a single 'imports' arrow that points to a node labelled 'ModuleD.js'.">

Пример дерева зависимостей модулей.


<details>
<summary><small>(eng)</small></summary>

An example module dependency tree.

</details>

</Diagram>

Дерево зависимостей часто используется инструментами сборки для компоновки всего необходимого JavaScript-кода для загрузки и рендеринга клиентом. Большой размер пакета ухудшает пользовательский опыт в React-приложениях. Понимание дерева зависимостей модулей помогает отлаживать такие проблемы.


<details>
<summary><small>(eng)</small></summary>

A dependency tree is often used by build tools to bundle all the relevant JavaScript code for the client to download and render. A large bundle size regresses user experience for React apps. Understanding the module dependency tree is helpful to debug such issues.

</details>

<LearnMore path="/learn/understanding-your-ui-as-a-tree">

Прочитайте **[Your UI as a Tree](/learn/understanding-your-ui-as-a-tree)**, чтобы узнать, как создавать деревья зависимостей рендеринга и модулей для приложения React и как они являются полезными ментальными моделями для улучшения пользовательского опыта и производительности.


<details>
<summary><small>(eng)</small></summary>

Read **[Your UI as a Tree](/learn/understanding-your-ui-as-a-tree)** to learn how to create a render and module dependency trees for a React app and how they're useful mental models for improving user experience and performance.

</details>

</LearnMore>

## What's next? {/_whats-next_/}

Перейдите по ссылке [Ваш первый компонент](/learn/your-first-component), чтобы начать читать эту главу страница за страницей!

Или, если вы уже знакомы с этими темами, почему бы не прочитать о [Adding Interactivity](/learn/adding-interactivity)?

<details>
<summary><small>(eng)</small></summary>

<b>What's next? :</b>
Head over to [Your First Component](/learn/your-first-component) to start reading this chapter page by page!

Or, if you're already familiar with these topics, why not read about [Adding Interactivity](/learn/adding-interactivity)?
</details>


