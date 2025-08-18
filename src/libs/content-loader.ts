import { getCollection } from 'astro:content'

export async function getAllPosts() {
  const essays = await getCollection('posts')

  // @ts-ignore
  essays.sort((a, b) => new Date(b.data.date) - new Date(a.data.date))
  return essays
}

export async function getAllEssays() {
  const essays = await getCollection('essays')

  // @ts-ignore
  essays.sort((a, b) => new Date(b.data.date) - new Date(a.data.date))
  return essays
}

export async function getAllNotes() {
  const essays = await getCollection('notes')

  // @ts-ignore
  essays.sort((a, b) => new Date(b.data.date) - new Date(a.data.date))
  return essays
}

export async function getAllTags() {
  const allPosts = await getCollection('posts')

  const uniqueTags = [...new Set(allPosts.map((post) => post.data.tags).flat())]

  const tagMap = uniqueTags.map((tag) => ({
    label: tag,
    count: allPosts.filter((post) => post.data.tags.includes(tag)).length,
  }))

  return tagMap.sort((a, b) => b.count - a.count)
}

export async function getPostsByTag() {
  const essays = await getCollection('essays')
  console.log(essays.length)
}
