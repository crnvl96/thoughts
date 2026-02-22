+++
title = "Docker mangement in Neovim"
date = "2025-08-24"
+++

lazydocker.nvim is my personal Neovim plugin project that brings the power
of lazydocker directly into your editor workflow

> Check out the project [source code](https://github.com/crnvl96/lazydocker.nvim)
> on Github on GitHub

_lazydocker.nvim_ is a Lua-based Neovim plugin that allows you to open
lazydocker in a floating window without ever leaving your editor.
This means you can quickly check on your containers, view logs, or
manage services, and then get right back to your code with a single keystroke.

This is a personal project of mine that I've developed to solve
my own Docker management workflow needs. As a developer who spends
most of my time in Neovim, I wanted a seamless way to manage containers without context switching.

## Installation and configuration

```lua
{
  'crnvl96/lazydocker.nvim',
  config = function()
    require('lazydocker').setup({
      window = {
        settings = {
          width = 0.8, -- 80% of screen width
          height = 0.8, -- 80% of screen height
          border = 'rounded',
        },
      },
    })
  end,
}
```

## Usage

The plugin exposes a _toggle_ function that you can map to a key of your choice.
It's recommended to map it in both normal and terminal modes, as
lazydocker runs inside a terminal buffer.

```lua
vim.keymap.set(
    { "n", "t" },
    "<leader>ld",
    "<Cmd>lua require('lazydocker').toggle({ engine = 'docker' })<CR>",
    { desc = "LazyDocker (docker)" }
)
```
