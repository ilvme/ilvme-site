---
title: "JS 数组操作"
type: "Post"
slug: "js-array-wiki"
published: true
date: 2022-07-01
description: "This is the first post of my new Astro blog."
tags: ["javascript", "数组操作"]
category: "Notes"
---

## 数组基础

### 定义数组的四种方式

```jsx
**// （一）最简便的方法，数组字面量。推荐**
var arr = ['a', 'b', 'c'];  // 最后一个元素后最好不要加逗号，浏览器兼容性问题

**// （二）使用 new Array()，不推荐，其行为不一致**
let a = new Array() // 没有参数，创建空数组 []
let c = new Array(2)  // 一个参数时，如果是数值则表示新数组的长度，非数值即当作数组新元素
var cars = new Array("Saab", "Volvo", "BMW"); // 多个参数时，参数即为新数组元素

**//（三）es6 的 Array.from()，可接收一个或两个参数**
Array.from("Matt"); // ["M", "a", "t", "t"] 字符串会被拆分为单字符数组
const a1 = [1, 2, 3, 4];
const a2 = Array.from(a1, x => x**2);
a2; // [1, 4, 9, 16]

**//（四）es6 的 Array.of()，把一组参数转换为数组，替代了 ES6 之前常用的 Array.prototype.slice.call(arguments)**
Array.of(1, 2, 3, 4); // [1, 2, 3, 4]
Array.of(undefined); // [undefined ]

// 数组的本质是对象
typeof [1, 2, 3] // object
```

### **length 属性**

数组的 `length` 属性，返回数组的元素数量。**但它不是只读的，通过修改 length 属性，可以从数组末尾删除或添加元素！！！**

```jsx
let arr = ["a", "b", "c"];

arr.length; // 3

// 设置长度为2时，最后一位自动被删除了
arr.length = 2;
arr; // ['a', 'b']

// 以下效果相当于清空数组
arr.length = 0;
arr; // []

// 当设置 length 大于当前元素个数，新增的位置都是 undefined
arr.length = 4;
arr[3]; // undefined
```

> 注意：数组最多可以包含 4 294 967 295 个元素，这对于大多数编程任务应该足够了。如果
> 尝试添加更多项，则会导致抛出错误。以这个最大值作为初始值创建数组，可能导致脚本
> 运行时间过长的错误。

### **数组的空位**

当数组的某个位置是空元素，即两个逗号之间没有任何值，我们称该数组存在空位（hole）。

```jsx
var a = [1, , 1];
a.length // 3
a[1] // undefined

# 最后一个元素后面有逗号，并不会产生空位
var a = [1, 2, 3,];

a.length // 3
a // [1, 2, 3]
```

### 扩展运算符（…）

扩展运算符（spread）是三个点（`...`）。它好比 rest 参数的逆运算，将一个数组转为用逗号分隔的参数序列。

```jsx
console.log(...[1, 2, 3])
// 1 2 3

console.log(1, ...[2, 3, 4], 5)
// 1 2 3 4 5

[...document.querySelectorAll('div')]
// [<div>, <div>, <div>]
```

该运算符主要用于函数调用。

```jsx
function push(array, ...items) {
  array.push(...items);
}

function add(x, y) {
  return x + y;
}

const numbers = [4, 38];
add(...numbers); // 42
```

上面代码中，`array.push(...items)`和`add(...numbers)`这两行，都是函数的调用，它们都使用了扩展运算符。该运算符将一个数组，变为参数序列。

```jsx
// 扩展运算符与正常的函数参数可以结合使用，非常灵活
function f(v, w, x, y, z) {}
const args = [0, 1];
f(-1, ...args, 2, ...[3]);

// 扩展运算符后面还可以放置表达式
const arr = [...(x > 0 ? ["a"] : []), "b"];

// 如果扩展运算符后面是一个空数组，则不产生任何效果
[...[], 1];
// [1]
```

### 检测数组 Array.isArray()

```jsx
var arr = [1, 2, 3];

typeof arr; // "object"，不足
Array.isArray(arr); // true
```

