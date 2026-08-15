"use client";

import { useState, useEffect } from "react";
import { useParams } from 'next/navigation';
import Image from "next/image";

export type Post = {
  id: number;
  title: string;
  thumbnailUrl: string;
  createdAt: string;
  categories: string[];
  content: string;
}

export default function DetailPage() {
  const { id } = useParams();
  const [post, setPost] = useState<Post | null>(null);
  const [load, setLoad] = useState(true);

  useEffect(() => {
    const fetchPost = async () => {
      const response = await fetch(`https://1hmfpsvto6.execute-api.ap-northeast-1.amazonaws.com/dev/posts/${id}`);
      const data = await response.json() as {post: Post};
      setPost(data.post);
      setLoad(false);
    }
    fetchPost();
  }, [id]);

  if (load) {
    return (
      <div className="text-center p-20">
        <h2 className="text-2xl font-bold mb-4">読み込み中</h2>
      </div>
    );
  };

  if (!post) {
    return (
      <div className="text-center p-20">
        <h2 className="text-2xl font-bold mb-4">記事がありませんでした</h2>
      </div>
    );
  }

  return (
    <article>
      <div className="relative w-fill h-64 mb-8">
        <Image
            src={post.thumbnailUrl}
            alt={post.title}
            fill
            className="object-cover"
            priority
        />
      </div>
      <div className="flex justify-between items-center mb-8">
        <span className="text-gray-400">{post.createdAt.slice(0, 10)}</span>
        <div className="flex gap-2">
          {post.categories.map(cat => <span key={cat} className="bg-black text-white px-2 py-1 text-xs">{cat}</span>)}
        </div>
      </div>
      <h1 className="text-3xl font-bold mb-8">{post.title}</h1>
      <div className="leading-loose" dangerouslySetInnerHTML={{ __html: post.content }} />
    </article>
  );
}