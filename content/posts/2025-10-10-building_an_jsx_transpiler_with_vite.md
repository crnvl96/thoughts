+++
date = '2025-10-10'
draft = false
title = 'Building a JSX Transpiler with Vite'
+++

## Step 1: Vite Setup

Bootstrap a new vite project using vanilla template.

```bash
npm create vite@latest jsx-renderer-vite -- --template vanilla
```

Enter the project and install the dependencies

```bash
cd jsx-renderer-vite && npm install
```

Then, adjust the project files so that the final structure is like this

```
.
├── src/
│   └── main.jsx
├── .gitignore
├── index.html
├── package-lock.json
├── package.json
└── vite.config.js
```

The following files are important for this setup process

```javascript
// vite.config.js

import * as v from "vite";

export default v.defineConfig({
  esbuild: {
    // use `h` as the JSX Factory function instead of React.createElement
    jsxFactory: "h",
    // use Fragment for JSX fragments (<>)
    jsxFragment: "Fragment",
  },
});
```

```json
// package.json

{
  "name": "jsx-renderer-vite",
  "private": true,
  "version": "0.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview"
  },
  "devDependencies": {
    "vite": "^7.1.7"
  }
}
```

```html
<!-- index.html -->

<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>jsx-renderer-vite</title>
  </head>
  <body>
    <div id="app"></div>
    <!-- change the value of "src" here to `main.jsx` -->
    <script type="module" src="src/main.jsx"></script>
  </body>
</html>
```

## Step 2: Creating the `h` Function

Now let's implement the `h()` function that esbuild will call for each JSX element.

```javascript
// main.jsx

function h(nodeName, attributes, ...args) {
  let vnode = { nodeName };
  if (attributes) vnode.attributes = attributes;
  if (args.length) vnode.children = [].concat(...args);
  return vnode;
}
```

This function creates a virtual DOM node object with:

- `nodeName`: The HTML tag name (e.g., "div")
- `attributes`: An object of element attributes (optional)
- `children`: An array of child nodes (text or other virtual nodes)

The `...args` syntax collects all remaining arguments into an array, and `[].concat(...args)` flattens nested arrays.

## Step 3: Writing the First JSX

```javascript
// main.jsx

function h(nodeName, attributes, ...args) {
  let vnode = { nodeName };
  if (attributes) vnode.attributes = attributes;
  if (args.length) vnode.children = [].concat(...args);
  return vnode;
}

const element = <div>Hello World</div>;
console.log(element);
```

Run `npm run dev` to start Vite's development server. Vite will automatically transpile the JSX and you can see the result in the browser console.

## Step 4: Implementing the DOM Renderer

Now let's implement the function to convert our virtual DOM nodes into real DOM elements. Add the renderer to `src/main.jsx`:

```javascript
// main.jsx

function h(nodeName, attributes, ...args) {
  let vnode = { nodeName };
  if (attributes) vnode.attributes = attributes;
  if (args.length) vnode.children = [].concat(...args);
  return vnode;
}

// Function to render virtual DOM nodes to real DOM elements
function render(vnode) {
  // Handle text nodes
  if (typeof vnode === "string") return document.createTextNode(vnode);

  // Handle functional components
  if (typeof vnode.nodeName === "function") {
    const componentVnode = vnode.nodeName(vnode.attributes || {});
    return render(componentVnode);
  }

  // Create DOM element
  let n = document.createElement(vnode.nodeName);

  // Set attributes
  Object.keys(vnode.attributes || {}).forEach((k) =>
    n.setAttribute(k, vnode.attributes[k]),
  );

  // Render and append children
  (vnode.children || []).forEach((c) => n.appendChild(render(c)));

  return n;
}

const ITEMS = "some random content".split(" ");

// A functional component that returns JSX
function ItemList({ items }) {
  return (
    <ul>
      {items.map((item) => (
        <li>{item}</li>
      ))}
    </ul>
  );
}

// Main JSX structure
const vdom = (
  <div id="app">
    <h1>JSX Renderer Demo</h1>
    <p>Look, a simple JSX DOM renderer!</p>
    <ItemList items={ITEMS} />
  </div>
);

document.body.appendChild(render(vdom));
```

The `ItemList` function returns JSX, which Vite transpiles to `h()` calls. The `{items.map(...)}` expression gets embedded directly in the transpiled code. Vite's fast refresh will update the component instantly when you make changes.

## Advanced JSX Features

Our renderer can be extended to support modern JSX features. Below are working examples for each feature.

