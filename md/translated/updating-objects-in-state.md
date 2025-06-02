---
title: Updating Objects in State
---

<Intro>

Состояние может содержать любые значения JavaScript, включая объекты. Но вы не должны напрямую изменять объекты, которые хранятся в состоянии React. Вместо этого, когда вы хотите обновить объект, вам нужно создать новый (или сделать копию существующего), а затем настроить состояние на использование этой копии.


<details>
<summary><small>(eng)</small></summary>

State can hold any kind of JavaScript value, including objects. But you shouldn't change objects that you hold in the React state directly. Instead, when you want to update an object, you need to create a new one (or make a copy of an existing one), and then set the state to use that copy.

</details>

</Intro>

<YouWillLearn>

- Как правильно обновить объект в состоянии React
- Как обновить вложенный объект, не мутируя его
- Что такое неизменяемость и как ее не нарушить
- Как сделать копирование объектов менее повторяющимся с помощью Immer


<details>
<summary><small>(eng)</small></summary>

- How to correctly update an object in React state
- How to update a nested object without mutating it
- What immutability is, and how not to break it
- How to make object copying less repetitive with Immer

</details>

</YouWillLearn>

## What's a mutation? {/*whats-a-mutation*/}

В state можно хранить любые значения JavaScript.

```js
const [x, setX] = useState(0);
```

До сих пор вы работали с числами, строками и булевыми числами. Эти типы значений JavaScript являются "неизменяемыми", то есть неизменяемыми или "доступными только для чтения". Вы можете вызвать повторный рендеринг, чтобы _заменить_ значение:

```js
setX(5);
```

Состояние `x` изменилось с `0` на `5`, но само _число `0` не изменилось. В JavaScript невозможно внести какие-либо изменения во встроенные примитивные значения, такие как числа, строки и булевы.

Теперь рассмотрим объект в состоянии:

```js
const [position, setPosition] = useState({ x: 0, y: 0 });
```

Технически, можно изменить содержимое _самого объекта_. **Это называется мутацией.

```js
position.x = 5;
```

Однако, несмотря на то, что объекты в состоянии React технически являются изменяемыми, вы должны обращаться с ними **так, как если бы** они были неизменяемыми - как с числами, булевыми числами и строками. Вместо того чтобы изменять их, вы всегда должны заменять их.


<details>
<summary><small>(eng)</small></summary>

<b>What's a mutation? :</b>
You can store any kind of JavaScript value in state.

```js
const [x, setX] = useState(0);
```

So far you've been working with numbers, strings, and booleans. These kinds of JavaScript values are "immutable", meaning unchangeable or "read-only". You can trigger a re-render to _replace_ a value:

```js
setX(5);
```

The `x` state changed from `0` to `5`, but the _number `0` itself_ did not change. It's not possible to make any changes to the built-in primitive values like numbers, strings, and booleans in JavaScript.

Now consider an object in state:

```js
const [position, setPosition] = useState({ x: 0, y: 0 });
```

Technically, it is possible to change the contents of _the object itself_. **This is called a mutation:**

```js
position.x = 5;
```

However, although objects in React state are technically mutable, you should treat them **as if** they were immutable--like numbers, booleans, and strings. Instead of mutating them, you should always replace them.

</details>

## Рассматривайте состояние как доступное только для чтения{/*treat-state-as-read-only*/}

Другими словами, вы должны **рассматривать любой объект JavaScript, который вы поместили в состояние, как доступный только для чтения.**.

В этом примере в состояние помещен объект, представляющий текущую позицию указателя. Предполагается, что красная точка будет перемещаться при касании или перемещении курсора по области предварительного просмотра. Но точка остается в исходном положении:


<details>
<summary><small>(eng)</small></summary>

<b>Treat state as read-only :</b>
In other words, you should **treat any JavaScript object that you put into state as read-only.**

This example holds an object in state to represent the current pointer position. The red dot is supposed to move when you touch or move the cursor over the preview area. But the dot stays in the initial position:

</details>

<Sandpack>

```js
import { useState } from 'react';

export default function MovingDot() {
  const [position, setPosition] = useState({
    x: 0,
    y: 0
  });
  return (
    <div
      onPointerMove={e => {
        position.x = e.clientX;
        position.y = e.clientY;
      }}
      style={{
        position: 'relative',
        width: '100vw',
        height: '100vh',
      }}>
      <div style={{
        position: 'absolute',
        backgroundColor: 'red',
        borderRadius: '50%',
        transform: `translate(${position.x}px, ${position.y}px)`,
        left: -10,
        top: -10,
        width: 20,
        height: 20,
      }} />
    </div>
  );
}
```

```css
body { margin: 0; padding: 0; height: 250px; }
```

</Sandpack>

Проблема заключается в этом фрагменте кода.

```js
onPointerMove={e => {
  position.x = e.clientX;
  position.y = e.clientY;
}}
```

