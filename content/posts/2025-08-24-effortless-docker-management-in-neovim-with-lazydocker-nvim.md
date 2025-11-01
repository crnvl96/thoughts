+++
date = '2025-08-24'
draft = true
title = 'Effortless Docker Management in Neovim with lazydocker.nvim'
+++

lazydocker.nvim is my personal Neovim plugin project that brings the power of lazydocker directly into your editor workflow

> Check out the project [source code](https://github.com/crnvl96/lazydocker.nvim) on Github

Docker containers have become essential in modern development workflows, enabling consistent environments, simplified dependency management, and reproducible builds across different systems. However, managing these containers through Docker's native CLI can be time-consuming and context-switch heavy, especially when you need to frequently check logs, monitor resource usage, or restart services during development.

This is where tools like [lazydocker](https://github.com/jesseduffield/lazydocker) come in, providing a terminal-based UI that visualizes container relationships, simplifies common operations, and offers real-time monitoring - all without leaving the terminal. lazydocker solves the problem of Docker management complexity by offering an intuitive interface that makes container operations accessible and efficient.

But what if you could bring that convenience directly into your favorite editor, Neovim? Here enters the role of [lazydocker.nvim](https://github.com/crnvl96/lazydocker.nvim), a simple and straightforward Neovim plugin that seamlessly integrates lazydocker into your development workflow.

## What is lazydocker.nvim?

`lazydocker.nvim` is a Lua-based Neovim plugin that allows you to open lazydocker in a floating window without ever leaving your editor. This means you can quickly check on your containers, view logs, or manage services, and then get right back to your code with a single keystroke.

This is a personal project of mine that I've developed to solve my own Docker management workflow needs. As a developer who spends most of my time in Neovim, I wanted a seamless way to manage containers without context switching. This plugin represents my approach to creating simple, effective tools that enhance developer productivity.

## Key Features

- **Floating Window Integration:** Opens lazydocker in a customizable floating window, keeping you in the Neovim environment.
- **Docker and Podman Support:** Whether you're using Docker or Podman, `lazydocker.nvim` has you covered. You can easily configure it to use your preferred container engine.
- **Simple Configuration:** The plugin comes with sensible defaults, but you can easily customize the floating window's size, border, and position to your liking.
- **Easy to Use:** With a single command or keymap, you can toggle the lazydocker window, making it incredibly efficient to use.
- **Lightweight and Dependency-Free:** The latest version of the plugin has removed its dependencies, making it even more lightweight and easier to maintain.

## Installation and Configuration

You can install `lazydocker.nvim` using your favorite Neovim plugin manager. Here's an example using `lazy.nvim`:

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

The plugin exposes a `toggle` function that you can map to a key of your choice. It's recommended to map it in both normal and terminal modes, as lazydocker runs inside a terminal buffer.

```lua
-- For Docker
vim.keymap.set(
	{ "n", "t" },
	"<leader>ld",
	"<Cmd>lua require('lazydocker').toggle({ engine = 'docker' })<CR>",
	{ desc = "LazyDocker (docker)" }
)

-- For Podman
vim.keymap.set(
	{ "n", "t" },
	"<leader>lp",
	"<Cmd>lua require('lazydocker').toggle({ engine = 'podman' })<CR>",
	{ desc = "LazyDocker (podman)" }
)
```

With these keymaps, you can press `<leader>ld` or `<leader>lp` to open and close the lazydocker window.

## How the Toggle Function Works

The `toggle` function is the core of `lazydocker.nvim`'s user experience. Here's a detailed breakdown of how it operates:

### Core Logic

The toggle function follows a simple but effective pattern:

```lua
function LazyDocker.toggle(opts)
	-- Attempt to close first. If close() returns false, it means
	-- the window wasn't open (or the handle was invalid), so open it.
	if not LazyDocker.close() then
		LazyDocker.open(opts)
	end
end
```

### State Management

The plugin uses global variables to track state:

- `_G.__LazyDocker_Window_Handle`: Stores the window handle of the active lazydocker instance
- `_G.__LazyDocker_Process_JobID`: Stores the Job ID of the running lazydocker process

### Open Operation

When opening:

1. **Validation**: Validates the engine option ('docker' or 'podman')
2. **Focus Existing**: If a window is already open, focuses it instead of creating a new one
3. **Prerequisite Checks**: Verifies both the container engine and lazydocker executables are available
4. **Cleanup**: Stops any hanging lazydocker jobs from previous sessions
5. **Window Creation**: Creates a floating window with customized dimensions and borders
6. **Process Launch**: Starts the lazydocker process in a terminal within the window
7. **Auto-cleanup**: Sets up autocommands to clean up when the window or buffer is closed

### Close Operation

When closing:

1. Checks if the stored window handle is valid using `vim.api.nvim_win_is_valid()`
2. If valid, closes the window with `vim.api.nvim_win_close(win_handle, true)`
3. Clears the window handle reference
4. Returns `true` if a window was closed, `false` otherwise

### Process Management

The plugin uses Neovim's job control API:

- `vim.fn.jobstart()` to launch lazydocker
- `vim.fn.jobstop()` to terminate hanging processes
- `vim.fn.jobwait()` to check process status

### Auto-cleanup System

Autocommands ensure proper cleanup:

- `BufWipeout`: Cleans up when the terminal buffer is destroyed
- `WinClosed`: Cleans up when the window is closed
- Both trigger job termination and state reset

This robust implementation ensures that `lazydocker.nvim` provides a seamless, reliable toggle experience without leaving orphaned processes or windows.

## Project Philosophy: Simplicity and Maintainability

**lazydocker.nvim** is built with a strong emphasis on simplicity and long-term maintainability. The plugin follows a minimalist approach, focusing on doing one thing well without unnecessary complexity or dependencies.

### Documentation as a Priority

Documentation has been taken very seriously from the start. The plugin uses [mini.doc](https://github.com/echasnovski/mini.doc) to ensure comprehensive and accessible documentation. Every function is properly documented with parameter descriptions, return values, and usage examples, making the codebase self-documenting and easier to maintain.

### Testing Strategy

For testing, I've chosen [mini.test](https://github.com/echasnovski/mini.test) with a sophisticated mocking approach that reliably simulates Neovim functions and external dependencies. This strategy enables comprehensive unit testing without requiring actual Docker or lazydocker installations, ensuring tests are fast, reliable, and can run in any environment.

#### Mocking Architecture

The mocking system is implemented through a structured approach in `tests/mocks.lua` that provides:

1. **Function Replacement**: Each mock replaces a specific Neovim API function with a controlled implementation
2. **State Preservation**: Original functions are stored in global variables for easy restoration
3. **Behavior Control**: Mocks can simulate different scenarios (success, failure, missing executables)
4. **Logging**: Mocked functions capture call parameters for verification

#### Key Mock Implementations

- **`vim.fn.executable` Mocks**: Simulate presence/absence of Docker, Podman, and lazydocker executables
- **`vim.fn.jobstart` Mock**: Captures command execution details without actually running processes
- **`vim.notify` Mock**: Collects notification messages for verification
- **Window API Mocks**: Simulate window creation and management operations
- **Autocommand Mocks**: Handle autocmd and augroup creation without side effects

#### Test Isolation

The mocking strategy completely isolates the plugin logic from:

- External system dependencies (Docker, Podman, lazydocker)
- Neovim's actual window management
- Process execution and job control
- Real-time system interactions

This isolation makes the test suite:

- **Fast**: No actual processes are launched
- **Deterministic**: Tests produce consistent results
- **Portable**: Runs anywhere without specific installations
- **Comprehensive**: Covers edge cases and error conditions

## Conclusion

`lazydocker.nvim` is a fantastic plugin for any Neovim user who works with Docker or Podman. It's a simple, yet powerful tool that can significantly improve your development workflow by bringing container management directly into your editor. If you're looking for a way to streamline your Docker workflow in Neovim, give `lazydocker.nvim` a try!
