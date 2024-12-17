import { useQuery } from '@tanstack/react-query'
import * as React from 'react'
import { memo } from 'react'

import { HighLighterPrismCdn } from '../../ui/code-highlighter'
import { Loading } from '../../ui/loading'

const ext2FileType = {
  '.js': 'javascript',
  '.ts': 'typescript',
  '.jsx': 'javascript',
  '.tsx': 'typescript',
  '.md': 'markdown',
  '.css': 'css',
  '.scss': 'scss',
  '.html': 'html',
  '.json': 'json',
  '.yml': 'yaml',
  '.yaml': 'yaml',
  '.toml': 'toml',
  '.xml': 'xml',
  '.sh': 'bash',
  '.bash': 'bash',
  '.zsh': 'bash',
  '.fish': 'bash',
  '.ps1': 'powershell',
  '.bat': 'batch',
  '.cmd': 'batch',
  '.go': 'go',
  '.py': 'python',
  '.rb': 'ruby',
  '.java': 'java',
  '.c': 'c',
  '.cpp': 'cpp',
  '.cs': 'csharp',
  '.rs': 'rust',
  '.swift': 'swift',
  '.kt': 'kotlin',
  '.clj': 'clojure',
  '.lua': 'lua',
  '.sql': 'sql',
  '.graphql': 'graphql',
  '.groovy': 'groovy',
  '.scala': 'scala',
  '.pl': 'perl',
  '.r': 'r',
  '.dart': 'dart',
  '.elm': 'elm',
  '.erl': 'erlang',
  '.ex': 'elixir',
  '.h': 'c',
  '.hpp': 'cpp',
  '.hxx': 'cpp',
  '.hh': 'cpp',
  '.h++': 'cpp',
  '.m': 'objectivec',
  '.mm': 'objectivec',
  '.vue': 'vue',
}
export const EmbedGithubFile = memo(
  ({
    owner,
    path,
    repo,
    startLineNumber,
    endLineNumber,
    refType,
  }: {
    owner: string
    repo: string
    path: string
    startLineNumber: number
    endLineNumber?: number
    refType?: string
  }) => {
    const ext = path.slice(path.lastIndexOf('.'))
    const fileType = (ext2FileType as any)[ext] || 'text'
    const { data, isLoading, isError } = useQuery<string>({
      queryKey: ['github-preview', owner, repo, path, refType],
      queryFn: async () => {
        return fetch(
          `https://cdn.jsdelivr.net/gh/${owner}/${repo}${
            refType ? `@${refType}` : ''
          }/${path}`,
        ).then(async (res) => {
          return res.text()
        })
      },
    })

    if (isLoading) {
      return (
        <Loading
          className="h-[50vh]"
          loadingText="Loading GitHub File Preview..."
        />
      )
    }

    if (isError) {
      return (
        <pre className="center flex h-[50vh] flex-wrap rounded-md border border-uk-orange-light">
          <code>Loading GitHub File Preview Failed:</code>
          <br />
          <code>
            {owner}/{repo}/{path}
          </code>
        </pre>
      )
    }

    if (!data) return null

    const splitData = data.split('\n')
    if (!endLineNumber) {
      endLineNumber = splitData.length
    }
    const newData = splitData.slice(startLineNumber, endLineNumber).join('\n')

    if (endLineNumber - startLineNumber > 20) {
      return (
        <div className="h-[50vh] w-full overflow-auto">
          <HighLighterPrismCdn
            content={newData}
            lang={fileType}
            startLineNumber={startLineNumber + 1}
          />
        </div>
      )
    } else {
      return (
        <div className="w-full overflow-auto">
          <HighLighterPrismCdn
            content={newData}
            lang={fileType}
            startLineNumber={startLineNumber + 1}
          />
        </div>
      )
    }
  },
)
EmbedGithubFile.displayName = 'EmbedGithubFile'
