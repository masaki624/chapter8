"use client";
import Link from "next/link";
import { useState, useEffect} from 'react';

export type Post = {
  id: number;
  title: string;
  thumbnailUrl: string;
  createdAt: string;
  categories: string[];
  content: string;
}

export  default function TopPage() {

  const [posts, setposts] = useState<Post[]>([]);
  const [load, setLoad] = useState(true);

  useEffect(() => {
    const fetchPosts = async () => {
      setLoad(true);
      const response  = await fetch('https://1hmfpsvto6.execute-api.ap-northeast-1.amazonaws.com/dev/posts');
      const data = await response.json();
      const postsData: Post[] =  data.posts;
      setposts(postsData);
      setLoad(false);
    };
    fetchPosts();
  }, []);

  if(load) {
    return (
      <div className="text-center p-20">
        <h2 className="text-2xl font-bold mb-4">読み込み中</h2>
      </div>
    );
  };

  if(posts.length === 0) {
    return (
      <div className="text-center p-20">
        <h2 className="text-2xl font-bold mb-4">記事がありませんでした</h2>
      </div>
    );
  }

  return(
    <ul className="space-y-16">
      {posts.map((post) => (
        <li key={post.id}>
          <Link href={`/post/${post.id}`} className="block group">
            <article className="bg-white border border-gray-200 p-12 shadow-sm transition-all hover:shadow-md">
              <div className="flex justify-between items-start mb-12">
                    <span className="text-[10px] text-gray-400 tracking-widest font-mono uppercase">
                      {post.createdAt.slice(0, 10).replace(/-/g, '/')}
                    </span>
                  <div className="flex gap-2">
                    {post.categories.map((cat) => (
                    <span key={cat} className="text-[9px] bg-black text-white px-2 py-0.5 tracking-tighter uppercase">
                      {cat}
                    </span>
                    ))}
                  </div>
              </div>

              <div className='text-center'>
                <h2 className='text-2xl font-semibold mb-6 tracking-tight'>
                    {post.title}
                </h2>

                <hr className="w-8 mx-auto border-gray-200 mb-8" />
                    <div className="text-gray-500 text-sm leading-loose line-clamp-2 text-left" dangerouslySetInnerHTML={{ __html: post.content }}>
                    </div>
              </div>
            </article>
          </Link>
        </li>
      ))}
    </ul>
  )
}

