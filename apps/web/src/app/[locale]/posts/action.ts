'use server'

import { revalidatePath } from 'next/cache'

export const revalidatePostList = async () => revalidatePath('/posts')