## 数组方法

### 【迭代器方法】keys()、values()、entries()

- **`keys()`** 返回数组索引的迭代器，即 0，1，2，3…
- **`values()`** 返回数组元素的迭代器
- **`entries()`** 返回索引/值对的迭代器

```jsx
const a = ["foo", "bar", "baz", "qux"];

// 因为这些方法都返回迭代器，所以可以将它们的内容通过 Array.from()直接转换为数组实例
const aKeys = Array.from(a.keys());
const aValues = Array.from(a.values());
const aEntries = Array.from(a.entries());
console.log(aKeys); // [0, 1, 2, 3]
console.log(aValues); // ["foo", "bar", "baz", "qux"]
console.log(aEntries); // [[0, "foo"], [1, "bar"], [2, "baz"], [3, "qux"]]

// 使用 ES6 的解构可以非常容易地在循环中拆分键/值对：
const a = ["foo", "bar", "baz"];
for (const [idx, element] of a.entries()) {
  alert(idx);
  alert(element);
}
// 0
// foo
// 1
// bar
// 2
// baz
```

### 【复制和填充方法】copyWithin()、fill()

ES6 新增了两个方法：批量复制方法 `copyWithin()`，以及填充数组方法 `fill()`。这两个方法的函数签名类似，都需要指定既有数组实例上的一个范围，包含开始索引，不包含结束索引。使用这个方法不会改变数组的大小。

- **`fill()`**：向一个已有的数组中插入全部或部分相同的值。开始索引用于指定开始填充的位置，它是可选的。如果不提供结束索引，则一直填充到数组末尾。负值索引从数组末尾开始计算。也可以将负索引想象成数组长度加上它得到的一个正索引。

  ```jsx
  const zeroes = [0, 0, 0, 0, 0];

  // 用 5 填充整个数组
  zeroes.fill(5);
  console.log(zeroes); // [5, 5, 5, 5, 5]
  zeroes.fill(0); // 重置

  // 用 6 填充索引大于等于 3 的元素
  zeroes.fill(6, 3);
  console.log(zeroes); // [0, 0, 0, 6, 6]
  zeroes.fill(0); // 重置

  // 用 7 填充索引大于等于 1 且小于 3 的元素
  zeroes.fill(7, 1, 3);
  console.log(zeroes); // [0, 7, 7, 0, 0];
  zeroes.fill(0); // 重置

  // 用 8 填充索引大于等于 1 且小于 4 的元素
  // (-4 + zeroes.length = 1)
  // (-1 + zeroes.length = 4)
  zeroes.fill(8, -4, -1);
  console.log(zeroes); // [0, 8, 8, 8, 0];

  // fill()静默忽略超出数组边界、零长度及方向相反的索引范围：
  const zeroes = [0, 0, 0, 0, 0];

  // 索引过低，忽略
  zeroes.fill(1, -10, -6);
  console.log(zeroes); // [0, 0, 0, 0, 0]

  // 索引过高，忽略
  zeroes.fill(1, 10, 15);
  console.log(zeroes); // [0, 0, 0, 0, 0]

  // 索引反向，忽略
  zeroes.fill(2, 4, 2);
  console.log(zeroes); // [0, 0, 0, 0, 0]

  // 索引部分可用，填充可用部分
  zeroes.fill(4, 3, 10);
  console.log(zeroes); // [0, 0, 0, 4, 4]
  ```

