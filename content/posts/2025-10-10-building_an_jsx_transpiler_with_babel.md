+++
date = '2025-10-10'
draft = true
title = 'Building a JSX Renderer with Vite'
+++

## Step 1: Vite Setup

```bash
# bootstrap a new vite project
npm create vite@latest jsx-renderer-vite -- --template vanilla

# cd into it
cd jsx-renderer-vite

# create a new config file
touch vite.config.js
```

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

Our `package.json` file should look like this:

```json
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

Vite handles JSX transformation automatically with this setup, giving us fast development with hot reload.

You can safely delete the folder public/, index.html, and all the files under src/

## Step 2: Understanding JSX Pragma

With our Vite configuration in place, create `src/main.js` and start with the JSX pragma comment:

```javascript
/** @jsx h */
```

This comment tells esbuild to transform JSX elements into calls to an `h()` function instead of `React.createElement()`.

The pragma comment works alongside our `vite.config.js` configuration, providing explicit control over JSX transformation. Without this setup, esbuild would default to `React.createElement`, which doesn't exist in our framework-free environment.

## Step 3: Creating the Hyperscript Function

Now let's implement the `h()` function that esbuild will call for each JSX element. Update `src/main.js`:

```javascript
/** @jsx h */

function h(nodeName, attributes, ...args) {
  let vnode = { nodeName };
  if (attributes) vnode.attributes = attributes;
  if (args.length) vnode.children = [].concat(...args);
  return vnode;
}
```

This function creates a virtual DOM node object with:

- `nodeName`: The HTML tag name (e.g., "div", "p")
- `attributes`: An object of element attributes (optional)
- `children`: An array of child nodes (text or other virtual nodes)

The `...args` syntax collects all remaining arguments into an array, and `[].concat(...args)` flattens nested arrays, allowing for flexible child handling.

## Step 4: Writing Your First JSX

Let's add some JSX code and see Vite's hot reload in action:

```javascript
/** @jsx h */

function h(nodeName, attributes, ...args) {
  let vnode = { nodeName };
  if (attributes) vnode.attributes = attributes;
  if (args.length) vnode.children = [].concat(...args);
  return vnode;
}

// Our first JSX element
const element = <div>Hello World</div>;

console.log(element);
```

Run `npm run dev` to start Vite's development server. Vite will automatically transpile the JSX and you can see the result in the browser console. The JSX `<div>Hello World</div>` gets transformed into `h("div", null, "Hello World")` - the `null` represents no attributes, and `"Hello World"` is the text child.

## Step 5: Implementing the DOM Renderer

Now we need a function to convert our virtual DOM nodes into real DOM elements. Add the renderer to `src/main.js`:

```javascript
/** @jsx h */

function h(nodeName, attributes, ...args) {
  let vnode = { nodeName };
  if (attributes) vnode.attributes = attributes;
  if (args.length) vnode.children = [].concat(...args);
  return vnode;
}

function render(vnode) {
  if (typeof vnode === "string") return document.createTextNode(vnode);
  let n = document.createElement(vnode.nodeName);
  Object.keys(vnode.attributes || {}).forEach((k) =>
    n.setAttribute(k, vnode.attributes[k]),
  );
  (vnode.children || []).forEach((c) => n.appendChild(render(c)));
  return n;
}

// Test it
const element = <div>Hello World</div>;
const domElement = render(element);
document.body.appendChild(domElement);
```

The `render` function recursively traverses the virtual DOM tree:

1. If the node is a string, create a text node
2. Otherwise, create an element with the tag name
3. Set attributes from the attributes object
4. Recursively render children and append them

With Vite's hot reload, you can modify the JSX and see changes instantly in the browser.

## Step 6: Adding Attributes and Complex JSX

Let's enhance our JSX with attributes and nested elements:

```javascript
/** @jsx h */

function h(nodeName, attributes, ...args) {
  let vnode = { nodeName };
  if (attributes) vnode.attributes = attributes;
  if (args.length) vnode.children = [].concat(...args);
  return vnode;
}

function render(vnode) {
  if (typeof vnode === "string") return document.createTextNode(vnode);
  let n = document.createElement(vnode.nodeName);
  Object.keys(vnode.attributes || {}).forEach((k) =>
    n.setAttribute(k, vnode.attributes[k]),
  );
  (vnode.children || []).forEach((c) => n.appendChild(render(c)));
  return n;
}

// More complex JSX
const vdom = (
  <div id="container">
    <h1>JSX Renderer</h1>
    <p className="description">Rendering JSX without frameworks!</p>
  </div>
);