### JSX Fragments

To support JSX fragments, define a Fragment component and update the render function to handle it:

```javascript
// main.jsx

function h(nodeName, attributes, ...args) {
  let vnode = { nodeName };
  if (attributes) vnode.attributes = attributes;
  if (args.length) vnode.children = [].concat(...args);
  return vnode;
}

const Fragment = ({ children }) => children;

function render(vnode) {
  if (typeof vnode === "string") return document.createTextNode(vnode);

  if (vnode.nodeName === Fragment) {
    const fragment = document.createDocumentFragment();
    (vnode.children || []).forEach((c) => fragment.appendChild(render(c)));
    return fragment;
  }

  if (typeof vnode.nodeName === "function") {
    const componentVnode = vnode.nodeName(vnode.attributes || {});
    return render(componentVnode);
  }

  let n = document.createElement(vnode.nodeName);
  Object.keys(vnode.attributes || {}).forEach((k) =>
    n.setAttribute(k, vnode.attributes[k]),
  );
  (vnode.children || []).forEach((c) => n.appendChild(render(c)));
  return n;
}

const component = (
  <>
    <h1>Title</h1>
    <p>Content</p>
  </>
);

document.body.appendChild(render(component));
```

### Conditional Rendering

Conditional rendering uses JavaScript expressions in JSX. This example includes a toggle button to demonstrate dynamic conditional rendering:

```javascript
// main.jsx

function h(nodeName, attributes, ...args) {
  let vnode = { nodeName };
  if (attributes) vnode.attributes = attributes;
  if (args.length) vnode.children = [].concat(...args);
  return vnode;
}

function render(vnode) {
  if (typeof vnode === "string") return document.createTextNode(vnode);
  if (typeof vnode.nodeName === "function") {
    const componentVnode = vnode.nodeName(vnode.attributes || {});
    return render(componentVnode);
  }
  let n = document.createElement(vnode.nodeName);
  Object.keys(vnode.attributes || {}).forEach((k) => {
    if (k.startsWith("on") && typeof vnode.attributes[k] === "function") {
      n.addEventListener(k.toLowerCase().slice(2), vnode.attributes[k]);
    } else {
      n.setAttribute(k, vnode.attributes[k]);
    }
  });
  (vnode.children || []).forEach((c) => n.appendChild(render(c)));
  return n;
}

// State for conditional rendering
let show = true;

// Toggle function
function toggleShow() {
  show = !show;
  // Re-render the app
  document.body.innerHTML = "";
  document.body.appendChild(render(<App />));
}

const ConditionalComponent = ({ show }) => (
  <div>
    {show && <p>This shows conditionally</p>}
    {!show && <p>This shows when not shown</p>}
  </div>
);

const App = () => (
  <div id="app">
    <h1>Conditional Rendering Demo</h1>
    <ConditionalComponent show={show} />
    <button onClick={toggleShow}>Toggle Content</button>
  </div>
);

document.body.appendChild(render(<App />));
```

### Event Handling

To handle events, update the render function to attach event listeners for attributes starting with "on". This example demonstrates a clickable counter:

```javascript
// main.jsx

function h(nodeName, attributes, ...args) {
  let vnode = { nodeName };
  if (attributes) vnode.attributes = attributes;
  if (args.length) vnode.children = [].concat(...args);
  return vnode;
}

function render(vnode) {
  if (typeof vnode === "string" || typeof vnode === "number")
    return document.createTextNode(vnode);
  if (typeof vnode.nodeName === "function") {
    const componentVnode = vnode.nodeName(vnode.attributes || {});
    return render(componentVnode);
  }
  let n = document.createElement(vnode.nodeName);
  Object.keys(vnode.attributes || {}).forEach((k) => {
    if (k.startsWith("on") && typeof vnode.attributes[k] === "function") {
      n.addEventListener(k.toLowerCase().slice(2), vnode.attributes[k]);
    } else {
      n.setAttribute(k, vnode.attributes[k]);
    }
  });
  (vnode.children || []).forEach((c) => n.appendChild(render(c)));
  return n;
}

// Counter state
let counter = 0;

function handleClick() {
  counter++;
  // Re-render the app
  document.body.innerHTML = "";
  document.body.appendChild(render(<InteractiveComponent />));
}

const InteractiveComponent = () => (
  <div>
    <p>Counter: {counter}</p>
    <button onClick={handleClick}>Click me</button>
  </div>
);

document.body.appendChild(render(<InteractiveComponent />));
```
