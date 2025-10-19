+++
date = '2025-10-18'
draft = false
title = 'Introducing Dirt: Keep Your Git Repositories Clean'
+++

Dirt is a lightweight command-line tool built in Go that helps developers maintain clean Git repositories across their workspaces. It scans specified directories (and subdirectories up to 2 levels deep)
for Git repos, checking each for uncommitted changes or unpushed commits.

> Check out the project [source code](https://github.com/crnvl96/dirt) on GitHub

## The Problem It Solves

In large codebases or multi-project setups, it's easy to forget about local changes or commits that haven't been pushed. Dirt automates the discovery of "dirty" repositories, saving time and preventing
lost work or merge conflicts.

## Key Features

• Recursive scanning: Searches directories up to 2 levels deep by default
• Clear output: Uses colored terminal output to highlight clean vs. dirty repos
• Flexible targets: Specify multiple directories or scan the current one
• Fast execution: Leverages Go's performance for quick scans

## Technical Decisions

• Go ecosystem: Chosen for its speed, cross-platform binaries, and strong standard library
• Cobra CLI framework: Provides robust command-line parsing and help generation
• Lipgloss styling: Adds visual appeal with minimal dependencies for terminal output
• Simple architecture: Pure functions for core logic, easy to test and maintain

## Getting Started

Install via Go: go install github.com/crnvl96/dirt@latest

Basic usage: dirt (scans current directory) or dirt -t ~/projects -t ~/config

Contributions welcome!
