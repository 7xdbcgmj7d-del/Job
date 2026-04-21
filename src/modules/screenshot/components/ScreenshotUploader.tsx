import { Image, Upload, X } from 'lucide-react'
import { useRef, useState } from 'react'

import { Button } from '@/components/ui/button'

interface ScreenshotUploaderProps {
  onFileReady: (file: File | null, dataUrl: string) => void
  disabled?: boolean
}

function fileToDataUrl(file: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(String(reader.result))
    reader.onerror = () => reject(new Error('图片读取失败'))
    reader.readAsDataURL(file)
  })
}

async function compressImage(file: File): Promise<File> {
  const bitmap = await createImageBitmap(file)
  const maxWidth = 1600
  const scale = Math.min(1, maxWidth / bitmap.width)
  const width = Math.round(bitmap.width * scale)
  const height = Math.round(bitmap.height * scale)

  const canvas = document.createElement('canvas')
  canvas.width = width
  canvas.height = height
  const ctx = canvas.getContext('2d')
  if (!ctx) return file

  ctx.drawImage(bitmap, 0, 0, width, height)
  bitmap.close()

  const blob = await new Promise<Blob | null>((resolve) =>
    canvas.toBlob(resolve, 'image/jpeg', 0.85)
  )
  if (!blob) return file

  const name = file.name.replace(/\.(png|jpg|jpeg)$/i, '.jpg')
  return new File([blob], name, { type: 'image/jpeg' })
}

function formatFileSize(bytes: number): string {
  if (bytes < 1024 * 1024) return `${Math.max(1, Math.round(bytes / 1024))}KB`
  return `${(bytes / 1024 / 1024).toFixed(2)}MB`
}

export function ScreenshotUploader({ onFileReady, disabled }: ScreenshotUploaderProps) {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [previewUrl, setPreviewUrl] = useState('')
  const [fileName, setFileName] = useState('')
  const [fileMeta, setFileMeta] = useState('')
  const [error, setError] = useState('')

  const handleFiles = async (file?: File) => {
    if (!file) return

    if (!['image/png', 'image/jpeg', 'image/jpg'].includes(file.type)) {
      setError('仅支持 PNG / JPG 格式。')
      return
    }

    try {
      setError('')
      const optimizedFile = await compressImage(file)
      const dataUrl = await fileToDataUrl(optimizedFile)
      setPreviewUrl(dataUrl)
      setFileName(optimizedFile.name)
      setFileMeta(`${formatFileSize(file.size)} -> ${formatFileSize(optimizedFile.size)}`)
      onFileReady(optimizedFile, dataUrl)
    } catch {
      setError('图片处理失败，请重新上传后重试。')
      setPreviewUrl('')
      setFileName('')
      setFileMeta('')
      onFileReady(null, '')
    }
  }

  return (
    <div>
      <input
        ref={fileInputRef}
        type="file"
        accept="image/png,image/jpeg,image/jpg"
        className="hidden"
        onChange={(event) => void handleFiles(event.target.files?.[0])}
      />

      {previewUrl ? (
        <div className="rounded-[20px] border border-[#e8e6e2] bg-[#fbfaf8] p-3">
          <div className="mb-2 flex items-center justify-between">
            <p className="truncate text-xs text-[#666666]">{fileName}</p>
            <button
              type="button"
              className="rounded-full p-1 hover:bg-white"
              onClick={() => {
                setPreviewUrl('')
                setFileName('')
                setFileMeta('')
                setError('')
                onFileReady(null, '')
              }}
            >
              <X size={14} />
            </button>
          </div>
          {fileMeta ? <p className="mb-2 text-xs text-[#999999]">{fileMeta}</p> : null}
          <img
            src={previewUrl}
            alt="截图预览"
            className="h-52 w-full rounded-xl object-cover"
          />
        </div>
      ) : (
        <button
          type="button"
          disabled={disabled}
          onDragOver={(event) => event.preventDefault()}
          onDrop={(event) => {
            event.preventDefault()
            void handleFiles(event.dataTransfer.files?.[0])
          }}
          onClick={() => fileInputRef.current?.click()}
          className="w-full cursor-pointer rounded-[20px] border-2 border-dashed border-gray-300 bg-[#fbfaf8] p-8 text-center transition-colors hover:border-gray-400 disabled:cursor-not-allowed"
        >
          <Upload size={32} className="mx-auto mb-3 text-gray-400" />
          <p className="text-sm text-[#666666]">拖拽或点击上传招聘详情截图</p>
          <p className="mt-1 text-xs text-[#999999]">支持 PNG, JPG 格式</p>
        </button>
      )}

      <div className="mt-2 flex items-center justify-between">
        <span className="text-xs text-[#999999]">
          {error || '上传后可点击 AI 识别自动填充表单'}
        </span>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          disabled={disabled}
          onClick={() => fileInputRef.current?.click()}
        >
          <Image size={14} />
          重新选择
        </Button>
      </div>
    </div>
  )
}

