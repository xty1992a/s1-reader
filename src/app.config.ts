import { tabbarList } from "./const/config";

export default defineAppConfig({
  pages: ["pages/home/index", "pages/my/index"],
  subpackages: [
    {
      root: "subpack",
      pages: [
        "post-detail/index",
        "favorite/index",
        "message/index",
        "forum/index",
        "setting/index",
      ],
    },
  ],
  window: {
    backgroundTextStyle: "light",
    navigationBarBackgroundColor: "#F6F7EB",
    navigationBarTitleText: "WeChat",
    navigationBarTextStyle: "black",
    backgroundColor: "#F6F7EB",
  },
  tabBar: {
    backgroundColor: "#ffd5db",
    custom: true,
    list: tabbarList,
  },
  usingComponents: {
    "i-color": "@/components/color-picker/color-picker",
  },
});
