+++
title= "Building a JSX Transpiler with Vite"
date= "2025-10-10"
+++

# Vite Setup

Bootstrap a new vite project using vanilla template.

```bash
npm create vite@latest jsx-renderer-vite -- --template vanilla
```

Enter the project and install the dependencies

```bash
cd jsx-renderer-vite && npm install
```

Then, adjust the project files so that the final structure is like this

```terminal
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
        // use h as the JSX Factory function instead of React.createElement
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
    <!-- change the value of "src" here to main.jsx -->
    <script type="module" src="src/main.jsx"></script>
  </body>
</html>
```

# Creating the **h** Function

Now let's implement the _h()_ function that esbuild will call for each
JSX element.

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

- nodeName: The HTML tag name (e.g., "div")
- attributes: An object of element attributes (optional)
- children: An array of child nodes (text or other virtual nodes)

The _...args_ syntax collects all remaining arguments into
an array, and _[].concat(...args)_ flattens nested arrays.

# Writing the First JSX

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

Run _npm run dev_ to start Vite's development server. Vite will automatically
transpile the JSX and you can see the result in the browser console.

# Implementing the DOM Renderer

Now let's implement the function to convert our virtual DOM nodes into
real DOM elements. Add the renderer to _src/main.jsx_:

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

The _ItemList_ function returns JSX, which Vite transpiles to _h()~_
calls. The _{items.map(...)}_ expression gets embedded directly in the
transpiled code. Vite's fast refresh will update the component
instantly when you make changes.
