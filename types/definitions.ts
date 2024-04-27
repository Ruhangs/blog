export type User = {
  id: string;
  name: string;
  password: string;
  email: string;
  emailVerified: Date;
  image: string;
  // accounts: Account[];
  // sessions: Session[];
};

export type websiteAllInfoType = {
  pageviews: obj;
  visitors: obj;
  visits: obj;
  bounces: obj;
  totaltime: obj;
};

interface obj {
  value: number;
  change: number;
}

// type Account = {
//   id: string;
// };

// type Session = {
//   id: string;
// };

// interface Post {
//   title: string;
// }

// interface Profile {
//   id: string;
//   avatar: string;
//   introduction: string;
//   weixin: string;
//   qq: string;
//   github: string;
//   university: string;
//   hometown: string;
//   grade: string;
//   user: User;
//   userId: string;
// }
