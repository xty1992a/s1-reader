import * as cheerio from "cheerio";
import * as qs from "qs";
import { forum } from "@/types";

export function parseForumHtml(str: string) {
  try {
    const $ = cheerio.load(str);
    const allForum: forum.ForumOption[] = [];
    $(".sub_forum li").each((i, n) => {
      const li = $(n);
      const num = li.find(".num").text();
      const searchString =
        (li.find("a").attr("href") ?? "").split("?")[1] || "";
      const search = qs.parse(searchString);
      const name = li.text().replace(num, "").replace(/\\\\n/gi, "");
      const fid = (search.get ? search.get("fid") : search["fid"]) || "";

      allForum.push({
        name,
        fid,
      });
    });
    return allForum;
  } catch (e) {
    console.error(e);
    return [];
  }
}
