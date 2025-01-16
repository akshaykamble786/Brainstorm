"use client";

import { Loader2Icon } from 'lucide-react';
import dynamic from 'next/dynamic';
import { Suspense } from 'react';

const CreateWorkspace = dynamic(
  () => import('@/app/_components/CreateWorkspace'),
  {
    ssr: false,
    loading: () => (
      <Loader2Icon className='animate-spin'/>
    )
  }
);

export default function CreateWorkspacePage() {
  return (
    <Suspense>
      <CreateWorkspace />
    </Suspense>
  );
}