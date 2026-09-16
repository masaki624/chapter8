"use client";

import { useState, useEffect } from "react";
import { useParams } from 'next/navigation';
import Image from "next/image";
import { MicroCmsPost } from '../../_types/MicroCmsPost';

export default function DetailPage() {
  const { id } = useParams();
  const [post, setPost] = useState<MicroCmsPost | null>(null);
  const [load, setLoad] = useState(true);

  useEffect(() => {
    const fetchPost = async () => {
      setLoad(true)
      const response = await fetch(`https://mu98a05l8b.microcms.io/api/v1/posts/${id}`, {
        headers: {
            'X-MICROCMS-API-KEY': process.env.NEXT_PUBLIC_MICROCMS_API_KEY as string, 
          },
        }, 
      )
      const data = await response.json()
      setPost(data);
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
            src={post.thumbnail.url}
            alt={post.title}
            fill
            className="object-cover"
            priority
        />
      </div>
      <div className="flex justify-between items-center mb-8">
        <span className="text-gray-400">{post.createdAt.slice(0, 10)}</span>
        <div className="flex gap-2">
          {post.categories.map((category) => <span key={category.id} className="bg-black text-white px-2 py-1 text-xs">{category.name}</span>)}
        </div>
      </div>
      <h1 className="text-3xl font-bold mb-8">{post.title}</h1>
      <div className="leading-loose" dangerouslySetInnerHTML={{ __html: post.content }} />
    </article>
  );
}