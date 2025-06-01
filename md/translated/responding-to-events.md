---
title: Responding to Events
---

<Intro>

React позволяет добавлять _обработчики событий_ в JSX. Обработчики событий - это ваши собственные функции, которые будут запускаться в ответ на такие действия, как нажатие, наведение курсора, фокусировка ввода формы и так далее.

<details>
<summary><small>(eng)</small></summary>

React lets you add _event handlers_ to your JSX. Event handlers are your own functions that will be triggered in response to interactions like clicking, hovering, focusing form inputs, and so on.

</details>

</Intro>

<YouWillLearn>

- Различные способы написания обработчика событий
- Как передать логику обработки событий от родительского компонента
- Как распространяются события и как их остановить

<details>
<summary><small>(eng)</small></summary>

- Different ways to write an event handler
- How to pass event handling logic from a parent component
- How events propagate and how to stop them

</details>

</YouWillLearn>

## Adding event handlers {/_adding-event-handlers_/}

Чтобы добавить обработчик событий, сначала определите функцию, а затем [передайте ее в качестве свойства](/learn/passing-props-to-a-component) в соответствующий JSX-тег. Например, здесь находится кнопка, которая пока ничего не делает:

<details>
<summary><small>(eng)</small></summary>

<b>Adding event handlers :</b>

To add an event handler, you will first define a function and then [pass it as a prop](/learn/passing-props-to-a-component) to the appropriate JSX tag. For example, here is a button that doesn't do anything yet:

</details>

<Sandpack>

```js
export default function Button() {
  return <button>I don't do anything</button>;
}
```

</Sandpack>

Вы можете заставить его показывать сообщение, когда пользователь нажимает на кнопку, выполнив следующие три шага:

1. Объявите функцию `handleClick` _внутри_ вашего компонента `Button`.
2. Реализуйте логику внутри этой функции (используйте `alert` для показа сообщения).
3. Добавьте `onClick={handleClick}` в JSX `<button>`.

<details>
<summary><small>(eng)</small></summary>

You can make it show a message when a user clicks by following these three steps:

1. Declare a function called `handleClick` _inside_ your `Button` component.
2. Implement the logic inside that function (use `alert` to show the message).
3. Add `onClick={handleClick}` to the `<button>` JSX.

</details>

<Sandpack>

```js
export default function Button() {
  function handleClick() {
    alert("You clicked me!");
  }

  return <button onClick={handleClick}>Click me</button>;
}
```

```css
button {
  margin-right: 10px;
}
```

</Sandpack>

Вы определили функцию `handleClick`, а затем [передали ее в качестве свойства](/learn/passing-props-to-a-component) в `<button>`. `handleClick` - это ** обработчик событий.** Функции обработчика событий:

- Обычно определяются \*внутри ваших компонентов.
- Имеют имена, начинающиеся с `handle`, за которым следует имя события.

По традиции принято называть обработчики событий `handle`, за которым следует имя события. Часто можно встретить `onClick={handleClick}`, `onMouseEnter={handleMouseEnter}` и так далее.

Кроме того, вы можете определить обработчик события в JSX:

```jsx
<button onClick={function handleClick() {
  alert('You clicked me!');
}}>
```

Или, если говорить более кратко, с помощью функции стрелок:

```jsx
<button onClick={() => {
  alert('You clicked me!');
}}>
```

Все эти стили эквивалентны. Встроенные обработчики событий удобны для коротких функций.

<details>
<summary><small>(eng)</small></summary>

You defined the `handleClick` function and then [passed it as a prop](/learn/passing-props-to-a-component) to `<button>`. `handleClick` is an **event handler.** Event handler functions:

- Are usually defined _inside_ your components.
- Have names that start with `handle`, followed by the name of the event.

By convention, it is common to name event handlers as `handle` followed by the event name. You'll often see `onClick={handleClick}`, `onMouseEnter={handleMouseEnter}`, and so on.

Alternatively, you can define an event handler inline in the JSX:

```jsx
<button onClick={function handleClick() {
  alert('You clicked me!');
}}>
```

Or, more concisely, using an arrow function:

```jsx
<button onClick={() => {
  alert('You clicked me!');
}}>
```

All of these styles are equivalent. Inline event handlers are convenient for short functions.

</details>

<Pitfall>

Функции, передаваемые обработчикам событий, должны передаваться, а не вызываться. Например:

| передача функции (правильно)     | вызов функции (неправильно)        |
| -------------------------------- | ---------------------------------- |
| `<button onClick={handleClick}>` | `<button onClick={handleClick()}>` |

Разница едва заметна. В первом примере функция `handleClick` передается в качестве обработчика события `onClick`. Это указывает React запомнить ее и вызывать вашу функцию только тогда, когда пользователь нажмет на кнопку.

