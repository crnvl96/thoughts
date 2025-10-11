+++
date = '2025-08-31'
draft = false
title = 'LuaLS type annotations'
+++

Lua's dynamic nature makes it incredibly flexible, but this flexibility can sometimes lead to hard-to-debug type errors. The Lua Language Server (LuaLS) introduces a powerful type annotation system called **LuaCATS** (Lua Comment And Type System) that brings type safety and intelligent code assistance to Lua development.

> Check out the [official documentation](https://luals.github.io/wiki/annotations/) for more

## What are LuaLS Annotations?

LuaLS annotations are special comments prefixed with `---` (three dashes) that provide type information to the language server. These annotations help the server understand your code better, enabling features like:

- **Type checking** and error detection
- **Intelligent autocompletion**
- **Better signature help**
- **Code navigation** and documentation
- **Refactoring support**

## Basic Syntax and Formatting

Annotations use triple-dash comments and support Markdown formatting:

```lua
--- This is a basic annotation
---
--- **Bold text** and *italic text* are supported
```

## Core Type System

LuaLS recognizes all standard Lua types, such as `nil`, `any`, `boolean`, `string`, and more.

### Advanced Type Expressions

| Type Pattern  | Example                         | Description             |
| ------------- | ------------------------------- | ----------------------- |
| Union Type    | `string\|number`                | Multiple possible types |
| Array         | `string[]`                      | Array of specific type  |
| Dictionary    | `{ [string]: boolean }`         | String-keyed dictionary |
| Key-Value     | `table<KEY, VALUE>`             | Generic table type      |
| Table Literal | `{ name: string, age: number }` | Structured table        |
| Function      | `fun(param: string): boolean`   | Function signature      |
| Optional      | `string?`                       | Same as `string\|nil`   |

## Essential Annotations with Examples

### `@type` - Variable Type Declarations

```lua
---@type string
local name = "John"

---@type number[]
local scores = { 95, 87, 92 }

---@type { [string]: boolean }
local settings = { sound = true, music = false }

---@type fun(username: string): boolean
local validateUser
```

### `@param` - Function Parameters

```lua
---@param username string The user's name
---@param age? number Optional age parameter
---@param scores number[] Array of scores
function createUser(username, age, scores)
	-- function body
end

--- Union type parameter
---@param id string | number
function findById(id) end

--- Optional parameter with ?
---@param callback? fun() Optional callback function
function processData(callback) end
```

### `@return` - Function Return Values

```lua
--- Simple return
---@return boolean
function isValid()
	return true
end

--- Named return with description
---@return boolean success If operation succeeded
---@return string? error Error message if failed
function riskyOperation()
	return false, "Something went wrong"
end

--- Multiple returns
---@return integer count, string... names
function getNames()
	return 3, "Alice", "Bob", "Charlie"
end
```

### `@class` - Defining Custom Types

```lua
---@class User
---@field name string
---@field email string
---@field age? number
---@field scores number[]

---@param user User
function processUser(user)
	print(user.name) -- Autocomplete works here!
end

--- Class inheritance
---@class Admin: User
---@field permissions string[]
```

### `@alias` - Type Aliases and Enums

```lua
--- Simple type alias
---@alias UserID integer

--- Union type alias
---@alias Status "active" | "inactive" | "pending"

--- Enum with descriptions
---@alias Color
---| '"red"'    # Primary color red
---| '"green"'  # Primary color green
---| '"blue"'   # Primary color blue

---@param favoriteColor Color
function setColor(favoriteColor) end
```

### `@enum` - Runtime Enums

```lua
---@enum LogLevel
local LOG_LEVELS = {
	DEBUG = 1,
	INFO = 2,
	WARN = 3,
	ERROR = 4,
}

---@param level LogLevel
function logMessage(level, message) end

logMessage(LOG_LEVELS.INFO, "System started") -- Type-safe!
```

## Advanced Annotations

### `@generic` - Generic Types

```lua
--- Generic function
---@generic T
---@param item T
---@return T
function identity(item)
	return item
end

--- Generic class
---@class Container<T>
---@field value T

---@type Container<string>
local stringContainer = { value = "hello" }
```

### `@overload` - Function Overloading

```lua
---@param name string
---@param age number
---@return User
---@overload fun(name: string): User
---@overload fun(id: number): User
function createUser(name, age) end

-- All these calls are valid:
local user1 = createUser("Alice", 30)
local user2 = createUser("Bob")
local user3 = createUser(123)
```

### `@async` - Asynchronous Functions

```lua
---@async
---@param url string
---@return string response
function fetchData(url) end

-- Language server will show "await" hint
local data = fetchData("https://api.example.com/data")
```

### `@diagnostic` - Controlling Error Reporting

```lua
--- Disable specific diagnostics
---@diagnostic disable-next-line: unused-local
local unusedVariable = 42

--- Enable spell checking in file
---@diagnostic enable: spell-check
```

## Practical Examples

### API Client with Full Type Safety

```lua
---@class ApiResponse
---@field success boolean
---@field data any
---@field error? string

---@class User
---@field id integer
---@field name string
---@field email string

---@async
---@param endpoint string
---@return ApiResponse
function apiRequest(endpoint) end

---@param id integer
---@return User?
function getUser(id)
	---@type ApiResponse
	local response = apiRequest("/users/" .. id)

	if response.success then
		---@cast response.data User
		return response.data
	end

	return nil
end
```

### Game Entity System

```lua
---@alias EntityType "player" | "enemy" | "item" | "npc"

---@class Vector2
---@field x number
---@field y number

---@class Entity
---@field id integer
---@field type EntityType
---@field position Vector2
---@field health number
---@field maxHealth number

---@class Player: Entity
---@field username string
---@field inventory Item[]

---@param entity Entity
---@param damage number
---@return boolean entityDied
function applyDamage(entity, damage)
	entity.health = entity.health - damage
	return entity.health <= 0
end
```

## Best Practices

1. **Start with critical functions**: Add annotations to your most important functions first
2. **Use descriptive names**: Good parameter names help with autocomplete
3. **Leverage union types**: Use `|` for values that can be multiple types
4. **Mark optional parameters**: Use `?` suffix for parameters that can be `nil`
5. **Create type aliases**: Use `@alias` for complex or frequently used types
6. **Enable strict mode**: Configure LuaLS for stricter type checking in production

## Conclusion

LuaLS type annotations transform Lua development from a purely dynamic experience to one with robust type safety and intelligent assistance. By adopting these annotations, you can:

- Catch type errors before runtime
- Improve code documentation and readability
- Enhance IDE autocompletion and navigation
- Facilitate better team collaboration
- Create more maintainable codebases

Start gradually introducing annotations to your existing codebase, and you'll quickly appreciate the productivity gains and error prevention they provide.
