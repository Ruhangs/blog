import Link from 'next/link';

import { Button } from '@/components/ui/button';

import {
  IconBarandGithub,
  IconLogoBing,
  IconLogoGoogle,
  IconSkillCSS,
  IconSkillDocker,
  IconSkillGithubActionDark,
  IconSkillGithubActionLight, // IconSkillGolang,
  IconSkillHTML,
  IconSkillJavaScript,
  IconSkillMysqlDark,
  IconSkillMysqlLight,
  IconSkillNextjsDark,
  IconSkillNextjsLight,
  IconSkillNginx,
  IconSkillNodejsDark,
  IconSkillNodejsLight,
  IconSkillPrisma,
  IconSkillReactDark,
  IconSkillReactLight,
  IconSkillStackoverflowDark,
  IconSkillStackoverflowLight,
  IconSkillTailwindcssDark,
  IconSkillTailwindcssLight,
  IconSkillTypeScript,
  IconSkillViteDark,
  IconSkillViteLight,
  IconSkillWebpackDark, // IconSkillGolang,
  IconSkillWebpackLight,
} from '@/components/icons';
import { PageHeader } from '@/components/page-header';

import { NAME, PATHS } from '@/constants';
import { socialMediaList } from '@/features/home';

export const revalidate = 60;

export default function Page() {
  let delay = 0;

  // 每次调用，增加延时
  const getDelay = () => (delay += 200);

  return (
    <div className="w-full flex flex-col justify-center px-6 md:max-w-screen-md  2xl:max-w-6xl  md:mx-auto pb-24 pt-8">
      <PageHeader
        breadcrumbList={[PATHS.SITE_HOME, PATHS.SITE_ABOUT]}
        className="mb-0"
      />

      <section className="prose dark:prose-invert prose-zinc  2xl:max-w-6xl">
        <div
          className="animate-fade-up animate-ease-in-out"
          style={{
            animationDelay: `${getDelay()}ms`,
          }}
        >
          <h2>我是谁</h2>
          <p>
            Hi~ 我是{NAME}
            ，一名前端开发工程师，2024年重庆邮电大学毕业，喜欢Coding💻、
            打篮球🏀、旅游🛫、没事看看电影🎞
          </p>
        </div>

        <div
          className="animate-fade-up animate-ease-in-out"
          style={{
            animationDelay: `${getDelay()}ms`,
          }}
        >
          <h2>我的技能</h2>
        </div>

        <div
          className="animate-fade-up animate-ease-in-out"
          style={{
            animationDelay: `${getDelay()}ms`,
          }}
        >
          <h3>前端</h3>
          <ul>
            <li>
              <IconSkillHTML className="mx-1 translate-y-0.5" /> HTML +
              <IconSkillCSS className="mx-1 translate-y-0.5" />
              CSS + <IconSkillJavaScript className="mx-1 translate-y-0.5" />
              JavaScript ，熟练使用
            </li>
            <li>
              <IconSkillTypeScript className="mx-1 translate-y-0.5" />
              TypeScript +
              <>
                <IconSkillReactDark className="dark:hidden mx-1 translate-y-0.5" />
                <IconSkillReactLight className="hidden dark:inline-block mx-1 translate-y-0.5" />
              </>
              React +
              <>
                <IconSkillNextjsDark className="dark:hidden mx-1 translate-y-0.5" />
                <IconSkillNextjsLight className="hidden dark:inline-block mx-1 translate-y-0.5" />
              </>
              Next.js + ahooks +
              <>
                <IconSkillTailwindcssDark className="dark:hidden mx-1 translate-y-0.5" />
                <IconSkillTailwindcssLight className="hidden dark:inline-block mx-1 translate-y-0.5" />
              </>
              Tailwind CSS，熟练使用
            </li>
            <li>
              能够使用
              <>
                <IconSkillWebpackDark className="dark:hidden mx-1 translate-y-0.5" />
                <IconSkillWebpackLight className="hidden dark:inline-block mx-1 translate-y-0.5" />
              </>
              webpack，对项目进行打包并优化； 同时也对开发友好的
              <>
                <IconSkillViteDark className="dark:hidden mx-1 translate-y-0.5" />
                <IconSkillViteLight className="hidden dark:inline-block mx-1 translate-y-0.5" />
              </>
              有一定了解
            </li>
          </ul>
        </div>
        <div
          className="animate-fade-up animate-ease-in-out"
          style={{
            animationDelay: `${getDelay()}ms`,
          }}
        >
          <h3>后端</h3>
          <ul>
            <li>
              <>
                <IconSkillNodejsDark className="dark:hidden mx-1 translate-y-0.5" />
                <IconSkillNodejsLight className="hidden dark:inline-block mx-1 translate-y-0.5" />
              </>
              Node.js，能简单 CRUD 水平
            </li>
            <li>
              <>
                <IconSkillNextjsDark className="dark:hidden mx-1 translate-y-0.5" />
                <IconSkillNextjsLight className="hidden dark:inline-block mx-1 translate-y-0.5" />
              </>
              Next.js + <IconSkillPrisma className="mx-1 translate-y-0.5" />
              Prisma +
              <>
                <IconSkillMysqlDark className="dark:hidden mx-1 translate-y-0.5" />
                <IconSkillMysqlLight className="hidden dark:inline-block mx-1 translate-y-0.5" />
              </>
              MySQL，熟练使用
            </li>
            {/* <li>
              <IconSkillGolang className="mx-1 translate-y-0.5" />
              Golang，非常感兴趣，目前能简单 CRUD，还在努力学习中
            </li> */}
          </ul>
        </div>
        <div
          className="animate-fade-up animate-ease-in-out"
          style={{
            animationDelay: `${getDelay()}ms`,
          }}
        >
          <h3>其它</h3>
          <ul>
            {/* <li>
              用过 <IconLogoCentOS className="mx-1 translate-y-0.5" />
              CentOS、
              <>
                <IconSkillDebianDark className="dark:hidden mx-1 translate-y-0.5" />
                <IconSkillDebianLight className="hidden dark:inline-block mx-1 translate-y-0.5" />
              </>
              Debian、
              <IconLogoRockyLinux className="mx-1 translate-y-0.5" />
              Rocky Linux （最近使用）
            </li> */}
            <li>
              <IconSkillDocker className="mx-1 translate-y-0.5" />
              Docker + Docker Desktop，Docker 起数据库服务
            </li>
            <li>
              使用
              <IconSkillNginx className="mx-1 translate-y-0.5" />
              NGINX 、 Caddy （配置超简单，无需手动配置 HTTPS
              证书），进行反向代理 + 配置 HTTPS + 开启 HTTP2
            </li>
            <li>
              <>
                <IconSkillGithubActionDark className="dark:hidden mx-1 translate-y-0.5" />
                <IconSkillGithubActionLight className="hidden dark:inline-block mx-1 translate-y-0.5" />
              </>
              Github Action，实现项目的CI/CD，使得项目部署非常方便
            </li>
            <li>
              熟练使用 <IconLogoGoogle className="mx-1 translate-y-0.5" />
              Google/
              <IconLogoBing className="mx-1 translate-y-0.5" />
              Bing 搜索 + <IconBarandGithub className="mx-1 translate-y-1" />
              GitHub +
              <>
                <IconSkillStackoverflowDark className="dark:hidden mx-1 translate-y-0.5" />
                <IconSkillStackoverflowLight className="hidden dark:inline-block mx-1 translate-y-0.5" />
              </>
              Stack Overflow + ChatGPT 解决遇到的各种问题
            </li>
          </ul>
        </div>

        {/* <div
          className="animate-fade-up animate-ease-in-out"
          style={{
            animationDelay: `${getDelay()}ms`,
          }}
        >
          <h2>我的爱好</h2>
          <ul>
            <li>🏀热爱打篮球，🛫喜欢旅游，没事看看电影🎞</li>
          </ul>
        </div> */}

        <div
          className="animate-fade-up animate-ease-in-out"
          style={{
            animationDelay: `${getDelay()}ms`,
          }}
        >
          <h2>自我评价</h2>
          对自己要求严格，认真踏实有耐心；对技术抱有热情，具有较强的持续学习能力和研究能力；有良好的编程习惯，善于总结和整理；拥有良好的沟通和协调能力，可以快速融入团队。
        </div>

        <div
          className="animate-fade-up animate-ease-in-out"
          style={{
            animationDelay: `${getDelay()}ms`,
          }}
        >
          <h2>联系我</h2>
          <ul className="!list-none flex space-x-4 items-center !pl-0 !mb-0">
            {socialMediaList.map((el) => (
              <li key={el.link}>
                <Button asChild variant="outline" size="icon">
                  <Link href={el.link} target="_blank">
                    {el.icon}
                  </Link>
                </Button>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </div>
  );
}
