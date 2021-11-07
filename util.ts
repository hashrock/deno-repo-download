import { copy } from "https://deno.land/std@0.113.0/io/util.ts";
import { readerFromStreamReader } from "https://deno.land/std@0.113.0/io/mod.ts";

export interface RepoInfo {
  user: string;
  repo: string;
  version: string;
}

export function getUrl(info: RepoInfo): string {
  return `https://github.com/${info.user}/${info.repo}/archive/${info.version}.zip`;
}

export async function getDefaultBranch(user: string, repo: string) {
  const res = await fetch(`https://api.github.com/repos/${user}/${repo}`);
  const json = await res.json();
  return json.default_branch;
}

export async function fetchZip(url: string, downloadUri: string) {
  const rsp = await fetch(url);
  const rdr = rsp.body?.getReader();
  if (rdr) {
    const r = readerFromStreamReader(rdr);
    const f = await Deno.open(downloadUri, {
      create: true,
      write: true,
    });
    await copy(r, f);
    f.close();
  }
}