- **`copyWithin()`**：按照指定范围浅复制数组中的部分内容，然后将它们插入到指定索引开始的位置。开始索引和结束索引则与 fill()使用同样的计算方法。

  ```jsx
  let ints,
    reset = () => (ints = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]);
  reset();

  // 从 ints 中复制索引 0 开始的内容，插入到索引 5 开始的位置
  // 在源索引或目标索引到达数组边界时停止
  ints.copyWithin(5);
  console.log(ints); // [0, 1, 2, 3, 4, 0, 1, 2, 3, 4]
  reset();

  // 从 ints 中复制索引 5 开始的内容，插入到索引 0 开始的位置
  ints.copyWithin(0, 5);
  console.log(ints); // [5, 6, 7, 8, 9, 5, 6, 7, 8, 9]
  reset();

  // 从 ints 中复制索引 0 开始到索引 3 结束的内容
  // 插入到索引 4 开始的位置
  ints.copyWithin(4, 0, 3);
  alert(ints); // [0, 1, 2, 3, 0, 1, 2, 7, 8, 9]
  reset();

  // JavaScript 引擎在插值前会完整复制范围内的值
  // 因此复制期间不存在重写的风险
  ints.copyWithin(2, 0, 6);
  alert(ints); // [0, 1, 0, 1, 2, 3, 4, 5, 8, 9]
  reset();

  // 支持负索引值，与 fill()相对于数组末尾计算正向索引的过程是一样的
  ints.copyWithin(-4, -7, -3);
  alert(ints); // [0, 1, 2, 3, 4, 5, 3, 4, 5, 6]

  // copyWithin()静默忽略超出数组边界、零长度及方向相反的索引范围：
  let ints,
    reset = () => (ints = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]);
  reset();

  // 索引过低，忽略
  ints.copyWithin(1, -15, -12);
  alert(ints); // [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
  reset();

  // 索引过高，忽略
  ints.copyWithin(1, 12, 15);
  alert(ints); // [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
  reset();

  // 索引反向，忽略
  ints.copyWithin(2, 4, 2);
  alert(ints); // [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
  reset();

  // 索引部分可用，复制、填充可用部分
  ints.copyWithin(4, 7, 10);
  alert(ints); // [0, 1, 2, 3, 7, 8, 9, 7, 8, 9];
  ```

### 【转换方法】valueOf()、toString()、toLocaleString()、join()

```jsx
let colors = ["red", "blue", "green"]; // 创建一个包含 3 个字符串的数组
alert(colors.toString()); // red,blue,green
alert(colors.valueOf()); // red,blue,green
alert(colors); // red,blue,green

let colors = ["red", "green", "blue"];
alert(colors.join(",")); // red,green,blue
alert(colors.join("||")); // red||green||blue
```

- 首先是被显式调用的 `toString()` 和 `valueOf()` 方法，它们分别返回了数组的字符串表示，即将所有字符串组合起来，以逗号分隔。
- 最后一行代码直接用 `alert()` 显示数组，会在后台调用数组的 `toString()` 方法，从而得到跟前面一样的结果。
- `join()` 方法接收一个参数，即字符串分隔符，返回包含所有项的字符串。如果不给 `join()`传入任何参数，或者传入 `undefined`，则仍然使用逗号作为分隔符。

> 注意 如果数组中某一项是 `null` 或 `undefined`，则在 `join()`、`toLocaleString()`、`toString()` 和 `valueOf()` 返回的结果中会以空字符串表示。

### 【栈和队列方法】push()、pop()、shift()、unshift()

- **`push()`**：接收任意数量的参数，并将它们添加到数组末尾，返回数组的最新长度
- **`pop()`**：用于删除数组的最后一项，同时减少数组的 `length` 值，返回被删除的项
- **`shift()`**：删除数组的第一项并返回它，然后数组长度减 1
- **`unshift()`**：在数组开头添加任意多个值，然后返回新的数组长度
- 代码示例：

  ```jsx
  let colors = new Array(); // 创建一个数组

  let count = colors.push("red", "green"); // 推入两项
  alert(count); // 2

  count = colors.push("black"); // 再推入一项
  alert(count); // 3

  let item = colors.pop(); // 取得最后一项
  alert(item); // black
  alert(colors.length); // 2

  let colors = ["red", "blue"];

  colors.push("brown"); // 再添加一项
  colors[3] = "black"; // 添加一项
  alert(colors.length); // 4

  let item = colors.pop(); // 取得最后一项
  alert(item); // black

  let colors = new Array(); // 创建一个数组

  let count = colors.push("red", "green"); // 推入两项
  alert(count); // 2

  count = colors.push("black"); // 再推入一项
  alert(count); // 3

  let item = colors.shift(); // 取得第一项
  alert(item); // red
  alert(colors.length); // 2

  let colors = new Array(); // 创建一个数组

  let count = colors.unshift("red", "green"); // 从数组开头推入两项
  alert(count); // 2

  count = colors.unshift("black"); // 再推入一项
  alert(count); // 3

  let item = colors.pop(); // 取得最后一项
  alert(item); // green
  alert(colors.length); // 2
  ```

