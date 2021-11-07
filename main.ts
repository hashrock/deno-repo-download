import { join } from "https://deno.land/std@0.113.0/path/mod.ts";
import { readZip } from "https://deno.land/x/jszip@0.10.0/mod.ts";
import { unzip } from "./zip.ts";
import { wait } from "https://deno.land/x/wait@0.1.12/mod.ts";
import { fetchZip, getDefaultBranch, getUrl } from "./util.ts";
import { Command } from "https://deno.land/x/cliffy@v0.20.1/command/mod.ts";

async function main() {
  const { options, args } = await new Command()
    .name("deno-repo-download")
    .description("Repository Downloader for GitHub")
    .arguments("<repo> <output-path>")
    .parse(Deno.args);

  const [user, repo] = args[0].split("/");
  const outputPath = args[1];

  // fetch default branch from GitHub API
  const defaultBranch = await getDefaultBranch(user, repo);
  const repoInfo = {
    user,
    repo,
    version: `refs/heads/${defaultBranch}`,
  };
  const url = getUrl(repoInfo);
  const tmpdir = await Deno.makeTempDir({
    prefix: `deno-repo-download-${Date.now()}`,
  });
  const downloadUri = join(tmpdir, `${defaultBranch}.zip`);

  const spinner = wait("Downloading ZIP from GitHub").start();

  await fetchZip(url, downloadUri);
  spinner.text = "extracting ZIP";

  if (outputPath !== ".") {
    await Deno.mkdir(outputPath);
  }

  if (outputPath === ".") {
    // check if directory is not empty
    const files = await Deno.readDir(outputPath);
    for await (const _ of files) {
      throw new Error("Directory is not empty");
    }
  }

  const z = await readZip(downloadUri);
  await unzip(z, outputPath, 1);

  spinner.text = "Cleanup cache";
  await Deno.remove(downloadUri);
  await Deno.remove(tmpdir);
  spinner.succeed("Repo download succeed");
}

main();
