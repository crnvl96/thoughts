+++
title = "Contributing ESLint Support to nvim-lspconfig"
date = "2025-04-27"
+++

My recent contribution to the [neovim/nvim-lspconfig](https://github.com/neovim/nvim-lspconfig) repository
adds comprehensive [eslint](https://www.google.com/url?sa=t&source=web&rct=j&opi=89978449&url=https://eslint.org/&ved
=2ahUKEwjH_Kzy1u2QAxUwALkGHSjBNWQQFnoECA8QAQ&usg=AOvVaw3BGEnWIUCsLA7AsBnz99Wm)
language server support using the modern [vim.lsp.config](<https://neovim.io/doc/user/lsp.html#vim.lsp.config()>)
api. this pull request addresses [issue #3075](https://github.com/neovim/nvim-lspconfig/issues/3705).

> Check out the [pull request #3731](https://github.com/neovim/nvim-lspconfig/pull/3731) on GitHub

nvim-lspconfig is the official Neovim plugin that provides quickstart configurations
for Language Server Protocol (LSP) clients. With the release of [Neovim 0.11](https://neovim.io/news/2025/03),
the project has been transitioning from the legacy _require'lspconfig'.setup{}_ pattern to the new
_vim.lsp.config_ API. This modernization efforttt requires updating all
existing configurations to use the new pattern.

The ESLint configuration was one of the remaining configurations that
needed to be ported to the new API. [Issue #3705](https://github.com/neovim/nvim-lspconfig/issues/3705)
specifically tracked this migration task, and my contribution accomplishes this
transition for the [eslint](https://eslint.org/ESLint) language server.

The configuration follows the established patterns in nvim-lspconfig:

```lua
return {
    name = "eslint",
    cmd = { "vscode-eslint-language-server", "--stdio" },
    filetypes = {
        "javascript",
        "javascriptreact",
        "javascript.jsx",
        "typescript",
        "typescriptreact",
        "typescript.tsx",
        "vue",
        "svelte",
        "astro",
    },
    root_dir = function(fname)
        return util.root_pattern(
            ".eslintrc",
            ".eslintrc.js",
            ".eslintrc.cjs",
            ".eslintrc.yaml",
            ".eslintrc.yml",
            ".eslintrc.json",
            "eslint.config.js",
            "package.json"
        )(fname) or util.find_git_ancestor(fname)
    end,
    -- ... additional configuration
}
```
