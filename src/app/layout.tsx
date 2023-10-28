import '../styles/index.css'

import { Analytics } from '@vercel/analytics/react'
import { ToastContainer } from 'react-toastify'
import type { AggregateRoot } from '@mx-space/api-client'
import type { Viewport } from 'next'
import type { AppThemeConfig } from './config'

import { ClerkProvider } from '@clerk/nextjs'

import PKG from '~/../package.json'
import { HydrationEndDetector } from '~/components/common/HydrationEndDetector'
import { ScrollTop } from '~/components/common/ScrollTop'
import { Root } from '~/components/layout/root/Root'
import { SearchPanelWithHotKey } from '~/components/widgets/shared/SearchFAB'
import { TocAutoScroll } from '~/components/widgets/toc/TocAutoScroll'
import { attachUAAndRealIp } from '~/lib/attach-ua'
import { sansFont, serifFont } from '~/lib/fonts'
import { getQueryClient } from '~/lib/query-client.server'
import { AggregationProvider } from '~/providers/root/aggregation-data-provider'
import { queries } from '~/queries/definition'

import { Providers } from '../providers/root'
import { Analyze } from './analyze'
import { init } from './init'

const { version } = PKG
init()

export const revalidate = 60

let aggregationData: (AggregateRoot & { theme: AppThemeConfig }) | null = null

export function generateViewport(): Viewport {
  return {
    themeColor: [
      { media: '(prefers-color-scheme: dark)', color: '#000212' },
      { media: '(prefers-color-scheme: light)', color: '#fafafa' },
    ],
  }
}

export const generateMetadata = async () => {
  const queryClient = getQueryClient()

  const fetchedData =
    aggregationData ??
    (await queryClient.fetchQuery(queries.aggregation.root()))

  aggregationData = fetchedData
  const {
    seo,
    url,
    user,
    theme: { config },
  } = fetchedData

  return {
    metadataBase: new URL(url.webUrl),
    title: {
      template: `%s - ${seo.title}`,
      default: `${seo.title} - ${seo.description}`,
    },
    description: seo.description,
    keywords: seo.keywords?.join(',') || '',
    icons: [
      {
        url: config.site.favicon,
        type: 'image/svg+xml',
        sizes: 'any',
      },
      {
        rel: 'icon',
        type: 'image/svg+xml',
        url: config.site.favicon,
        media: '(prefers-color-scheme: light)',
      },
      {
        rel: 'icon',
        type: 'image/svg+xml',
        url: config.site.faviconDark || config.site.favicon,

        media: '(prefers-color-scheme: dark)',
      },
    ],

    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
    openGraph: {
      title: {
        default: seo.title,
        template: `%s | ${seo.title}`,
      },
      description: seo.description,
      siteName: `${seo.title}`,
      locale: 'zh_CN',
      type: 'website',
      url: url.webUrl,
      images: {
        url: user.avatar,
        username: user.name,
      },
    },
    twitter: {
      creator: `@${user.username}`,
      card: 'summary_large_image',
      title: seo.title,
      description: seo.description,
    },
  }
}

type Props = {
  children: React.ReactNode
}

export default async function RootLayout(props: Props) {
  attachUAAndRealIp()
  const { children } = props

  const queryClient = getQueryClient()

  const data = await queryClient.fetchQuery({
    ...queries.aggregation.root(),
  })

  const themeConfig = data.theme

  aggregationData = data

  return (
    // <ClerkProvider localization={ClerkZhCN}>
    <ClerkProvider>
      <html lang="zh-CN" className="noise" suppressHydrationWarning>
        <ASCIIart />
        <head>
          <script
            dangerouslySetInnerHTML={{
              __html: `
              if (localStorage.getItem('sw_installed') === 'true') {
                console.log('[TNXG_SW]检测到旧版本的SW，正在卸载...');
                navigator.serviceWorker.getRegistrations()
                    .then(function (registrations) {
                        for (let registration of registrations) {
                            registration.unregister();
                        }
                    });
                navigator.serviceWorker.register('/sw.js?t=' + new Date().getTime())
            } else {
                if (!!navigator.serviceWorker) {
                    navigator.serviceWorker.register('/sw.js?t=' + new Date().getTime())
                        .then(async (registration) => {
                            if (localStorage.getItem('sw_installed') !== 'true') {
                                localStorage.setItem('sw_installed', 'true');
                                console.log('[TNXG_SW] 安装成功，正在重载页面！');
                                fetch(window.location.href)
                                    .then(res => res.text())
                                    .then(text => {
                                        document.open();
                                        document.write(text);
                                        document.close();
                                    });
                            }
                        }).catch(err => {
                            console.error('[TNXG_SW] 安装失败，原因： ' + err.message);
                        });
                } else {
                    console.error('[TNXG_SW] 安装失败，原因： 浏览器不支持service worker');
                }
            }
    `,
            }}
          />
          <SayHi />
          <HydrationEndDetector />
          <link rel="stylesheet" href="/assets/css/master.css" />
          <link
            rel="stylesheet"
            href="https://assets.tnxg.whitenuo.cn/fonts/HarmonyOS_Regular.css"
          />
        </head>
        <body
          className={`${sansFont.variable} ${serifFont.variable} m-0 h-full p-0 font-sans`}
        >
          <Providers>
            <AggregationProvider
              aggregationData={data}
              appConfig={themeConfig.config}
            />

            <Root>{children}</Root>

            <TocAutoScroll />
            <SearchPanelWithHotKey />
            <Analyze />
          </Providers>
          <ToastContainer />
          <ScrollTop />
        </body>
      </html>
      <Analytics />
    </ClerkProvider>
  )
}

