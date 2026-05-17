import { useState } from 'react'
import { toast } from 'sonner'
import type { Attachment } from '@/lib/types/attachment'

export function MediaLibraryImage({ attachment }: { attachment: Attachment }) {
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(attachment.url)
      setCopied(true)
      setTimeout(() => setCopied(false), 1500)
    } catch (err) {
      toast.error('Не удалось скопировать')
    }
  }

  return (
    <div
      onClick={handleCopy}
      className="group relative cursor-pointer overflow-hidden rounded-lg"
    >
      <img
        src={attachment.url}
        alt={attachment.fileName}
        className="w-full rounded-lg transition-transform duration-200"
      />
      <div className="absolute inset-0 flex items-center justify-center bg-black text-sm text-white opacity-0 group-hover:opacity-80">
        {copied ? 'Скопировано!' : 'Клик, чтобы скопировать'}
      </div>
    </div>
  )
}
