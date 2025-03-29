import { NotFound404 } from '~/components/common/404'
import { StyledButton } from '~/components/ui/button'
import { sansFont } from '~/lib/fonts'

export default () => (
  <html>
    <body
      suppressHydrationWarning
      className={`${sansFont.variable} m-0 h-full p-0 font-sans`}
    >
      <div data-theme>
        <NotFound404>
          <StyledButton>
            <a href="/">返回首页</a>
          </StyledButton>
        </NotFound404>
      </div>
    </body>
  </html>
)
