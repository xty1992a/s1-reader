import { get, request, post } from "./request";
import type { forum, message } from "@/types";
import {exactMessage, parseForumHtml} from "@/utils/html";
import qs from "qs";

interface GetTreadListRequest {
  // 版块
  fid: forum.ForumItem["fid"];
  // 页码
  page: number;
  size: number;
}

interface GetThreadListResponse {
  Variables: {
    auth: string;
    member_uid: string;
    member_username: string;
    member_avatar: string;
    notice: Record<string, any>;
    forum: Record<string, any>;
    group: Record<string, any>;
    forum_threadlist: forum.ThreadItem[];
    sublist: forum.ForumItem[];
    threadtypes: {
      required: string;
      listable: string;
      prefix: string;
      types: Record<string, string>;
      icons: Record<string, string>;
      moderators: Record<string, string>;
    };
  };
  Message?: forum.Message;
}

export const getThreadList = (request: GetTreadListRequest) =>
  get<GetThreadListResponse>(
    "/2b/api/mobile/index.php",
    {
      ...request,
      tpp: request.size || 10,
      mobile: "no",
      module: "forumdisplay",
      orderby: "dblastpost",
      submodule: "checkpost",
      version: "1",
    },
    { loading: false }
  );

interface GetPostDetailResponse {
  Variables: {
    cookiepre: string;
    auth: string;
    saltkey: string;
    member_uid: string;
    member_username: string;
    member_avatar: string;
    groupid: string;
    formhash: string;
    ismoderator: string;
    readaccess: string;
    notice: Record<string, string>;
    fid: string;
    postlist: forum.PostItem[];
    thread: forum.ThreadDetail;
  };
  Message?: forum.Message;
}

export const getPostDetail = (
  request: { page: number | string; tid: string; size?: number },
  loading = true
) =>
  get<GetPostDetailResponse>(
    "/2b/api/mobile/index.php",
    {
      // mobile=no&module=viewthread&page=1&ppp=30&submodule=checkpost&tid=2097772&version=1
      mobile: "no",
      module: "viewthread",
      submodule: "checkpost",
      version: "1",
      page: request.page,
      tid: request.tid,
      ppp: request.size,
    },
    { loading }
  ).then((res) => {
    if (
      res.success &&
      res.data?.Variables?.postlist?.length &&
      res.data?.Variables?.thread?.authorid
    ) {
      res.data.Variables.postlist.forEach((it) => {
        it.ishost = it.authorid === res.data.Variables.thread.authorid;
      });
    }
    return res;
  });

interface LoginRequest {
  username: string;
  password: string;
}

interface LoginResponse {
  Variables: {
    cookiepre: string; //"B7Y9_2132_",
    auth: string; //"6b7bPIEK+FqP3Yf4OYIcLWzlSb2ypF2B7o0cqUJitClcpzejlPXckN+uqo8B0Ox6NkTfboxZueEB3S1oJSeq0lLXB7Y",
    saltkey: string; //"pVc5LFXE",
    member_uid: string; //"246801",
    member_username: string; //"redbuck",
    member_avatar: string; //"https://avatar.saraba1st.com/data/avatar/000/24/68/01_avatar_small.jpg",
    groupid: string; //"53",
    formhash: string; //"a7ba56a5",
    ismoderator: string; //null,
    readaccess: string; //"100",
    notice: forum.Notice;
  };
  Message?: forum.Message;
}

// https://bbs.saraba1st.com/2b/api/mobile/?cookietime=2592000&loginfield=auto&loginsubmit=yes&mobile=no&module=login&version=1
export const login = (data: LoginRequest) =>
  request<LoginResponse>(
    "/2b/api/mobile/?cookietime=2592000&loginfield=auto&loginsubmit=yes&mobile=no&module=login&version=1",
    {
      method: "POST",
      headers: {
        "content-type": "application/x-www-form-urlencoded",
      },
      data: qs.stringify({
        ...data,
        questionid: "1",
        answer: "",
      }),
    }
  );

// https://bbs.saraba1st.com/2b/api/mobile/index.php?mobile=no&module=secure&type=login&version=1
export const visit = () =>
  get("/2b/api/mobile/index.php", {
    mobile: "no",
    module: "secure",
    type: "login",
    version: "1",
  });

interface GetMessageListResponse {
  Variables: {
    list: message.MessageItem[];
    count: string
  };
}

export const getMessageList = (request: { page: number }) =>
  get<GetMessageListResponse>("/2b/api/mobile/index.php", {
    // module=mypm&version=1&page=1&mobile=no
    module: "mypm",
    version: "1",
    page: request.page,
    mobile: "no",
  });

interface GetFavoriteListResponse {
  Variables: {
    list: forum.FavPost[];
    count: string
  };
}
export const getFavoriteList = (request: { page: number }) =>
  get<GetFavoriteListResponse>("/2b/api/mobile/index.php", {
    // ?module=myfavthread&version=1&page=1&mobile=no
    module: "myfavthread",
    version: "1",
    page: request.page,
    mobile: "no",
  });

export const getForumList = () =>
  get<forum.ForumOption[]>(
    "/2b/forum.php",
    {
      forumlist: 1,
      mobile: 2,
    },
    {
      isSuccess: (_) => true,
      toast: false,
    }
  ).then((res) => {
    if (res.success && typeof res.data === "string") {
      res.data = parseForumHtml(res.data);
    }
    return res;
  });

/**
 * 收藏帖子
 * */
export const addFavoriteThread = (body: {tid: string, formhash: string}) => request(`/2b/home.php`, {
  method: 'POST',
  params: {
    mod:'spacecp',
    ac:'favorite',
    type:'thread',
    id: body.tid,
    mobile:'2',
    handlekey:'favbtn',
    formhash: body.formhash,
    inajax:'1',
  },
  headers: {
    "content-type": "application/x-www-form-urlencoded",
  },
}, {
  isSuccess: res => res.data.includes('信息收藏成功'),
  message: res => exactMessage(res.data )
})
