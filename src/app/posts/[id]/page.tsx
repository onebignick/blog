import Date from '@/components/date';
import Navbar from '@/components/navbar';
import { getPostData } from '@/lib/posts'
import Link from 'next/link';

type Params = {
  id: string
}

type Props = {
  params: Params
}

type PostData = {
  title: string
  date: string
  contentHtml: string
}

export async function generateMetadata({ params }: Props) {
  const postData: PostData = await getPostData(params.id)

  return {
    title: postData.title,
  }
}

export default async function Post({ params }: Props) {
  const postData: PostData = await getPostData(params.id)

  return (
    <>
      <Navbar currentPage={"Blog"}/>
      <section className='p-4'>
      <Link href='/blog'>Back</Link>
      <br/>
      <br/>
      <h1 className='font-extrabold text-3xl mb-1'>{postData.title}</h1>

      <div className='text-white-500 font-medium mb-5'>
        <Date dateString={postData.date} />
      </div>

      <div
        className='text-white-600'
        dangerouslySetInnerHTML={{ __html: postData.contentHtml }}
      />
      </section>
    </>
  )
}