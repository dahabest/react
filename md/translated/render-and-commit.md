---
title: Рендеринг и Фиксация
---

<Intro>

Прежде чем ваши компоненты будут отображены на экране, они должны быть отрисованы React. Понимание этапов этого процесса поможет вам продумать, как выполняется ваш код, и объяснить его поведение.

<details>
<summary><small>(eng)</small></summary>

Before your components are displayed on screen, they must be rendered by React. Understanding the steps in this process will help you think about how your code executes and explain its behavior.

</details>

</Intro>

<YouWillLearn>

- Что означает рендеринг в React
- Когда и почему React рендерит компонент
- Шаги, связанные с отображением компонента на экране
- Почему рендеринг не всегда приводит к обновлению DOM

<details>
<summary><small>(eng)</small></summary>

- What rendering means in React
- When and why React renders a component
- The steps involved in displaying a component on screen
- Why rendering does not always produce a DOM update

</details>

</YouWillLearn>

Представьте, что ваши компоненты - это повара на кухне, собирающие вкусные блюда из ингредиентов. В этом сценарии React - официант, который принимает запросы от клиентов и приносит им их заказы. Этот процесс запроса и подачи UI состоит из трех этапов:

1. **Триггирование** рендера (доставка заказа гостя на кухню)
2. **Рендеринг** компонента (подготовка заказа на кухне)
3. **Коммитация** в DOM (размещение заказа на столе)

<IllustrationBlock sequential>
  <Illustration caption="Trigger" alt="React как сервер в ресторане, получающий заказы от пользователей и доставляющий их на кухню компонента." src="/ru.react.doc/images/docs/illustrations/i_render-and-commit1.png" />
  <Illustration caption="Render" alt="Card Chef дает React свежий компонент Card." src="/ru.react.doc/images/docs/illustrations/i_render-and-commit2.png" />
  <Illustration caption="Commit" alt="React доставляет карточку пользователю за его столик." src="/ru.react.doc/images/docs/illustrations/i_render-and-commit3.png" />
</IllustrationBlock

<details>
<summary><small>(eng)</small></summary>

Imagine that your components are cooks in the kitchen, assembling tasty dishes from ingredients. In this scenario, React is the waiter who puts in requests from customers and brings them their orders. This process of requesting and serving UI has three steps:

1. **Triggering** a render (delivering the guest's order to the kitchen)
2. **Rendering** the component (preparing the order in the kitchen)
3. **Committing** to the DOM (placing the order on the table)

<IllustrationBlock sequential>
  <Illustration caption="Trigger" alt="React as a server in a restaurant, fetching orders from the users and delivering them to the Component Kitchen." src="/ru.react.doc/images/docs/illustrations/i_render-and-commit1.png" />
  <Illustration caption="Render" alt="The Card Chef gives React a fresh Card component." src="/ru.react.doc/images/docs/illustrations/i_render-and-commit2.png" />
  <Illustration caption="Commit" alt="React delivers the Card to the user at their table." src="/ru.react.doc/images/docs/illustrations/i_render-and-commit3.png" />
</IllustrationBlock>

</details>

## Шаг 1: Запуск рендеринга{/_step-1-trigger-a-render_/}

Существует две причины, по которым компонент не может отрисоваться:

1. Это **первоначальный рендеринг компонента.**.
2. Состояние компонента (или одного из его предков) **обновилось.**.

<details>
<summary><small>(eng)</small></summary>

<b>Step 1: Trigger a render :</b>
There are two reasons for a component to render:

1. It's the component's **initial render.**
2. The component's (or one of its ancestors') **state has been updated.**

</details>

### Первоначальный рендеринг{/_initial-render_/}

Когда ваше приложение запускается, необходимо вызвать начальный рендеринг. Фреймворки и песочницы иногда скрывают этот код, но он выполняется вызовом [`createRoot`](/reference/react-dom/client/createRoot) с целевым узлом DOM, а затем вызовом его метода `render` с вашим компонентом:

<details>
<summary><small>(eng)</small></summary>

<b>Initial render :</b>
When your app starts, you need to trigger the initial render. Frameworks and sandboxes sometimes hide this code, but it's done by calling [`createRoot`](/reference/react-dom/client/createRoot) with the target DOM node, and then calling its `render` method with your component:

