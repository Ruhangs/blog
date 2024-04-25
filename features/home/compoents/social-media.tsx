import {
  IconBarandGithub,
  IconEvaPhone,
  IconSkillGmailLight,
} from '@/components/icons';

import { EMAIL, GITHUB_PAGE, PHONE_NUMBER } from '@/constants';

export const socialMediaList: Array<{
  icon: React.ReactNode;
  label: string;
  link: string;
}> = [
  {
    icon: <IconBarandGithub className="text-2xl text-[#ffcd64]" />,
    label: 'Github',
    link: GITHUB_PAGE,
  },
  {
    icon: <IconSkillGmailLight className={`text-2xl text-[#ffcd64]`} />,
    label: 'Email',
    link: `mailto:${EMAIL}`,
  },
  {
    icon: <IconEvaPhone className={`text-2xl text-[#ffcd64]`} />,
    label: 'phone',
    link: `tel:${PHONE_NUMBER}`,
  },

  // {
  //   icon: <IconBrandBilibili className={`text-2xl text-[#ffcd64]`} />,
  //   label: 'Bilibili',
  //   link: BILIBILI_PAGE,
  // },
  // {
  //   icon: <IconLogoJuejin className={`text-2xl text-[#ffcd64]`} />,
  //   label: '掘金',
  //   link: JUEJIN_PAGE,
  // },
];