### 【迭代方法】every()、filter()、forEach()、map()、some()

ECMAScript 为数组定义了 5 个迭代方法。

每个方法接收两个参数：以每一项为参数运行的函数，以及可选的作为函数运行上下文的作用域对象（影响函数中 this 的值）。

传给每个方法的函数接收 3个参数：**数组元素**、**元素索引**和**数组本身**。因具体方法而异，这个函数的执行结果可能会也可能不会影响方法的返回值。数组的 5 个迭代方法使用方法以及参数说明：

```jsx
array.xxx(function (item, index, array) {
  /* 操作*/
}); // 普通函数
array.xxx((item, index, array) => {
  /* 操作*/
}); // 箭头函数（推荐）
// item：数组当前项的值
// index：数组当前项的索引（下标）
// array：数组对象本身
```

- **`every()`**：如果对每一项函数都返回 true，则这个方法返 true
- **`some()`**：如果有一项函数返回 true，则立即返回 true 终止循环，不再继续查找
- **`filter()`**：按照条件筛选数组，它会返回一个新数组
- **`forEach()`**：对数组每一项都运行传入的函数，没有返回值
- **`map()`**：对数组每一项都运行传入的函数，返回由每次函数调用的结果构成的数组

```jsx
let numbers = [1, 2, 3, 4, 5, 4, 3, 2, 1];

// **every**
let everyResult = numbers.every((item, index, array) => item > 2);
alert(everyResult); // false

// **some**
let someResult = numbers.some((item, index, array) => item > 2);
alert(someResult); // true

// **filter**
// 筛选数组中数值大于 2 的值
let filterResult = numbers.filter((item, index, array) => item > 2);
alert(filterResult); // 3,4,5,4,3

// **map**
let mapResult = numbers.map((item, index, array) => item * 2);
alert(mapResult); // 2,4,6,8,10,8,6,4,2

// **foreach**
numbers.forEach((item, index, array) => {
  // 执行某些操作
});
```

<aside>
📢 注意：

- 这些方法都不改变调用它们的数组。
- **some 语句内遇到 `return true` 会终止迭代，forEach 和 filter 不会停止迭代，所以在数组中查找唯一元素的时候使用 some 效率高一点。**
</aside>

### 【排序方法】reverse()、sort()

- **`reverse()`**：将数组元素反向排列。方法很直观，但不够灵活
- **`sort()`**：数组排序，可以自定义排序规则。

  - 默认情况下，`sort()` 会按照升序重新排列数组元素，即最小的值在前面，最大的值在后面。为此，`sort()` 会在每一项上调用 `String()` 转型函数，然后比较字符串来决定顺序。即使数组的元素都是数值，也会先把数组转换为字符串再比较、排序。

    ```jsx
    let values = [0, 1, 5, 10, 15];
    values.sort();
    alert(values); // 0,1,10,15,5
    ```

  - **`sort()`** 方法可以接收一个比较函数，用于判断哪个值应该排在前面。

    ```jsx
    function compare(value1, value2) {
      if (value1 < value2) {
        return -1;
      } else if (value1 > value2) {
        return 1;
      } else {
        return 0;
      }
    }

    let values = [0, 1, 5, 10, 15];
    values.sort(compare);
    alert(values); // 0,1,5,10,15

    // 或者直接传入一个箭头函数
    let values = [0, 1, 5, 10, 15];
    values.sort((a, b) => (a < b ? 1 : a > b ? -1 : 0));
    alert(values); // 15,10,5,1,0
    ```

### 【操作方法】concat()、slice()、splice()

