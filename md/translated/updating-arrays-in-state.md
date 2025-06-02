---
title: Updating Arrays in State
---

<Intro>

Массивы в JavaScript можно изменять, но при хранении их в state следует обращаться с ними как с неизменяемыми. Как и в случае с объектами, когда вы хотите обновить массив, хранящийся в состоянии, вам нужно создать новый (или сделать копию существующего), а затем установить состояние для использования нового массива.


<details>
<summary><small>(eng)</small></summary>

Arrays are mutable in JavaScript, but you should treat them as immutable when you store them in state. Just like with objects, when you want to update an array stored in state, you need to create a new one (or make a copy of an existing one), and then set state to use the new array.

</details>

</Intro>

<YouWillLearn>

- Как добавлять, удалять или изменять элементы в массиве в состоянии React
- Как обновить объект внутри массива
- Как сделать копирование массива менее повторяющимся с помощью Immer


<details>
<summary><small>(eng)</small></summary>

- How to add, remove, or change items in an array in React state
- How to update an object inside of an array
- How to make array copying less repetitive with Immer

</details>

</YouWillLearn>

## Обновление массивов без мутации{/*updating-arrays-without-mutation*/}

В JavaScript массивы - это просто еще один вид объектов. [Как и в случае с объектами](/learn/updating-objects-in-state), **вы должны рассматривать массивы в React state как доступные только для чтения.** Это означает, что вы не должны переназначать элементы внутри массива, например `arr[0] = 'bird'`, а также не должны использовать методы, изменяющие массив, такие как `push()` и `pop()`.

Вместо этого каждый раз, когда вы хотите обновить массив, вы должны передавать *новый* массив в вашу функцию установки состояния. Для этого вы можете создать новый массив из исходного массива вашего состояния, вызвав его не мутирующие методы, такие как `filter()` и `map()`. Затем вы можете установить свое состояние на полученный новый массив.

Вот справочная таблица распространенных операций с массивами. При работе с массивами внутри React state вам нужно избегать методов в левом столбце, а предпочесть методы в правом столбце:

| | избегайте (мутирует массив) | предпочитайте (возвращает новый массив) |
| --------- | ----------------------------------- | ------------------------------------------------------------------- |
| добавление | `push`, `unshift` | `concat`, `[...arr]` синтаксис распространения ([пример](#adding-to-an-array)) |
| удаление | `pop`, `shift`, ``splice` | `filter`, `lice` ([пример](#removing-from-an-array))              |
| замена | `splice`, `arr[i] = ...` назначение | `map` ([пример](#replacing-items-in-an-array))                     |
| сортировка | `reverse`, `sort` | сначала копируем массив ([пример](#making-other-changes-to-an-array)) |

В качестве альтернативы можно [использовать Immer](#write-concise-update-logic-with-immer), который позволяет использовать методы из обоих столбцов.


<details>
<summary><small>(eng)</small></summary>

<b>Updating arrays without mutation :</b>
In JavaScript, arrays are just another kind of object. [Like with objects](/learn/updating-objects-in-state), **you should treat arrays in React state as read-only.** This means that you shouldn't reassign items inside an array like `arr[0] = 'bird'`, and you also shouldn't use methods that mutate the array, such as `push()` and `pop()`.

Instead, every time you want to update an array, you'll want to pass a *new* array to your state setting function. To do that, you can create a new array from the original array in your state by calling its non-mutating methods like `filter()` and `map()`. Then you can set your state to the resulting new array.

Here is a reference table of common array operations. When dealing with arrays inside React state, you will need to avoid the methods in the left column, and instead prefer the methods in the right column:

|           | avoid (mutates the array)           | prefer (returns a new array)                                        |
| --------- | ----------------------------------- | ------------------------------------------------------------------- |
| adding    | `push`, `unshift`                   | `concat`, `[...arr]` spread syntax ([example](#adding-to-an-array)) |
| removing  | `pop`, `shift`, `splice`            | `filter`, `slice` ([example](#removing-from-an-array))              |
| replacing | `splice`, `arr[i] = ...` assignment | `map` ([example](#replacing-items-in-an-array))                     |
| sorting   | `reverse`, `sort`                   | copy the array first ([example](#making-other-changes-to-an-array)) |

Alternatively, you can [use Immer](#write-concise-update-logic-with-immer) which lets you use methods from both columns.

</details>

<Pitfall>

К сожалению, [`slice`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/slice) и [`splice`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/splice) называются одинаково, но являются совершенно разными:

* `slice` позволяет скопировать массив или его часть.
* `splice` **изменяет** массив (вставляет или удаляет элементы).

В React вы будете использовать `slice (без `p`!) гораздо чаще, потому что вы не хотите мутировать объекты или массивы в состоянии. В [Updating Objects](/learn/updating-objects-in-state) объясняется, что такое мутация и почему она не рекомендуется для состояния.


<details>
<summary><small>(eng)</small></summary>

Unfortunately, [`slice`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/slice) and [`splice`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/splice) are named similarly but are very different:

* `slice` lets you copy an array or a part of it.
* `splice` **mutates** the array (to insert or delete items).

In React, you will be using `slice` (no `p`!) a lot more often because you don't want to mutate objects or arrays in state. [Updating Objects](/learn/updating-objects-in-state) explains what mutation is and why it's not recommended for state.

</details>

</Pitfall>

### Добавление в массив{/*adding-to-an-array*/}

`push()` изменит массив, чего вы не хотите:


<details>
<summary><small>(eng)</small></summary>

<b>Adding to an array :</b>
`push()` will mutate an array, which you don't want:

</details>

<Sandpack>

```js
import { useState } from 'react';

let nextId = 0;

export default function List() {
  const [name, setName] = useState('');
  const [artists, setArtists] = useState([]);

  return (
    <>
      <h1>Inspiring sculptors:</h1>
      <input
        value={name}
        onChange={e => setName(e.target.value)}
      />
      <button onClick={() => {
        artists.push({
          id: nextId++,
          name: name,
        });
      }}>Add</button>
      <ul>
        {artists.map(artist => (
          <li key={artist.id}>{artist.name}</li>
        ))}
      </ul>
    </>
  );
}
```

```css
button { margin-left: 5px; }
```

</Sandpack>

Вместо этого создайте *новый* массив, содержащий существующие элементы *и* новый элемент в конце. Существует несколько способов сделать это, но самый простой - использовать синтаксис `...` [array spread](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Spread_syntax#spread_in_array_literals):

```js
setArtists( // Replace the state
  [ // with a new array
    ...artists, // that contains all the old items
    { id: nextId++, name: name } // and one new item at the end
  ]
);
```

Теперь он работает правильно:


<details>
<summary><small>(eng)</small></summary>

Instead, create a *new* array which contains the existing items *and* a new item at the end. There are multiple ways to do this, but the easiest one is to use the `...` [array spread](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Spread_syntax#spread_in_array_literals) syntax:

```js
setArtists( // Replace the state
  [ // with a new array
    ...artists, // that contains all the old items
    { id: nextId++, name: name } // and one new item at the end
  ]
);
```

Now it works correctly:

</details>

<Sandpack>

```js
import { useState } from 'react';

let nextId = 0;

export default function List() {
  const [name, setName] = useState('');
  const [artists, setArtists] = useState([]);

  return (
    <>
      <h1>Inspiring sculptors:</h1>
      <input
        value={name}
        onChange={e => setName(e.target.value)}
      />
      <button onClick={() => {
        setArtists([
          ...artists,
          { id: nextId++, name: name }
        ]);
      }}>Add</button>
      <ul>
        {artists.map(artist => (
          <li key={artist.id}>{artist.name}</li>
        ))}
      </ul>
    </>
  );
}
```

```css
button { margin-left: 5px; }
```

</Sandpack>

Синтаксис распространения массива также позволяет добавлять элемент, помещая его *перед* исходным `...artists`:

```js
setArtists([
  { id: nextId++, name: name },
  ...artists // Put old items at the end
]);
```

Таким образом, spread может выполнять работу как `push()`, добавляя в конец массива, так и `unshift()`, добавляя в начало массива. Попробуйте это в песочнице выше!


<details>
<summary><small>(eng)</small></summary>

The array spread syntax also lets you prepend an item by placing it *before* the original `...artists`:

```js
setArtists([
  { id: nextId++, name: name },
  ...artists // Put old items at the end
]);
```

In this way, spread can do the job of both `push()` by adding to the end of an array and `unshift()` by adding to the beginning of an array. Try it in the sandbox above!

</details>

### Удаление из массива{/*removing-from-an-array*/}

Самый простой способ удалить элемент из массива - это *отфильтровать его*. Другими словами, вы создадите новый массив, который не будет содержать этот элемент. Для этого используйте метод `filter`, например:


<details>
<summary><small>(eng)</small></summary>

<b>Removing from an array :</b>
The easiest way to remove an item from an array is to *filter it out*. In other words, you will produce a new array that will not contain that item. To do this, use the `filter` method, for example:

</details>

<Sandpack>

```js
import { useState } from 'react';

let initialArtists = [
  { id: 0, name: 'Marta Colvin Andrade' },
  { id: 1, name: 'Lamidi Olonade Fakeye'},
  { id: 2, name: 'Louise Nevelson'},
];

export default function List() {
  const [artists, setArtists] = useState(
    initialArtists
  );

  return (
    <>
      <h1>Inspiring sculptors:</h1>
      <ul>
        {artists.map(artist => (
          <li key={artist.id}>
            {artist.name}{' '}
            <button onClick={() => {
              setArtists(
                artists.filter(a =>
                  a.id !== artist.id
                )
              );
            }}>
              Delete
            </button>
          </li>
        ))}
      </ul>
    </>
  );
}
```

</Sandpack>

Несколько раз щелкните на кнопке "Удалить" и посмотрите на ее обработчик нажатия.

```js
setArtists(
  artists.filter(a => a.id !== artist.id)
);
```

Здесь `artists.filter(a => a.id !== artist.id)` означает "создать массив, состоящий из тех `артистов`, чьи ID отличаются от `artist.id`". Другими словами, при нажатии кнопки "Удалить" каждого артиста из массива будет отфильтровываться _этот_ артист, а затем будет запрошен повторный рендеринг с полученным массивом. Обратите внимание, что `filter` не изменяет исходный массив.


<details>
<summary><small>(eng)</small></summary>

Click the "Delete" button a few times, and look at its click handler.

```js
setArtists(
  artists.filter(a => a.id !== artist.id)
);
```

Here, `artists.filter(a => a.id !== artist.id)` means "create an array that consists of those `artists` whose IDs are different from `artist.id`". In other words, each artist's "Delete" button will filter _that_ artist out of the array, and then request a re-render with the resulting array. Note that `filter` does not modify the original array.

</details>

### Преобразование массива{/*transforming-an-array*/}

Если вы хотите изменить некоторые или все элементы массива, вы можете использовать `map()` для создания **нового** массива. Функция, которую вы передадите в `map`, может решать, что делать с каждым элементом, основываясь на его данных или индексе (или и том, и другом).

В этом примере массив содержит координаты двух кругов и квадрата. Когда вы нажимаете на кнопку, она перемещает только круги вниз на 50 пикселей. Для этого создается новый массив данных с помощью `map()`:


<details>
<summary><small>(eng)</small></summary>

<b>Transforming an array :</b>
If you want to change some or all items of the array, you can use `map()` to create a **new** array. The function you will pass to `map` can decide what to do with each item, based on its data or its index (or both).

In this example, an array holds coordinates of two circles and a square. When you press the button, it moves only the circles down by 50 pixels. It does this by producing a new array of data using `map()`:

</details>

<Sandpack>

```js
import { useState } from 'react';

let initialShapes = [
  { id: 0, type: 'circle', x: 50, y: 100 },
  { id: 1, type: 'square', x: 150, y: 100 },
  { id: 2, type: 'circle', x: 250, y: 100 },
];

export default function ShapeEditor() {
  const [shapes, setShapes] = useState(
    initialShapes
  );

  function handleClick() {
    const nextShapes = shapes.map(shape => {
      if (shape.type === 'square') {
        // No change
        return shape;
      } else {
        // Return a new circle 50px below
        return {
          ...shape,
          y: shape.y + 50,
        };
      }
    });
    // Re-render with the new array
    setShapes(nextShapes);
  }

  return (
    <>
      <button onClick={handleClick}>
        Move circles down!
      </button>
      {shapes.map(shape => (
        <div
          key={shape.id}
          style={{
          background: 'purple',
          position: 'absolute',
          left: shape.x,
          top: shape.y,
          borderRadius:
            shape.type === 'circle'
              ? '50%' : '',
          width: 20,
          height: 20,
        }} />
      ))}
    </>
  );
}
```

```css
body { height: 300px; }
```

</Sandpack>

### Замена элементов в массиве{/*replacing-items-in-an-array*/}

Особенно часто требуется заменить один или несколько элементов в массиве. Задания типа `arr[0] = 'bird'` изменяют исходный массив, поэтому для этих целей лучше использовать `map`.

Чтобы заменить элемент, создайте новый массив с помощью `map`. Внутри вызова `map` вы получите индекс элемента в качестве второго аргумента. Используйте его, чтобы решить, вернуть ли исходный элемент (первый аргумент) или что-то другое:


<details>
<summary><small>(eng)</small></summary>

<b>Replacing items in an array :</b>
It is particularly common to want to replace one or more items in an array. Assignments like `arr[0] = 'bird'` are mutating the original array, so instead you'll want to use `map` for this as well.

To replace an item, create a new array with `map`. Inside your `map` call, you will receive the item index as the second argument. Use it to decide whether to return the original item (the first argument) or something else:

</details>

<Sandpack>

```js
import { useState } from 'react';

let initialCounters = [
  0, 0, 0
];

export default function CounterList() {
  const [counters, setCounters] = useState(
    initialCounters
  );

  function handleIncrementClick(index) {
    const nextCounters = counters.map((c, i) => {
      if (i === index) {
        // Increment the clicked counter
        return c + 1;
      } else {
        // The rest haven't changed
        return c;
      }
    });
    setCounters(nextCounters);
  }

  return (
    <ul>
      {counters.map((counter, i) => (
        <li key={i}>
          {counter}
          <button onClick={() => {
            handleIncrementClick(i);
          }}>+1</button>
        </li>
      ))}
    </ul>
  );
}
```

```css
button { margin: 5px; }
```

</Sandpack>

### Вставка в массив{/*inserting-into-an-array*/}

Иногда требуется вставить элемент в определенную позицию, которая не находится ни в начале, ни в конце. Для этого можно использовать синтаксис разложения массива `...` вместе с методом `lice()`. Метод `slice()` позволяет вырезать "кусочек" массива. Чтобы вставить элемент, вы создадите массив, который раздвинет ломтик _до_ точки вставки, затем новый элемент, а затем остаток исходного массива.

В этом примере кнопка Insert всегда вставляется по индексу `1`:


<details>
<summary><small>(eng)</small></summary>

<b>Inserting into an array :</b>
Sometimes, you may want to insert an item at a particular position that's neither at the beginning nor at the end. To do this, you can use the `...` array spread syntax together with the `slice()` method. The `slice()` method lets you cut a "slice" of the array. To insert an item, you will create an array that spreads the slice _before_ the insertion point, then the new item, and then the rest of the original array.

In this example, the Insert button always inserts at the index `1`:

</details>

<Sandpack>

```js
import { useState } from 'react';

let nextId = 3;
const initialArtists = [
  { id: 0, name: 'Marta Colvin Andrade' },
  { id: 1, name: 'Lamidi Olonade Fakeye'},
  { id: 2, name: 'Louise Nevelson'},
];

export default function List() {
  const [name, setName] = useState('');
  const [artists, setArtists] = useState(
    initialArtists
  );

  function handleClick() {
    const insertAt = 1; // Could be any index
    const nextArtists = [
      // Items before the insertion point:
      ...artists.slice(0, insertAt),
      // New item:
      { id: nextId++, name: name },
      // Items after the insertion point:
      ...artists.slice(insertAt)
    ];
    setArtists(nextArtists);
    setName('');
  }

  return (
    <>
      <h1>Inspiring sculptors:</h1>
      <input
        value={name}
        onChange={e => setName(e.target.value)}
      />
      <button onClick={handleClick}>
        Insert
      </button>
      <ul>
        {artists.map(artist => (
          <li key={artist.id}>{artist.name}</li>
        ))}
      </ul>
    </>
  );
}
```

```css
button { margin-left: 5px; }
```

</Sandpack>

### Внесение других изменений в массив{/*making-other-changes-to-an-array*/}

Есть вещи, которые нельзя сделать, используя только синтаксис распространения и немутирующие методы, такие как `map()` и `filter()`. Например, вы можете захотеть развернуть или отсортировать массив. Методы JavaScript `reverse()` и `sort()` мутируют исходный массив, поэтому вы не можете использовать их напрямую.

**Однако можно сначала скопировать массив, а затем внести в него изменения.

Например:


<details>
<summary><small>(eng)</small></summary>

<b>Making other changes to an array :</b>
There are some things you can't do with the spread syntax and non-mutating methods like `map()` and `filter()` alone. For example, you may want to reverse or sort an array. The JavaScript `reverse()` and `sort()` methods are mutating the original array, so you can't use them directly.

**However, you can copy the array first, and then make changes to it.**

For example:

</details>

<Sandpack>

```js
import { useState } from 'react';

const initialList = [
  { id: 0, title: 'Big Bellies' },
  { id: 1, title: 'Lunar Landscape' },
  { id: 2, title: 'Terracotta Army' },
];

export default function List() {
  const [list, setList] = useState(initialList);

  function handleClick() {
    const nextList = [...list];
    nextList.reverse();
    setList(nextList);
  }

  return (
    <>
      <button onClick={handleClick}>
        Reverse
      </button>
      <ul>
        {list.map(artwork => (
          <li key={artwork.id}>{artwork.title}</li>
        ))}
      </ul>
    </>
  );
}
```

</Sandpack>

Здесь вы используете синтаксис распространения `[...list]`, чтобы сначала создать копию исходного массива. Теперь, когда у вас есть копия, вы можете использовать такие мутирующие методы, как `nextList.reverse()` или `nextList.sort()`, или даже назначить отдельные элементы с помощью `nextList[0] = "something"`.

Однако **даже если вы копируете массив, вы не можете изменять существующие элементы _внутри_ него непосредственно**. Это происходит потому, что копирование является поверхностным - новый массив будет содержать те же элементы, что и исходный. Поэтому если вы изменяете объект внутри скопированного массива, вы изменяете существующее состояние. Например, такой код представляет собой проблему.

```js
const nextList = [...list];
nextList[0].seen = true; // Problem: mutates list[0]
setList(nextList);
```

Хотя `nextList` и `list` - это два разных массива, **`nextList[0]` и `list[0]` указывают на один и тот же объект.** Поэтому, изменяя `nextList[0].seen`, вы также изменяете `list[0].seen`. Это мутация состояния, которой следует избегать! Вы можете решить эту проблему аналогично [обновлению вложенных объектов JavaScript](/learn/updating-objects-in-state#updating-a-nested-object)-копируя отдельные элементы, которые вы хотите изменить, вместо того чтобы мутировать их. Вот как это делается.


<details>
<summary><small>(eng)</small></summary>

Here, you use the `[...list]` spread syntax to create a copy of the original array first. Now that you have a copy, you can use mutating methods like `nextList.reverse()` or `nextList.sort()`, or even assign individual items with `nextList[0] = "something"`.

However, **even if you copy an array, you can't mutate existing items _inside_ of it directly.** This is because copying is shallow--the new array will contain the same items as the original one. So if you modify an object inside the copied array, you are mutating the existing state. For example, code like this is a problem.

```js
const nextList = [...list];
nextList[0].seen = true; // Problem: mutates list[0]
setList(nextList);
```

Although `nextList` and `list` are two different arrays, **`nextList[0]` and `list[0]` point to the same object.** So by changing `nextList[0].seen`, you are also changing `list[0].seen`. This is a state mutation, which you should avoid! You can solve this issue in a similar way to [updating nested JavaScript objects](/learn/updating-objects-in-state#updating-a-nested-object)--by copying individual items you want to change instead of mutating them. Here's how.

</details>

## Обновление объектов внутри массивов{/*updating-objects-inside-arrays*/}

Объекты на самом деле не находятся "внутри" массивов. В коде они могут казаться "внутри", но каждый объект в массиве - это отдельное значение, на которое "указывает" массив. Вот почему нужно быть осторожным при изменении вложенных полей, таких как `list[0]`. Список произведений искусства другого человека может указывать на тот же элемент массива!

**При обновлении вложенного состояния необходимо создавать копии от точки, где вы хотите обновить, и до самого верхнего уровня.** Давайте посмотрим, как это работает.

В этом примере два отдельных списка произведений искусства имеют одинаковое начальное состояние. Они должны быть изолированы, но из-за мутации их состояние случайно стало общим, и установка флажка в одном списке влияет на другой список:


<details>
<summary><small>(eng)</small></summary>

<b>Updating objects inside arrays :</b>
Objects are not _really_ located "inside" arrays. They might appear to be "inside" in code, but each object in an array is a separate value, to which the array "points". This is why you need to be careful when changing nested fields like `list[0]`. Another person's artwork list may point to the same element of the array!

**When updating nested state, you need to create copies from the point where you want to update, and all the way up to the top level.** Let's see how this works.

In this example, two separate artwork lists have the same initial state. They are supposed to be isolated, but because of a mutation, their state is accidentally shared, and checking a box in one list affects the other list:

</details>

<Sandpack>

```js
import { useState } from 'react';

let nextId = 3;
const initialList = [
  { id: 0, title: 'Big Bellies', seen: false },
  { id: 1, title: 'Lunar Landscape', seen: false },
  { id: 2, title: 'Terracotta Army', seen: true },
];

export default function BucketList() {
  const [myList, setMyList] = useState(initialList);
  const [yourList, setYourList] = useState(
    initialList
  );

  function handleToggleMyList(artworkId, nextSeen) {
    const myNextList = [...myList];
    const artwork = myNextList.find(
      a => a.id === artworkId
    );
    artwork.seen = nextSeen;
    setMyList(myNextList);
  }

  function handleToggleYourList(artworkId, nextSeen) {
    const yourNextList = [...yourList];
    const artwork = yourNextList.find(
      a => a.id === artworkId
    );
    artwork.seen = nextSeen;
    setYourList(yourNextList);
  }

  return (
    <>
      <h1>Art Bucket List</h1>
      <h2>My list of art to see:</h2>
      <ItemList
        artworks={myList}
        onToggle={handleToggleMyList} />
      <h2>Your list of art to see:</h2>
      <ItemList
        artworks={yourList}
        onToggle={handleToggleYourList} />
    </>
  );
}

function ItemList({ artworks, onToggle }) {
  return (
    <ul>
      {artworks.map(artwork => (
        <li key={artwork.id}>
          <label>
            <input
              type="checkbox"
              checked={artwork.seen}
              onChange={e => {
                onToggle(
                  artwork.id,
                  e.target.checked
                );
              }}
            />
            {artwork.title}
          </label>
        </li>
      ))}
    </ul>
  );
}
```

</Sandpack>

Проблема возникает в коде, подобном этому:

```js
const myNextList = [...myList];
const artwork = myNextList.find(a => a.id === artworkId);
artwork.seen = nextSeen; // Problem: mutates an existing item
setMyList(myNextList);
```

Хотя сам массив `myNextList` является новым, сами *элементы* являются теми же, что и в исходном массиве `myList`. Таким образом, изменение `artwork.seen` изменяет *оригинальный* элемент произведения искусства. Этот элемент также находится в `yourList`, что и вызывает ошибку. О таких ошибках бывает трудно думать, но, к счастью, они исчезают, если не мутировать состояние.

**Вы можете использовать `map` для замены старого элемента его обновленной версией без мутации.**

```js
setMyList(myList.map(artwork => {
  if (artwork.id === artworkId) {
    // Create a *new* object with changes
    return { ...artwork, seen: nextSeen };
  } else {
    // No changes
    return artwork;
  }
}));
```

Здесь `...` - это синтаксис распространения объекта, используемый для [создания копии объекта] (/learn/updating-objects-in-state#copying-objects-with-the-spread-syntax).

При таком подходе ни один из существующих элементов состояния не будет изменен, и ошибка будет исправлена:


<details>
<summary><small>(eng)</small></summary>

The problem is in code like this:

```js
const myNextList = [...myList];
const artwork = myNextList.find(a => a.id === artworkId);
artwork.seen = nextSeen; // Problem: mutates an existing item
setMyList(myNextList);
```

Although the `myNextList` array itself is new, the *items themselves* are the same as in the original `myList` array. So changing `artwork.seen` changes the *original* artwork item. That artwork item is also in `yourList`, which causes the bug. Bugs like this can be difficult to think about, but thankfully they disappear if you avoid mutating state.

**You can use `map` to substitute an old item with its updated version without mutation.**

```js
setMyList(myList.map(artwork => {
  if (artwork.id === artworkId) {
    // Create a *new* object with changes
    return { ...artwork, seen: nextSeen };
  } else {
    // No changes
    return artwork;
  }
}));
```

Here, `...` is the object spread syntax used to [create a copy of an object.](/learn/updating-objects-in-state#copying-objects-with-the-spread-syntax)

With this approach, none of the existing state items are being mutated, and the bug is fixed:

</details>

<Sandpack>

```js
import { useState } from 'react';

let nextId = 3;
const initialList = [
  { id: 0, title: 'Big Bellies', seen: false },
  { id: 1, title: 'Lunar Landscape', seen: false },
  { id: 2, title: 'Terracotta Army', seen: true },
];

export default function BucketList() {
  const [myList, setMyList] = useState(initialList);
  const [yourList, setYourList] = useState(
    initialList
  );

  function handleToggleMyList(artworkId, nextSeen) {
    setMyList(myList.map(artwork => {
      if (artwork.id === artworkId) {
        // Create a *new* object with changes
        return { ...artwork, seen: nextSeen };
      } else {
        // No changes
        return artwork;
      }
    }));
  }

  function handleToggleYourList(artworkId, nextSeen) {
    setYourList(yourList.map(artwork => {
      if (artwork.id === artworkId) {
        // Create a *new* object with changes
        return { ...artwork, seen: nextSeen };
      } else {
        // No changes
        return artwork;
      }
    }));
  }

  return (
    <>
      <h1>Art Bucket List</h1>
      <h2>My list of art to see:</h2>
      <ItemList
        artworks={myList}
        onToggle={handleToggleMyList} />
      <h2>Your list of art to see:</h2>
      <ItemList
        artworks={yourList}
        onToggle={handleToggleYourList} />
    </>
  );
}

function ItemList({ artworks, onToggle }) {
  return (
    <ul>
      {artworks.map(artwork => (
        <li key={artwork.id}>
          <label>
            <input
              type="checkbox"
              checked={artwork.seen}
              onChange={e => {
                onToggle(
                  artwork.id,
                  e.target.checked
                );
              }}
            />
            {artwork.title}
          </label>
        </li>
      ))}
    </ul>
  );
}
```

</Sandpack>

В общем случае **мутировать следует только те объекты, которые вы только что создали.** Если бы вы вставляли *новое* произведение искусства, вы могли бы его мутировать, но если вы имеете дело с чем-то, что уже находится в состоянии, вам нужно создать копию.


<details>
<summary><small>(eng)</small></summary>

In general, **you should only mutate objects that you have just created.** If you were inserting a *new* artwork, you could mutate it, but if you're dealing with something that's already in state, you need to make a copy.

</details>

### Напишите лаконичную логику обновления с помощью Immer{/*write-concise-update-logic-with-immer*/}

Обновление вложенных массивов без мутации может стать немного повторяющимся. [Как и в случае с объектами](/learn/updating-objects-in-state#write-concise-update-logic-with-immer):

- Как правило, вам не нужно обновлять состояние глубже, чем на пару уровней. Если ваши объекты состояния очень глубоки, возможно, вам стоит [перестроить их по-другому](/learn/choosing-the-state-structure#avoid-deeply-nested-state), чтобы они были плоскими.
- Если вы не хотите менять структуру состояний, лучше использовать [Immer](https://github.com/immerjs/use-immer), который позволяет вам писать, используя удобный, но мутирующий синтаксис, и заботится о создании копий за вас.

Вот пример Art Bucket List, переписанный с помощью Immer:


<details>
<summary><small>(eng)</small></summary>

<b>Write concise update logic with Immer :</b>
Updating nested arrays without mutation can get a little bit repetitive. [Just as with objects](/learn/updating-objects-in-state#write-concise-update-logic-with-immer):

- Generally, you shouldn't need to update state more than a couple of levels deep. If your state objects are very deep, you might want to [restructure them differently](/learn/choosing-the-state-structure#avoid-deeply-nested-state) so that they are flat.
- If you don't want to change your state structure, you might prefer to use [Immer](https://github.com/immerjs/use-immer), which lets you write using the convenient but mutating syntax and takes care of producing the copies for you.

Here is the Art Bucket List example rewritten with Immer:

</details>

<Sandpack>

```js
import { useState } from 'react';
import { useImmer } from 'use-immer';

let nextId = 3;
const initialList = [
  { id: 0, title: 'Big Bellies', seen: false },
  { id: 1, title: 'Lunar Landscape', seen: false },
  { id: 2, title: 'Terracotta Army', seen: true },
];

export default function BucketList() {
  const [myList, updateMyList] = useImmer(
    initialList
  );
  const [yourList, updateYourList] = useImmer(
    initialList
  );

  function handleToggleMyList(id, nextSeen) {
    updateMyList(draft => {
      const artwork = draft.find(a =>
        a.id === id
      );
      artwork.seen = nextSeen;
    });
  }

  function handleToggleYourList(artworkId, nextSeen) {
    updateYourList(draft => {
      const artwork = draft.find(a =>
        a.id === artworkId
      );
      artwork.seen = nextSeen;
    });
  }

  return (
    <>
      <h1>Art Bucket List</h1>
      <h2>My list of art to see:</h2>
      <ItemList
        artworks={myList}
        onToggle={handleToggleMyList} />
      <h2>Your list of art to see:</h2>
      <ItemList
        artworks={yourList}
        onToggle={handleToggleYourList} />
    </>
  );
}

function ItemList({ artworks, onToggle }) {
  return (
    <ul>
      {artworks.map(artwork => (
        <li key={artwork.id}>
          <label>
            <input
              type="checkbox"
              checked={artwork.seen}
              onChange={e => {
                onToggle(
                  artwork.id,
                  e.target.checked
                );
              }}
            />
            {artwork.title}
          </label>
        </li>
      ))}
    </ul>
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

</Sandpack>

Обратите внимание, что с Immer, **мутация типа `artwork.seen = nextSeen` теперь в порядке:**.

```js
updateMyTodos(draft => {
  const artwork = draft.find(a => a.id === artworkId);
  artwork.seen = nextSeen;
});
```

Это происходит потому, что вы не мутируете _оригинальное_ состояние, а мутируете специальный объект `draft`, предоставляемый Immer. Аналогично, вы можете применять такие мутирующие методы, как `push()` и `pop()` к содержимому `черновика`.

За кулисами Immer всегда строит следующее состояние с нуля в соответствии с изменениями, которые вы внесли в `draft`. Благодаря этому обработчики событий становятся очень лаконичными и не изменяют состояние.


<details>
<summary><small>(eng)</small></summary>

Note how with Immer, **mutation like `artwork.seen = nextSeen` is now okay:**

```js
updateMyTodos(draft => {
  const artwork = draft.find(a => a.id === artworkId);
  artwork.seen = nextSeen;
});
```

This is because you're not mutating the _original_ state, but you're mutating a special `draft` object provided by Immer. Similarly, you can apply mutating methods like `push()` and `pop()` to the content of the `draft`.

Behind the scenes, Immer always constructs the next state from scratch according to the changes that you've done to the `draft`. This keeps your event handlers very concise without ever mutating state.

</details>

<Recap>

- Вы можете помещать массивы в состояние, но не можете их изменять.
- Вместо того чтобы мутировать массив, создайте *новую* его версию и обновите состояние для нее.
- Для создания массивов с новыми элементами можно использовать синтаксис распространения массивов `[...arr, newItem]`.
- Вы можете использовать `filter()` и `map()` для создания новых массивов с отфильтрованными или преобразованными элементами.
- Вы можете использовать Immer, чтобы сохранить лаконичность кода.


<details>
<summary><small>(eng)</small></summary>

- You can put arrays into state, but you can't change them.
- Instead of mutating an array, create a *new* version of it, and update the state to it.
- You can use the `[...arr, newItem]` array spread syntax to create arrays with new items.
- You can use `filter()` and `map()` to create new arrays with filtered or transformed items.
- You can use Immer to keep your code concise.

</details>

</Recap>



<Challenges>

#### Обновление элемента в корзине{/*update-an-item-in-the-shopping-cart*/}

Заполните логику `handleIncreaseClick` так, чтобы нажатие "+" увеличивало соответствующее число:


<details>
<summary><small>(eng)</small></summary>

<b>Update an item in the shopping cart :</b>
Fill in the `handleIncreaseClick` logic so that pressing "+" increases the corresponding number:

</details>

<Sandpack>

```js
import { useState } from 'react';

const initialProducts = [{
  id: 0,
  name: 'Baklava',
  count: 1,
}, {
  id: 1,
  name: 'Cheese',
  count: 5,
}, {
  id: 2,
  name: 'Spaghetti',
  count: 2,
}];

export default function ShoppingCart() {
  const [
    products,
    setProducts
  ] = useState(initialProducts)

  function handleIncreaseClick(productId) {

  }

  return (
    <ul>
      {products.map(product => (
        <li key={product.id}>
          {product.name}
          {' '}
          (<b>{product.count}</b>)
          <button onClick={() => {
            handleIncreaseClick(product.id);
          }}>
            +
          </button>
        </li>
      ))}
    </ul>
  );
}
```

```css
button { margin: 5px; }
```

</Sandpack>

<Solution>

Вы можете использовать функцию `map` для создания нового массива, а затем с помощью синтаксиса распространения объектов `...` создать копию измененного объекта для нового массива:


<details>
<summary><small>(eng)</small></summary>

You can use the `map` function to create a new array, and then use the `...` object spread syntax to create a copy of the changed object for the new array:

</details>

<Sandpack>

```js
import { useState } from 'react';

const initialProducts = [{
  id: 0,
  name: 'Baklava',
  count: 1,
}, {
  id: 1,
  name: 'Cheese',
  count: 5,
}, {
  id: 2,
  name: 'Spaghetti',
  count: 2,
}];

export default function ShoppingCart() {
  const [
    products,
    setProducts
  ] = useState(initialProducts)

  function handleIncreaseClick(productId) {
    setProducts(products.map(product => {
      if (product.id === productId) {
        return {
          ...product,
          count: product.count + 1
        };
      } else {
        return product;
      }
    }))
  }

  return (
    <ul>
      {products.map(product => (
        <li key={product.id}>
          {product.name}
          {' '}
          (<b>{product.count}</b>)
          <button onClick={() => {
            handleIncreaseClick(product.id);
          }}>
            +
          </button>
        </li>
      ))}
    </ul>
  );
}
```

```css
button { margin: 5px; }
```

</Sandpack>

</Solution>

#### Удалить товар из корзины{/*remove-an-item-from-the-shopping-cart*/}

В этой корзине есть работающая кнопка "+", но кнопка "-" ничего не делает. Необходимо добавить обработчик события, чтобы при нажатии на нее уменьшался `count` соответствующего товара. Если вы нажмете "-", когда счетчик будет равен 1, товар должен автоматически удалиться из корзины. Убедитесь, что он никогда не показывает 0.


<details>
<summary><small>(eng)</small></summary>

<b>Remove an item from the shopping cart :</b>
This shopping cart has a working "+" button, but the "–" button doesn't do anything. You need to add an event handler to it so that pressing it decreases the `count` of the corresponding product. If you press "–" when the count is 1, the product should automatically get removed from the cart. Make sure it never shows 0.

</details>

<Sandpack>

```js
import { useState } from 'react';

const initialProducts = [{
  id: 0,
  name: 'Baklava',
  count: 1,
}, {
  id: 1,
  name: 'Cheese',
  count: 5,
}, {
  id: 2,
  name: 'Spaghetti',
  count: 2,
}];

export default function ShoppingCart() {
  const [
    products,
    setProducts
  ] = useState(initialProducts)

  function handleIncreaseClick(productId) {
    setProducts(products.map(product => {
      if (product.id === productId) {
        return {
          ...product,
          count: product.count + 1
        };
      } else {
        return product;
      }
    }))
  }

  return (
    <ul>
      {products.map(product => (
        <li key={product.id}>
          {product.name}
          {' '}
          (<b>{product.count}</b>)
          <button onClick={() => {
            handleIncreaseClick(product.id);
          }}>
            +
          </button>
          <button>
            –
          </button>
        </li>
      ))}
    </ul>
  );
}
```

```css
button { margin: 5px; }
```

</Sandpack>

<Solution>

Вы можете сначала использовать `map` для создания нового массива, а затем `filter` для удаления товаров с `count`, установленным на `0`:


<details>
<summary><small>(eng)</small></summary>

You can first use `map` to produce a new array, and then `filter` to remove products with a `count` set to `0`:

</details>

<Sandpack>

```js
import { useState } from 'react';

const initialProducts = [{
  id: 0,
  name: 'Baklava',
  count: 1,
}, {
  id: 1,
  name: 'Cheese',
  count: 5,
}, {
  id: 2,
  name: 'Spaghetti',
  count: 2,
}];

export default function ShoppingCart() {
  const [
    products,
    setProducts
  ] = useState(initialProducts)

  function handleIncreaseClick(productId) {
    setProducts(products.map(product => {
      if (product.id === productId) {
        return {
          ...product,
          count: product.count + 1
        };
      } else {
        return product;
      }
    }))
  }

  function handleDecreaseClick(productId) {
    let nextProducts = products.map(product => {
      if (product.id === productId) {
        return {
          ...product,
          count: product.count - 1
        };
      } else {
        return product;
      }
    });
    nextProducts = nextProducts.filter(p =>
      p.count > 0
    );
    setProducts(nextProducts)
  }

  return (
    <ul>
      {products.map(product => (
        <li key={product.id}>
          {product.name}
          {' '}
          (<b>{product.count}</b>)
          <button onClick={() => {
            handleIncreaseClick(product.id);
          }}>
            +
          </button>
          <button onClick={() => {
            handleDecreaseClick(product.id);
          }}>
            –
          </button>
        </li>
      ))}
    </ul>
  );
}
```

```css
button { margin: 5px; }
```

</Sandpack>

</Solution>

#### Исправление мутаций с помощью немутационных методов{/*fix-the-mutations-using-non-mutative-methods*/}

В этом примере все обработчики событий в `App.js` используют мутацию. В результате редактирование и удаление тодо не работает. Перепишите `handleAddTodo`, `handleChangeTodo` и `handleDeleteTodo`, чтобы они использовали немутационные методы:


<details>
<summary><small>(eng)</small></summary>

<b>Fix the mutations using non-mutative methods :</b>
In this example, all of the event handlers in `App.js` use mutation. As a result, editing and deleting todos doesn't work. Rewrite `handleAddTodo`, `handleChangeTodo`, and `handleDeleteTodo` to use the non-mutative methods:

</details>

<Sandpack>

```js src/App.js
import { useState } from 'react';
import AddTodo from './AddTodo.js';
import TaskList from './TaskList.js';

let nextId = 3;
const initialTodos = [
  { id: 0, title: 'Buy milk', done: true },
  { id: 1, title: 'Eat tacos', done: false },
  { id: 2, title: 'Brew tea', done: false },
];

export default function TaskApp() {
  const [todos, setTodos] = useState(
    initialTodos
  );

  function handleAddTodo(title) {
    todos.push({
      id: nextId++,
      title: title,
      done: false
    });
  }

  function handleChangeTodo(nextTodo) {
    const todo = todos.find(t =>
      t.id === nextTodo.id
    );
    todo.title = nextTodo.title;
    todo.done = nextTodo.done;
  }

  function handleDeleteTodo(todoId) {
    const index = todos.findIndex(t =>
      t.id === todoId
    );
    todos.splice(index, 1);
  }

  return (
    <>
      <AddTodo
        onAddTodo={handleAddTodo}
      />
      <TaskList
        todos={todos}
        onChangeTodo={handleChangeTodo}
        onDeleteTodo={handleDeleteTodo}
      />
    </>
  );
}
```

```js src/AddTodo.js
import { useState } from 'react';

export default function AddTodo({ onAddTodo }) {
  const [title, setTitle] = useState('');
  return (
    <>
      <input
        placeholder="Add todo"
        value={title}
        onChange={e => setTitle(e.target.value)}
      />
      <button onClick={() => {
        setTitle('');
        onAddTodo(title);
      }}>Add</button>
    </>
  )
}
```

```js src/TaskList.js
import { useState } from 'react';

export default function TaskList({
  todos,
  onChangeTodo,
  onDeleteTodo
}) {
  return (
    <ul>
      {todos.map(todo => (
        <li key={todo.id}>
          <Task
            todo={todo}
            onChange={onChangeTodo}
            onDelete={onDeleteTodo}
          />
        </li>
      ))}
    </ul>
  );
}

function Task({ todo, onChange, onDelete }) {
  const [isEditing, setIsEditing] = useState(false);
  let todoContent;
  if (isEditing) {
    todoContent = (
      <>
        <input
          value={todo.title}
          onChange={e => {
            onChange({
              ...todo,
              title: e.target.value
            });
          }} />
        <button onClick={() => setIsEditing(false)}>
          Save
        </button>
      </>
    );
  } else {
    todoContent = (
      <>
        {todo.title}
        <button onClick={() => setIsEditing(true)}>
          Edit
        </button>
      </>
    );
  }
  return (
    <label>
      <input
        type="checkbox"
        checked={todo.done}
        onChange={e => {
          onChange({
            ...todo,
            done: e.target.checked
          });
        }}
      />
      {todoContent}
      <button onClick={() => onDelete(todo.id)}>
        Delete
      </button>
    </label>
  );
}
```

```css
button { margin: 5px; }
li { list-style-type: none; }
ul, li { margin: 0; padding: 0; }
```

</Sandpack>

<Solution>

В `handleAddTodo` вы можете использовать синтаксис распространения массива. В `handleChangeTodo` можно создать новый массив с помощью `map`. В `handleDeleteTodo` можно создать новый массив с помощью `filter`. Теперь список работает корректно:


<details>
<summary><small>(eng)</small></summary>

In `handleAddTodo`, you can use the array spread syntax. In `handleChangeTodo`, you can create a new array with `map`. In `handleDeleteTodo`, you can create a new array with `filter`. Now the list works correctly:

</details>

<Sandpack>

```js src/App.js
import { useState } from 'react';
import AddTodo from './AddTodo.js';
import TaskList from './TaskList.js';

let nextId = 3;
const initialTodos = [
  { id: 0, title: 'Buy milk', done: true },
  { id: 1, title: 'Eat tacos', done: false },
  { id: 2, title: 'Brew tea', done: false },
];

export default function TaskApp() {
  const [todos, setTodos] = useState(
    initialTodos
  );

  function handleAddTodo(title) {
    setTodos([
      ...todos,
      {
        id: nextId++,
        title: title,
        done: false
      }
    ]);
  }

  function handleChangeTodo(nextTodo) {
    setTodos(todos.map(t => {
      if (t.id === nextTodo.id) {
        return nextTodo;
      } else {
        return t;
      }
    }));
  }

  function handleDeleteTodo(todoId) {
    setTodos(
      todos.filter(t => t.id !== todoId)
    );
  }

  return (
    <>
      <AddTodo
        onAddTodo={handleAddTodo}
      />
      <TaskList
        todos={todos}
        onChangeTodo={handleChangeTodo}
        onDeleteTodo={handleDeleteTodo}
      />
    </>
  );
}
```

```js src/AddTodo.js
import { useState } from 'react';

export default function AddTodo({ onAddTodo }) {
  const [title, setTitle] = useState('');
  return (
    <>
      <input
        placeholder="Add todo"
        value={title}
        onChange={e => setTitle(e.target.value)}
      />
      <button onClick={() => {
        setTitle('');
        onAddTodo(title);
      }}>Add</button>
    </>
  )
}
```

```js src/TaskList.js
import { useState } from 'react';

export default function TaskList({
  todos,
  onChangeTodo,
  onDeleteTodo
}) {
  return (
    <ul>
      {todos.map(todo => (
        <li key={todo.id}>
          <Task
            todo={todo}
            onChange={onChangeTodo}
            onDelete={onDeleteTodo}
          />
        </li>
      ))}
    </ul>
  );
}

function Task({ todo, onChange, onDelete }) {
  const [isEditing, setIsEditing] = useState(false);
  let todoContent;
  if (isEditing) {
    todoContent = (
      <>
        <input
          value={todo.title}
          onChange={e => {
            onChange({
              ...todo,
              title: e.target.value
            });
          }} />
        <button onClick={() => setIsEditing(false)}>
          Save
        </button>
      </>
    );
  } else {
    todoContent = (
      <>
        {todo.title}
        <button onClick={() => setIsEditing(true)}>
          Edit
        </button>
      </>
    );
  }
  return (
    <label>
      <input
        type="checkbox"
        checked={todo.done}
        onChange={e => {
          onChange({
            ...todo,
            done: e.target.checked
          });
        }}
      />
      {todoContent}
      <button onClick={() => onDelete(todo.id)}>
        Delete
      </button>
    </label>
  );
}
```

```css
button { margin: 5px; }
li { list-style-type: none; }
ul, li { margin: 0; padding: 0; }
```

</Sandpack>

</Solution>


#### Исправьте мутации с помощью Immer{/*fix-the-mutations-using-immer*/}

Это тот же пример, что и в предыдущем задании. На этот раз исправьте мутации с помощью Immer. Для вашего удобства функция `useImmer` уже импортирована, поэтому вам нужно изменить переменную состояния `todos`, чтобы использовать ее.


<details>
<summary><small>(eng)</small></summary>

<b>Fix the mutations using Immer :</b>
This is the same example as in the previous challenge. This time, fix the mutations by using Immer. For your convenience, `useImmer` is already imported, so you need to change the `todos` state variable to use it.

</details>

<Sandpack>

```js src/App.js
import { useState } from 'react';
import { useImmer } from 'use-immer';
import AddTodo from './AddTodo.js';
import TaskList from './TaskList.js';

let nextId = 3;
const initialTodos = [
  { id: 0, title: 'Buy milk', done: true },
  { id: 1, title: 'Eat tacos', done: false },
  { id: 2, title: 'Brew tea', done: false },
];

export default function TaskApp() {
  const [todos, setTodos] = useState(
    initialTodos
  );

  function handleAddTodo(title) {
    todos.push({
      id: nextId++,
      title: title,
      done: false
    });
  }

  function handleChangeTodo(nextTodo) {
    const todo = todos.find(t =>
      t.id === nextTodo.id
    );
    todo.title = nextTodo.title;
    todo.done = nextTodo.done;
  }

  function handleDeleteTodo(todoId) {
    const index = todos.findIndex(t =>
      t.id === todoId
    );
    todos.splice(index, 1);
  }

  return (
    <>
      <AddTodo
        onAddTodo={handleAddTodo}
      />
      <TaskList
        todos={todos}
        onChangeTodo={handleChangeTodo}
        onDeleteTodo={handleDeleteTodo}
      />
    </>
  );
}
```

```js src/AddTodo.js
import { useState } from 'react';

export default function AddTodo({ onAddTodo }) {
  const [title, setTitle] = useState('');
  return (
    <>
      <input
        placeholder="Add todo"
        value={title}
        onChange={e => setTitle(e.target.value)}
      />
      <button onClick={() => {
        setTitle('');
        onAddTodo(title);
      }}>Add</button>
    </>
  )
}
```

```js src/TaskList.js
import { useState } from 'react';

export default function TaskList({
  todos,
  onChangeTodo,
  onDeleteTodo
}) {
  return (
    <ul>
      {todos.map(todo => (
        <li key={todo.id}>
          <Task
            todo={todo}
            onChange={onChangeTodo}
            onDelete={onDeleteTodo}
          />
        </li>
      ))}
    </ul>
  );
}

function Task({ todo, onChange, onDelete }) {
  const [isEditing, setIsEditing] = useState(false);
  let todoContent;
  if (isEditing) {
    todoContent = (
      <>
        <input
          value={todo.title}
          onChange={e => {
            onChange({
              ...todo,
              title: e.target.value
            });
          }} />
        <button onClick={() => setIsEditing(false)}>
          Save
        </button>
      </>
    );
  } else {
    todoContent = (
      <>
        {todo.title}
        <button onClick={() => setIsEditing(true)}>
          Edit
        </button>
      </>
    );
  }
  return (
    <label>
      <input
        type="checkbox"
        checked={todo.done}
        onChange={e => {
          onChange({
            ...todo,
            done: e.target.checked
          });
        }}
      />
      {todoContent}
      <button onClick={() => onDelete(todo.id)}>
        Delete
      </button>
    </label>
  );
}
```

```css
button { margin: 5px; }
li { list-style-type: none; }
ul, li { margin: 0; padding: 0; }
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

С Immer вы можете писать код в мутативной манере, если только вы мутируете только части `черновика`, который дает вам Immer. Здесь все мутации выполняются на `черновике`, так что код работает:


<details>
<summary><small>(eng)</small></summary>

With Immer, you can write code in the mutative fashion, as long as you're only mutating parts of the `draft` that Immer gives you. Here, all mutations are performed on the `draft` so the code works:

</details>

<Sandpack>

```js src/App.js
import { useState } from 'react';
import { useImmer } from 'use-immer';
import AddTodo from './AddTodo.js';
import TaskList from './TaskList.js';

let nextId = 3;
const initialTodos = [
  { id: 0, title: 'Buy milk', done: true },
  { id: 1, title: 'Eat tacos', done: false },
  { id: 2, title: 'Brew tea', done: false },
];

export default function TaskApp() {
  const [todos, updateTodos] = useImmer(
    initialTodos
  );

  function handleAddTodo(title) {
    updateTodos(draft => {
      draft.push({
        id: nextId++,
        title: title,
        done: false
      });
    });
  }

  function handleChangeTodo(nextTodo) {
    updateTodos(draft => {
      const todo = draft.find(t =>
        t.id === nextTodo.id
      );
      todo.title = nextTodo.title;
      todo.done = nextTodo.done;
    });
  }

  function handleDeleteTodo(todoId) {
    updateTodos(draft => {
      const index = draft.findIndex(t =>
        t.id === todoId
      );
      draft.splice(index, 1);
    });
  }

  return (
    <>
      <AddTodo
        onAddTodo={handleAddTodo}
      />
      <TaskList
        todos={todos}
        onChangeTodo={handleChangeTodo}
        onDeleteTodo={handleDeleteTodo}
      />
    </>
  );
}
```

```js src/AddTodo.js
import { useState } from 'react';

export default function AddTodo({ onAddTodo }) {
  const [title, setTitle] = useState('');
  return (
    <>
      <input
        placeholder="Add todo"
        value={title}
        onChange={e => setTitle(e.target.value)}
      />
      <button onClick={() => {
        setTitle('');
        onAddTodo(title);
      }}>Add</button>
    </>
  )
}
```

```js src/TaskList.js
import { useState } from 'react';

export default function TaskList({
  todos,
  onChangeTodo,
  onDeleteTodo
}) {
  return (
    <ul>
      {todos.map(todo => (
        <li key={todo.id}>
          <Task
            todo={todo}
            onChange={onChangeTodo}
            onDelete={onDeleteTodo}
          />
        </li>
      ))}
    </ul>
  );
}

function Task({ todo, onChange, onDelete }) {
  const [isEditing, setIsEditing] = useState(false);
  let todoContent;
  if (isEditing) {
    todoContent = (
      <>
        <input
          value={todo.title}
          onChange={e => {
            onChange({
              ...todo,
              title: e.target.value
            });
          }} />
        <button onClick={() => setIsEditing(false)}>
          Save
        </button>
      </>
    );
  } else {
    todoContent = (
      <>
        {todo.title}
        <button onClick={() => setIsEditing(true)}>
          Edit
        </button>
      </>
    );
  }
  return (
    <label>
      <input
        type="checkbox"
        checked={todo.done}
        onChange={e => {
          onChange({
            ...todo,
            done: e.target.checked
          });
        }}
      />
      {todoContent}
      <button onClick={() => onDelete(todo.id)}>
        Delete
      </button>
    </label>
  );
}
```

```css
button { margin: 5px; }
li { list-style-type: none; }
ul, li { margin: 0; padding: 0; }
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

Кроме того, в Immer можно смешивать и сочетать мутативные и немутативные подходы.

Например, в этой версии `handleAddTodo` реализована путем мутации Immer `draft`, а `handleChangeTodo` и `handleDeleteTodo` используют немутативные методы `map` и `filter`:


<details>
<summary><small>(eng)</small></summary>

You can also mix and match the mutative and non-mutative approaches with Immer.

For example, in this version `handleAddTodo` is implemented by mutating the Immer `draft`, while `handleChangeTodo` and `handleDeleteTodo` use the non-mutative `map` and `filter` methods:

</details>

<Sandpack>

```js src/App.js
import { useState } from 'react';
import { useImmer } from 'use-immer';
import AddTodo from './AddTodo.js';
import TaskList from './TaskList.js';

let nextId = 3;
const initialTodos = [
  { id: 0, title: 'Buy milk', done: true },
  { id: 1, title: 'Eat tacos', done: false },
  { id: 2, title: 'Brew tea', done: false },
];

export default function TaskApp() {
  const [todos, updateTodos] = useImmer(
    initialTodos
  );

  function handleAddTodo(title) {
    updateTodos(draft => {
      draft.push({
        id: nextId++,
        title: title,
        done: false
      });
    });
  }

  function handleChangeTodo(nextTodo) {
    updateTodos(todos.map(todo => {
      if (todo.id === nextTodo.id) {
        return nextTodo;
      } else {
        return todo;
      }
    }));
  }

  function handleDeleteTodo(todoId) {
    updateTodos(
      todos.filter(t => t.id !== todoId)
    );
  }

  return (
    <>
      <AddTodo
        onAddTodo={handleAddTodo}
      />
      <TaskList
        todos={todos}
        onChangeTodo={handleChangeTodo}
        onDeleteTodo={handleDeleteTodo}
      />
    </>
  );
}
```

```js src/AddTodo.js
import { useState } from 'react';

export default function AddTodo({ onAddTodo }) {
  const [title, setTitle] = useState('');
  return (
    <>
      <input
        placeholder="Add todo"
        value={title}
        onChange={e => setTitle(e.target.value)}
      />
      <button onClick={() => {
        setTitle('');
        onAddTodo(title);
      }}>Add</button>
    </>
  )
}
```

```js src/TaskList.js
import { useState } from 'react';

export default function TaskList({
  todos,
  onChangeTodo,
  onDeleteTodo
}) {
  return (
    <ul>
      {todos.map(todo => (
        <li key={todo.id}>
          <Task
            todo={todo}
            onChange={onChangeTodo}
            onDelete={onDeleteTodo}
          />
        </li>
      ))}
    </ul>
  );
}

function Task({ todo, onChange, onDelete }) {
  const [isEditing, setIsEditing] = useState(false);
  let todoContent;
  if (isEditing) {
    todoContent = (
      <>
        <input
          value={todo.title}
          onChange={e => {
            onChange({
              ...todo,
              title: e.target.value
            });
          }} />
        <button onClick={() => setIsEditing(false)}>
          Save
        </button>
      </>
    );
  } else {
    todoContent = (
      <>
        {todo.title}
        <button onClick={() => setIsEditing(true)}>
          Edit
        </button>
      </>
    );
  }
  return (
    <label>
      <input
        type="checkbox"
        checked={todo.done}
        onChange={e => {
          onChange({
            ...todo,
            done: e.target.checked
          });
        }}
      />
      {todoContent}
      <button onClick={() => onDelete(todo.id)}>
        Delete
      </button>
    </label>
  );
}
```

```css
button { margin: 5px; }
li { list-style-type: none; }
ul, li { margin: 0; padding: 0; }
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

С Immer вы можете выбрать стиль, который будет наиболее естественным для каждого отдельного случая.


<details>
<summary><small>(eng)</small></summary>

With Immer, you can pick the style that feels the most natural for each separate case.

</details>

</Solution>

</Challenges>

