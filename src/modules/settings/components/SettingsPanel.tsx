import { Download, Upload } from 'lucide-react'
import { useRef, useState } from 'react'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { parseImportedAppState } from '@/storage'
import { useAppState } from '@/state'

import type { AIProvider, AppSettings } from '../types'
import { normalizeAppSettings, PROVIDER_LABELS, PROVIDER_PRESETS } from '../utils'

function downloadJson(filename: string, json: string) {
  const blob = new Blob([json], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  a.click()
  URL.revokeObjectURL(url)
}

function downloadBlob(filename: string, blob: Blob) {
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  a.click()
  URL.revokeObjectURL(url)
}

export function SettingsPanel() {
  const { settings, setSettings, getAppStateSnapshot, replaceAppState } = useAppState()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [statusText, setStatusText] = useState('')
  const [isTestingConnection, setIsTestingConnection] = useState(false)
  const [showAdvancedAiConfig, setShowAdvancedAiConfig] = useState(false)
  const [clearQuestionBankOpen, setClearQuestionBankOpen] = useState(false)
  const appSettings = normalizeAppSettings(settings)

  const updateSettings = (next: AppSettings) => {
    setSettings(next)
  }

  const currentProvider = appSettings.aiProvider
  const currentConfig = appSettings.aiConfigs[currentProvider]

  const exportAllData = () => {
    const snapshot = getAppStateSnapshot()
    downloadJson(`job-tracker-backup-${new Date().toISOString().slice(0, 10)}.json`, JSON.stringify(snapshot, null, 2))
    setStatusText('已导出全量数据 JSON。')
  }

  const exportInterviewQuestionBank = () => {
    const questions = appSettings.interviewQuestionBank
      .map((item) => String(item).trim())
      .filter(Boolean)
    if (questions.length === 0) {
      setStatusText('当前问题库为空，暂无可导出内容。')
      return
    }
    const date = new Date().toISOString().slice(0, 10)
    const html = `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8" />
  <title>面试问题库</title>
  <style>
    body { font-family: "Microsoft YaHei", "PingFang SC", sans-serif; padding: 24px; color: #1a1a1a; }
    h1 { font-size: 20px; margin-bottom: 8px; }
    p { color: #666666; font-size: 12px; margin-bottom: 16px; }
    li { margin: 8px 0; line-height: 1.6; }
  </style>
</head>
<body>
  <h1>面试问题库</h1>
  <p>导出日期：${date}</p>
  <ol>
    ${questions.map((q) => `<li>${q.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')}</li>`).join('')}
  </ol>
</body>
</html>`
    const blob = new Blob([`\ufeff${html}`], {
      type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    })
    downloadBlob(`interview-question-bank-${date}.docx`, blob)
    setStatusText('已导出面试问题库 Word 文件。')
  }

  const applyProviderPreset = () => {
    const preset = PROVIDER_PRESETS[currentProvider]
    updateSettings({
      ...appSettings,
      aiConfigs: {
        ...appSettings.aiConfigs,
        [currentProvider]: {
          ...currentConfig,
          apiUrl: preset.apiUrl,
          model: preset.model,
        },
      },
    })
    setStatusText(`已填充 ${PROVIDER_LABELS[currentProvider]} 推荐 URL 与模型。`)
  }

  const testProviderConnection = async () => {
    if (!currentConfig.apiKey.trim()) {
      setStatusText(`请先填写 ${PROVIDER_LABELS[currentProvider]} 的 API Key。`)
      return
    }
    if (!currentConfig.apiUrl.trim() || !currentConfig.model.trim()) {
      setStatusText('请先填写 API URL 与模型名。')
      return
    }
    setIsTestingConnection(true)
    setStatusText('正在测试连接...')
    const controller = new AbortController()
    const timer = window.setTimeout(() => controller.abort(), 15000)
    try {
      const payload =
        currentProvider === 'zhipu'
          ? {
              model: currentConfig.model,
              temperature: 0.1,
              messages: [{ role: 'user', content: '请回复 ok' }],
            }
          : {
              model: currentConfig.model,
              temperature: 0.1,
              response_format: { type: 'json_object' },
              messages: [{ role: 'user', content: '请返回 {"ok":true}' }],
            }
      const response = await fetch(currentConfig.apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${currentConfig.apiKey}`,
        },
        body: JSON.stringify(payload),
        signal: controller.signal,
      })
      if (!response.ok) {
        const text = await response.text()
        setStatusText(`连接失败（${response.status}）：${text || '未知错误'}`)
      } else {
        setStatusText(`连接成功：${PROVIDER_LABELS[currentProvider]} 已可调用。`)
      }
    } catch (error) {
      if (error instanceof DOMException && error.name === 'AbortError') {
        setStatusText('连接测试超时，请检查网络或 API URL。')
      } else {
        setStatusText('连接测试失败，请检查 Key/URL/模型配置。')
      }
    } finally {
      window.clearTimeout(timer)
      setIsTestingConnection(false)
    }
  }

  const importAllData = async (file?: File) => {
    if (!file) return
    try {
      const text = await file.text()
      const parsed = parseImportedAppState(text)
      replaceAppState(parsed)
      setStatusText('导入成功，已完成 schema 兼容处理。')
    } catch (error) {
      setStatusText(error instanceof Error ? error.message : '导入失败，请检查 JSON 文件。')
    }
  }

  return (
    <div className="mx-auto max-w-3xl space-y-6 text-[#1a1a1a] dark:text-[#f5f5f5]">
      <div>
        <h1 className="text-3xl font-bold text-[#1a1a1a] dark:text-[#f5f5f5]">设置与数据管理</h1>
        <p className="mt-1 text-sm text-[#666666] dark:text-[#b8b8b8]">API 配置、AI 提供商、主题与全量备份恢复（PRD 3.7）</p>
      </div>

      <section className="rounded-[24px] border border-[#e8e6e2] bg-white p-5 dark:border-[#333333] dark:bg-[#1f1f1f]">
        <h3 className="text-base font-semibold text-[#1a1a1a] dark:text-[#f5f5f5]">AI 配置</h3>
        <p className="mt-1 text-xs text-[#666666] dark:text-[#b8b8b8]">
          默认无需配置。仅当你需要自定义模型服务时，再展开高级配置。
        </p>
        <button
          type="button"
          onClick={() => setShowAdvancedAiConfig((prev) => !prev)}
          className="mt-3 rounded-full border border-[#dfddd8] px-4 py-2 text-sm text-[#555555] transition hover:bg-[#f4f2ee] dark:border-[#3a3a3a] dark:text-[#b8b8b8] dark:hover:bg-[#2a2a2a]"
        >
          {showAdvancedAiConfig ? '收起高级 AI 配置' : '展开高级 AI 配置'}
        </button>
        {showAdvancedAiConfig ? (
          <div className="mt-4 space-y-3 border-t border-[#efede8] pt-4 dark:border-[#2f2f2f]">
            <div>
              <Label className="text-[#666666] dark:text-[#b8b8b8]">AI 提供商</Label>
              <select
                value={currentProvider}
                onChange={(e) =>
                  updateSettings({
                    ...appSettings,
                    aiProvider: e.target.value as AIProvider,
                  })
                }
                className="mt-1 w-full rounded-xl border border-[#e8e6e2] bg-[#fbfaf8] px-3 py-2 text-sm dark:border-[#333333] dark:bg-[#2a2a2a] dark:text-[#f5f5f5]"
              >
                {Object.entries(PROVIDER_LABELS).map(([key, label]) => (
                  <option key={key} value={key}>
                    {label}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <Label className="text-[#666666] dark:text-[#b8b8b8]">API Key</Label>
              <Input
                type="password"
                value={currentConfig.apiKey}
                placeholder={`输入 ${PROVIDER_LABELS[currentProvider]} API Key`}
                onChange={(e) =>
                  updateSettings({
                    ...appSettings,
                    aiConfigs: {
                      ...appSettings.aiConfigs,
                      [currentProvider]: {
                        ...currentConfig,
                        apiKey: e.target.value,
                      },
                    },
                  })
                }
                className="mt-1 rounded-xl border-[#e8e6e2] bg-[#fbfaf8] dark:border-[#333333] dark:bg-[#2a2a2a] dark:text-[#f5f5f5]"
              />
            </div>
            <div>
              <Label className="text-[#666666] dark:text-[#b8b8b8]">API URL</Label>
              <Input
                value={currentConfig.apiUrl}
                placeholder={PROVIDER_PRESETS[currentProvider].apiUrl}
                onChange={(e) =>
                  updateSettings({
                    ...appSettings,
                    aiConfigs: {
                      ...appSettings.aiConfigs,
                      [currentProvider]: {
                        ...currentConfig,
                        apiUrl: e.target.value,
                      },
                    },
                  })
                }
                className="mt-1 rounded-xl border-[#e8e6e2] bg-[#fbfaf8] dark:border-[#333333] dark:bg-[#2a2a2a] dark:text-[#f5f5f5]"
              />
            </div>
            <div>
              <Label className="text-[#666666] dark:text-[#b8b8b8]">模型名</Label>
              <Input
                value={currentConfig.model}
                placeholder={PROVIDER_PRESETS[currentProvider].model}
                onChange={(e) =>
                  updateSettings({
                    ...appSettings,
                    aiConfigs: {
                      ...appSettings.aiConfigs,
                      [currentProvider]: {
                        ...currentConfig,
                        model: e.target.value,
                      },
                    },
                  })
                }
                className="mt-1 rounded-xl border-[#e8e6e2] bg-[#fbfaf8] dark:border-[#333333] dark:bg-[#2a2a2a] dark:text-[#f5f5f5]"
              />
            </div>
            <div className="flex flex-wrap gap-2 pt-1">
              <Button type="button" variant="outline" className="rounded-full" onClick={applyProviderPreset}>
                使用推荐配置
              </Button>
              <Button type="button" className="rounded-full bg-[#1a1a1a]" disabled={isTestingConnection} onClick={() => void testProviderConnection()}>
                {isTestingConnection ? '测试中...' : '测试连接'}
              </Button>
            </div>
          </div>
        ) : null}
      </section>

      <section className="rounded-[24px] border border-[#e8e6e2] bg-white p-5 dark:border-[#333333] dark:bg-[#1f1f1f]">
        <h3 className="text-base font-semibold text-[#1a1a1a] dark:text-[#f5f5f5]">偏好设置</h3>
        <div className="mt-4 grid gap-3 md:grid-cols-2">
          <div>
            <Label className="text-[#666666] dark:text-[#b8b8b8]">主题（P2）</Label>
            <select
              value={appSettings.theme}
              onChange={(e) =>
                updateSettings({
                  ...appSettings,
                  theme: e.target.value as AppSettings['theme'],
                })
              }
              className="mt-1 w-full rounded-xl border border-[#e8e6e2] bg-[#fbfaf8] px-3 py-2 text-sm dark:border-[#333333] dark:bg-[#2a2a2a] dark:text-[#f5f5f5]"
            >
              <option value="system">跟随系统</option>
              <option value="light">浅色</option>
              <option value="dark">深色</option>
            </select>
          </div>
        </div>
      </section>

      <section className="rounded-[24px] border border-[#e8e6e2] bg-white p-5 dark:border-[#333333] dark:bg-[#1f1f1f]">
        <h3 className="text-base font-semibold text-[#1a1a1a] dark:text-[#f5f5f5]">面试问题库（P2）</h3>
        <p className="mt-1 text-xs text-[#666666] dark:text-[#b8b8b8]">从复盘中自动沉淀问题，支持一键清空。</p>
        <div className="mt-3 flex items-center justify-between">
          <span className="text-sm text-[#666666] dark:text-[#b8b8b8]">已收录 {appSettings.interviewQuestionBank.length} 条</span>
          <div className="flex items-center gap-2">
            <Button
              type="button"
              variant="outline"
              className="rounded-full"
              onClick={exportInterviewQuestionBank}
              disabled={appSettings.interviewQuestionBank.length === 0}
            >
              导出问题库
            </Button>
            <Button
              type="button"
              variant="outline"
              className="rounded-full"
              onClick={() => setClearQuestionBankOpen(true)}
            >
              清空问题库
            </Button>
          </div>
        </div>
      </section>

      <section className="rounded-[24px] border border-[#e8e6e2] bg-white p-5 dark:border-[#333333] dark:bg-[#1f1f1f]">
        <h3 className="text-base font-semibold text-[#1a1a1a] dark:text-[#f5f5f5]">数据管理</h3>
        <p className="mt-1 text-xs text-[#666666] dark:text-[#b8b8b8]">全量导出/导入 JSON（P0），包含 schemaVersion 与迁移兼容。</p>
        <div className="mt-4 flex flex-wrap gap-3">
          <Button type="button" variant="outline" className="rounded-full" onClick={exportAllData}>
            <Download className="size-4" />
            导出 JSON
          </Button>
          <Button type="button" className="rounded-full bg-[#1a1a1a]" onClick={() => fileInputRef.current?.click()}>
            <Upload className="size-4" />
            导入 JSON
          </Button>
          <input
            ref={fileInputRef}
            type="file"
            accept="application/json,.json"
            className="hidden"
            onChange={(e) => void importAllData(e.target.files?.[0])}
          />
        </div>
        {statusText ? <p className="mt-3 text-sm text-[#666666] dark:text-[#b8b8b8]">{statusText}</p> : null}
      </section>

      <AlertDialog open={clearQuestionBankOpen} onOpenChange={setClearQuestionBankOpen}>
        <AlertDialogContent className="rounded-[24px]">
          <AlertDialogHeader>
            <AlertDialogTitle>清空问题库</AlertDialogTitle>
            <AlertDialogDescription>
              确定清空全部面试问题库吗？该操作不可撤销。
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel type="button">取消</AlertDialogCancel>
            <AlertDialogCancel
              type="button"
              className="text-red-600 hover:text-red-600"
              onClick={() => {
                updateSettings({
                  ...appSettings,
                  interviewQuestionBank: [],
                })
                setClearQuestionBankOpen(false)
              }}
            >
              确认清空
            </AlertDialogCancel>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