- **`concat()`**：在现有数组全部元素基础上创建一个新数组。它首先会创建一个当前数组的副本，然后再把它的参数添加到副本末尾，最后返回这个新构建的数组。如果传入一个或多个数组，则 `concat()` 会把这些数组的每一项都添加到结果数组。如果参数不是数组，则直接把它们添加到结果数组末尾。

  ```jsx
  let colors = ["red", "green", "blue"];

  let colors2 = colors.concat("yellow", ["black", "brown"]);
  console.log(colors); // ["red", "green","blue"]
  console.log(colors2); // ["red", "green", "blue", "yellow", "black", "brown"]

  /*
  先创建一个包含3个值的数组 colors。
  然后 colors 调用 concat() 方法，传入字符串 "yellow" 和一个包含"black"和"brown"的数组。
  保存在 colors2 中的结果就是["red", "green", "blue", "yellow", "black", "brown"]。
  原始数组 colors 保持不变。
  */
  ```

- **`slice()`**：用于创建一个包含原有数组中一个或多个元素的新数组。`slice()` 方法可以接收一个或两个参数：返回元素的开始索引和结束索引。如果只有一个参数，则 `slice()` 会返回该索引到数组末尾的所有元素。如果有两个参数，则 `slice()` 返回从开始索引到结束索引对应的所有元素，其中不包含结束索引对应的元素。记住，这个操作不影响原始数组。

      ```jsx
      let colors = ["red", "green", "blue", "yellow", "purple"];
      let colors2 = colors.slice(1);
      let colors3 = colors.slice(1, 4);
      alert(colors2); // green,blue,yellow,purple
      alert(colors3); // green,blue,yellow

      /*
      这里，colors 数组一开始有 5 个元素。调用 slice()传入 1 会得到包含 4 个元素的新数组。
      其中不包括"red"，这是因为拆分操作要从位置 1 开始，即从"green"开始。
      得到的 colors2 数组包含"green"、"blue"、"yellow"和"purple"。
      colors3 数组是通过调用 slice()并传入 1 和 4 得到的，即从位置 1 开始复制到位置 3。
      因此 colors3 包含"green"、"blue"和"yellow"。
      */
      ```

  > 注意 如果 `slice()` 的参数有负值，那么就以数值长度加上这个负值的结果确定位置。比如，在包含 5 个元素的数组上调用 `slice(-2,-1)`，就相当于调用 `slice(3,4)`。如果结束位置小于开始位置，则返回空数组。

- `splice()`：最强大的数组方法，`splice()` 的主要目的是在数组中间插入元素，使用方式有多种。

  - **删除**：需要传 2 个参数：要删除的第一个元素的位置和要删除的元素数量。可以从数组中删除任意多个元素，比如 `splice(0, 2)` 会删除前两个元素。
  - **插入**：需要传 3 个参数：开始位置、0（要删除的元素数量）和要插入的元素，可以在数组中指定的位置插入元素。第三个参数之后还可以传第四个、第五个参数，乃至任意多个要插入的元素。比如，`splice(2, 0, "red", "green")` 会从数组位置 2 开始插入字串"red"和"green"。
  - **替换**：`splice()` 在删除元素的同时可以在指定位置插入新元素，同样要传入 3 个参数：开始位置、要删除元素的数量和要插入的任意多个元素。要插入的元素数量不一定跟删除的元素数量一致。比如，`splice(2, 1, "red", "green")` 会在位置 2 删除一个元素，然后从该位置开始向数组中插入"red" 和 "green"。

  `splice()` 方法始终返回这样一个数组，它包含从数组中被删除的元素（如果没有删除元素，则返回空数组）。以下示例展示了上述 3 种使用方式。

  ```jsx
  let colors = ["red", "green", "blue"];

  let removed = colors.splice(0, 1); // 删除第一项
  alert(colors); // green,blue
  alert(removed); // red，只有一个元素的数组

  // 当前 colors 为 ["green", "blue"]
  removed = colors.splice(1, 0, "yellow", "orange"); // 在位置 1 插入两个元素
  alert(colors); // green,yellow,orange,blue
  alert(removed); // 空数组

  // 当前 colors 为 ["green", "yellow", "orange", "blue"]
  removed = colors.splice(1, 1, "red", "purple"); // 插入两个值，删除一个元素
  alert(colors); // green,red,purple,orange,blue
  alert(removed); // yellow，只有一个元素的数组

  /*
  这个例子中，colors 数组一开始包含 3 个元素。
  第一次调用 splice()时，只删除了第一项，colors 中还有"green"和"blue"。
  第二次调用 slice()时，在位置 1 插入两项，然后 colors 包含"green"、"yellow"、"orange"和"blue"。这次没删除任何项，因此返回空数组。
  最后一次调用 splice()时删除了位置 1 上的一项，同时又插入了"red"和"purple"。
  最后，colors 数组包含"green"、"red"、"purple"、"orange"和"blue"。
  */
  ```

