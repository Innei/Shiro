import { readFileSync } from 'node:fs'
import { homedir } from 'node:os'
import { resolve } from 'node:path'

import { MarkdownClient } from './client'

export default function Page() {
  const text = readFileSync(resolve(homedir(), 'test-text.md'), 'utf-8')
  return (
    <div className="prose mx-auto w-[65ch]">
      <MarkdownClient>{text}</MarkdownClient>
    </div>
  )
}