Этот код изменяет объект, назначенный на `позицию` из [предыдущего рендера] (/learn/state-as-a-snapshot#rendering-takes-a-snapshot-in-time). Но без использования функции установки состояния React не имеет понятия, что объект изменился. Поэтому React ничего не делает в ответ. Это все равно что пытаться изменить заказ после того, как вы уже поели. Хотя мутирование состояния может работать в некоторых случаях, мы не рекомендуем это делать. Вы должны рассматривать значение состояния, к которому вы имеете доступ при рендере, как доступное только для чтения.

Чтобы действительно [вызвать повторный рендер] (/learn/state-as-a-snapshot#setting-state-triggers-renders) в этом случае, **создайте *новый* объект и передайте его функции установки состояния:**.

```js
onPointerMove={e => {
  setPosition({
    x: e.clientX,
    y: e.clientY
  });
}}
```

С помощью `setPosition` вы сообщаете React:

* Замените `position` на этот новый объект.
* И снова отрендерить этот компонент

Обратите внимание, как красная точка теперь следует за вашим указателем, когда вы касаетесь или наводите курсор на область предварительного просмотра:


<details>
<summary><small>(eng)</small></summary>

The problem is with this bit of code.

```js
onPointerMove={e => {
  position.x = e.clientX;
  position.y = e.clientY;
}}
```

This code modifies the object assigned to `position` from [the previous render.](/learn/state-as-a-snapshot#rendering-takes-a-snapshot-in-time) But without using the state setting function, React has no idea that object has changed. So React does not do anything in response. It's like trying to change the order after you've already eaten the meal. While mutating state can work in some cases, we don't recommend it. You should treat the state value you have access to in a render as read-only.

To actually [trigger a re-render](/learn/state-as-a-snapshot#setting-state-triggers-renders) in this case, **create a *new* object and pass it to the state setting function:**

```js
onPointerMove={e => {
  setPosition({
    x: e.clientX,
    y: e.clientY
  });
}}
```

With `setPosition`, you're telling React:

* Replace `position` with this new object
* And render this component again

Notice how the red dot now follows your pointer when you touch or hover over the preview area:

</details>

<Sandpack>

```js
import { useState } from 'react';

export default function MovingDot() {
  const [position, setPosition] = useState({
    x: 0,
    y: 0
  });
  return (
    <div
      onPointerMove={e => {
        setPosition({
          x: e.clientX,
          y: e.clientY
        });
      }}
      style={{
        position: 'relative',
        width: '100vw',
        height: '100vh',
      }}>
      <div style={{
        position: 'absolute',
        backgroundColor: 'red',
        borderRadius: '50%',
        transform: `translate(${position.x}px, ${position.y}px)`,
        left: -10,
        top: -10,
        width: 20,
        height: 20,
      }} />
    </div>
  );
}
```

```css
body { margin: 0; padding: 0; height: 250px; }
```

</Sandpack>

<DeepDive>

#### Local mutation is fine {/*local-mutation-is-fine*/}

Код, подобный этому, является проблемой, потому что он изменяет *существующий* объект в состоянии:

```js
position.x = e.clientX;
position.y = e.clientY;
```

Но код, подобный этому, **абсолютно нормален**, потому что вы мутируете свежий объект, который вы *только что создали*:

```js
const nextPosition = {};
nextPosition.x = e.clientX;
nextPosition.y = e.clientY;
setPosition(nextPosition);
```

На самом деле, это совершенно равносильно тому, чтобы написать это:

```js
setPosition({
  x: e.clientX,
  y: e.clientY
});
```

Мутация является проблемой только тогда, когда вы изменяете *существующие* объекты, которые уже находятся в состоянии. Мутация только что созданного объекта - это нормально, потому что *на него пока не ссылается никакой другой код.* Его изменение не повлияет случайно на что-то, что от него зависит. Это называется "локальной мутацией". Вы даже можете делать локальные мутации [во время рендеринга] (/learn/keeping-components-pure#local-mutation-your-components-little-secret) Очень удобно и совершенно нормально!


<details>
<summary><small>(eng)</small></summary>

<b>Local mutation is fine :</b>
Code like this is a problem because it modifies an *existing* object in state:

```js
position.x = e.clientX;
position.y = e.clientY;
```

But code like this is **absolutely fine** because you're mutating a fresh object you have *just created*:

```js
const nextPosition = {};
nextPosition.x = e.clientX;
nextPosition.y = e.clientY;
setPosition(nextPosition);
```

In fact, it is completely equivalent to writing this:

```js
setPosition({
  x: e.clientX,
  y: e.clientY
});
```

Mutation is only a problem when you change *existing* objects that are already in state. Mutating an object you've just created is okay because *no other code references it yet.* Changing it isn't going to accidentally impact something that depends on it. This is called a "local mutation". You can even do local mutation [while rendering.](/learn/keeping-components-pure#local-mutation-your-components-little-secret) Very convenient and completely okay!

</details>

</DeepDive>  

## Copying objects with the spread syntax {/*copying-objects-with-the-spread-syntax*/}

В предыдущем примере объект `position` всегда создается на основе текущей позиции курсора. Но часто требуется включить *существующие* данные в новый создаваемый объект. Например, вы можете захотеть обновить *только одно* поле в форме, но сохранить прежние значения для всех остальных полей.

Такие поля ввода не работают, потому что обработчики `onChange` изменяют состояние:


<details>
<summary><small>(eng)</small></summary>

<b>Copying objects with the spread syntax :</b>
In the previous example, the `position` object is always created fresh from the current cursor position. But often, you will want to include *existing* data as a part of the new object you're creating. For example, you may want to update *only one* field in a form, but keep the previous values for all other fields.

These input fields don't work because the `onChange` handlers mutate the state:

</details>

<Sandpack>

```js
import { useState } from 'react';

export default function Form() {
  const [person, setPerson] = useState({
    firstName: 'Barbara',
    lastName: 'Hepworth',
    email: 'bhepworth@sculpture.com'
  });

  function handleFirstNameChange(e) {
    person.firstName = e.target.value;
  }

  function handleLastNameChange(e) {
    person.lastName = e.target.value;
  }

  function handleEmailChange(e) {
    person.email = e.target.value;
  }

  return (
    <>
      <label>
        First name:
        <input
          value={person.firstName}
          onChange={handleFirstNameChange}
        />
      </label>
      <label>
        Last name:
        <input
          value={person.lastName}
          onChange={handleLastNameChange}
        />
      </label>
      <label>
        Email:
        <input
          value={person.email}
          onChange={handleEmailChange}
        />
      </label>
      <p>
        {person.firstName}{' '}
        {person.lastName}{' '}
        ({person.email})
      </p>
    </>
  );
}
```

```css
label { display: block; }
input { margin-left: 5px; margin-bottom: 5px; }
```

</Sandpack>

Например, эта строка изменяет состояние из прошлого рендера:

```js
person.firstName = e.target.value;
```

Надежный способ добиться нужного поведения - создать новый объект и передать его в `setPerson`. Но здесь вы хотите также **скопировать в него существующие данные**, поскольку изменилось только одно из полей:

```js
setPerson({
  firstName: e.target.value, // New first name from the input
  lastName: person.lastName,
  email: person.email
});
```

Вы можете использовать синтаксис `...` [распространение объекта](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Spread_syntax#spread_in_object_literals), чтобы не копировать каждое свойство отдельно.

```js
setPerson({
  ...person, // Copy the old fields
  firstName: e.target.value // But override this one
});
```

Теперь форма работает!

Обратите внимание, что вы не стали объявлять отдельную переменную состояния для каждого поля ввода. Для больших форм хранить все данные, сгруппированные в одном объекте, очень удобно - при условии, что вы правильно их обновляете!


<details>
<summary><small>(eng)</small></summary>

For example, this line mutates the state from a past render:

```js
person.firstName = e.target.value;
```

The reliable way to get the behavior you're looking for is to create a new object and pass it to `setPerson`. But here, you want to also **copy the existing data into it** because only one of the fields has changed:

```js
setPerson({
  firstName: e.target.value, // New first name from the input
  lastName: person.lastName,
  email: person.email
});
```

You can use the `...` [object spread](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Spread_syntax#spread_in_object_literals) syntax so that you don't need to copy every property separately.

```js
setPerson({
  ...person, // Copy the old fields
  firstName: e.target.value // But override this one
});
```

Now the form works! 

Notice how you didn't declare a separate state variable for each input field. For large forms, keeping all data grouped in an object is very convenient--as long as you update it correctly!

</details>

<Sandpack>

```js
import { useState } from 'react';

export default function Form() {
  const [person, setPerson] = useState({
    firstName: 'Barbara',
    lastName: 'Hepworth',
    email: 'bhepworth@sculpture.com'
  });

  function handleFirstNameChange(e) {
    setPerson({
      ...person,
      firstName: e.target.value
    });
  }

  function handleLastNameChange(e) {
    setPerson({
      ...person,
      lastName: e.target.value
    });
  }

  function handleEmailChange(e) {
    setPerson({
      ...person,
      email: e.target.value
    });
  }

  return (
    <>
      <label>
        First name:
        <input
          value={person.firstName}
          onChange={handleFirstNameChange}
        />
      </label>
      <label>
        Last name:
        <input
          value={person.lastName}
          onChange={handleLastNameChange}
        />
      </label>
      <label>
        Email:
        <input
          value={person.email}
          onChange={handleEmailChange}
        />
      </label>
      <p>
        {person.firstName}{' '}
        {person.lastName}{' '}
        ({person.email})
      </p>
    </>
  );
}
```

```css
label { display: block; }
input { margin-left: 5px; margin-bottom: 5px; }
```

</Sandpack>

Обратите внимание, что синтаксис распространения `...` является "неглубоким" - он копирует объекты только на один уровень вглубь. Это делает его быстрым, но это также означает, что если вы хотите обновить вложенное свойство, вам придется использовать его более одного раза.


<details>
<summary><small>(eng)</small></summary>

Note that the `...` spread syntax is "shallow"--it only copies things one level deep. This makes it fast, but it also means that if you want to update a nested property, you'll have to use it more than once. 

</details>

<DeepDive>

#### Using a single event handler for multiple fields {/*using-a-single-event-handler-for-multiple-fields*/}

Вы также можете использовать скобки `[` и `]` внутри определения объекта, чтобы указать свойство с динамическим именем. Вот тот же пример, но с одним обработчиком событий вместо трех разных:


<details>
<summary><small>(eng)</small></summary>

<b>Using a single event handler for multiple fields :</b>
You can also use the `[` and `]` braces inside your object definition to specify a property with a dynamic name. Here is the same example, but with a single event handler instead of three different ones:

</details>

<Sandpack>

```js
import { useState } from 'react';

export default function Form() {
  const [person, setPerson] = useState({
    firstName: 'Barbara',
    lastName: 'Hepworth',
    email: 'bhepworth@sculpture.com'
  });

  function handleChange(e) {
    setPerson({
      ...person,
      [e.target.name]: e.target.value
    });
  }

  return (
    <>
      <label>
        First name:
        <input
          name="firstName"
          value={person.firstName}
          onChange={handleChange}
        />
      </label>
      <label>
        Last name:
        <input
          name="lastName"
          value={person.lastName}
          onChange={handleChange}
        />
      </label>
      <label>
        Email:
        <input
          name="email"
          value={person.email}
          onChange={handleChange}
        />
      </label>
      <p>
        {person.firstName}{' '}
        {person.lastName}{' '}
        ({person.email})
      </p>
    </>
  );
}
```

```css
label { display: block; }
input { margin-left: 5px; margin-bottom: 5px; }
```

</Sandpack>

Здесь `e.target.name` ссылается на свойство `name`, заданное элементу DOM `<input>`.


<details>
<summary><small>(eng)</small></summary>

Here, `e.target.name` refers to the `name` property given to the `<input>` DOM element.

</details>

</DeepDive>

## Updating a nested object {/*updating-a-nested-object*/}

Рассмотрим вложенную структуру объектов следующим образом:

```js
const [person, setPerson] = useState({
  name: 'Niki de Saint Phalle',
  artwork: {
    title: 'Blue Nana',
    city: 'Hamburg',
    image: 'https://i.imgur.com/Sd1AgUOm.jpg',
  }
});
```

Если вы хотите обновить `person.artwork.city`, то понятно, как это сделать с помощью мутации:

```js
person.artwork.city = 'New Delhi';
```

Но в React состояние считается неизменяемым! Чтобы изменить `city`, вам нужно сначала создать новый объект `artwork` (предварительно заполнив его данными из предыдущего), а затем создать новый объект `person`, который будет указывать на новый `artwork`:

```js
const nextArtwork = { ...person.artwork, city: 'New Delhi' };
const nextPerson = { ...person, artwork: nextArtwork };
setPerson(nextPerson);
```

Или записанный в виде одного вызова функции:

```js
setPerson({
  ...person, // Copy other fields
  artwork: { // but replace the artwork
    ...person.artwork, // with the same one
    city: 'New Delhi' // but in New Delhi!
  }
});
```

Это немного многословно, но для многих случаев подходит:


<details>
<summary><small>(eng)</small></summary>

<b>Updating a nested object :</b>
Consider a nested object structure like this:

```js
const [person, setPerson] = useState({
  name: 'Niki de Saint Phalle',
  artwork: {
    title: 'Blue Nana',
    city: 'Hamburg',
    image: 'https://i.imgur.com/Sd1AgUOm.jpg',
  }
});
```

If you wanted to update `person.artwork.city`, it's clear how to do it with mutation:

```js
person.artwork.city = 'New Delhi';
```

But in React, you treat state as immutable! In order to change `city`, you would first need to produce the new `artwork` object (pre-populated with data from the previous one), and then produce the new `person` object which points at the new `artwork`:

```js
const nextArtwork = { ...person.artwork, city: 'New Delhi' };
const nextPerson = { ...person, artwork: nextArtwork };
setPerson(nextPerson);
```

Or, written as a single function call:

```js
setPerson({
  ...person, // Copy other fields
  artwork: { // but replace the artwork
    ...person.artwork, // with the same one
    city: 'New Delhi' // but in New Delhi!
  }
});
```

This gets a bit wordy, but it works fine for many cases:

</details>

<Sandpack>

```js
import { useState } from 'react';

export default function Form() {
  const [person, setPerson] = useState({
    name: 'Niki de Saint Phalle',
    artwork: {
      title: 'Blue Nana',
      city: 'Hamburg',
      image: 'https://i.imgur.com/Sd1AgUOm.jpg',
    }
  });

  function handleNameChange(e) {
    setPerson({
      ...person,
      name: e.target.value
    });
  }

  function handleTitleChange(e) {
    setPerson({
      ...person,
      artwork: {
        ...person.artwork,
        title: e.target.value
      }
    });
  }

  function handleCityChange(e) {
    setPerson({
      ...person,
      artwork: {
        ...person.artwork,
        city: e.target.value
      }
    });
  }

  function handleImageChange(e) {
    setPerson({
      ...person,
      artwork: {
        ...person.artwork,
        image: e.target.value
      }
    });
  }

  return (
    <>
      <label>
        Name:
        <input
          value={person.name}
          onChange={handleNameChange}
        />
      </label>
      <label>
        Title:
        <input
          value={person.artwork.title}
          onChange={handleTitleChange}
        />
      </label>
      <label>
        City:
        <input
          value={person.artwork.city}
          onChange={handleCityChange}
        />
      </label>
      <label>
        Image:
        <input
          value={person.artwork.image}
          onChange={handleImageChange}
        />
      </label>
      <p>
        <i>{person.artwork.title}</i>
        {' by '}
        {person.name}
        <br />
        (located in {person.artwork.city})
      </p>
      <img 
        src={person.artwork.image} 
        alt={person.artwork.title}
      />
    </>
  );
}
```

```css
label { display: block; }
input { margin-left: 5px; margin-bottom: 5px; }
img { width: 200px; height: 200px; }
```

</Sandpack>

<DeepDive>

#### Objects are not really nested {/*objects-are-not-really-nested*/}

Такой объект появляется "вложенным" в код:

```js
let obj = {
  name: 'Niki de Saint Phalle',
  artwork: {
    title: 'Blue Nana',
    city: 'Hamburg',
    image: 'https://i.imgur.com/Sd1AgUOm.jpg',
  }
};
```

Однако "вложенность" - это неточное представление о том, как ведут себя объекты. Когда код выполняется, не существует такого понятия, как "вложенный" объект. На самом деле перед вами два разных объекта:

```js
let obj1 = {
  title: 'Blue Nana',
  city: 'Hamburg',
  image: 'https://i.imgur.com/Sd1AgUOm.jpg',
};

let obj2 = {
  name: 'Niki de Saint Phalle',
  artwork: obj1
};
```

Объект `obj1` не находится "внутри" `obj2`. Например, `obj3` может "указывать" и на `obj1`:

```js
let obj1 = {
  title: 'Blue Nana',
  city: 'Hamburg',
  image: 'https://i.imgur.com/Sd1AgUOm.jpg',
};

let obj2 = {
  name: 'Niki de Saint Phalle',
  artwork: obj1
};

let obj3 = {
  name: 'Copycat',
  artwork: obj1
};
```

Если бы вы мутировали `obj3.artwork.city`, это повлияло бы и на `obj2.artwork.city`, и на `obj1.city`. Это происходит потому, что `obj3.artwork`, `obj2.artwork` и `obj1` являются одним и тем же объектом. Это трудно понять, если рассматривать объекты как "вложенные". Вместо этого они представляют собой отдельные объекты, "указывающие" друг на друга с помощью свойств.


<details>
<summary><small>(eng)</small></summary>

<b>Objects are not really nested :</b>
An object like this appears "nested" in code:

```js
let obj = {
  name: 'Niki de Saint Phalle',
  artwork: {
    title: 'Blue Nana',
    city: 'Hamburg',
    image: 'https://i.imgur.com/Sd1AgUOm.jpg',
  }
};
```

However, "nesting" is an inaccurate way to think about how objects behave. When the code executes, there is no such thing as a "nested" object. You are really looking at two different objects:

```js
let obj1 = {
  title: 'Blue Nana',
  city: 'Hamburg',
  image: 'https://i.imgur.com/Sd1AgUOm.jpg',
};

let obj2 = {
  name: 'Niki de Saint Phalle',
  artwork: obj1
};
```

The `obj1` object is not "inside" `obj2`. For example, `obj3` could "point" at `obj1` too:

```js
let obj1 = {
  title: 'Blue Nana',
  city: 'Hamburg',
  image: 'https://i.imgur.com/Sd1AgUOm.jpg',
};

let obj2 = {
  name: 'Niki de Saint Phalle',
  artwork: obj1
};

let obj3 = {
  name: 'Copycat',
  artwork: obj1
};
```

If you were to mutate `obj3.artwork.city`, it would affect both `obj2.artwork.city` and `obj1.city`. This is because `obj3.artwork`, `obj2.artwork`, and `obj1` are the same object. This is difficult to see when you think of objects as "nested". Instead, they are separate objects "pointing" at each other with properties.

</details>

</DeepDive>  

### Write concise update logic with Immer {/*write-concise-update-logic-with-immer*/}

Если ваши состояния глубоко вложены, вам стоит подумать о [сглаживании](/learn/choosing-the-state-structure#avoid-deeply-nested-state). Но если вы не хотите менять структуру состояний, вы можете предпочесть короткий путь к вложенным разворотам. [Immer](https://github.com/immerjs/use-immer) - популярная библиотека, которая позволяет писать, используя удобный, но мутирующий синтаксис, и заботится о создании копий за вас. С Immer код, который вы пишете, выглядит так, будто вы "нарушаете правила" и мутируете объект:

```js
updatePerson(draft => {
  draft.artwork.city = 'Lagos';
});
```

Но в отличие от обычной мутации, она не переписывает прошлое состояние!


<details>
<summary><small>(eng)</small></summary>

<b>Write concise update logic with Immer :</b>
If your state is deeply nested, you might want to consider [flattening it.](/learn/choosing-the-state-structure#avoid-deeply-nested-state) But, if you don't want to change your state structure, you might prefer a shortcut to nested spreads. [Immer](https://github.com/immerjs/use-immer) is a popular library that lets you write using the convenient but mutating syntax and takes care of producing the copies for you. With Immer, the code you write looks like you are "breaking the rules" and mutating an object:

```js
updatePerson(draft => {
  draft.artwork.city = 'Lagos';
});
```

But unlike a regular mutation, it doesn't overwrite the past state!

</details>

<DeepDive>

#### How does Immer work? {/*how-does-immer-work*/}

Черновик", предоставляемый Immer, - это особый тип объекта, называемый [Proxy](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Proxy), который "записывает" то, что вы с ним делаете. Именно поэтому вы можете свободно мутировать его сколько угодно! Под капотом Immer выясняет, какие части `черновика` были изменены, и создает совершенно новый объект, содержащий ваши правки.


<details>
<summary><small>(eng)</small></summary>

<b>How does Immer work? :</b>
The `draft` provided by Immer is a special type of object, called a [Proxy](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Proxy), that "records" what you do with it. This is why you can mutate it freely as much as you like! Under the hood, Immer figures out which parts of the `draft` have been changed, and produces a completely new object that contains your edits.

</details>

</DeepDive>

Чтобы попробовать Immer:

1. Запустите `npm install use-immer`, чтобы добавить Immer в качестве зависимости.
2. Затем замените `import { useState } из 'react'` на `import { useImmer } из 'use-immer'`.

Вот пример выше, преобразованный в Immer:


<details>
<summary><small>(eng)</small></summary>

To try Immer:

1. Run `npm install use-immer` to add Immer as a dependency
2. Then replace `import { useState } from 'react'` with `import { useImmer } from 'use-immer'`

Here is the above example converted to Immer:

</details>

<Sandpack>

```js
import { useImmer } from 'use-immer';

export default function Form() {
  const [person, updatePerson] = useImmer({
    name: 'Niki de Saint Phalle',
    artwork: {
      title: 'Blue Nana',
      city: 'Hamburg',
      image: 'https://i.imgur.com/Sd1AgUOm.jpg',
    }
  });

  function handleNameChange(e) {
    updatePerson(draft => {
      draft.name = e.target.value;
    });
  }

  function handleTitleChange(e) {
    updatePerson(draft => {
      draft.artwork.title = e.target.value;
    });
  }

  function handleCityChange(e) {
    updatePerson(draft => {
      draft.artwork.city = e.target.value;
    });
  }

  function handleImageChange(e) {
    updatePerson(draft => {
      draft.artwork.image = e.target.value;
    });
  }

  return (
    <>
      <label>
        Name:
        <input
          value={person.name}
          onChange={handleNameChange}
        />
      </label>
      <label>
        Title:
        <input
          value={person.artwork.title}
          onChange={handleTitleChange}
        />
      </label>
      <label>
        City:
        <input
          value={person.artwork.city}
          onChange={handleCityChange}
        />
      </label>
      <label>
        Image:
        <input
          value={person.artwork.image}
          onChange={handleImageChange}
        />
      </label>
      <p>
        <i>{person.artwork.title}</i>
        {' by '}
        {person.name}
        <br />
        (located in {person.artwork.city})
      </p>
      <img 
        src={person.artwork.image} 
        alt={person.artwork.title}
      />
    </>
  );
}
```

```json package.json
{
  "dependencies": {
    "immer": "1.7.3",
    "react": "latest",
    "react-dom": "latest",
    "react-scripts": "latest",
    "use-immer": "0.5.1"
  },
  "scripts": {
    "start": "react-scripts start",
    "build": "react-scripts build",
    "test": "react-scripts test --env=jsdom",
    "eject": "react-scripts eject"
  }
}
```

```css
label { display: block; }
input { margin-left: 5px; margin-bottom: 5px; }
img { width: 200px; height: 200px; }
```

</Sandpack>

Обратите внимание, насколько более лаконичными стали обработчики событий. Вы можете смешивать и сочетать `useState` и `useImmer` в одном компоненте сколько угодно. Immer - отличный способ сохранить обработчики обновлений лаконичными, особенно если в вашем состоянии есть вложенность, и копирование объектов приводит к повторяющемуся коду.


<details>
<summary><small>(eng)</small></summary>

Notice how much more concise the event handlers have become. You can mix and match `useState` and `useImmer` in a single component as much as you like. Immer is a great way to keep the update handlers concise, especially if there's nesting in your state, and copying objects leads to repetitive code.

</details>

<DeepDive>

#### Why is mutating state not recommended in React? {/*why-is-mutating-state-not-recommended-in-react*/}

На это есть несколько причин:

* ** Отладка:** Если вы используете `console.log` и не мутируете состояние, ваши прошлые логи не будут забиты более поздними изменениями состояния. Таким образом, вы можете четко видеть, как изменялось состояние между рендерами.
* **Оптимизации:** Обычные [стратегии оптимизации] React (/reference/react/memo) полагаются на пропуск работы, если предыдущие реквизиты или состояние совпадают с последующими. Если вы никогда не изменяете состояние, то проверить, были ли изменения, можно очень быстро. Если `prevObj === obj`, вы можете быть уверены, что внутри него ничего не могло измениться.
* **Новые возможности:** Новые функции React, которые мы создаём, полагаются на то, что состояние будет [рассматриваться как снимок](/learn/state-as-a-snapshot). Если вы мутируете прошлые версии состояния, это может помешать вам использовать новые возможности.
* **Изменения требований:** Некоторые функции приложения, такие как реализация Undo/Redo, показ истории изменений или предоставление пользователю возможности вернуть форму к прежним значениям, проще реализовать, когда ничего не мутирует. Это происходит потому, что вы можете хранить в памяти прошлые копии состояния и использовать их повторно, когда это необходимо. Если вы начнете с мутативного подхода, такие возможности, как эта, будет сложно добавить позже.
* **Простая реализация:** Поскольку React не полагается на мутацию, ему не нужно делать ничего особенного с вашими объектами. Ему не нужно перехватывать их свойства, всегда оборачивать их в прокси или выполнять другую работу при инициализации, как это делают многие "реактивные" решения. Именно поэтому React позволяет вам поместить любой объект в состояние - независимо от его размера - без дополнительных проблем с производительностью и корректностью.

На практике вы часто можете "уйти" от мутирования состояния в React, но мы настоятельно рекомендуем вам не делать этого, чтобы вы могли использовать новые функции React, разработанные с учетом этого подхода. Будущие разработчики и, возможно, даже вы сами будете благодарны!


<details>
<summary><small>(eng)</small></summary>

<b>Why is mutating state not recommended in React? :</b>
There are a few reasons:

* **Debugging:** If you use `console.log` and don't mutate state, your past logs won't get clobbered by the more recent state changes. So you can clearly see how state has changed between renders.
* **Optimizations:** Common React [optimization strategies](/reference/react/memo) rely on skipping work if previous props or state are the same as the next ones. If you never mutate state, it is very fast to check whether there were any changes. If `prevObj === obj`, you can be sure that nothing could have changed inside of it.
* **New Features:** The new React features we're building rely on state being [treated like a snapshot.](/learn/state-as-a-snapshot) If you're mutating past versions of state, that may prevent you from using the new features.
* **Requirement Changes:** Some application features, like implementing Undo/Redo, showing a history of changes, or letting the user reset a form to earlier values, are easier to do when nothing is mutated. This is because you can keep past copies of state in memory, and reuse them when appropriate. If you start with a mutative approach, features like this can be difficult to add later on.
* **Simpler Implementation:** Because React does not rely on mutation, it does not need to do anything special with your objects. It does not need to hijack their properties, always wrap them into Proxies, or do other work at initialization as many "reactive" solutions do. This is also why React lets you put any object into state--no matter how large--without additional performance or correctness pitfalls.

In practice, you can often "get away" with mutating state in React, but we strongly advise you not to do that so that you can use new React features developed with this approach in mind. Future contributors and perhaps even your future self will thank you!

</details>

</DeepDive>

<Recap>

* Рассматривайте все состояния в React как неизменяемые.
* Когда вы храните объекты в состоянии, их мутирование не вызовет рендеринга и изменит состояние в предыдущих "снимках" рендера.
* Вместо того чтобы мутировать объект, создайте его *новую* версию и вызовите повторный рендер, установив для нее состояние.
* Для создания копий объектов можно использовать синтаксис распространения объектов `{...obj, something: 'newValue'}`.
* Синтаксис распространения неглубокий: он копирует только один уровень в глубину.
* Чтобы обновить вложенный объект, вам нужно создать копии на всех уровнях, начиная с того, который вы обновляете.
* Чтобы уменьшить количество повторяющегося кода копирования, используйте Immer.


<details>
<summary><small>(eng)</small></summary>

* Treat all state in React as immutable.
* When you store objects in state, mutating them will not trigger renders and will change the state in previous render "snapshots".
* Instead of mutating an object, create a *new* version of it, and trigger a re-render by setting state to it.
* You can use the `{...obj, something: 'newValue'}` object spread syntax to create copies of objects.
* Spread syntax is shallow: it only copies one level deep.
* To update a nested object, you need to create copies all the way up from the place you're updating.
* To reduce repetitive copying code, use Immer.

</details>

</Recap>



<Challenges>

#### Fix incorrect state updates {/*fix-incorrect-state-updates*/}

В этой форме есть несколько ошибок. Несколько раз нажмите на кнопку, увеличивающую оценку. Заметьте, что он не увеличивается. Затем отредактируйте имя и фамилию и заметите, что оценка внезапно "подхватила" ваши изменения. Наконец, отредактируйте фамилию, и вы заметите, что оценка полностью исчезла.

Ваша задача - исправить все эти ошибки. По мере исправления объясняйте, почему происходит каждая из них.


<details>
<summary><small>(eng)</small></summary>

<b>Fix incorrect state updates :</b>
This form has a few bugs. Click the button that increases the score a few times. Notice that it does not increase. Then edit the first name, and notice that the score has suddenly "caught up" with your changes. Finally, edit the last name, and notice that the score has disappeared completely.

Your task is to fix all of these bugs. As you fix them, explain why each of them happens.

</details>

<Sandpack>

```js
import { useState } from 'react';

export default function Scoreboard() {
  const [player, setPlayer] = useState({
    firstName: 'Ranjani',
    lastName: 'Shettar',
    score: 10,
  });

  function handlePlusClick() {
    player.score++;
  }

  function handleFirstNameChange(e) {
    setPlayer({
      ...player,
      firstName: e.target.value,
    });
  }

  function handleLastNameChange(e) {
    setPlayer({
      lastName: e.target.value
    });
  }

  return (
    <>
      <label>
        Score: <b>{player.score}</b>
        {' '}
        <button onClick={handlePlusClick}>
          +1
        </button>
      </label>
      <label>
        First name:
        <input
          value={player.firstName}
          onChange={handleFirstNameChange}
        />
      </label>
      <label>
        Last name:
        <input
          value={player.lastName}
          onChange={handleLastNameChange}
        />
      </label>
    </>
  );
}
```

```css
label { display: block; margin-bottom: 10px; }
input { margin-left: 5px; margin-bottom: 5px; }
```

</Sandpack>

<Solution>

Вот версия, в которой исправлены обе ошибки:


<details>
<summary><small>(eng)</small></summary>

Here is a version with both bugs fixed:

</details>

<Sandpack>

```js
import { useState } from 'react';

export default function Scoreboard() {
  const [player, setPlayer] = useState({
    firstName: 'Ranjani',
    lastName: 'Shettar',
    score: 10,
  });

  function handlePlusClick() {
    setPlayer({
      ...player,
      score: player.score + 1,
    });
  }

  function handleFirstNameChange(e) {
    setPlayer({
      ...player,
      firstName: e.target.value,
    });
  }

  function handleLastNameChange(e) {
    setPlayer({
      ...player,
      lastName: e.target.value
    });
  }

  return (
    <>
      <label>
        Score: <b>{player.score}</b>
        {' '}
        <button onClick={handlePlusClick}>
          +1
        </button>
      </label>
      <label>
        First name:
        <input
          value={player.firstName}
          onChange={handleFirstNameChange}
        />
      </label>
      <label>
        Last name:
        <input
          value={player.lastName}
          onChange={handleLastNameChange}
        />
      </label>
    </>
  );
}
```

```css
label { display: block; }
input { margin-left: 5px; margin-bottom: 5px; }
```

</Sandpack>

Проблема с `handlePlusClick` заключалась в том, что он мутировал объект `player`. В результате React не знал, что есть причина для повторного рендеринга, и не обновлял счет на экране. Вот почему, когда вы редактировали имя, состояние обновлялось, вызывая повторный рендеринг, который _также_ обновлял счет на экране.

Проблема с `handleLastNameChange` заключалась в том, что она не копировала существующие поля `...player` в новый объект. Именно поэтому счет терялся после редактирования фамилии.


<details>
<summary><small>(eng)</small></summary>

The problem with `handlePlusClick` was that it mutated the `player` object. As a result, React did not know that there's a reason to re-render, and did not update the score on the screen. This is why, when you edited the first name, the state got updated, triggering a re-render which _also_ updated the score on the screen.

The problem with `handleLastNameChange` was that it did not copy the existing `...player` fields into the new object. This is why the score got lost after you edited the last name.

</details>

</Solution>

#### Find and fix the mutation {/*find-and-fix-the-mutation*/}

На статичном фоне находится перетаскиваемая коробка. Цвет поля можно изменить с помощью кнопки выбора.

Но есть ошибка. Если сначала переместить бокс, а затем изменить его цвет, фон (который не должен двигаться!) "перескочит" на позицию бокса. Но этого не должно происходить: параметр `позиции` `Background` установлен в `initialPosition`, что равно `{ x: 0, y: 0 }`. Почему фон перемещается после смены цвета?

Найдите ошибку и исправьте ее.

<Hint>

Если меняется что-то неожиданное, значит, произошла мутация. Найдите мутацию в файле `App.js` и исправьте ее.

</Hint>


<details>
<summary><small>(eng)</small></summary>

<b>Find and fix the mutation :</b>
There is a draggable box on a static background. You can change the box's color using the select input.

But there is a bug. If you move the box first, and then change its color, the background (which isn't supposed to move!) will "jump" to the box position. But this should not happen: the `Background`'s `position` prop is set to `initialPosition`, which is `{ x: 0, y: 0 }`. Why is the background moving after the color change?

Find the bug and fix it.

<Hint>

If something unexpected changes, there is a mutation. Find the mutation in `App.js` and fix it.

</Hint>

</details>

<Sandpack>

```js src/App.js
import { useState } from 'react';
import Background from './Background.js';
import Box from './Box.js';

const initialPosition = {
  x: 0,
  y: 0
};

export default function Canvas() {
  const [shape, setShape] = useState({
    color: 'orange',
    position: initialPosition
  });

  function handleMove(dx, dy) {
    shape.position.x += dx;
    shape.position.y += dy;
  }

  function handleColorChange(e) {
    setShape({
      ...shape,
      color: e.target.value
    });
  }

  return (
    <>
      <select
        value={shape.color}
        onChange={handleColorChange}
      >
        <option value="orange">orange</option>
        <option value="lightpink">lightpink</option>
        <option value="aliceblue">aliceblue</option>
      </select>
      <Background
        position={initialPosition}
      />
      <Box
        color={shape.color}
        position={shape.position}
        onMove={handleMove}
      >
        Drag me!
      </Box>
    </>
  );
}
```

```js src/Box.js
import { useState } from 'react';

export default function Box({
  children,
  color,
  position,
  onMove
}) {
  const [
    lastCoordinates,
    setLastCoordinates
  ] = useState(null);

  function handlePointerDown(e) {
    e.target.setPointerCapture(e.pointerId);
    setLastCoordinates({
      x: e.clientX,
      y: e.clientY,
    });
  }

  function handlePointerMove(e) {
    if (lastCoordinates) {
      setLastCoordinates({
        x: e.clientX,
        y: e.clientY,
      });
      const dx = e.clientX - lastCoordinates.x;
      const dy = e.clientY - lastCoordinates.y;
      onMove(dx, dy);
    }
  }

  function handlePointerUp(e) {
    setLastCoordinates(null);
  }

  return (
    <div
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      style={{
        width: 100,
        height: 100,
        cursor: 'grab',
        backgroundColor: color,
        position: 'absolute',
        border: '1px solid black',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        transform: `translate(
          ${position.x}px,
          ${position.y}px
        )`,
      }}
    >{children}</div>
  );
}
```

```js src/Background.js
export default function Background({
  position
}) {
  return (
    <div style={{
      position: 'absolute',
      transform: `translate(
        ${position.x}px,
        ${position.y}px
      )`,
      width: 250,
      height: 250,
      backgroundColor: 'rgba(200, 200, 0, 0.2)',
    }} />
  );
};
```

```css
body { height: 280px; }
select { margin-bottom: 10px; }
```

</Sandpack>

<Solution>

Проблема заключалась в мутации внутри `handleMove`. Она мутировала `shape.position`, но это тот же объект, на который указывает `initialPosition`. Поэтому и форма, и фон перемещаются. (Это мутация, поэтому изменения не отражаются на экране до тех пор, пока не произойдет не связанное с ними обновление - изменение цвета - вызывающее повторный рендеринг).

Исправление состоит в том, чтобы удалить мутацию из `handleMove` и использовать синтаксис распространения для копирования фигуры. Обратите внимание, что `+=` - это мутация, поэтому вам нужно переписать ее, чтобы использовать обычную операцию `+`.


<details>
<summary><small>(eng)</small></summary>

The problem was in the mutation inside `handleMove`. It mutated `shape.position`, but that's the same object that `initialPosition` points at. This is why both the shape and the background move. (It's a mutation, so the change doesn't reflect on the screen until an unrelated update--the color change--triggers a re-render.)

The fix is to remove the mutation from `handleMove`, and use the spread syntax to copy the shape. Note that `+=` is a mutation, so you need to rewrite it to use a regular `+` operation.

</details>

<Sandpack>

```js src/App.js
import { useState } from 'react';
import Background from './Background.js';
import Box from './Box.js';

const initialPosition = {
  x: 0,
  y: 0
};

export default function Canvas() {
  const [shape, setShape] = useState({
    color: 'orange',
    position: initialPosition
  });

  function handleMove(dx, dy) {
    setShape({
      ...shape,
      position: {
        x: shape.position.x + dx,
        y: shape.position.y + dy,
      }
    });
  }

  function handleColorChange(e) {
    setShape({
      ...shape,
      color: e.target.value
    });
  }

  return (
    <>
      <select
        value={shape.color}
        onChange={handleColorChange}
      >
        <option value="orange">orange</option>
        <option value="lightpink">lightpink</option>
        <option value="aliceblue">aliceblue</option>
      </select>
      <Background
        position={initialPosition}
      />
      <Box
        color={shape.color}
        position={shape.position}
        onMove={handleMove}
      >
        Drag me!
      </Box>
    </>
  );
}
```

```js src/Box.js
import { useState } from 'react';

export default function Box({
  children,
  color,
  position,
  onMove
}) {
  const [
    lastCoordinates,
    setLastCoordinates
  ] = useState(null);

  function handlePointerDown(e) {
    e.target.setPointerCapture(e.pointerId);
    setLastCoordinates({
      x: e.clientX,
      y: e.clientY,
    });
  }

  function handlePointerMove(e) {
    if (lastCoordinates) {
      setLastCoordinates({
        x: e.clientX,
        y: e.clientY,
      });
      const dx = e.clientX - lastCoordinates.x;
      const dy = e.clientY - lastCoordinates.y;
      onMove(dx, dy);
    }
  }

  function handlePointerUp(e) {
    setLastCoordinates(null);
  }

  return (
    <div
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      style={{
        width: 100,
        height: 100,
        cursor: 'grab',
        backgroundColor: color,
        position: 'absolute',
        border: '1px solid black',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        transform: `translate(
          ${position.x}px,
          ${position.y}px
        )`,
      }}
    >{children}</div>
  );
}
```

```js src/Background.js
export default function Background({
  position
}) {
  return (
    <div style={{
      position: 'absolute',
      transform: `translate(
        ${position.x}px,
        ${position.y}px
      )`,
      width: 250,
      height: 250,
      backgroundColor: 'rgba(200, 200, 0, 0.2)',
    }} />
  );
};
```

```css
body { height: 280px; }
select { margin-bottom: 10px; }
```

</Sandpack>

</Solution>

#### Update an object with Immer {/*update-an-object-with-immer*/}

Это тот же пример с ошибками, что и в предыдущей задаче. На этот раз исправьте мутацию с помощью Immer. Для вашего удобства функция `useImmer` уже импортирована, поэтому вам нужно изменить переменную состояния `shape`, чтобы использовать ее.


<details>
<summary><small>(eng)</small></summary>

<b>Update an object with Immer :</b>
This is the same buggy example as in the previous challenge. This time, fix the mutation by using Immer. For your convenience, `useImmer` is already imported, so you need to change the `shape` state variable to use it.

</details>

<Sandpack>

```js src/App.js
import { useState } from 'react';
import { useImmer } from 'use-immer';
import Background from './Background.js';
import Box from './Box.js';

const initialPosition = {
  x: 0,
  y: 0
};

export default function Canvas() {
  const [shape, setShape] = useState({
    color: 'orange',
    position: initialPosition
  });

  function handleMove(dx, dy) {
    shape.position.x += dx;
    shape.position.y += dy;
  }

  function handleColorChange(e) {
    setShape({
      ...shape,
      color: e.target.value
    });
  }

  return (
    <>
      <select
        value={shape.color}
        onChange={handleColorChange}
      >
        <option value="orange">orange</option>
        <option value="lightpink">lightpink</option>
        <option value="aliceblue">aliceblue</option>
      </select>
      <Background
        position={initialPosition}
      />
      <Box
        color={shape.color}
        position={shape.position}
        onMove={handleMove}
      >
        Drag me!
      </Box>
    </>
  );
}
```

```js src/Box.js
import { useState } from 'react';

export default function Box({
  children,
  color,
  position,
  onMove
}) {
  const [
    lastCoordinates,
    setLastCoordinates
  ] = useState(null);

  function handlePointerDown(e) {
    e.target.setPointerCapture(e.pointerId);
    setLastCoordinates({
      x: e.clientX,
      y: e.clientY,
    });
  }

  function handlePointerMove(e) {
    if (lastCoordinates) {
      setLastCoordinates({
        x: e.clientX,
        y: e.clientY,
      });
      const dx = e.clientX - lastCoordinates.x;
      const dy = e.clientY - lastCoordinates.y;
      onMove(dx, dy);
    }
  }

  function handlePointerUp(e) {
    setLastCoordinates(null);
  }

  return (
    <div
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      style={{
        width: 100,
        height: 100,
        cursor: 'grab',
        backgroundColor: color,
        position: 'absolute',
        border: '1px solid black',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        transform: `translate(
          ${position.x}px,
          ${position.y}px
        )`,
      }}
    >{children}</div>
  );
}
```

```js src/Background.js
export default function Background({
  position
}) {
  return (
    <div style={{
      position: 'absolute',
      transform: `translate(
        ${position.x}px,
        ${position.y}px
      )`,
      width: 250,
      height: 250,
      backgroundColor: 'rgba(200, 200, 0, 0.2)',
    }} />
  );
};
```

```css
body { height: 280px; }
select { margin-bottom: 10px; }
```

```json package.json
{
  "dependencies": {
    "immer": "1.7.3",
    "react": "latest",
    "react-dom": "latest",
    "react-scripts": "latest",
    "use-immer": "0.5.1"
  },
  "scripts": {
    "start": "react-scripts start",
    "build": "react-scripts build",
    "test": "react-scripts test --env=jsdom",
    "eject": "react-scripts eject"
  }
}
```

</Sandpack>

<Solution>

Это решение, переписанное с помощью Immer. Обратите внимание, что обработчики событий написаны мутирующим образом, но ошибка не возникает. Это происходит потому, что под капотом Immer никогда не мутирует существующие объекты.


<details>
<summary><small>(eng)</small></summary>

This is the solution rewritten with Immer. Notice how the event handlers are written in a mutating fashion, but the bug does not occur. This is because under the hood, Immer never mutates the existing objects.

</details>

<Sandpack>

```js src/App.js
import { useImmer } from 'use-immer';
import Background from './Background.js';
import Box from './Box.js';

const initialPosition = {
  x: 0,
  y: 0
};

export default function Canvas() {
  const [shape, updateShape] = useImmer({
    color: 'orange',
    position: initialPosition
  });

  function handleMove(dx, dy) {
    updateShape(draft => {
      draft.position.x += dx;
      draft.position.y += dy;
    });
  }

  function handleColorChange(e) {
    updateShape(draft => {
      draft.color = e.target.value;
    });
  }

  return (
    <>
      <select
        value={shape.color}
        onChange={handleColorChange}
      >
        <option value="orange">orange</option>
        <option value="lightpink">lightpink</option>
        <option value="aliceblue">aliceblue</option>
      </select>
      <Background
        position={initialPosition}
      />
      <Box
        color={shape.color}
        position={shape.position}
        onMove={handleMove}
      >
        Drag me!
      </Box>
    </>
  );
}
```

```js src/Box.js
import { useState } from 'react';

export default function Box({
  children,
  color,
  position,
  onMove
}) {
  const [
    lastCoordinates,
    setLastCoordinates
  ] = useState(null);

  function handlePointerDown(e) {
    e.target.setPointerCapture(e.pointerId);
    setLastCoordinates({
      x: e.clientX,
      y: e.clientY,
    });
  }

  function handlePointerMove(e) {
    if (lastCoordinates) {
      setLastCoordinates({
        x: e.clientX,
        y: e.clientY,
      });
      const dx = e.clientX - lastCoordinates.x;
      const dy = e.clientY - lastCoordinates.y;
      onMove(dx, dy);
    }
  }

  function handlePointerUp(e) {
    setLastCoordinates(null);
  }

  return (
    <div
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      style={{
        width: 100,
        height: 100,
        cursor: 'grab',
        backgroundColor: color,
        position: 'absolute',
        border: '1px solid black',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        transform: `translate(
          ${position.x}px,
          ${position.y}px
        )`,
      }}
    >{children}</div>
  );
}
```

```js src/Background.js
export default function Background({
  position
}) {
  return (
    <div style={{
      position: 'absolute',
      transform: `translate(
        ${position.x}px,
        ${position.y}px
      )`,
      width: 250,
      height: 250,
      backgroundColor: 'rgba(200, 200, 0, 0.2)',
    }} />
  );
};
```

```css
body { height: 280px; }
select { margin-bottom: 10px; }
```

```json package.json
{
  "dependencies": {
    "immer": "1.7.3",
    "react": "latest",
    "react-dom": "latest",
    "react-scripts": "latest",
    "use-immer": "0.5.1"
  },
  "scripts": {
    "start": "react-scripts start",
    "build": "react-scripts build",
    "test": "react-scripts test --env=jsdom",
    "eject": "react-scripts eject"
  }
}
```

</Sandpack>

</Solution>

</Challenges>

