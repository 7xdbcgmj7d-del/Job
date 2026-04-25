import { ExternalLink } from 'lucide-react'

import { Sheet, SheetContent, SheetHeader, SheetTitle } from '../../../../components/ui/sheet'

interface SourcePreviewDrawerProps {
  open: boolean
  previewUrl: string | null
  previewLoadFailed: boolean
  onOpenChange: (open: boolean) => void
  onIframeLoad: () => void
  onIframeFail: () => void
}

const IFRAME_LOAD_TIMEOUT_MS = 8000

export function SourcePreviewDrawer({
  open,
  previewUrl,
  previewLoadFailed,
  onOpenChange,
  onIframeLoad,
  onIframeFail,
}: SourcePreviewDrawerProps) {
  const canRenderIframe = open && Boolean(previewUrl) && !previewLoadFailed

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-[96vw] max-w-3xl overflow-y-auto bg-white p-0 sm:max-w-3xl">
        <SheetHeader className="border-b border-[#efede8] px-5 py-4">
          <SheetTitle>岗位来源预览</SheetTitle>
        </SheetHeader>
        <div className="flex h-[calc(100vh-72px)] flex-col p-4">
          {previewUrl ? (
            <>
              <p className="mb-3 truncate text-xs text-[#666666]" title={previewUrl}>
                {previewUrl}
              </p>
              {canRenderIframe ? (
                <iframe
                  key={previewUrl}
                  src={previewUrl}
                  title="岗位来源链接预览"
                  className="h-full w-full rounded-xl border border-[#efede8]"
                  referrerPolicy="no-referrer"
                  sandbox="allow-forms allow-popups allow-popups-to-escape-sandbox allow-scripts allow-same-origin"
                  onLoad={onIframeLoad}
                  onError={onIframeFail}
                />
              ) : (
                <div className="flex h-full flex-col items-center justify-center rounded-xl border border-dashed border-[#ddd7cf] bg-[#fbfaf8] px-6 text-center">
                  <p className="text-sm font-medium text-[#1a1a1a]">该链接暂不支持站内预览</p>
                  <p className="mt-2 text-xs text-[#666666]">
                    目标网站可能限制了 iframe 加载（如 X-Frame-Options/CSP）。
                  </p>
                  <button
                    type="button"
                    onClick={() => window.open(previewUrl, '_blank', 'noopener,noreferrer')}
                    className="mt-4 inline-flex items-center gap-1 rounded-full bg-[#1a1a1a] px-4 py-2 text-xs font-semibold text-white transition hover:bg-[#333333]"
                  >
                    <ExternalLink size={14} />
                    在新标签打开
                  </button>
                </div>
              )}
            </>
          ) : null}
        </div>
      </SheetContent>
    </Sheet>
  )
}

export { IFRAME_LOAD_TIMEOUT_MS }