const ASCIIart = () => {
  return `
  &lt;!--
    同人的诞生就是对于某个故事的意难平，正是因为这些意难平，众多优秀的作品才会从幕后走到台前。
    这些故事的诞生就是为了让我们能够在这个世界上找到一些共鸣，找到一些温暖。
    它们让我们看到了不同的可能性，让我们感受到了不同的情感。
    它们，就是同人，就是本就不属于这个残酷世界的美好故事。
    我们，热爱着这一切的人们，与现实有着不可跨越的鸿沟，这无疑使我们与他人更显得格格不入。
    但是，我们却不会因此而放弃，我们却不会因此而停下脚步，我们会继续前行，去追寻那本不属于这个世界的，美好的故事。
--&gt;
&lt;!--
                          o                           *~+                      
                     o ^n                       n * z                      
                     . .**;                   -     o                      
                    ^.  -  o      ..  ^^.   .v      ^                      
                    .    i  nv             -1  +    z                      
                     .   +     +~;    * z     v   *n                       
                      in ^   .   -     .^~         -z   .                  
                     a.    ^   .         *n   -       o   -                
                    - ^   +              ~-z           z   *n              
                  +^ -   -    ^             z          +*  n               
                  ;       -  .+          - + z          -1o                
                 v .    -     .          .. ^ -.. .      ;^                
                 n - .   ;. . ^          .  ^   z         z*               
               v ;-      + -^ n      -   *o o  ^  o    *^  a               
           ;+   o.       ; no~ *+        v~-*a.   o+.+ ~-  ^n              
                n..      ~^.uo  n       . ;v   n*         n~+aa            
                ^~.     +** -1vnazn+     nv;azzvu         a~.              
                ;v      v^~nz n   ; on*;     - zv ^       ao^              
                n*       ;;  ^^ -~^  *   -      ~         o.^              
                 ~   ..  .z-         ;         n +       ++                
                 ~~  ;    oz                  n~a      ;.a-                
                 z*o z^   ozv      *           u^   -~- o-^                
                 ~* o^^-  ~  ++              u+-+    o++ .o                
                  ;   zn ~;; -  .i-       u~  ~-   n+ ;. *o                
                ~ ~    .  ..n + au+ ;1a+  zo.1o;   ..; . *~.               
                + v     +  *   ^u    - z     ana   ;   - . ~               
               * -z      * ^. vuz^     ~    o^a* -     ~;  *               
               ^  v       -n~     .   ^*  v   u        un + ;              
              ~ - .        ; a      o.;o~    z- .     - o^u*               
              ..ao          ~n*      ^z^      ...     v *u o*o             
             ;v .u^n n    .-+auz+1   *~  .n +;~^       *    ^ ~            
            .-~    a- v+    .n +.  a;+;~~    .v    . ..+    -;.            
            *n      .+v +;uuu^~ n~;z  a *~v  *    v +.       ; z           
           ^ a        on   .~; -ono+v .~+ ^ ~**+ o*        - .* +          
           * +         -.- ;-      aa*!     *;n; v            v v          
          ~ *           -~  oiai.  ^^  n ^uiv*.^z ~           +.-.         
          . ;            v          v            ;            +a n         
         o; + .                      nv          a           o~  ~         
             ;+     +                -;-         ~  -~       ;n  *         
        n+   n*       .v  ;                         .         u  ^         
        .~   ^v        ~;-*.                    a  ^          + *^.        
       . v   **            nn                  1  v            u-++        
       ~ z   ^               o  -;  ^  o -ozu.1 -              ~^^^        
       ~+a   u               n      a~+o      ;                !*o-        
       ~*o   i         1o-  -a        + **    no    *~no      u -v         
       目白樱落 メジロさくらがちる Mejiro Sakuragachiru
--&gt;
  `
}

const SayHi = () => {
  return (
    <script
      dangerouslySetInnerHTML={{
        __html: `var version = "${version}";
    (${function () {
      console.log(
        `%c Mix Space %c https://github.com/mx-space `,
        'color: #fff; margin: 1em 0; padding: 5px 0; background: #2980b9;',
        'margin: 1em 0; padding: 5px 0; background: #efefef;',
      )
      console.log(
        `%c Shiro ${window.version} %c https://innei.ren `,
        'color: #fff; margin: 1em 0; padding: 5px 0; background: #39C5BB;',
        'margin: 1em 0; padding: 5px 0; background: #efefef;',
      )
      console.log(
        `%c TiaNXianG(iykrzu) 2019 - ${new Date().getFullYear()} %c https://tnxg.top `,
        'color: #fff; margin: 1em 0; padding: 5px 0; background: #66CCFF;',
        'margin: 1em 0; padding: 5px 0; background: #ee0000;',
      )
      const motto = `
This Personal Space Powered By Mix Space.
Written by TypeScript, Coding with Love.
--------
Stay hungry. Stay foolish. --Steve Jobs
`

      if (document.firstChild?.nodeType !== Node.COMMENT_NODE) {
        document.prepend(document.createComment(motto))
      }
    }.toString()})();`,
      }}
    />
  )
}

declare global {
  interface Window {
    version: string
  }
}
