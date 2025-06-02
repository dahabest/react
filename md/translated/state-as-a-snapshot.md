---
title: State as a Snapshot
---

<Intro>

Переменные состояния могут выглядеть как обычные переменные JavaScript, которые можно читать и записывать. Однако состояние больше похоже на снимок. Ее установка не изменяет уже имеющуюся переменную состояния, а вызывает повторный рендеринг.


<details>
<summary><small>(eng)</small></summary>

State variables might look like regular JavaScript variables that you can read and write to. However, state behaves more like a snapshot. Setting it does not change the state variable you already have, but instead triggers a re-render.

</details>

</Intro>

<YouWillLearn>

* Как установка состояния вызывает повторные рендеры
* Когда и как обновляется состояние
* Почему состояние не обновляется сразу после его установки
* Как обработчики событий получают доступ к "снимку" состояния


<details>
<summary><small>(eng)</small></summary>

* How setting state triggers re-renders
* When and how state updates
* Why state does not update immediately after you set it
* How event handlers access a "snapshot" of the state

</details>

</YouWillLearn>

## Setting state triggers renders {/*setting-state-triggers-renders*/}

Вы можете думать, что ваш пользовательский интерфейс изменяется непосредственно в ответ на событие пользователя, например на клик. В React все работает немного иначе, чем в этой ментальной модели. На предыдущей странице вы видели, что [установка состояния запрашивает повторный рендеринг](/learn/render-and-commit#step-1-trigger-a-render) в React. Это означает, что для того, чтобы интерфейс отреагировал на событие, вам нужно *обновить состояние*.

В этом примере, когда вы нажимаете кнопку "отправить", `setIsSent(true)` сообщает React о необходимости повторного рендеринга пользовательского интерфейса:


<details>
<summary><small>(eng)</small></summary>

<b>Setting state triggers renders :</b>
You might think of your user interface as changing directly in response to the user event like a click. In React, it works a little differently from this mental model. On the previous page, you saw that [setting state requests a re-render](/learn/render-and-commit#step-1-trigger-a-render) from React. This means that for an interface to react to the event, you need to *update the state*.

In this example, when you press "send", `setIsSent(true)` tells React to re-render the UI:

</details>

<Sandpack>

```js
import { useState } from 'react';

export default function Form() {
  const [isSent, setIsSent] = useState(false);
  const [message, setMessage] = useState('Hi!');
  if (isSent) {
    return <h1>Your message is on its way!</h1>
  }
  return (
    <form onSubmit={(e) => {
      e.preventDefault();
      setIsSent(true);
      sendMessage(message);
    }}>
      <textarea
        placeholder="Message"
        value={message}
        onChange={e => setMessage(e.target.value)}
      />
      <button type="submit">Send</button>
    </form>
  );
}

function sendMessage(message) {
  // ...
}
```

```css
label, textarea { margin-bottom: 10px; display: block; }
```

</Sandpack>

Вот что происходит, когда вы нажимаете на кнопку:

1. Выполняется обработчик события `onSubmit`.
2. `setIsSent(true)` устанавливает `isSent` в `true` и ставит в очередь новый рендер.
3. React перерисовывает компонент в соответствии с новым значением `isSent`.

Давайте подробнее рассмотрим связь между состоянием и рендерингом.


<details>
<summary><small>(eng)</small></summary>

Here's what happens when you click the button:

1. The `onSubmit` event handler executes.
2. `setIsSent(true)` sets `isSent` to `true` and queues a new render.
3. React re-renders the component according to the new `isSent` value.

Let's take a closer look at the relationship between state and rendering.

</details>

## Рендеринг делает моментальный снимок во времени{/*rendering-takes-a-snapshot-in-time*/}

["Рендеринг"](/learn/render-and-commit#step-2-react-renders-your-components) означает, что React вызывает ваш компонент, который является функцией. JSX, который вы возвращаете из этой функции, - это как снимок пользовательского интерфейса во времени. Его реквизиты, обработчики событий и локальные переменные были рассчитаны **используя его состояние на момент рендеринга*.

В отличие от фотографии или кадра фильма, возвращаемый вами "снимок" пользовательского интерфейса является интерактивным. Он включает в себя логику, например обработчики событий, которые определяют, что происходит в ответ на входные данные. React обновляет экран в соответствии с этим снимком и подключает обработчики событий. В результате нажатие на кнопку вызовет обработчик клика из вашего JSX.

Когда React перерисовывает компонент:

1. React снова вызывает вашу функцию.
2. Ваша функция возвращает новый JSX-снимок.
3. Затем React обновляет экран в соответствии со снимком, который вернула ваша функция.

<IllustrationBlock sequential>
    <Illustration caption="React выполняет функцию" src="/ru.react.doc/images/docs/illustrations/i_render1.png" />
    <Illustration caption="Вычисление моментального снимка" src="/ru.react.doc/images/docs/illustrations/i_render2.png" />
    <Illustration caption="Обновление дерева DOM" src="/ru.react.doc/images/docs/illustrations/i_render3.png" />
</IllustrationBlock

Как память компонента, состояние не похоже на обычную переменную, которая исчезает после возврата функции. Состояние фактически "живет" в самом React - как будто на полке! - вне вашей функции. Когда React вызывает ваш компонент, он дает вам снимок состояния для этого конкретного рендера. Ваш компонент возвращает снимок пользовательского интерфейса со свежим набором реквизитов и обработчиков событий в своем JSX, все вычисленные **используя значения состояния из этого рендера!**.

<IllustrationBlock sequential>
  <Illustration caption="Вы говорите React обновить состояние" src="/ru.react.doc/images/docs/illustrations/i_state-snapshot1.png" />
  <Illustration caption="React обновляет значение состояния" src="/ru.react.doc/images/docs/illustrations/i_state-snapshot2.png" />
  <Illustration caption="React передает в компонент снимок значения состояния" src="/ru.react.doc/images/docs/illustrations/i_state-snapshot3.png" />
</IllustrationBlock

Вот небольшой эксперимент, который покажет вам, как это работает. В этом примере вы могли бы ожидать, что нажатие кнопки "+3" увеличит счетчик в три раза, потому что он вызывает `setNumber(number + 1)` три раза.

Посмотрите, что произойдет, когда вы нажмете кнопку "+3":


<details>
<summary><small>(eng)</small></summary>

<b>Rendering takes a snapshot in time :</b>
["Rendering"](/learn/render-and-commit#step-2-react-renders-your-components) means that React is calling your component, which is a function. The JSX you return from that function is like a snapshot of the UI in time. Its props, event handlers, and local variables were all calculated **using its state at the time of the render.**

Unlike a photograph or a movie frame, the UI "snapshot" you return is interactive. It includes logic like event handlers that specify what happens in response to inputs. React updates the screen to match this snapshot and connects the event handlers. As a result, pressing a button will trigger the click handler from your JSX.

When React re-renders a component:

1. React calls your function again.
2. Your function returns a new JSX snapshot.
3. React then updates the screen to match the snapshot your function returned.

<IllustrationBlock sequential>
    <Illustration caption="React executing the function" src="/ru.react.doc/images/docs/illustrations/i_render1.png" />
    <Illustration caption="Calculating the snapshot" src="/ru.react.doc/images/docs/illustrations/i_render2.png" />
    <Illustration caption="Updating the DOM tree" src="/ru.react.doc/images/docs/illustrations/i_render3.png" />
</IllustrationBlock>

As a component's memory, state is not like a regular variable that disappears after your function returns. State actually "lives" in React itself--as if on a shelf!--outside of your function. When React calls your component, it gives you a snapshot of the state for that particular render. Your component returns a snapshot of the UI with a fresh set of props and event handlers in its JSX, all calculated **using the state values from that render!**

<IllustrationBlock sequential>
  <Illustration caption="You tell React to update the state" src="/ru.react.doc/images/docs/illustrations/i_state-snapshot1.png" />
  <Illustration caption="React updates the state value" src="/ru.react.doc/images/docs/illustrations/i_state-snapshot2.png" />
  <Illustration caption="React passes a snapshot of the state value into the component" src="/ru.react.doc/images/docs/illustrations/i_state-snapshot3.png" />
</IllustrationBlock>

Here's a little experiment to show you how this works. In this example, you might expect that clicking the "+3" button would increment the counter three times because it calls `setNumber(number + 1)` three times.

See what happens when you click the "+3" button:

</details>

<Sandpack>

```js
import { useState } from 'react';

export default function Counter() {
  const [number, setNumber] = useState(0);

  return (
    <>
      <h1>{number}</h1>
      <button onClick={() => {
        setNumber(number + 1);
        setNumber(number + 1);
        setNumber(number + 1);
      }}>+3</button>
    </>
  )
}
```

```css
button { display: inline-block; margin: 10px; font-size: 20px; }
h1 { display: inline-block; margin: 10px; width: 30px; text-align: center; }
```

</Sandpack>

Обратите внимание, что `число` увеличивается только один раз за клик!

**Установка состояния изменяет его только для *следующего* рендера.** Во время первого рендера `number` было `0`. Вот почему в обработчике `onClick` того рендера значение `number` все еще `0`, даже после вызова `setNumber(number + 1)`:

```js
<button onClick={() => {
  setNumber(number + 1);
  setNumber(number + 1);
  setNumber(number + 1);
}}>+3</button>
```

Вот что обработчик нажатия этой кнопки говорит React сделать:

1. `setNumber(number + 1)`: `number` - это `0`, поэтому `setNumber(0 + 1)`.
    - React готовится изменить `число` на `1` при следующем рендере.
2. `setNumber(number + 1)`: `number` - это `0`, поэтому `setNumber(0 + 1)`.
    - React готовится изменить `число` на `1` при следующем рендере.
3. `setNumber(number + 1)`: `number` - это `0`, поэтому `setNumber(0 + 1)`.
    - React готовится изменить `число` на `1` при следующем рендере.

Несмотря на то, что вы вызвали `setNumber(number + 1)` три раза, в обработчике события *этого рендера `number` всегда `0`, поэтому вы установили состояние `1` три раза. Вот почему после завершения обработчика события React повторно рендерит компонент с `number`, равным `1`, а не `3`.

Вы также можете представить себе это, мысленно заменив переменные состояния их значениями в коде. Поскольку переменная состояния `number` равна `0` для *этого рендера*, обработчик его события выглядит следующим образом:

```js
<button onClick={() => {
  setNumber(0 + 1);
  setNumber(0 + 1);
  setNumber(0 + 1);
}}>+3</button>
```

Для следующего рендера `number` будет `1`, поэтому *обработчик клика этого рендера* будет выглядеть следующим образом:

```js
<button onClick={() => {
  setNumber(1 + 1);
  setNumber(1 + 1);
  setNumber(1 + 1);
}}>+3</button>
```

Именно поэтому при повторном нажатии на кнопку счетчик установится на `2`, при следующем нажатии - на `3` и так далее.


<details>
<summary><small>(eng)</small></summary>

Notice that `number` only increments once per click!

**Setting state only changes it for the *next* render.** During the first render, `number` was `0`. This is why, in *that render's* `onClick` handler, the value of `number` is still `0` even after `setNumber(number + 1)` was called:

```js
<button onClick={() => {
  setNumber(number + 1);
  setNumber(number + 1);
  setNumber(number + 1);
}}>+3</button>
```

Here is what this button's click handler tells React to do:

1. `setNumber(number + 1)`: `number` is `0` so `setNumber(0 + 1)`.
    - React prepares to change `number` to `1` on the next render.
2. `setNumber(number + 1)`: `number` is `0` so `setNumber(0 + 1)`.
    - React prepares to change `number` to `1` on the next render.
3. `setNumber(number + 1)`: `number` is `0` so `setNumber(0 + 1)`.
    - React prepares to change `number` to `1` on the next render.

Even though you called `setNumber(number + 1)` three times, in *this render's* event handler `number` is always `0`, so you set the state to `1` three times. This is why, after your event handler finishes, React re-renders the component with `number` equal to `1` rather than `3`.

You can also visualize this by mentally substituting state variables with their values in your code. Since the `number` state variable is `0` for *this render*, its event handler looks like this:

```js
<button onClick={() => {
  setNumber(0 + 1);
  setNumber(0 + 1);
  setNumber(0 + 1);
}}>+3</button>
```

For the next render, `number` is `1`, so *that render's* click handler looks like this:

```js
<button onClick={() => {
  setNumber(1 + 1);
  setNumber(1 + 1);
  setNumber(1 + 1);
}}>+3</button>
```

This is why clicking the button again will set the counter to `2`, then to `3` on the next click, and so on.

</details>

## Состояние с течением времени{/*state-over-time*/}

Что ж, это было весело. Попробуйте угадать, о чем предупредит нажатие этой кнопки:


<details>
<summary><small>(eng)</small></summary>

<b>State over time :</b>
Well, that was fun. Try to guess what clicking this button will alert:

</details>

<Sandpack>

```js
import { useState } from 'react';

export default function Counter() {
  const [number, setNumber] = useState(0);

  return (
    <>
      <h1>{number}</h1>
      <button onClick={() => {
        setNumber(number + 5);
        alert(number);
      }}>+5</button>
    </>
  )
}
```

```css
button { display: inline-block; margin: 10px; font-size: 20px; }
h1 { display: inline-block; margin: 10px; width: 30px; text-align: center; }
```

</Sandpack>

Если вы воспользуетесь методом подстановки, то сможете догадаться, что в оповещении отображается "0":

```js
setNumber(0 + 5);
alert(0);
```

Но что, если поставить таймер на оповещение, чтобы оно срабатывало только после того, как компонент перерендерится? Будет ли он говорить "0" или "5"? Попробуйте угадать!


<details>
<summary><small>(eng)</small></summary>

If you use the substitution method from before, you can guess that the alert shows "0":

```js
setNumber(0 + 5);
alert(0);
```

But what if you put a timer on the alert, so it only fires _after_ the component re-rendered? Would it say "0" or "5"? Have a guess!

</details>

<Sandpack>

```js
import { useState } from 'react';

export default function Counter() {
  const [number, setNumber] = useState(0);

  return (
    <>
      <h1>{number}</h1>
      <button onClick={() => {
        setNumber(number + 5);
        setTimeout(() => {
          alert(number);
        }, 3000);
      }}>+5</button>
    </>
  )
}
```

```css
button { display: inline-block; margin: 10px; font-size: 20px; }
h1 { display: inline-block; margin: 10px; width: 30px; text-align: center; }
```

</Sandpack>

Удивлены? Если вы используете метод подстановки, вы можете увидеть "снимок" состояния, переданного в оповещение.

```js
setNumber(0 + 5);
setTimeout(() => {
  alert(0);
}, 3000);
```

Состояние, хранящееся в React, может измениться к моменту запуска оповещения, но оно было запланировано с использованием моментального снимка состояния на момент взаимодействия пользователя с ним!

**Значение переменной состояния никогда не меняется внутри рендера,** даже если код ее обработчика события асинхронный. Внутри `onClick` этого рендера значение `number` продолжает быть `0` даже после вызова `setNumber(number + 5)`. Его значение было "зафиксировано", когда React "сделал снимок" пользовательского интерфейса, вызвав ваш компонент.

Вот пример того, как это делает ваши обработчики событий менее подверженными ошибкам синхронизации. Ниже приведена форма, которая отправляет сообщение с пятисекундной задержкой. Представьте себе такой сценарий:

1. Вы нажимаете кнопку "Отправить", отправляя Алисе сообщение "Привет".
2. До окончания пятисекундной задержки вы меняете значение поля "Кому" на "Бобу".

Что, по вашему мнению, должно отображаться в `alert`? Будет ли оно отображать "Вы сказали "Привет" Алисе"? Или "Вы сказали "Привет" Бобу"? Сделайте предположение, основываясь на том, что вы знаете, а затем попробуйте:


<details>
<summary><small>(eng)</small></summary>

Surprised? If you use the substitution method, you can see the "snapshot" of the state passed to the alert.

```js
setNumber(0 + 5);
setTimeout(() => {
  alert(0);
}, 3000);
```

The state stored in React may have changed by the time the alert runs, but it was scheduled using a snapshot of the state at the time the user interacted with it!

**A state variable's value never changes within a render,** even if its event handler's code is asynchronous. Inside *that render's* `onClick`, the value of `number` continues to be `0` even after `setNumber(number + 5)` was called. Its value was "fixed" when React "took the snapshot" of the UI by calling your component.

Here is an example of how that makes your event handlers less prone to timing mistakes. Below is a form that sends a message with a five-second delay. Imagine this scenario:

1. You press the "Send" button, sending "Hello" to Alice.
2. Before the five-second delay ends, you change the value of the "To" field to "Bob".

What do you expect the `alert` to display? Would it display, "You said Hello to Alice"? Or would it display, "You said Hello to Bob"? Make a guess based on what you know, and then try it:

</details>

<Sandpack>

```js
import { useState } from 'react';

export default function Form() {
  const [to, setTo] = useState('Alice');
  const [message, setMessage] = useState('Hello');

  function handleSubmit(e) {
    e.preventDefault();
    setTimeout(() => {
      alert(`You said ${message} to ${to}`);
    }, 5000);
  }

  return (
    <form onSubmit={handleSubmit}>
      <label>
        To:{' '}
        <select
          value={to}
          onChange={e => setTo(e.target.value)}>
          <option value="Alice">Alice</option>
          <option value="Bob">Bob</option>
        </select>
      </label>
      <textarea
        placeholder="Message"
        value={message}
        onChange={e => setMessage(e.target.value)}
      />
      <button type="submit">Send</button>
    </form>
  );
}
```

```css
label, textarea { margin-bottom: 10px; display: block; }
```

</Sandpack>

**React сохраняет значения состояния "фиксированными" в обработчиках событий одного рендера.** Вам не нужно беспокоиться о том, изменилось ли состояние во время выполнения кода.

Но что, если вы хотите прочитать последнее состояние перед повторным рендерингом? Для этого нужно использовать функцию [state updater] (/learn/queueing-a-series-of-state-updates), о которой мы расскажем на следующей странице!


<details>
<summary><small>(eng)</small></summary>

**React keeps the state values "fixed" within one render's event handlers.** You don't need to worry whether the state has changed while the code is running.

But what if you wanted to read the latest state before a re-render? You'll want to use a [state updater function](/learn/queueing-a-series-of-state-updates), covered on the next page!

</details>

<Recap>

* Установка состояния запрашивает новый рендер.
* React хранит состояние вне вашего компонента, как на полке.
* Когда вы вызываете `useState`, React дает вам снимок состояния *для этого рендера*.
* Переменные и обработчики событий не "переживают" повторных рендеров. Каждый рендер имеет свои собственные обработчики событий.
* Каждый рендер (и функции внутри него) всегда будет "видеть" снимок состояния, который React передал *этому* рендеру.
* Вы можете мысленно подставлять состояние в обработчики событий, аналогично тому, как вы думаете о рендеринге JSX.
* Обработчики событий, созданные в прошлом, имеют значения состояния из рендера, в котором они были созданы.


<details>
<summary><small>(eng)</small></summary>

* Setting state requests a new render.
* React stores state outside of your component, as if on a shelf.
* When you call `useState`, React gives you a snapshot of the state *for that render*.
* Variables and event handlers don't "survive" re-renders. Every render has its own event handlers.
* Every render (and functions inside it) will always "see" the snapshot of the state that React gave to *that* render.
* You can mentally substitute state in event handlers, similarly to how you think about the rendered JSX.
* Event handlers created in the past have the state values from the render in which they were created.

</details>

</Recap>



<Challenges>

#### Implement a traffic light {/*implement-a-traffic-light*/}

Перед вами компонент светофора для пешеходного перехода, который переключается при нажатии кнопки:


<details>
<summary><small>(eng)</small></summary>

<b>Implement a traffic light :</b>
Here is a crosswalk light component that toggles when the button is pressed:

</details>

<Sandpack>

```js
import { useState } from 'react';

export default function TrafficLight() {
  const [walk, setWalk] = useState(true);

  function handleClick() {
    setWalk(!walk);
  }

  return (
    <>
      <button onClick={handleClick}>
        Change to {walk ? 'Stop' : 'Walk'}
      </button>
      <h1 style={{
        color: walk ? 'darkgreen' : 'darkred'
      }}>
        {walk ? 'Walk' : 'Stop'}
      </h1>
    </>
  );
}
```

```css
h1 { margin-top: 20px; }
```

</Sandpack>

Добавьте `alert` в обработчик нажатия. Когда на светофоре горит зеленый цвет и написано "Walk", при нажатии на кнопку должно появиться сообщение "Stop is next". Когда свет красный и говорит "Стоп", нажатие на кнопку должно говорить "Ходьба следующая".

Есть ли разница в том, поместить ли `alert` до или после вызова `setWalk`?


<details>
<summary><small>(eng)</small></summary>

Add an `alert` to the click handler. When the light is green and says "Walk", clicking the button should say "Stop is next". When the light is red and says "Stop", clicking the button should say "Walk is next".

Does it make a difference whether you put the `alert` before or after the `setWalk` call?

</details>

<Solution>

Ваше `оповещение` должно выглядеть следующим образом:


<details>
<summary><small>(eng)</small></summary>

Your `alert` should look like this:

</details>

<Sandpack>

```js
import { useState } from 'react';

export default function TrafficLight() {
  const [walk, setWalk] = useState(true);

  function handleClick() {
    setWalk(!walk);
    alert(walk ? 'Stop is next' : 'Walk is next');
  }

  return (
    <>
      <button onClick={handleClick}>
        Change to {walk ? 'Stop' : 'Walk'}
      </button>
      <h1 style={{
        color: walk ? 'darkgreen' : 'darkred'
      }}>
        {walk ? 'Walk' : 'Stop'}
      </h1>
    </>
  );
}
```

```css
h1 { margin-top: 20px; }
```

</Sandpack>

Поместите ли вы его до или после вызова `setWalk`, не имеет значения. Значение `walk` в этом рендере фиксировано. Вызов `setWalk` изменит его только для *следующего* рендера, но не повлияет на обработчик события предыдущего рендера.

Сначала эта строка может показаться неинтуитивной:

```js
alert(walk ? 'Stop is next' : 'Walk is next');
```

Но это имеет смысл, если читать это как: "Если светофор показывает "Идти сейчас", то в сообщении должно быть написано "Остановка следующая"". Переменная `walk` в вашем обработчике событий соответствует значению `walk` в рендере и не меняется.

Вы можете убедиться в этом, применив метод подстановки. Когда `walk` имеет значение `true`, вы получите:

```js
<button onClick={() => {
  setWalk(false);
  alert('Stop is next');
}}>
  Change to Stop
</button>
<h1 style={{color: 'darkgreen'}}>
  Walk
</h1>
```

Таким образом, нажатие "Change to Stop" ставит в очередь рендеринг с `walk`, установленным в `false`, и предупреждает "Stop is next".


<details>
<summary><small>(eng)</small></summary>

Whether you put it before or after the `setWalk` call makes no difference. That render's value of `walk` is fixed. Calling `setWalk` will only change it for the *next* render, but will not affect the event handler from the previous render.

This line might seem counter-intuitive at first:

```js
alert(walk ? 'Stop is next' : 'Walk is next');
```

But it makes sense if you read it as: "If the traffic light shows 'Walk now', the message should say 'Stop is next.'" The `walk` variable inside your event handler matches that render's value of `walk` and does not change.

You can verify that this is correct by applying the substitution method. When `walk` is `true`, you get:

```js
<button onClick={() => {
  setWalk(false);
  alert('Stop is next');
}}>
  Change to Stop
</button>
<h1 style={{color: 'darkgreen'}}>
  Walk
</h1>
```

So clicking "Change to Stop" queues a render with `walk` set to `false`, and alerts "Stop is next".

</details>

</Solution>

</Challenges>

