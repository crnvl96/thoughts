+++
title = "Enhancing Neovim Plugin Documentation and Readability with Lua Type Annotations: lazydocker.nvim Case Study"
date = "2025-09-11"
+++

# Introduction

In the world of Neovim plugin development. One of superpowers enabled by the Lua language
in Neovim is type annotations using EmmyLua-style comments (_---@_).
These annotations supercharge documentation, IDE integration, and code readability.

In _lazydocker.nvim_, a plugin that embeds [LazyDocker](https://github.com/jesseduffield/lazydocker)
into a Neovim floating window, I extensively used these annotations.

# Lua Type Annotations

Lua is dynamically typed, but Neovim's LSP (via _nvim-lspconfig_ and _emmy-lua_) supports EmmyLua annotations:

```
---@class MyClass
---@field field string A description.

---@param param string Input param.
---@return boolean Success?
function myFunc(param) end
```

These generate:

- **Hover docs** in Neovim (_K_)
- **Autocomplete** for fields/methods
- **Vim help pages** (_:help lazydocker.nvim_)
- **Type checking** warnings

# Type Hierarchy in lazydocker.nvim

The plugin defines a rich type system:

```
---@class LazyDocker
---@field config LazyDocker.Config Module config table. See |LazyDocker.config|.
---@field setup fun(config?: LazyDocker.Config) Module Setup. See |LazyDocker.setup()|.
...
```

**Nested Types**:

```
---@class LazyDocker.Config
---@field window LazyDocker.WindowConfig

---@class LazyDocker.WindowConfig
---@field settings LazyDocker.WindowSettings

---@class LazyDocker.WindowSettings
---@field width number Width of the floating panel...
---@field height number Height...
---@field border string Style...
---@field relative string Layout relative to...
```

**Aliases** for enums:

```
---@alias LazyDocker.Engine string only accepts the values 'podman' and 'docker'
```

# Enhancing Readability

Without types:

```lua
-- What is this? Magic table?
local config = { window = { settings = { width = 0.618 } } }
require('lazydocker').setup(config)
```

With types (hover _config_ generates a full schema!):

```lua
local config: LazyDocker.Config = {
  window = {
    settings = {
      width = 0.618,  -- 0-1 percentage
      border = 'rounded',  -- Valid: 'rounded', 'single', etc.
    }
  }
}
```

**Validation helpers** reference types implicitly:

```lua
function H._is_percentage(a)  -- Ensures 0 < width/height <= 1
vim.validate({ ['width'] = { settings.width, H._is_percentage, '0-1' } })
```

# Supercharged IDE Features

1. **Autocomplete Everywhere**:
   - Type _LazyDocker.config.window.settings._ generates a popup with _width|height|border|relative_.
   - _LazyDocker.open({ engine = '_ generates an autocompletion with _'docker'|'podman'_.

2. **Hover Documentation** (hit _K_):
   - On _LazyDocker.open_: Full _@usage_ examples + param types.
   - Cross-references like _|LazyDocker.config|_ link to help sections.

3. **Error Prevention**:
   - LSP warns: _opts.engine_ must be _'docker'|'podman'_.
   - Invalid _border = 'invalid'_ generates an error message.

4. **Help Integration**:
   ***
   - |LazyDocker.types|
   - |LazyDocker.setup|
   ***
   _:help LazyDocker.types_ renders the _@class_ docs beautifully.
