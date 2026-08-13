"use client";

type Form = {
  name: string;
  email: string;
  message: string;
}

import { useState } from 'react';
import type { ChangeEvent, FormEvent } from 'react';

export default function ContactPage() {
  const [form, setForm] = useState<Form>({
    name: '',
    email: '',
    message: ''
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleForm = (e: ChangeEvent< HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });

    if (errors[e.target.name]) {
      setErrors({ ...errors, [e.target.name]: '' });
    }
  };

  const handleClear = () => {
    setForm({ name: '', email: '', message: '' });
    setErrors({});
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const newErrors: Record<string, string> = {};

    if (!form.name.trim()) {
      newErrors.name = 'お名前は必須です';
    } else if (form.name.length > 30) {
      newErrors.name = '30文字以内で入力してください'
    }

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!form.email.trim()) {
      newErrors.email = 'メールアドレスは必須です';
    } else if (!emailPattern.test(form.email)) {
      newErrors.email = 'メールアドレスの形式が正しくありません'
    }

    if (!form.message.trim()) {
      newErrors.message = '本文は必須です';
    } else if (form.message.length > 500) {
      newErrors.message = '本文は500文字以内で入力してください';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch('https://1hmfpsvto6.execute-api.ap-northeast-1.amazonaws.com/dev/contacts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form as Form)
      });

      if (response.ok) {
        alert('送信しました');
        handleClear();
      } else {
        alert('送信に失敗しました');
      }
    } catch {
      alert('エラーが発生しました');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className='max-w-md mx-auto py-12 px-4'>
      <h1 className='text-2xl font-bold mb-10 text-center'>お問い合わせ</h1>
      <form onSubmit={handleSubmit} className='space-y-8'>
        <div>
          <label className='block text-xs font-bold mb-2 text-gray-400 uppercase tracking-widest'>名前</label>
          <input
            name='name'
            type='text'
            value={form.name}
            onChange={handleForm}
            disabled={isSubmitting}
            className='w-full border border-gray-300 py-2 outline-none focus:border-black transition-colors'
          />
          {errors.name && <p className='text-red-500 text-xs mt-1'>{errors.name}</p>}
        </div>
        <div>
          <label className='block text-xs font-bold mb-2 text-gray-400 uppercase tracking-widest'>メール</label>
          <input
            name='email'
            type='email'
            value={form.email}
            onChange={handleForm}
            disabled={isSubmitting}
            className='w-full border border-gray-300 py-2 outline-none focus:border-black transition-colors'
          />
          {errors.email && <p className='text-red-500 text-xs mt-1'>{errors.email}</p>}
        </div>
        <div>
          <label className='block text-xs font-bold mb-2 text-gray-400 uppercase tracking-widest'>本文</label>
          <textarea
            name='message'
            value={form.message}
            onChange={handleForm}
            disabled={isSubmitting}
            className='w-full border border-gray-300 p-4 h-40 outline-none focus:border-black transition-colors'
          />
          {errors.message && <p className="text-red-500 text-xs mt-1">{errors.message}</p>}
        </div>

        <div className='flex gap-4'>
          <button
            type='submit'
            disabled={isSubmitting}
            className={`flex-1 py-4 text-sm font-bold tracking-widest transition-colors ${isSubmitting ? 'bg-gray-400 cursor-not-allowed' : 'bg-black text-white hover:bg-gray-800'
              }`}>
            {isSubmitting ? '送信中' : '送信'}
          </button>

          <button
            type='button'
            onClick={handleClear}
            disabled={isSubmitting}
            className='flex-1 border border-black py-4 text-sm font-bold tracking-widest hover:bg-gray-100 transition-colors disabled:border-gray-300 disabled:text-gray-300'
          >
            クリア
          </button>
        </div>
      </form>
    </div>
  );
}