</details>

<Sandpack>

```js src/index.js active
import Image from "./Image.js";
import { createRoot } from "react-dom/client";

const root = createRoot(document.getElementById("root"));
root.render(<Image />);
```

```js src/Image.js
export default function Image() {
  return (
    <img
      src="https://i.imgur.com/ZF6s192.jpg"
      alt="'Floralis Genérica' by Eduardo Catalano: a gigantic metallic flower sculpture with reflective petals"
    />
  );
}
```

</Sandpack>

Попробуйте закомментировать вызов `root.render()` и увидите, как компонент исчезнет!

<details>
<summary><small>(eng)</small></summary>

Try commenting out the `root.render()` call and see the component disappear!

</details>

### Рендеринг при обновлении состояния{/_re-renders-when-state-updates_/}

После того как компонент был первоначально отрисован, вы можете вызывать последующие отрисовки, обновляя его состояние с помощью функции [`set`](/reference/react/useState#setstate). Обновление состояния компонента автоматически ставит его в очередь на отрисовку. (Вы можете представить это как посетителя ресторана, который после первого заказа заказывает чай, десерт и всевозможные другие вещи, в зависимости от состояния жажды или голода).

<IllustrationBlock sequential>
  <Illustration caption="Обновление состояния..." alt="React как сервер в ресторане, предоставляющий пользователю пользовательский интерфейс Card UI, представленный в виде покровителя с курсором в голове. Патрон выражает, что хочет розовую, а не черную карточку!" src="/ru.react.doc/images/docs/illustrations/i_rerender1.png" />
  <Illustration caption="...срабатывает..." alt="React возвращается на кухню компонентов и сообщает повару карт, что им нужна розовая карта." src="/ru.react.doc/images/docs/illustrations/i_rerender2.png" />
  <Illustration caption="...render!" alt="Card Chef дает React розовую карту." src="/ru.react.doc/images/docs/illustrations/i_rerender3.png" />
</IllustrationBlock

<details>
<summary><small>(eng)</small></summary>

<b>Re-renders when state updates :</b>
Once the component has been initially rendered, you can trigger further renders by updating its state with the [`set` function.](/reference/react/useState#setstate) Updating your component's state automatically queues a render. (You can imagine these as a restaurant guest ordering tea, dessert, and all sorts of things after putting in their first order, depending on the state of their thirst or hunger.)

<IllustrationBlock sequential>
  <Illustration caption="State update..." alt="React as a server in a restaurant, serving a Card UI to the user, represented as a patron with a cursor for their head. The patron expresses they want a pink card, not a black one!" src="/ru.react.doc/images/docs/illustrations/i_rerender1.png" />
  <Illustration caption="...triggers..." alt="React returns to the Component Kitchen and tells the Card Chef they need a pink Card." src="/ru.react.doc/images/docs/illustrations/i_rerender2.png" />
  <Illustration caption="...render!" alt="The Card Chef gives React the pink Card." src="/ru.react.doc/images/docs/illustrations/i_rerender3.png" />
</IllustrationBlock>

</details>

## Шаг 2: React рендерит ваши компоненты{/_step-2-react-renders-your-components_/}

После запуска рендеринга React вызывает ваши компоненты, чтобы определить, что отобразить на экране. **"Рендеринг" - это обращение React к вашим компонентам.**

- **При первом рендере ** React вызовет корневой компонент.
- **При последующих рендерах ** React будет вызывать компонент функции, обновление состояния которого вызвало рендер.

Этот процесс рекурсивен: если обновленный компонент вернет какой-то другой компонент, React отрендерит _этот_ компонент следующим, и если этот компонент тоже что-то вернет, он отрендерит _этот_ компонент следующим, и так далее. Процесс будет продолжаться до тех пор, пока не останется ни одного вложенного компонента и React не будет точно знать, что должно быть отображено на экране.

В следующем примере React вызовет `Gallery()` и `Image()` несколько раз:

<details>
<summary><small>(eng)</small></summary>

<b>Step 2: React renders your components :</b>
After you trigger a render, React calls your components to figure out what to display on screen. **"Rendering" is React calling your components.**

- **On initial render,** React will call the root component.
- **For subsequent renders,** React will call the function component whose state update triggered the render.

This process is recursive: if the updated component returns some other component, React will render _that_ component next, and if that component also returns something, it will render _that_ component next, and so on. The process will continue until there are no more nested components and React knows exactly what should be displayed on screen.

In the following example, React will call `Gallery()` and `Image()` several times:

</details>

<Sandpack>

```js src/Gallery.js active
export default function Gallery() {
  return (
    <section>
      <h1>Inspiring Sculptures</h1>
      <Image />
      <Image />
      <Image />
    </section>
  );
}

function Image() {
  return (
    <img
      src="https://i.imgur.com/ZF6s192.jpg"
      alt="'Floralis Genérica' by Eduardo Catalano: a gigantic metallic flower sculpture with reflective petals"
    />
  );
}
```

```js src/index.js
import Gallery from "./Gallery.js";
import { createRoot } from "react-dom/client";

const root = createRoot(document.getElementById("root"));
root.render(<Gallery />);
```

```css
img {
  margin: 0 10px 10px 0;
}
```

</Sandpack>

- **При первоначальном рендере ** React [создаст DOM-узлы](https://developer.mozilla.org/docs/Web/API/Document/createElement) для тегов `<section>`, `<h1>` и трех `<img>`.
- ** Во время повторного рендеринга** React вычислит, какие из их свойств, если таковые имеются, изменились с момента предыдущего рендеринга. Он ничего не будет делать с этой информацией до следующего шага, фазы фиксации.

<details>
<summary><small>(eng)</small></summary>

- **During the initial render,** React will [create the DOM nodes](https://developer.mozilla.org/docs/Web/API/Document/createElement) for `<section>`, `<h1>`, and three `<img>` tags.
- **During a re-render,** React will calculate which of their properties, if any, have changed since the previous render. It won't do anything with that information until the next step, the commit phase.

</details>

<Pitfall>

Рендеринг всегда должен быть [чистым вычислением](/learn/keeping-components-pure):

- **Одинаковые входы, одинаковый выход.** При одинаковых входах компонент всегда должен возвращать один и тот же JSX. (Когда кто-то заказывает салат с помидорами, он не должен получить салат с луком!)
- **Он занимается своими делами.** Он не должен изменять никакие объекты или переменные, которые существовали до рендеринга. (Один заказ не должен изменять другие заказы).

В противном случае вы можете столкнуться с запутанными ошибками и непредсказуемым поведением по мере роста сложности вашей кодовой базы. При разработке в "строгом режиме" React вызывает функцию каждого компонента дважды, что может помочь выявить ошибки, вызванные нечистыми функциями.

<details>
<summary><small>(eng)</small></summary>

Rendering must always be a [pure calculation](/learn/keeping-components-pure):

- **Same inputs, same output.** Given the same inputs, a component should always return the same JSX. (When someone orders a salad with tomatoes, they should not receive a salad with onions!)
- **It minds its own business.** It should not change any objects or variables that existed before rendering. (One order should not change anyone else's order.)

Otherwise, you can encounter confusing bugs and unpredictable behavior as your codebase grows in complexity. When developing in "Strict Mode", React calls each component's function twice, which can help surface mistakes caused by impure functions.

</details>

</Pitfall>

<DeepDive>

#### Optimizing performance {/_optimizing-performance_/}

Поведение по умолчанию, при котором отображаются все компоненты, вложенные в обновленный компонент, не является оптимальным с точки зрения производительности, если обновленный компонент находится очень высоко в дереве. Если вы столкнулись с проблемой производительности, есть несколько способов ее решения, описанных в разделе [Производительность](https://reactjs.org/docs/optimizing-performance.html). \*\*Не оптимизируйте преждевременно!

<details>
<summary><small>(eng)</small></summary>

<b>Optimizing performance :</b>
The default behavior of rendering all components nested within the updated component is not optimal for performance if the updated component is very high in the tree. If you run into a performance issue, there are several opt-in ways to solve it described in the [Performance](https://reactjs.org/docs/optimizing-performance.html) section. **Don't optimize prematurely!**

</details>

</DeepDive>

## Step 3: React commits changes to the DOM {/_step-3-react-commits-changes-to-the-dom_/}

После рендеринга (вызова) ваших компонентов React изменяет DOM.

- **Для первоначального рендеринга** React будет использовать API DOM [`appendChild()`](https://developer.mozilla.org/docs/Web/API/Node/appendChild), чтобы поместить все созданные им узлы DOM на экран.
- **При повторном рендеринге** React применит минимально необходимые операции (вычисляемые во время рендеринга!), чтобы DOM соответствовал последнему выводу рендеринга.

**React изменяет узлы DOM только в случае разницы между рендерами.** Например, вот компонент, который каждую секунду рендерится с разными props, передаваемыми от родителя. Обратите внимание, что вы можете добавить текст в `<input>`, обновляя его `value`, но текст не исчезает при повторном рендеринге компонента:

<details>
<summary><small>(eng)</small></summary>

<b>Step 3: React commits changes to the DOM :</b>
After rendering (calling) your components, React will modify the DOM.

- **For the initial render,** React will use the [`appendChild()`](https://developer.mozilla.org/docs/Web/API/Node/appendChild) DOM API to put all the DOM nodes it has created on screen.
- **For re-renders,** React will apply the minimal necessary operations (calculated while rendering!) to make the DOM match the latest rendering output.

**React only changes the DOM nodes if there's a difference between renders.** For example, here is a component that re-renders with different props passed from its parent every second. Notice how you can add some text into the `<input>`, updating its `value`, but the text doesn't disappear when the component re-renders:

</details>

<Sandpack>

```js src/Clock.js active
export default function Clock({ time }) {
  return (
    <>
      <h1>{time}</h1>
      <input />
    </>
  );
}
```

```js src/App.js hidden
import { useState, useEffect } from "react";
import Clock from "./Clock.js";

function useTime() {
  const [time, setTime] = useState(() => new Date());
  useEffect(() => {
    const id = setInterval(() => {
      setTime(new Date());
    }, 1000);
    return () => clearInterval(id);
  }, []);
  return time;
}

export default function App() {
  const time = useTime();
  return <Clock time={time.toLocaleTimeString()} />;
}
```

</Sandpack>

Это работает, потому что во время последнего шага React только обновляет содержимое `<h1>` с новым `временем`. Он видит, что `<input>` появляется в JSX в том же месте, что и в прошлый раз, поэтому React не трогает `<input>` или его `value`!

<details>
<summary><small>(eng)</small></summary>

This works because during this last step, React only updates the content of `<h1>` with the new `time`. It sees that the `<input>` appears in the JSX in the same place as last time, so React doesn't touch the `<input>`—or its `value`!

</details>

## Эпилог: Браузерная раскраска{/_epilogue-browser-paint_/}

После того как рендеринг завершен и React обновил DOM, браузер перерисует экран. Хотя этот процесс известен как "браузерный рендеринг", мы будем называть его "рисованием", чтобы избежать путаницы в документации.

<Иллюстрация alt="Браузер рисует "натюрморт с элементом карты"." src="/ru.react.doc/images/docs/illustrations/i_browser-paint.png" />

<details>
<summary><small>(eng)</small></summary>

<b>Epilogue: Browser paint :</b>
After rendering is done and React updated the DOM, the browser will repaint the screen. Although this process is known as "browser rendering", we'll refer to it as "painting" to avoid confusion throughout the docs.

<Illustration alt="A browser painting 'still life with card element'." src="/ru.react.doc/images/docs/illustrations/i_browser-paint.png" />

</details>

<Recap>

- Любое обновление экрана в приложении React происходит в три этапа:
  1. Триггер
  2. Рендеринг
  3. Commit
- Вы можете использовать строгий режим для поиска ошибок в ваших компонентах
- React не трогает DOM, если результат рендеринга такой же, как и в прошлый раз.

<details>
<summary><small>(eng)</small></summary>

- Any screen update in a React app happens in three steps:
  1. Trigger
  2. Render
  3. Commit
- You can use Strict Mode to find mistakes in your components
- React does not touch the DOM if the rendering result is the same as last time

</details>

</Recap>