### 【搜索方法】indexOf()、lastIndexOf()、includes()、find()、findIndex()

- **`indexOf()`**、**`lastIndexOf()`**、**`includes()`**：三个方法都接收两个参数：要查找的元素、可选的起始搜索位置。
  - `indexOf()` 和 `includes()` 从前向后搜索，`lastIndexOf()` 从从后向前搜索
  - `indexOf()` 和 `lastIndexOf()` 都返回要查找的元素在数组中的位置，如果没找到则返回 -1。`includes()` 返回布尔值，表示是否至少找到一个与指定元素匹配的项
  - 在比较第一个参数跟数组每一项时，会使用全等（===）比较，也就是说两项必须严格相等

```jsx
let numbers = [1, 2, 3, 4, 5, 4, 3, 2, 1];
alert(numbers.indexOf(4)); // 3
alert(numbers.lastIndexOf(4)); // 5
alert(numbers.includes(4)); // true
alert(numbers.indexOf(4, 4)); // 5
alert(numbers.lastIndexOf(4, 4)); // 3
alert(numbers.includes(4, 7)); // false

let person = { name: "Nicholas" };
let people = [{ name: "Nicholas" }];
let morePeople = [person];

alert(people.indexOf(person)); // -1
alert(morePeople.indexOf(person)); // 0
alert(people.includes(person)); // false，因为不是一个对象
alert(morePeople.includes(person)); // true
```

- **`find()`**、**`findIndex()`**：这两个方法使用了**断言函数**。这两个方法都从数组的最小索引开始。`find()`返回第一个匹配的元素，`findIndex()` 返回第一个匹配元素的索引。这两个方法也都接收第二个可选的参数，用于指定断言函数内部 `this` 的值。

  ```jsx
  const people = [
    { name: "Matt", age: 27 },
    { name: "Nicholas", age: 29 },
  ];
  alert(people.find((element, index, array) => element.age < 28));
  // {name: "Matt", age: 27}

  alert(people.findIndex((element, index, array) => element.age < 28));
  // 0

  // 找到匹配项后，这两个方法都不再继续搜索。
  const evens = [2, 4, 6];

  // 找到匹配后，永远不会检查数组的最后一个元素
  evens.find((element, index, array) => {
    console.log(element);
    console.log(index);
    console.log(array);
    return element === 4;
  });
  // 2
  // 0
  // [2, 4, 6]
  // 4
  // 1
  // [2, 4, 6]
  ```

> 断言函数：类比 Java 中的 `Predicate`
> ECMAScript 也允许按照定义的断言函数搜索数组，每个索引都会调用这个函数。断言函数的返回值决定了相应索引的元素是否被认为匹配。
> 断言函数接收 3 个参数：元素、索引和数组本身。其中元素是数组中当前搜索的元素，索引是当前元素的索引，而数组就是正在搜索的数组。断言函数返回真值，表示是否匹配。

### 【归并方法】reduce()、reduceRight()

这两个方法都会迭代数组的所有项，并在此基础上构建一个最终返回值。reduce() 方法从数组第一项开始遍历到最后一项。而 reduceRight() 从最后一项开始遍历至第一项。

