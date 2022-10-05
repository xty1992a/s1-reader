import {get, request} from "./request";
import type {forum} from "@/types";
import qs from 'qs';

interface GetTreadListRequest {
  // 版块
  fid: forum.ForumItem["fid"];
  // 页码
  page: number;
  size: number
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
  Message?: forum.Message
}

const mock = new Promise(resolve => {
  return resolve({
    success: true,
    data: {"Version":"1","Charset":"UTF-8","Variables":{"cookiepre":"B7Y9_2132_","auth":null,"saltkey":"PWZvz2wx","member_uid":"0","member_username":"","member_avatar":"https:\/\/avatar.saraba1st.com\/data\/avatar\/000\/00\/00\/00_avatar_small.jpg","groupid":"7","formhash":"6b766e21","ismoderator":"0","readaccess":"10","notice":{"newpush":"0","newpm":"0","newprompt":"0","newmypost":"0"},"allowperm":{"allowpost":"0","allowreply":"0","uploadhash":"4550ccefe6af37d85a01c08f2ee6d8f4"},"forum":{"fid":"75","rules":"\u5373\u65e5\u8d77\uff0c\u5982\u4e0b\u5185\u5bb9\u4e0d\u5f97\u53d1\u5e03\u3002<br \/>\r\n1\uff0c\u6d89\u53ca\u56fd\u5bb6\u9886\u5bfc\u4eba\uff0c\u653f\u5e9c\uff0c\u519b\u4e8b\uff0c\u5916\u4ea4\u7b49\u5185\u5bb9\u3002<br \/>\r\n2\uff0c\u6d89\u53ca\u56fd\u5916\u653f\u6cbb\uff08\u4e0e\u653f\u5e9c\uff0c\u56fd\u9645\uff0c\u7ecf\u6d4e\u7b49\u76f8\u5173\uff09\u7c7b\u5185\u5bb9\u3002<br \/>\r\n3\uff0c\u4e0e\u56fd\u5bb6\u9886\u5bfc\u4eba\u76f8\u5173\u7684\u53d8\u4f53\uff0c\u4ee3\u79f0\u7b49<br \/>\r\n4\uff0c\u4e0d\u8bba\u4efb\u4f55\u76ee\u7684\uff0c\u4e0d\u5f97\u53d1\u5e03\u6d77\u5916\u793e\u4ea4\u5a92\u4f53\u7684\u4ee5\u4e0a\u5185\u5bb9\uff08\u522b\u8f6c\u6c99\u96d5\u7c7b\u653f\u6cbb\u5185\u5bb9\uff09<br \/>\r\n<br \/>\r\n\u4f60\u4eec\u8981\u662f\u771f\u7684\u8fd8\u60f3\u5353\u660e\u8c37\u5b58\u5728\u7684\u8bdd\uff0c\u518d\u6765\u4e00\u6b21\uff0c\u5c31\u6254\u4e86\u5353\u660e\u8c37\u5427\u3002\u52a8\u6f2b\u6e38\u620f\u8bba\u575b\u4e5f\u8fd8\u884c\u3002","fup":"1","name":"\u5353\u660e\u8c37","threads":"635072","posts":"16777215","autoclose":"0","password":"0"},"group":{"groupid":"7","grouptitle":"\u6e38\u5ba2"},"forum_threadlist":[{"tid":"1842868","readperm":"0","author":"Prushka","authorid":"516449","subject":"[\u7ef4\u62a4\u5b8c\u6210]\u672c\u8d34\u4ece\u4eca\u65e5\u8d77\u5f00\u59cb\u7edf\u8ba1S1QQ\u7fa4\u76f8\u5173\u4fe1\u606f","dateline":"2019-6-28 13:29","lastpost":"2022-9-27 11:24","lastposter":"\u51b0\u7bb1\u7814\u4f1a\u957f","views":"370462","replies":"351","digest":"0","attachment":"0","dbdateline":"1561699785","dblastpost":"1664249083"},{"tid":"334540","readperm":"0","author":"john","authorid":"119","subject":"\u5916\u91ce\u7248\u89c4 - 18.04.13.\u7981\u6b62\u65e0\u671f\u9650\u548c\u8d85\u957f\u671f\u9650\u7684\u6295\u7968","dateline":"2008-2-9 19:32","lastpost":"2020-9-11 18:29","lastposter":"\u6d3b\u4e45\u89c1","views":"722273","replies":"1","digest":"0","attachment":"0","dbdateline":"1202556770","dblastpost":"1599820184"},{"tid":"2097710","readperm":"0","author":"\u5929\u7a79\u89c2\u6d4b\u8005","authorid":"554269","subject":"\u7535\u8f66\u786e\u5b9e\u9999\u554a\uff0c\u4e0d\u5173\u6cb9\u4e8b","dateline":"2022-10-2 12:31","lastpost":"2022-10-2 22:53","lastposter":"nohope","views":"10031","replies":"84","digest":"0","attachment":"0","dbdateline":"1664685118","dblastpost":"1664722384"},{"tid":"2097577","readperm":"0","author":"michaelakan","authorid":"73","subject":"10\u6708\u9e45\u4e4c\u65b0\u756a\u4e13\u697c#12\uff0c\u53c8\u53cc\u53d2\u53d5\u7684\u76f4\u63a5\u585e","dateline":"2022-10-1 11:04","lastpost":"2022-10-2 22:52","lastposter":"\u661f\u8e2a\u5e7b\u5f71","views":"48774","replies":"1328","digest":"0","attachment":"2","dbdateline":"1664593464","dblastpost":"1664722372"},{"tid":"2097763","readperm":"0","author":"\u8fc7\u5f80\u5316\u8f7b","authorid":"554019","subject":"\u6f6d\u53cb\u53ef\u4ee5\u5e2e\u6211\u9009\u62e9\u8f66\u4e0b\u4e48\uff1f","dateline":"2022-10-2 19:29","lastpost":"2022-10-2 22:52","lastposter":"\u8fc7\u5f80\u5316\u8f7b","views":"2361","replies":"70","digest":"0","attachment":"0","dbdateline":"1664710146","dblastpost":"1664722371"},{"tid":"2097780","readperm":"0","author":"ninini212","authorid":"65104","subject":"\u622a\u6b62\u5341\u4e8c\u70b9\u5fae\u4fe1\u4e91\u95ea\u4ed8\u6709\u4f18\u60e0","dateline":"2022-10-2 21:32","lastpost":"2022-10-2 22:52","lastposter":"wuxan94","views":"938","replies":"12","digest":"0","attachment":"2","dbdateline":"1664717522","dblastpost":"1664722349"},{"tid":"2097594","readperm":"0","author":"robertjiong","authorid":"511787","subject":"\u5f11\u6bcd\u6848\u5f53\u4e8b\u4eba\u5434\u8c22\u5b87\u53d1\u58f0\uff1a\u4e0d\u613f\u610f\u6bcd\u4eb2\u88ab\u6f14\u6210\u4e00\u4e2a\u574f\u4eba","dateline":"2022-10-1 12:37","lastpost":"2022-10-2 22:52","lastposter":"dren_zheng","views":"18366","replies":"73","digest":"0","attachment":"2","dbdateline":"1664599053","dblastpost":"1664722328"},{"tid":"2097683","readperm":"0","author":"S.T.A.L.K.E.R","authorid":"547591","subject":"\u6c42\u63a8\u8350\u5c0f\u8bf4","dateline":"2022-10-2 04:17","lastpost":"2022-10-2 22:52","lastposter":"\u672c\u5f02\u672b\u540c","views":"1473","replies":"20","digest":"0","attachment":"0","dbdateline":"1664655456","dblastpost":"1664722324"},{"tid":"2097770","readperm":"0","author":"\u6708\u89c1\u9ed1","authorid":"479307","subject":"\u770b\u5f97\u51fa\u6765\u300a\u5e95\u7ebf\u300b\u4e0a\u6620\u540e\u6709\u4e9b\u4eba\u771f\u7684\u5f88\u6025\u554a","dateline":"2022-10-2 20:49","lastpost":"2022-10-2 22:51","lastposter":"DelayNoMore","views":"3309","replies":"26","digest":"0","attachment":"2","dbdateline":"1664714943","dblastpost":"1664722312"},{"tid":"2097699","readperm":"0","author":"spunky23","authorid":"516163","subject":"\u53cc\u5341\u4e00\uff0c\u4f60\u51c6\u5907\u4e70\u5565\u5462?","dateline":"2022-10-2 11:36","lastpost":"2022-10-2 22:51","lastposter":"\u6ce2\u5361\u5e15\u9a6c","views":"6977","replies":"105","digest":"0","attachment":"0","dbdateline":"1664681786","dblastpost":"1664722277"}],"sublist":[{"fid":"74","name":"\u9a6c\u53c9\u866b","threads":"16184","posts":"662198","todayposts":"16"}],"tpp":"10","page":"1","threadtypes":{"required":"1","listable":"1","prefix":"1","types":{"138":"\u751f\u6d3b","139":"\u6b22\u4e50","173":"\u79d1\u6280","174":"\u65c5\u6e38","140":"\u793e\u4f1a","141":"\u6d77\u5916","142":"\u804c\u573a","145":"\u684c\u6e38","146":"\u7ecf\u6d4e","147":"\u80b2\u513f","148":"\u5065\u5eb7","149":"\u6c42\u52a9","150":"\u798f\u5229","176":"\u8bfb\u4e66","375":"\u97f3\u4e50","378":"\u7f8e\u98df","376":"\u5ba0\u7269","377":"\u8f7d\u5177","151":"\u5176\u4ed6"},"icons":{"138":"","139":"","173":"","174":"","140":"","141":"","142":"","145":"","146":"","147":"","148":"","149":"","150":"","176":"","375":"","378":"","376":"","377":"","151":""},"moderators":{"138":null,"139":null,"173":null,"174":null,"140":null,"141":null,"142":null,"145":null,"146":null,"147":null,"148":null,"149":null,"150":null,"176":null,"375":null,"378":null,"376":null,"377":null,"151":null}}}},
    message: ''
  })
})
export const getThreadList = (request: GetTreadListRequest) => /*process.env.NODE_ENV === 'development' ? mock : */get<GetThreadListResponse>(
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
  {loading: false}
  );

