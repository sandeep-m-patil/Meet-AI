import React from 'react'
import Image from 'next/image'

interface Props {
    title: string;
    description: string;
}
export default function EmptyState({ title, description }: Props) {
    return (
        <div className='flex flex-col items-center justify-center'>
            <Image src="/empty-agents.png" alt="Empty" width={240} height={240} />
            <div className="flex flex-col gap-y-6 text-center max-w-md mx-auto">
                <h1 className='text-lg font-bold'>{title}</h1>
                <p className='text-sm text-muted-foreground'>{description}</p>
            </div>
        </div>
    )
}