document.body.appendChild(render(vdom));
```

Vite's esbuild transforms this into:

```javascript
const vdom = h(
  "div",
  {
    id: "container",
  },
  h("h1", null, "JSX Renderer"),
  h(
    "p",
    {
      className: "description",
    },
    "Rendering JSX without frameworks!",
  ),
);
```

Notice how attributes become an object, and nested elements become nested `h()` calls. Vite handles this transformation automatically with our configuration.

## Step 7: Creating Functional Components

JSX allows us to create reusable "components" as functions. Let's add a list component to `src/main.js`:

```javascript
/** @jsx h */

function h(nodeName, attributes, ...args) {
  let vnode = { nodeName };
  if (attributes) vnode.attributes = attributes;
  if (args.length) vnode.children = [].concat(...args);
  return vnode;
}

function render(vnode) {
  if (typeof vnode === "string") return document.createTextNode(vnode);
  let n = document.createElement(vnode.nodeName);
  Object.keys(vnode.attributes || {}).forEach((k) =>
    n.setAttribute(k, vnode.attributes[k]),
  );
  (vnode.children || []).forEach((c) => n.appendChild(render(c)));
  return n;
}

const ITEMS = "hello there people".split(" ");

// A functional component that returns JSX
function ItemList(items) {
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

## Step 8: Adding Debug Serialization

Since our virtual DOM is just JavaScript objects, we can serialize it to JSON for debugging. Add this to `src/main.js`:

```javascript
/** @jsx h */

function h(nodeName, attributes, ...args) {
  let vnode = { nodeName };
  if (attributes) vnode.attributes = attributes;
  if (args.length) vnode.children = [].concat(...args);
  return vnode;
}

function render(vnode) {
  if (typeof vnode === "string") return document.createTextNode(vnode);
  let n = document.createElement(vnode.nodeName);
  Object.keys(vnode.attributes || {}).forEach((k) =>
    n.setAttribute(k, vnode.attributes[k]),
  );
  (vnode.children || []).forEach((c) => n.appendChild(render(c)));
  return n;
}

const ITEMS = "hello there people".split(" ");

function ItemList(items) {
  return (
    <ul>
      {items.map((item) => (
        <li>{item}</li>
      ))}
    </ul>
  );
}

const vdom = (
  <div id="app">
    <h1>JSX Renderer Demo</h1>
    <p>Look, a simple JSX DOM renderer!</p>
    <ItemList items={ITEMS} />
  </div>
);

// Render the main UI
document.body.appendChild(render(vdom));

// Debug: Show the virtual DOM as JSON
const json = JSON.stringify(vdom, null, "  ");
document.body.appendChild(render(<pre>{json}</pre>));
```

This adds a `<pre>` element containing the JSON representation of our virtual DOM, making it easy to inspect the structure. With Vite's development server, you can modify the code and see the JSON update instantly.

## Step 9: Vite Integration

Vite comes with a default `index.html` file. Update it to include our description:

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/svg+xml" href="/vite.svg" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>JSX Renderer</title>
  </head>
  <body>
    <h2>Understanding JSX</h2>
    <p>
      This is a Vite-powered JSX renderer with hot reload and no framework
      dependencies.
    </p>
    <script type="module" src="/src/main.js"></script>
  </body>
</html>
```

Run `npm run dev` and open the provided URL in your browser. You should see the rendered JSX content plus the JSON debug output. Vite's development server provides hot module replacement, so changes are reflected instantly.

## Understanding the Transpilation Process

Let's examine what Vite's esbuild does to our JSX. The original:

```javascript
const vdom = (
  <div id="app">
    <h1>JSX Renderer Demo</h1>
    <p>Look, a simple JSX DOM renderer!</p>
    <ItemList items={ITEMS} />
  </div>
);
```

Becomes:

```javascript
const vdom = h(
  "div",
  {
    id: "app",
  },
  h("h1", null, "JSX Renderer Demo"),
  h("p", null, "Look, a simple JSX DOM renderer!"),
  ItemList(ITEMS),
);
```

Key transformations:

- Element names → string literals
- Attributes → object literals
- Text content → string literals
- Nested JSX → nested `h()` calls
- JavaScript expressions → inline code

### Technical Details of JSX Transformation

esbuild's JSX transformation operates with high performance using direct AST manipulation:

1. **Parsing**: esbuild parses JSX syntax directly into its internal AST representation
2. **Transformation**: Converts JSX AST nodes into configured function calls

The transformation handles complex cases like:

- Self-closing tags: `<input />` → `h("input", null)`
- Fragment syntax: `<>...</>` → `h(Fragment, null, ...)` (with our Fragment config)
- Spread attributes: `<div {...props} />` → `h("div", { ...props })`
- Event handlers and other DOM properties

## Performance Considerations

This lightweight JSX renderer offers excellent performance characteristics:

- **Fast Development**: Vite's esbuild provides sub-second hot reload
- **Optimized Production**: Vite's rollup-based build creates highly optimized bundles
- **Zero Runtime Overhead**: No virtual DOM diffing or reconciliation algorithms
- **Minimal Bundle Size**: Only the `h()` and `render()` functions in the final bundle
- **Direct DOM Manipulation**: No abstraction layers between your code and the DOM

However, consider these trade-offs:

- No automatic updates: Manual re-rendering required for dynamic content
- No component lifecycle: No hooks or lifecycle methods like in React
- Memory usage: Virtual DOM trees consume memory for complex UIs

## Alternative Approaches

Several tools and libraries offer JSX transpilation capabilities:

### Babel-Based Setup

For more control over transpilation, you can use Babel directly:

```bash
npm install @babel/core @babel/cli @babel/plugin-syntax-jsx @babel/plugin-transform-react-jsx
```

Create `.babelrc`:

```json
{
  "plugins": [
    [
      "@babel/plugin-transform-react-jsx",
      {
        "pragma": "h"
      }
    ]
  ]
}
```

Run transpilation:

```bash
npx babel index.js --out-file index.transpiled.js
```

Babel offers more configuration options but is slower than esbuild for development.

### Nano JSX (1kB)

A server-first JSX library that compiles to vanilla JavaScript:

```javascript
import { h, render } from "nano-jsx";

const element = <div>Hello Nano!</div>;
render(element, document.body);
```

### Preact (3kB)

A fast React alternative with the same API:

```javascript
import { h, render } from "preact";

const element = <div>Hello Preact!</div>;
render(element, document.body);
```

### Other Modern Alternatives

- **htm**: Tagged template literal approach: `html`<div>Hello</div>``
- **lit-html**: Template literals with reactive updates
- **SolidJS**: Fine-grained reactivity with JSX

## Development Workflow

Vite streamlines the development process with its fast tools:

1. **Write JSX Code**: Use JSX syntax with `/** @jsx h */` pragma in `src/main.js`
2. **Start Dev Server**: Run `npm run dev` for hot-reload development
3. **Test**: Open the provided URL to see rendered output with instant updates
4. **Debug**: Inspect virtual DOM JSON in the browser
5. **Build**: Run `npm run build` for optimized production bundle
6. **Preview**: Run `npm run preview` to test the production build

## Best Practices and Tips

1. **Always use the JSX pragma** at the top of files with JSX
2. **Keep the `h()` function simple** - it's just for creating virtual nodes
3. **Use JSON serialization** for debugging complex virtual DOM structures
4. **Handle all node types** in your renderer (strings, objects, arrays)
5. **Test incrementally** - transpile and check output at each step
6. **Remember the virtual DOM is just data** - you can manipulate it before rendering
7. **Consider caching** frequently used virtual DOM structures
8. **Profile performance** for complex component trees

## Advanced JSX Features

Our renderer can be extended to support modern JSX features:

### JSX Fragments

```javascript
/** @jsx h */

// Configure fragment support
const Fragment = ({ children }) => children;

const component = (
  <>
    <h1>Title</h1>
    <p>Content</p>
  </>
);
```

### Conditional Rendering

```javascript
const ConditionalComponent = ({ show }) => (
  <div>
    {show && <p>This shows conditionally</p>}
    {!show && <p>This shows when not shown</p>}
  </div>
);
```

### Event Handling

```javascript
function handleClick() {
  console.log("Clicked!");
}

const InteractiveComponent = () => (
  <button onclick={handleClick}>Click me</button>
);
```

## Extending the Renderer

This basic renderer can be extended in many ways:

- **State Management**: Add simple state with closures or external stores
- **Diffing Algorithm**: Implement virtual DOM comparison for efficient updates
- **Event System**: Add custom event delegation
- **CSS-in-JS**: Integrate styled-components style approach
- **Server-Side Rendering**: Generate HTML strings instead of DOM elements
- **Component Composition**: Build complex UIs from simple components

## Conclusion

You've now built a complete JSX renderer from scratch using Vite with esbuild! By leveraging Vite's modern development experience and configuring esbuild for custom JSX transformation, we've created a fast, lightweight setup that gives you full control over JSX rendering.

The key insights from this tutorial:

1. **JSX is just syntax**: esbuild transforms JSX into function calls using high-performance AST manipulation
2. **Pragma + Config control**: The `/** @jsx h */` comment combined with `vite.config.js` directs esbuild to use your custom function
3. **Modern tooling**: Vite provides hot reload, optimized builds, and excellent developer experience
4. **Virtual DOM power**: Plain JavaScript objects make debugging and manipulation easy
5. **Framework freedom**: Build rendering logic that fits your specific needs without React overhead

This approach demonstrates how JSX can be used without framework dependencies while benefiting from modern build tools. The renderer we've built is production-ready for lightweight applications and serves as an excellent foundation for understanding how JSX transformation works under the hood.

Try extending this renderer with state management, diffing algorithms, or server-side rendering, or use it as a starting point for your own JSX-based projects. With Vite's ecosystem, the possibilities are endless!