interface GetPostDetailResponse {
  Variables: {
    "cookiepre": string
    "auth": string
    "saltkey": string
    "member_uid": string
    "member_username": string
    "member_avatar": string
    "groupid": string
    "formhash": string
    "ismoderator": string
    "readaccess": string
    notice: Record<string, string>
    fid: string
    postlist: forum.PostItem[]
    thread: forum.ThreadDetail
  }
  Message?: forum.Message
}
export const getPostDetail = (request: {page: number | string, tid: string, size?: number}, loading=true) => get<GetPostDetailResponse>('/2b/api/mobile/index.php', {
  // mobile=no&module=viewthread&page=1&ppp=30&submodule=checkpost&tid=2097772&version=1
  mobile: 'no',
  module: 'viewthread',
  submodule: 'checkpost',
  version: "1",
  page: request.page,
  tid: request.tid,
  ppp: request.size
}, {loading})
  .then(res => {
    if (res.success && res.data?.Variables?.postlist?.length && res.data?.Variables?.thread?.authorid) {
      res.data.Variables.postlist.forEach(it => {
        it.ishost = it.authorid === res.data.Variables.thread.authorid
      })
    }
    return res
  })


interface LoginRequest {
  'username': string,
  'password': string,
}

interface LoginResponse {
  "Variables": {
    "cookiepre":  string; //"B7Y9_2132_",
    "auth":  string; //"6b7bPIEK+FqP3Yf4OYIcLWzlSb2ypF2B7o0cqUJitClcpzejlPXckN+uqo8B0Ox6NkTfboxZueEB3S1oJSeq0lLXB7Y",
    "saltkey":  string; //"pVc5LFXE",
    "member_uid":  string; //"246801",
    "member_username":  string; //"redbuck",
    "member_avatar":  string; //"https://avatar.saraba1st.com/data/avatar/000/24/68/01_avatar_small.jpg",
    "groupid":  string; //"53",
    "formhash":  string; //"a7ba56a5",
    "ismoderator":  string; //null,
    "readaccess":  string; //"100",
    "notice": forum.Notice
  },
  "Message"?: forum.Message
}


// https://bbs.saraba1st.com/2b/api/mobile/?cookietime=2592000&loginfield=auto&loginsubmit=yes&mobile=no&module=login&version=1
export const login = (data: LoginRequest) => request<LoginResponse>('/2b/api/mobile/?cookietime=2592000&loginfield=auto&loginsubmit=yes&mobile=no&module=login&version=1', {
  method: 'POST',
  headers: {
    'content-type': 'application/x-www-form-urlencoded',
  },
  data: qs.stringify({
    ...data,
    'questionid': '1',
    'answer': ''
  }),
})

// https://bbs.saraba1st.com/2b/api/mobile/index.php?mobile=no&module=secure&type=login&version=1
export const visit = () => get('/2b/api/mobile/index.php', {
  mobile: 'no',
  module: 'secure',
  type: 'login',
  version: '1'
})
