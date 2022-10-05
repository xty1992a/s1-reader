import * as cheerio from "cheerio";
import { forum } from "@/types";

export function fmtRichText(
  text: string,
  attrs: Record<string, forum.Attachment>
) {
  const $ = cheerio.load(
    text.replace(/\[attach\](\d+)\[\/attach\]/gi, `<img attach="$1" />`)
  );
  $("img").each((i, it) => {
    const img = $(it);
    if (img.attr("smilieid")) return;

    const attachKey = img.attr("attach");
    if (attachKey) {
      const attachment = attrs[attachKey];
      img.attr("src", attachment.url + attachment.attachment);
    }
    img.css({
      width: "100%",
    });
  });

  return $("body").html() || "";
}