Во втором примере `()` в конце `handleClick()` запускает функцию _непосредственно_ во время [рендеринга](/learn/render-and-commit), без каких-либо щелчков. Это происходит потому, что JavaScript внутри [JSX `{` и `}`](/learn/javascript-in-jsx-with-curly-braces) исполняется сразу же.

Когда вы пишете код inline, тот же самый подводный камень проявляется по-другому:

| передача функции (правильно)            | вызов функции (неправильно)       |
| --------------------------------------- | --------------------------------- |
| `<button onClick={() => alert('...')}>` | `<button onClick={alert('...')}>` |

Если передать такой встроенный код, то он будет срабатывать не по щелчку, а при каждом рендеринге компонента:

```jsx
// This alert fires when the component renders, not when clicked!
<button onClick={alert('You clicked me!')}>
```

Если вы хотите определить обработчик события в строке, оберните его в анонимную функцию, как показано ниже:

```jsx
<button onClick={() => alert('You clicked me!')}>
```

Вместо того чтобы выполнять код внутри при каждом рендере, создается функция, которая будет вызвана позже.

В обоих случаях вы хотите передать функцию:

- `<button onClick={handleClick}>` передает функцию `handleClick`.
- `<button onClick={() => alert('...')}>` передает функцию `() => alert('...')`.

