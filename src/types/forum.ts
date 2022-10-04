export interface ThreadItem {
  tid: string;
  readperm: string;
  author: string;
  authorid: string;
  subject: string;
  dateline: string;
  lastpost: string;
  lastposter: string;
  views: string;
  replies: string;
  digest: string;
  attachment: string;
  dbdateline: string;
  dblastpost: string;
  newreplies: number
  read: boolean
}

export interface ForumItem {
  fid: string | number;
  name: string;
  threads: string;
  posts: string;
  todayposts: string;
}

export interface PostItem {
  "pid": string;
  "tid": string;
  "first": string;
  "author": string;
  "authorid": string;
  "dateline": string;
  "message": string;
  "anonymous": string;
  "attachment": string;
  "attachments": Record<string, Attachment>;
  "imagelist": string[];
  "status": string;
  "username": string;
  "adminid": string;
  "groupid": string;
  "memberstatus": string;
  "number": string;
  "dbdateline": string;
}

export interface ThreadDetail {
  addviews: string;
  allreplies: string;
  archiveid: string;
  attachment: string;
  author: string;
  authorid: string;
  bgcolor: string;
  closed: string;
  comments: string;
  cover: string;
  dateline: string;
  digest: string;
  displayorder: string;
  favtimes: string;
  fid: string;
  heatlevel: string;
  heats: string;
  hidden: string;
  highlight: string;
  icon: string;
  is_archived: string;
  isgroup: string;
  lastpost: string;
  lastposter: string;
  maxposition: string;
  moderated: string;
  posttable: string;
  posttableid: string;
  price: string;
  pushedaid: string;
  rate: string;
  readperm: string;
  recommend_add: string;
  recommend_sub: string;
  recommendlevel: string;
  recommends: string;
  relatebytag: string;
  relay: string;
  replies: string;
  replycredit: string;
  replycredit_rule: string;
  sharetimes: string;
  short_subject: string;
  sortid: string;
  special: string;
  stamp: string;
  status: string;
  stickreply: string;
  subject: string;
  subjectenc: string;
  threadtable: string;
  threadtableid: string;
  tid: string;
  typeid: string;
  views: string;
}

export interface Attachment {
  "aid": string //"1113198",
  "tid":  string //"2097847",
  "pid":  string //"57742870",
  "uid":  string //"182491",
  "dateline":  string //"2022-10-3 12:37",
  "filename":  string //"尼古拉·特斯拉和南斯拉夫国王彼得。1942 纽约.jpg",
  "filesize":  string //"80096",
  "attachment":  string //"202210/03/123706mah06z0bvbt3y5hc.jpg",
  "remote":  string //"0",
  "description":  string //"",
  "readperm":  string //"0",
  "price":  string //"0",
  "isimage":  string //"-1",
  "width":  string //"602",
  "thumb":  string //"0",
  "picid":  string //"0",
  "ext":  string //"jpg",
  "imgalt":  string //"尼古拉·特斯拉和南斯拉夫国王彼得。1942 纽约.jpg",
  "attachicon":  string //"",
  "attachsize":  string //"78.22 KB",
  "attachimg":  string //"1",
  "payed":  string //"0",
  "url":  string //"https://img.saraba1st.com/forum/",
  "dbdateline":  string //"1664771826",
  "downloads":  string //"0"
}

export interface Message {
  messagestr: string;
  messageval: string;
}

export interface Notice {
  "newpush": "0",
  "newpm": "0",
  "newprompt": "0",
  "newmypost": "0"
}
