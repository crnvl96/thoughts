+++
title = "Some less known Javascript features - Part 1"
date = "2026-02-19"
[params]
  math = true
+++

## Hoisting

Javascript literally hoists the variable declaration to the global scope.

```js
console.log(a);
var a = 1;

// results in undefined
```

In practice, what happens is:

```js
var a;
console.log(a);
a = 1;
```

- The variable declaration goes to the top of the scope;
- The variable attribution remains in place;
- In practice, the variable already exists, it just does not have a value yet;

If you instead declare your variables using `let` or `const`, you end
up witn an `ReferenceError`

```js
console.log(z);
const b = 3;

// results in ReferenceError
```

```js
console.log(y);
let y = 3;

// results in ReferenceError
```

## Scope

We have three types of scope in Javascript:

- Global scope
- Function scope
- Block scope

```js
// Global scope
const t = 1;

const print = () => {
  console.log(t);
};
```

```js
// Function scope
const calc = () => {
  const result = 1;
  console.log(result);
};

console.log(result); // ReferenceError
```

```js
// Block scope

if (true) {
  const result = 1;
  console.log(result);
}

console.log(result); // ReferenceError
```

This leads us to one of the most classical bugs of Javascript

```js
for (var i = 0; i < 3; i++) {
  setTimeout(() => console.log(i), 1000);
}
```

Since `var` is acessible from all scopes, we have only one
copy to it, meaning that when the setTimeout executes the value of `i` is
already 3.

So, this will print `3, 3, 3`

As a general rule in javascript, inner scopes have acess to broader scopes.
