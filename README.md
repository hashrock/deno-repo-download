# deno-repo-download

Download the GitHub repository in ZIP and extract it to a local directory.

Inspired from [SAO](https://github.com/saojs/sao) by egoist.

# Install

```shell
deno install --allow-net=api.github.com,github.com,codeload.github.com --allow-write --allow-read https://denopkg.com/hashrock/deno-repo-download@1.0.0/main.ts
```

# Usage

```shell
deno-repo-download username/repo [dir]
```

# Using sift template

```shell
deno-repo-download hashrock/sift-packup-template myapp
```
