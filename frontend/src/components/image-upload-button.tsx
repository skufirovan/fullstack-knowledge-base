import { useQueryClient } from '@tanstack/react-query'
import { ImagePlus } from 'lucide-react'
import { useRef, useState, type ChangeEvent } from 'react'
import { toast } from 'sonner'
import { attachmentsApi } from '@/lib/api/attachments-api'
import { ALLOWED_IMAGE_MIME_TYPES } from '@/lib/constants'
import { Button } from './ui/button'
import { Input } from './ui/input'

export function ImageUploadButton() {
  const inputRef = useRef<HTMLInputElement>(null)
  const [isBusy, setIsBusy] = useState(false)
  const queryClient = useQueryClient()

  const handleUpload = async (e: ChangeEvent<HTMLInputElement>) => {
    setIsBusy(true)
    const input = e.currentTarget
    const file = input.files?.[0]

    if (!file) {
      setIsBusy(false)
      return
    }

    if (!ALLOWED_IMAGE_MIME_TYPES.includes(file.type)) {
      toast.error('Поддерживаются только PNG, JPEG и WEBP форматы')
      setIsBusy(false)
      return
    }

    try {
      const { uploadUrl, key, headers } = await attachmentsApi.getUploadUrl({
        contentType: file.type,
        contentLength: file.size,
        fileName: file.name,
      })

      const res = await fetch(uploadUrl, {
        method: 'PUT',
        headers,
        body: file,
      })

      if (!res.ok) {
        toast.error('Не удалось загрузить фото', {
          description: 'Попробуйте позже',
        })
        console.error(`Upload failed: ${res.status}`)
      }

      await attachmentsApi.confirmUpload({ key })

      await queryClient.invalidateQueries({
        queryKey: ['attachments'],
      })
    } catch (error) {
      console.error(error)
    } finally {
      setIsBusy(false)
    }
  }

  return (
    <div>
      <Button
        variant="outline"
        disabled={isBusy}
        onClick={e => {
          e.preventDefault()
          inputRef.current?.click()
        }}
      >
        <ImagePlus className="size-5" />
        Загрузить фотографию
      </Button>

      <Input
        ref={inputRef}
        type="file"
        className="hidden"
        onChange={handleUpload}
        accept="image/*"
      />
    </div>
  )
}