[Подробнее о стрелочных функциях.](https://javascript.info/arrow-functions-basics)

<details>
<summary><small>(eng)</small></summary>

Functions passed to event handlers must be passed, not called. For example:

| passing a function (correct)     | calling a function (incorrect)     |
| -------------------------------- | ---------------------------------- |
| `<button onClick={handleClick}>` | `<button onClick={handleClick()}>` |

The difference is subtle. In the first example, the `handleClick` function is passed as an `onClick` event handler. This tells React to remember it and only call your function when the user clicks the button.

In the second example, the `()` at the end of `handleClick()` fires the function _immediately_ during [rendering](/learn/render-and-commit), without any clicks. This is because JavaScript inside the [JSX `{` and `}`](/learn/javascript-in-jsx-with-curly-braces) executes right away.

When you write code inline, the same pitfall presents itself in a different way:

| passing a function (correct)            | calling a function (incorrect)    |
| --------------------------------------- | --------------------------------- |
| `<button onClick={() => alert('...')}>` | `<button onClick={alert('...')}>` |

Passing inline code like this won't fire on click—it fires every time the component renders:

```jsx
// This alert fires when the component renders, not when clicked!
<button onClick={alert('You clicked me!')}>
```

If you want to define your event handler inline, wrap it in an anonymous function like so:

```jsx
<button onClick={() => alert('You clicked me!')}>
```

Rather than executing the code inside with every render, this creates a function to be called later.

In both cases, what you want to pass is a function:

- `<button onClick={handleClick}>` passes the `handleClick` function.
- `<button onClick={() => alert('...')}>` passes the `() => alert('...')` function.

[Read more about arrow functions.](https://javascript.info/arrow-functions-basics)

</details>

</Pitfall>

### Reading props in event handlers {/_reading-props-in-event-handlers_/}

Поскольку обработчики событий объявляются внутри компонента, они имеют доступ к его реквизитам. Здесь показана кнопка, которая при нажатии выводит оповещение с реквизитом `message`:

<details>
<summary><small>(eng)</small></summary>

<b>Reading props in event handlers :</b>

Because event handlers are declared inside of a component, they have access to the component's props. Here is a button that, when clicked, shows an alert with its `message` prop:

</details>

<Sandpack>

```js
function AlertButton({ message, children }) {
  return <button onClick={() => alert(message)}>{children}</button>;
}

export default function Toolbar() {
  return (
    <div>
      <AlertButton message="Playing!">Play Movie</AlertButton>
      <AlertButton message="Uploading!">Upload Image</AlertButton>
    </div>
  );
}
```

```css
button {
  margin-right: 10px;
}
```

</Sandpack>

Это позволяет этим двум кнопкам показывать разные сообщения. Попробуйте изменить передаваемые им сообщения.

<details>
<summary><small>(eng)</small></summary>

This lets these two buttons show different messages. Try changing the messages passed to them.

</details>

### Passing event handlers as props {/_passing-event-handlers-as-props_/}

Часто требуется, чтобы родительский компонент указывал обработчик дочернего события. Рассмотрим кнопки: в зависимости от того, где вы используете компонент `Button`, вы можете захотеть выполнить разные функции - возможно, одна воспроизводит фильм, а другая загружает изображение.

Для этого в качестве обработчика события передайте компоненту свойство, полученное от родителя, следующим образом:

<details>
<summary><small>(eng)</small></summary>

<b>Passing event handlers as props :</b>

Often you'll want the parent component to specify a child's event handler. Consider buttons: depending on where you're using a `Button` component, you might want to execute a different function—perhaps one plays a movie and another uploads an image.

To do this, pass a prop the component receives from its parent as the event handler like so:

</details>

<Sandpack>

```js
function Button({ onClick, children }) {
  return <button onClick={onClick}>{children}</button>;
}

function PlayButton({ movieName }) {
  function handlePlayClick() {
    alert(`Playing ${movieName}!`);
  }

  return <Button onClick={handlePlayClick}>Play "{movieName}"</Button>;
}

function UploadButton() {
  return <Button onClick={() => alert("Uploading!")}>Upload Image</Button>;
}

export default function Toolbar() {
  return (
    <div>
      <PlayButton movieName="Kiki's Delivery Service" />
      <UploadButton />
    </div>
  );
}
```

```css
button {
  margin-right: 10px;
}
```

</Sandpack>

Здесь компонент `Toolbar` отображает кнопки `PlayButton` и `UploadButton`:

- `PlayButton` передает `handlePlayClick` в качестве свойства `onClick` для `Button` внутри.
- `UploadButton` передает `() => alert('Uploading!')` в качестве свойства `onClick` для `Button` внутри.

Наконец, ваш компонент `Button` принимает свойство `onClick`. Он передает это свойство непосредственно встроенному браузеру `<button>` с `onClick={onClick}`. Это указывает React на вызов переданной функции по щелчку.

Если вы используете [систему проектирования](https://uxdesign.cc/everything-you-need-to-know-about-design-systems-54b109851969), то обычно такие компоненты, как кнопки, содержат стилистику, но не указывают поведение. Вместо этого такие компоненты, как `PlayButton` и `UploadButton`, передают обработчики событий вниз.

<details>
<summary><small>(eng)</small></summary>

Here, the `Toolbar` component renders a `PlayButton` and an `UploadButton`:

- `PlayButton` passes `handlePlayClick` as the `onClick` prop to the `Button` inside.
- `UploadButton` passes `() => alert('Uploading!')` as the `onClick` prop to the `Button` inside.

Finally, your `Button` component accepts a prop called `onClick`. It passes that prop directly to the built-in browser `<button>` with `onClick={onClick}`. This tells React to call the passed function on click.

If you use a [design system](https://uxdesign.cc/everything-you-need-to-know-about-design-systems-54b109851969), it's common for components like buttons to contain styling but not specify behavior. Instead, components like `PlayButton` and `UploadButton` will pass event handlers down.

</details>

### Naming event handler props {/_naming-event-handler-props_/}

Встроенные компоненты, такие как `<button>` и `<div>`, поддерживают только [имена событий браузера](/reference/react-dom/components/common#common-props), например `onClick`. Однако при создании собственных компонентов вы можете называть реквизиты обработчиков событий как угодно.

По соглашению, реквизит обработчика событий должен начинаться с `on`, за которым следует заглавная буква.

Например, реквизит `onClick` компонента `Button` можно было бы назвать `onSmash`:

<details>
<summary><small>(eng)</small></summary>

<b>Naming event handler props :</b>

Built-in components like `<button>` and `<div>` only support [browser event names](/reference/react-dom/components/common#common-props) like `onClick`. However, when you're building your own components, you can name their event handler props any way that you like.

By convention, event handler props should start with `on`, followed by a capital letter.

For example, the `Button` component's `onClick` prop could have been called `onSmash`:

</details>

<Sandpack>

```js
function Button({ onSmash, children }) {
  return <button onClick={onSmash}>{children}</button>;
}

export default function App() {
  return (
    <div>
      <Button onSmash={() => alert("Playing!")}>Play Movie</Button>
      <Button onSmash={() => alert("Uploading!")}>Upload Image</Button>
    </div>
  );
}
```

```css
button {
  margin-right: 10px;
}
```

</Sandpack>

В этом примере `<button onClick={onSmash}>` показывает, что браузеру `<button>` (в нижнем регистре) все еще нужен реквизит `onClick`, но имя реквизита, полученное вашим пользовательским компонентом `Button`, зависит от вас!

Если ваш компонент поддерживает несколько взаимодействий, вы можете назвать реквизиты обработчиков событий для концепций, специфичных для конкретного приложения. Например, этот компонент `Toolbar` получает обработчики событий `onPlayMovie` и `onUploadImage`:

<details>
<summary><small>(eng)</small></summary>

In this example, `<button onClick={onSmash}>` shows that the browser `<button>` (lowercase) still needs a prop called `onClick`, but the prop name received by your custom `Button` component is up to you!

When your component supports multiple interactions, you might name event handler props for app-specific concepts. For example, this `Toolbar` component receives `onPlayMovie` and `onUploadImage` event handlers:

</details>

<Sandpack>

```js
export default function App() {
  return (
    <Toolbar
      onPlayMovie={() => alert("Playing!")}
      onUploadImage={() => alert("Uploading!")}
    />
  );
}

function Toolbar({ onPlayMovie, onUploadImage }) {
  return (
    <div>
      <Button onClick={onPlayMovie}>Play Movie</Button>
      <Button onClick={onUploadImage}>Upload Image</Button>
    </div>
  );
}

function Button({ onClick, children }) {
  return <button onClick={onClick}>{children}</button>;
}
```

```css
button {
  margin-right: 10px;
}
```

</Sandpack>

Обратите внимание, что компоненту `App` не нужно знать, _что_ `Toolbar` будет делать с `onPlayMovie` или `onUploadImage`. Это деталь реализации `Toolbar`. Здесь `Toolbar` передает их как обработчики `onClick` для своих `кнопок`, но позже он также может задействовать их по нажатию клавиш. Именование реквизитов в честь специфических для приложения взаимодействий, таких как `onPlayMovie`, дает вам возможность гибко менять их использование в дальнейшем.

<details>
<summary><small>(eng)</small></summary>

Notice how the `App` component does not need to know _what_ `Toolbar` will do with `onPlayMovie` or `onUploadImage`. That's an implementation detail of the `Toolbar`. Here, `Toolbar` passes them down as `onClick` handlers to its `Button`s, but it could later also trigger them on a keyboard shortcut. Naming props after app-specific interactions like `onPlayMovie` gives you the flexibility to change how they're used later.

</details>

<Note>

Убедитесь, что вы используете соответствующие HTML-теги для обработчиков событий. Например, для обработки щелчков используйте [`<button onClick={handleClick}>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/button) вместо `<div onClick={handleClick}>`. Использование настоящей браузерной `<button>` позволяет использовать встроенные в браузер поведенческие характеристики, такие как навигация по клавиатуре. Если вам не нравится стандартный браузерный стиль кнопки и вы хотите сделать ее более похожей на ссылку или другой элемент пользовательского интерфейса, вы можете добиться этого с помощью CSS. [Подробнее о написании доступной разметки.](https://developer.mozilla.org/en-US/docs/Learn/Accessibility/HTML)

<details>
<summary><small>(eng)</small></summary>

Make sure that you use the appropriate HTML tags for your event handlers. For example, to handle clicks, use [`<button onClick={handleClick}>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/button) instead of `<div onClick={handleClick}>`. Using a real browser `<button>` enables built-in browser behaviors like keyboard navigation. If you don't like the default browser styling of a button and want to make it look more like a link or a different UI element, you can achieve it with CSS. [Learn more about writing accessible markup.](https://developer.mozilla.org/en-US/docs/Learn/Accessibility/HTML)

</details>

</Note>

## Event propagation {/_event-propagation_/}

Обработчики событий также будут улавливать события от всех дочерних компонентов, которые могут быть у вашего компонента. Мы говорим, что событие "бурлит" или "распространяется" вверх по дереву: оно начинается с того места, где произошло событие, и затем поднимается вверх по дереву.

Этот `<div>` содержит две кнопки. И у `<div>` _и_ у каждой кнопки есть свои обработчики `onClick`. Как вы думаете, какие обработчики будут срабатывать при нажатии на кнопку?

<details>
<summary><small>(eng)</small></summary>

<b>Event propagation :</b>

Event handlers will also catch events from any children your component might have. We say that an event "bubbles" or "propagates" up the tree: it starts with where the event happened, and then goes up the tree.

This `<div>` contains two buttons. Both the `<div>` _and_ each button have their own `onClick` handlers. Which handlers do you think will fire when you click a button?

</details>

<Sandpack>

```js
export default function Toolbar() {
  return (
    <div
      className="Toolbar"
      onClick={() => {
        alert("You clicked on the toolbar!");
      }}
    >
      <button onClick={() => alert("Playing!")}>Play Movie</button>
      <button onClick={() => alert("Uploading!")}>Upload Image</button>
    </div>
  );
}
```

```css
.Toolbar {
  background: #aaa;
  padding: 5px;
}
button {
  margin: 5px;
}
```

</Sandpack>

Если вы нажмете на любую из кнопок, сначала будет запущен ее `onClick`, а затем `onClick` родительской `<div>`. Таким образом, появятся два сообщения. Если щелкнуть на самой панели инструментов, то будет запущен только `onClick` родительского `<div>`.

<details>
<summary><small>(eng)</small></summary>

If you click on either button, its `onClick` will run first, followed by the parent `<div>`'s `onClick`. So two messages will appear. If you click the toolbar itself, only the parent `<div>`'s `onClick` will run.

</details>

<Pitfall>

Все события распространяются в React, кроме `onScroll`, которое работает только на JSX-теге, к которому вы его прикрепили.

<details>
<summary><small>(eng)</small></summary>

All events propagate in React except `onScroll`, which only works on the JSX tag you attach it to.

</details>

</Pitfall>

### Stopping propagation {/_stopping-propagation_/}

Обработчики событий получают объект **event** в качестве единственного аргумента. По традиции он обычно называется `e`, что означает "событие". Вы можете использовать этот объект для чтения информации о событии.

Этот объект события также позволяет остановить его распространение. Если вы хотите, чтобы событие не достигло родительских компонентов, вам нужно вызвать `e.stopPropagation()`, как это делает компонент `Button`:

<details>
<summary><small>(eng)</small></summary>

<b>Stopping propagation :</b>

Event handlers receive an **event object** as their only argument. By convention, it's usually called `e`, which stands for "event". You can use this object to read information about the event.

That event object also lets you stop the propagation. If you want to prevent an event from reaching parent components, you need to call `e.stopPropagation()` like this `Button` component does:

</details>

<Sandpack>

```js
function Button({ onClick, children }) {
  return (
    <button
      onClick={(e) => {
        e.stopPropagation();
        onClick();
      }}
    >
      {children}
    </button>
  );
}

export default function Toolbar() {
  return (
    <div
      className="Toolbar"
      onClick={() => {
        alert("You clicked on the toolbar!");
      }}
    >
      <Button onClick={() => alert("Playing!")}>Play Movie</Button>
      <Button onClick={() => alert("Uploading!")}>Upload Image</Button>
    </div>
  );
}
```

```css
.Toolbar {
  background: #aaa;
  padding: 5px;
}
button {
  margin: 5px;
}
```

</Sandpack>

Когда вы нажимаете на кнопку:

1. React вызывает обработчик `onClick`, переданный в `<button>`.
2. Этот обработчик, определенный в `Button`, делает следующее:
   - Вызывает `e.stopPropagation()`, предотвращая дальнейшее распространение события.
   - Вызывает функцию `onClick`, которая является реквизитом, переданным из компонента `Toolbar`.
3. Эта функция, определенная в компоненте `Toolbar`, отображает собственное оповещение кнопки.
4. Поскольку распространение было остановлено, обработчик `onClick` родительского `<div>` не выполняется.

В результате `e.stopPropagation()` при нажатии на кнопки теперь отображается только одно оповещение (от `<кнопки>`), а не два (от `<кнопки>` и родительской панели инструментов `<div>`). Нажатие на кнопку - это не то же самое, что нажатие на окружающую панель инструментов, поэтому прекращение распространения имеет смысл для данного пользовательского интерфейса.

<details>
<summary><small>(eng)</small></summary>

When you click on a button:

1. React calls the `onClick` handler passed to `<button>`.
2. That handler, defined in `Button`, does the following:
   - Calls `e.stopPropagation()`, preventing the event from bubbling further.
   - Calls the `onClick` function, which is a prop passed from the `Toolbar` component.
3. That function, defined in the `Toolbar` component, displays the button's own alert.
4. Since the propagation was stopped, the parent `<div>`'s `onClick` handler does _not_ run.

As a result of `e.stopPropagation()`, clicking on the buttons now only shows a single alert (from the `<button>`) rather than the two of them (from the `<button>` and the parent toolbar `<div>`). Clicking a button is not the same thing as clicking the surrounding toolbar, so stopping the propagation makes sense for this UI.

</details>

<DeepDive>

#### Capture phase events {/_capture-phase-events_/}

В редких случаях вам может понадобиться перехватывать все события на дочерних элементах, даже если они прекратили распространение. Например, вы хотите регистрировать каждый клик в аналитике, независимо от логики распространения. Вы можете сделать это, добавив `Capture` в конце имени события:

```js
<div
  onClickCapture={() => {
    /* this runs first */
  }}
>
  <button onClick={(e) => e.stopPropagation()} />
  <button onClick={(e) => e.stopPropagation()} />
</div>
```

Каждое событие распространяется в три фазы:

1. Оно движется вниз, вызывая все обработчики `onClickCapture`.
2. Запускается обработчик `onClick` щелкнутого элемента.
3. Он перемещается вверх, вызывая все обработчики `onClick`.

События захвата полезны для такого кода, как маршрутизаторы или аналитика, но вы, вероятно, не будете использовать их в коде приложений.

<details>
<summary><small>(eng)</small></summary>

<b>Capture phase events :</b>

In rare cases, you might need to catch all events on child elements, _even if they stopped propagation_. For example, maybe you want to log every click to analytics, regardless of the propagation logic. You can do this by adding `Capture` at the end of the event name:

```js
<div
  onClickCapture={() => {
    /* this runs first */
  }}
>
  <button onClick={(e) => e.stopPropagation()} />
  <button onClick={(e) => e.stopPropagation()} />
</div>
```

Each event propagates in three phases:

1. It travels down, calling all `onClickCapture` handlers.
2. It runs the clicked element's `onClick` handler.
3. It travels upwards, calling all `onClick` handlers.

Capture events are useful for code like routers or analytics, but you probably won't use them in app code.

</details>

</DeepDive>

### Passing handlers as alternative to propagation {/_passing-handlers-as-alternative-to-propagation_/}

Обратите внимание, как этот обработчик щелчка запускает строку кода _а затем_ вызывает свойство `onClick`, переданное родителем:

```js {4,5}
function Button({ onClick, children }) {
  return (
    <button
      onClick={(e) => {
        e.stopPropagation();
        onClick();
      }}
    >
      {children}
    </button>
  );
}
```

Вы можете добавить в этот обработчик дополнительный код перед вызовом обработчика родительского события `onClick`. Этот паттерн предоставляет _альтернативу_ распространению. Он позволяет дочернему компоненту обрабатывать событие, а родительскому компоненту задавать дополнительное поведение. В отличие от распространения, он не является автоматическим. Но преимущество этого паттерна в том, что вы можете четко проследить всю цепочку кода, который выполняется в результате какого-либо события.

Если вы полагаетесь на распространение и вам сложно отследить, какие обработчики выполняются и почему, попробуйте применить этот подход.

<details>
<summary><small>(eng)</small></summary>

<b>Passing handlers as alternative to propagation :</b>

Notice how this click handler runs a line of code _and then_ calls the `onClick` prop passed by the parent:

```js {4,5}
function Button({ onClick, children }) {
  return (
    <button
      onClick={(e) => {
        e.stopPropagation();
        onClick();
      }}
    >
      {children}
    </button>
  );
}
```

You could add more code to this handler before calling the parent `onClick` event handler, too. This pattern provides an _alternative_ to propagation. It lets the child component handle the event, while also letting the parent component specify some additional behavior. Unlike propagation, it's not automatic. But the benefit of this pattern is that you can clearly follow the whole chain of code that executes as a result of some event.

If you rely on propagation and it's difficult to trace which handlers execute and why, try this approach instead.

</details>

### Preventing default behavior {/_preventing-default-behavior_/}

Некоторые события браузера имеют поведение по умолчанию, связанное с ними. Например, событие `<form>` submit, которое происходит при нажатии на кнопку внутри него, по умолчанию перезагружает всю страницу:

<details>
<summary><small>(eng)</small></summary>

<b>Preventing default behavior :</b>

Some browser events have default behavior associated with them. For example, a `<form>` submit event, which happens when a button inside of it is clicked, will reload the whole page by default:

</details>

<Sandpack>

```js
export default function Signup() {
  return (
    <form onSubmit={() => alert("Submitting!")}>
      <input />
      <button>Send</button>
    </form>
  );
}
```

```css
button {
  margin-left: 5px;
}
```

</Sandpack>

Чтобы этого не произошло, можно вызвать `e.preventDefault()` на объекте события:

<details>
<summary><small>(eng)</small></summary>

You can call `e.preventDefault()` on the event object to stop this from happening:

</details>

<Sandpack>

```js
export default function Signup() {
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        alert("Submitting!");
      }}
    >
      <input />
      <button>Send</button>
    </form>
  );
}
```

```css
button {
  margin-left: 5px;
}
```

</Sandpack>

Не путайте `e.stopPropagation()` и `e.preventDefault()`. Они оба полезны, но не связаны между собой:

- [`e.stopPropagation()`](https://developer.mozilla.org/docs/Web/API/Event/stopPropagation) останавливает срабатывание обработчиков событий, прикрепленных к тегам выше.
- [`e.preventDefault()`](https://developer.mozilla.org/docs/Web/API/Event/preventDefault) предотвращает поведение браузера по умолчанию для тех немногих событий, в которых оно есть.

<details>
<summary><small>(eng)</small></summary>

Don't confuse `e.stopPropagation()` and `e.preventDefault()`. They are both useful, but are unrelated:

- [`e.stopPropagation()`](https://developer.mozilla.org/docs/Web/API/Event/stopPropagation) stops the event handlers attached to the tags above from firing.
- [`e.preventDefault()` ](https://developer.mozilla.org/docs/Web/API/Event/preventDefault) prevents the default browser behavior for the few events that have it.

</details>

## Can event handlers have side effects? {/_can-event-handlers-have-side-effects_/}

Конечно! Обработчики событий - лучшее место для побочных эффектов.

В отличие от функций рендеринга, обработчикам событий не нужно быть [чистыми](/learn/keeping-components-pure), поэтому это отличное место для того, чтобы _изменить_ что-то - например, изменить значение ввода в ответ на ввод текста или изменить список в ответ на нажатие кнопки. Однако для того, чтобы изменить какую-то информацию, вам сначала нужно каким-то образом ее сохранить. В React для этого используется [state, память компонента](/learn/state-a-components-memory). Вы узнаете об этом на следующей странице.

<details>
<summary><small>(eng)</small></summary>

<b>Can event handlers have side effects? :</b>

Absolutely! Event handlers are the best place for side effects.

Unlike rendering functions, event handlers don't need to be [pure](/learn/keeping-components-pure), so it's a great place to _change_ something—for example, change an input's value in response to typing, or change a list in response to a button press. However, in order to change some information, you first need some way to store it. In React, this is done by using [state, a component's memory.](/learn/state-a-components-memory) You will learn all about it on the next page.

</details>

<Recap>

- Вы можете обрабатывать события, передавая функцию в качестве параметра элементу, например `<button>`.
- Обработчики событий должны передаваться, **а не вызываться! ** `onClick={handleClick}`, а не `onClick={handleClick()}`.
- Вы можете определить функцию-обработчик события отдельно или в строке.
- Обработчики событий определяются внутри компонента, поэтому они могут обращаться к реквизитам.
- Вы можете объявить обработчик событий в родительском компоненте и передать его в качестве реквизита в дочерний компонент.
- Вы можете определить свои собственные реквизиты обработчика событий с именами, специфичными для приложения.
- События распространяются вверх. Чтобы предотвратить это, вызовите `e.stopPropagation()` для первого аргумента.
- События могут иметь нежелательное поведение браузера по умолчанию. Вызовите `e.preventDefault()`, чтобы предотвратить это.
- Явный вызов свойства обработчика события из дочернего обработчика - хорошая альтернатива распространению.

<details>
<summary><small>(eng)</small></summary>

- You can handle events by passing a function as a prop to an element like `<button>`.
- Event handlers must be passed, **not called!** `onClick={handleClick}`, not `onClick={handleClick()}`.
- You can define an event handler function separately or inline.
- Event handlers are defined inside a component, so they can access props.
- You can declare an event handler in a parent and pass it as a prop to a child.
- You can define your own event handler props with application-specific names.
- Events propagate upwards. Call `e.stopPropagation()` on the first argument to prevent that.
- Events may have unwanted default browser behavior. Call `e.preventDefault()` to prevent that.
- Explicitly calling an event handler prop from a child handler is a good alternative to propagation.

</details>

</Recap>

<Challenges>

#### Fix an event handler {/_fix-an-event-handler_/}

Щелчок на этой кнопке должен переключить фон страницы с белого на черный. Однако при нажатии на нее ничего не происходит. Устраните эту проблему. (Не беспокойтесь о логике внутри `handleClick` - эта часть в порядке).

<details>
<summary><small>(eng)</small></summary>

<b>Fix an event handler :</b>

Clicking this button is supposed to switch the page background between white and black. However, nothing happens when you click it. Fix the problem. (Don't worry about the logic inside `handleClick`—that part is fine.)

</details>

<Sandpack>

```js
export default function LightSwitch() {
  function handleClick() {
    let bodyStyle = document.body.style;
    if (bodyStyle.backgroundColor === "black") {
      bodyStyle.backgroundColor = "white";
    } else {
      bodyStyle.backgroundColor = "black";
    }
  }

  return <button onClick={handleClick()}>Toggle the lights</button>;
}
```

</Sandpack>

<Solution>

Проблема в том, что `<button onClick={handleClick()}>` _вызывает_ функцию `handleClick` при рендеринге вместо того, чтобы _передать_ ее. Удаление вызова `()`, чтобы было `<button onClick={handleClick}>`, устраняет проблему:

<details>
<summary><small>(eng)</small></summary>

The problem is that `<button onClick={handleClick()}>` _calls_ the `handleClick` function while rendering instead of _passing_ it. Removing the `()` call so that it's `<button onClick={handleClick}>` fixes the issue:

</details>

<Sandpack>

```js
export default function LightSwitch() {
  function handleClick() {
    let bodyStyle = document.body.style;
    if (bodyStyle.backgroundColor === "black") {
      bodyStyle.backgroundColor = "white";
    } else {
      bodyStyle.backgroundColor = "black";
    }
  }

  return <button onClick={handleClick}>Toggle the lights</button>;
}
```

</Sandpack>

В качестве альтернативы можно обернуть вызов в другую функцию, например `<button onClick={() => handleClick()}>`:

<details>
<summary><small>(eng)</small></summary>

Alternatively, you could wrap the call into another function, like `<button onClick={() => handleClick()}>`:

</details>

<Sandpack>

```js
export default function LightSwitch() {
  function handleClick() {
    let bodyStyle = document.body.style;
    if (bodyStyle.backgroundColor === "black") {
      bodyStyle.backgroundColor = "white";
    } else {
      bodyStyle.backgroundColor = "black";
    }
  }

  return <button onClick={() => handleClick()}>Toggle the lights</button>;
}
```

</Sandpack>

</Solution>

#### Wire up the events {/_wire-up-the-events_/}

Этот компонент `ColorSwitch` отображает кнопку. Она должна менять цвет страницы. Подключите его к обработчику события `onChangeColor`, которое он получает от родителя, чтобы при нажатии на кнопку цвет менялся.

После того как вы это сделаете, обратите внимание, что нажатие на кнопку также увеличивает счетчик кликов на странице. Ваш коллега, написавший родительский компонент, настаивает на том, что `onChangeColor` не увеличивает никаких счетчиков. Что еще может происходить? Исправьте это так, чтобы нажатие на кнопку _только_ изменяло цвет и _не_ увеличивало счетчик.

<details>
<summary><small>(eng)</small></summary>

<b>Wire up the events :</b>

This `ColorSwitch` component renders a button. It's supposed to change the page color. Wire it up to the `onChangeColor` event handler prop it receives from the parent so that clicking the button changes the color.

After you do this, notice that clicking the button also increments the page click counter. Your colleague who wrote the parent component insists that `onChangeColor` does not increment any counters. What else might be happening? Fix it so that clicking the button _only_ changes the color, and does _not_ increment the counter.

</details>

<Sandpack>

```js src/ColorSwitch.js active
export default function ColorSwitch({ onChangeColor }) {
  return <button>Change color</button>;
}
```

```js src/App.js hidden
import { useState } from "react";
import ColorSwitch from "./ColorSwitch.js";

export default function App() {
  const [clicks, setClicks] = useState(0);

  function handleClickOutside() {
    setClicks((c) => c + 1);
  }

  function getRandomLightColor() {
    let r = 150 + Math.round(100 * Math.random());
    let g = 150 + Math.round(100 * Math.random());
    let b = 150 + Math.round(100 * Math.random());
    return `rgb(${r}, ${g}, ${b})`;
  }

  function handleChangeColor() {
    let bodyStyle = document.body.style;
    bodyStyle.backgroundColor = getRandomLightColor();
  }

  return (
    <div style={{ width: "100%", height: "100%" }} onClick={handleClickOutside}>
      <ColorSwitch onChangeColor={handleChangeColor} />
      <br />
      <br />
      <h2>Clicks on the page: {clicks}</h2>
    </div>
  );
}
```

</Sandpack>

<Solution>

Сначала нужно добавить обработчик события, например `<button onClick={onChangeColor}>`.

Однако в этом случае возникает проблема инкрементирующего счетчика. Если `onChangeColor` не делает этого, как настаивает ваш коллега, то проблема в том, что это событие распространяется вверх, и какой-то обработчик выше делает это. Чтобы решить эту проблему, нужно остановить распространение. Но не забывайте, что вы все равно должны вызывать `onChangeColor`.

<details>
<summary><small>(eng)</small></summary>

First, you need to add the event handler, like `<button onClick={onChangeColor}>`.

However, this introduces the problem of the incrementing counter. If `onChangeColor` does not do this, as your colleague insists, then the problem is that this event propagates up, and some handler above does it. To solve this problem, you need to stop the propagation. But don't forget that you should still call `onChangeColor`.

</details>

<Sandpack>

```js src/ColorSwitch.js active
export default function ColorSwitch({ onChangeColor }) {
  return (
    <button
      onClick={(e) => {
        e.stopPropagation();
        onChangeColor();
      }}
    >
      Change color
    </button>
  );
}
```

```js src/App.js hidden
import { useState } from "react";
import ColorSwitch from "./ColorSwitch.js";

export default function App() {
  const [clicks, setClicks] = useState(0);

  function handleClickOutside() {
    setClicks((c) => c + 1);
  }

  function getRandomLightColor() {
    let r = 150 + Math.round(100 * Math.random());
    let g = 150 + Math.round(100 * Math.random());
    let b = 150 + Math.round(100 * Math.random());
    return `rgb(${r}, ${g}, ${b})`;
  }

  function handleChangeColor() {
    let bodyStyle = document.body.style;
    bodyStyle.backgroundColor = getRandomLightColor();
  }

  return (
    <div style={{ width: "100%", height: "100%" }} onClick={handleClickOutside}>
      <ColorSwitch onChangeColor={handleChangeColor} />
      <br />
      <br />
      <h2>Clicks on the page: {clicks}</h2>
    </div>
  );
}
```

</Sandpack>

</Solution>

</Challenges>
