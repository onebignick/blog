import Navbar from "@/components/navbar";
import Date from "@/components/date";
import { getSortedPostsData } from "@/lib/posts";
import Link from "next/link";

type AllPostsData = {
    date: string
    title: string
    id: string
}[];

export default function Blog() {
    const allPostsData: AllPostsData = getSortedPostsData();

    return(
        <>
        <Navbar currentPage={"Blog"}/>
        <section className='p-4'>
          <h1 className='font-extrabold text-3xl mb-1'>Hey</h1>
          <p>
            welcome to my blog. It's great that you are reading this.
            This site was created to pen down my successes and failures, and most importantly, to document down my experiences.
            While some articles may be pretty crass and rough, I hope that you will have a great time reading it. (and hopefully learn something too!)
          </p>
        </section>
  
        <section className="p-4">
          <ul>
            {allPostsData.map(({ id, date, title }) => (
              <li key={id}>
                <div className='font-medium mb-1 mt-5'>
                  <Link href={`/posts/${id}`}>{title}</Link>
                </div>
                {/* <br /> */}
                <small className='text-gray-500 font-medium'>
                  <Date dateString={date} />
                </small>
              </li>
            ))}
          </ul>
        </section>
      </>
    );
};