`reduce()`方法和`reduceRight()`方法的第一个参数都是一个函数。该函数接受以下四个参数。

1. **累积变量**：第一次执行时，默认为数组的第一个成员；以后每次执行时，都是上一轮的返回值
2. **当前变量**：第一次执行时，默认为数组的第二个成员；以后每次执行时，都是下一个成员
3. 当前位置：一个整数，表示第二个参数（当前变量）的位置，默认为`1`
4. 原数组

这四个参数之中，只有前两个是必须的，后两个则是可选的。

如果要对累积变量指定初值，可以把它放在`reduce()`方法和`reduceRight()` 方法的第二个参数。建议总是加上第二个参数，这样比较符合直觉，每个数组成员都会依次执行`reduce()`方法的参数函数。另外，第二个参数可以防止空数组报错。

```jsx
// reduce() 执行累加数组中所有数值的操作，比如：
let values = [1, 2, 3, 4, 5];
let sum = values.reduce((prev, cur, index, array) => prev + cur);
alert(sum); // 15
// 解析：
// 第一次执行归并函数时，prev 是 1，cur 是 2。
// 第二次执行时，prev 是 3（1 + 2），cur 是 3（数组第三项）。
// 如此递进，直到把所有项都遍历一次，最后返回归并结果。

// reduceRight() 方法与之类似，只是方向相反
let values = [1, 2, 3, 4, 5];
let sum = values.reduceRight(function (prev, cur, index, array) {
  return prev + cur;
});
alert(sum); // 15
// 在这里，第一次调用归并函数时 prev 是 5，而 cur 是 4。当然，最终结果相同。
```

> 使用 `reduce()` 还是 `reduceRight()`，只取决于遍历数组元素的方向。除此之外，这两个方法没什么区别。

### 【摊平方法】flat()、flatMap()：数组扁平化

数组的成员有时候还是数组，**`Array.prototype.flat`** 用于将嵌套的数组“拉平”，变成一维的数组，该方法返回一个新数组，对原数组没有影响。

```jsx
[1, 2, [3, 4]].flat();
// [1, 2, 3, 4]
```

`flat()`默认只会“拉平”一层，如果想要“拉平”多层的嵌套数组，可以将`flat()`方法的参数写成一个整数，表示想要拉平的层数，默认为1。

```jsx
[1, 2, [3, [4, 5]]].flat()[
  // [1, 2, 3, [4, 5]]

  (1, 2, [3, [4, 5]])
].flat(2);
// [1, 2, 3, 4, 5]
```

上面代码中，`flat()`的参数为2，表示要“拉平”两层的嵌套数组。

如果不管有多少层嵌套，都要转成一维数组，可以用`Infinity`关键字作为参数。

```jsx
[1, [2, [3]]].flat(Infinity)
// [1, 2, 3]

// 如果原数组有空位，flat()方法会跳过空位
[1, 2, , 4, 5].flat()
// [1, 2, 4, 5]
```

`flatMap()`方法对原数组的每个成员执行一个函数（相当于执行`Array.prototype.map()`），然后对返回值组成的数组执行`flat()`方法。该方法返回一个新数组，不改变原数组。

例子：

直接调用 `ES6` 中的`flat`方法来实现数组扁平化。

`flat` 方法的语法：`arr.flat ( [depth] )`。其中`depth`是`flat`的参数，`depth` 是可以传递数组的展开深度（默认不填、数值是 `1`），即展开一层数组。

如果层数不确定，参数可以传进 `Infinity`，代表不论多少层都要展开。

```jsx
// 常规操作
let arr = [1, [2, [3, 4，5]]];
function flatten(arr) {
    while (arr.some(item => Array.isArray(item))) {
        arr = [].concat(...arr);
    }
    return arr;
}
console.log(flatten(arr))// [1, 2, 3, 4，5]

// 骚操作
let arr = [1, [2, [3, 4]]];
console.log(arr.flat(Infinity)); // [1, 2, 3, 4，5]
```

## 学习资料
