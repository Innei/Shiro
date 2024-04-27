import { $fetch } from 'ofetch'

const gh_token = process.env.GH_TOKEN

const namespace = 'innei-dev/Shiroi'

const myFetch = $fetch.create({
  headers: {
    Authorization: `Bearer ${gh_token}`,
  },
})
const data = await myFetch(
  `https://api.github.com/repos/${namespace}/actions/artifacts`,
)

data.artifacts.forEach(async (artifact) => {
  if (artifact.name === 'artifact') {
    console.log('deleting', artifact.id)
    await myFetch(
      `https://api.github.com/repos/${namespace}/actions/artifacts/${artifact.id}`,
      { method: 'DELETE' },
    )
  }
})
