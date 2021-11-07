import { join } from "https://deno.land/std@0.99.0/path/mod.ts";
import { JSZip } from "https://deno.land/x/jszip@0.10.0/mod.ts";

// Ported `strip` functionality of egoist/extract-zip into the heyd/deno-zip code.
// MIT : https://github.com/hayd/deno-zip
// BSD-2 : https://github.com/egoist-bot/extract-zip

/**
 * Unzip a JSZip asynchronously to a directory
 *
 * @param dir to unzip into
 * @return Returns promise
 */
export async function unzip(jszip: JSZip, dir: string, strip: number): Promise<void> {
  // FIXME optionally replace the existing folder prefix with dir.
  for (const f of jszip) {
    let filenameParts = f.name.split('/')
    filenameParts = filenameParts.slice(
      Math.min(strip, filenameParts.length - 1),
    )
    const ff = join(dir, ...filenameParts);
    if (f.dir) {
      // hopefully the directory is prior to any files inside it!
      await Deno.mkdir(ff, { recursive: true });
      continue;
    }
    const content = await f.async("uint8array");
    // TODO pass WriteFileOptions e.g. mode
    await Deno.writeFile(ff, content);
  }
}
