---
date: 2025-04-27
title: Contributing ESLint Support to nvim-lspconfig
featured: false
tags:
  - Open Source
  - Neovim
  - LSP
authors:
  - crnvl96
---

My recent contribution to the neovim/nvim-lspconfig repository adds comprehensive ESLint language server support using the modern `vim.lsp.config` API. This pull request addresses issue #3705 and provides a seamless integration for JavaScript and TypeScript developers using Neovim.

<!-- excerpt -->

:::tip
Check out the [pull request #3731](https://github.com/neovim/nvim-lspconfig/pull/3731) on GitHub
:::

## The Context: Modernizing nvim-lspconfig

nvim-lspconfig is the official Neovim plugin that provides quickstart configurations for Language Server Protocol (LSP) clients. With the release of Neovim 0.11+, the project has been transitioning from the legacy `require'lspconfig'.setup{}` pattern to the new `vim.lsp.config` API. This modernization effort requires updating all existing configurations to use the new pattern.

The ESLint configuration was one of the remaining configurations that needed to be ported to the new API. Issue [#3705](https://github.com/neovim/nvim-lspconfig/issues/3705) specifically tracked this migration task, and my contribution completes this transition for the ESLint language server.

## The Implementation: Building a Robust ESLint Configuration

The new ESLint configuration in `lsp/eslint.lua` provides a complete implementation that mirrors the functionality of the original configuration while leveraging the modern `vim.lsp.config` API.

### Key Features Implemented

1. **Modern API Compliance**: Uses `vim.lsp.config` instead of the deprecated `lspconfig` framework
2. **Comprehensive ESLint Support**: Includes all the essential ESLint LSP capabilities
3. **Root Directory Detection**: Properly detects ESLint configuration files for workspace setup
4. **Fix All Support**: Implements the `eslint/fixAll` code action for bulk fixes
5. **Buffer-specific Operations**: Ensures operations target the correct buffer context

### Technical Implementation Details

The configuration follows the established patterns in nvim-lspconfig while adding several improvements:

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

### The Challenge: Proper Buffer Context in Fix Operations

One of the key challenges was ensuring that the `eslint/fixAll` code action operated on the correct buffer. The original implementation had an issue where it would sometimes target the wrong buffer context. My contribution includes a fix that properly handles buffer identification:

```lua
fix_all = function()
	local bufnr = vim.api.nvim_get_current_buf()
	vim.lsp.buf_request(bufnr, "workspace/executeCommand", {
		command = "eslint/fixAll",
		arguments = { vim.uri_from_bufnr(bufnr) },
	})
end
```

This ensures that the fix operation always targets the current buffer, preventing cross-buffer contamination.

## Impact and Benefits

This contribution provides several benefits to the Neovim community:

1. **Completion of Migration**: Helps complete the transition to the modern `vim.lsp.config` API
2. **Improved Developer Experience**: JavaScript/TypeScript developers get seamless ESLint integration
3. **Community Collaboration**: Demonstrates the open-source collaboration process
4. **Code Quality**: Sets a standard for future configuration contributions

## The Open Source Contribution Experience

Contributing to a major project like nvim-lspconfig was a valuable experience that highlighted several aspects of open-source development:

1. **Importance of Following Conventions**: Adhering to project style guides and patterns
2. **Thorough Testing**: Ensuring compatibility across different environments
3. **Clear Communication**: Providing context and rationale for implementation choices
4. **Responsive Collaboration**: Addressing review feedback promptly and effectively

## Getting Started with nvim-lspconfig Contributions

For developers interested in contributing to nvim-lspconfig, the process is well-documented:

1. **Read CONTRIBUTING.md**: Understand the project guidelines and expectations
2. **Choose an Issue**: Look for labeled issues or identify missing configurations
3. **Follow Patterns**: Study existing configurations to understand the expected structure
4. **Test Thoroughly**: Verify your configuration works across different setups
5. **Submit PR**: Create a clear pull request with detailed description

## Conclusion

My contribution to nvim-lspconfig's ESLint support demonstrates how individual developers can make meaningful impacts on widely-used open source projects. The successful merge of this pull request not only improves the development experience for JavaScript and TypeScript users but also contributes to the ongoing modernization of the nvim-lspconfig ecosystem.

The collaborative review process and positive community feedback underscore the value of open source contributions and the importance of maintaining high-quality, well-documented code in critical developer tools.

For those interested in exploring the implementation, the complete code is available in the [nvim-lspconfig repository](https://github.com/neovim/nvim-lspconfig/blob/master/lsp/eslint.lua) and serves as a reference for future configuration contributions.
