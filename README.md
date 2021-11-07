# deno-repo-download

Download the GitHub repository in ZIP and extract it to a local directory.

Inspired from [SAO](https://github.com/saojs/sao) by egoist.

# Usage

> deno-repo-download username/repo [dir]

> deno run --allow-net=api.github.com,github.com,codeload.github.com --allow-write --allow-read .\main.ts saojs/sao tmp

> deno install --allow-net=api.github.com,github.com,codeload.github.com --allow-write --allow-read .\main.ts