import type { ReactNode } from 'react'
import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'

import type { AppPersistedStateV1 } from '@/domain/app-state'
import type { JobItem } from '@/modules/jobs/types'
import type { InterviewTimelineRecord } from '@/modules/interviews/types'
import type { ResumeVersion } from '@/modules/resumes/types'
import type { AppSettings } from '@/modules/settings/types'
import { loadAppState, saveAppState } from '@/storage/persistence'

const SAVE_DEBOUNCE_MS = 280

type SetSlice<T> = React.Dispatch<React.SetStateAction<T>>

interface AppStateContextValue {
 jobs: JobItem[]
 setJobs: SetSlice<JobItem[]>
 interviews: InterviewTimelineRecord[]
 setInterviews: SetSlice<InterviewTimelineRecord[]>
 resumes: ResumeVersion[]
 setResumes: SetSlice<ResumeVersion[]>
 settings: AppSettings
 setSettings: SetSlice<AppSettings>
 replaceAppState: (next: AppPersistedStateV1) => void
 getAppStateSnapshot: () => AppPersistedStateV1
 addResume: (item: Omit<ResumeVersion, 'id' | 'updatedAt'>) => void
 updateResume: (id: string, patch: Omit<ResumeVersion, 'id' | 'updatedAt'>) => void
 removeResume: (id: string) => void
 setDefaultResume: (id: string) => void
}

const AppStateContext = createContext<AppStateContextValue | null>(null)

export function AppStateProvider({ children }: { children: ReactNode }) {
 const [data, setData] = useState<AppPersistedStateV1>(() => loadAppState())

 const setJobs = useCallback<SetSlice<JobItem[]>>((update) => {
 setData((prev) => ({
 ...prev,
 jobs: typeof update === 'function' ? (update as (j: JobItem[]) => JobItem[])(prev.jobs) : update,
 }))
 }, [])

 const setInterviews = useCallback<SetSlice<InterviewTimelineRecord[]>>((update) => {
 setData((prev) => ({
 ...prev,
 interviews:
 typeof update === 'function'
 ? (update as (v: InterviewTimelineRecord[]) => InterviewTimelineRecord[])(prev.interviews)
 : update,
 }))
 }, [])

 const setResumes = useCallback<SetSlice<ResumeVersion[]>>((update) => {
 setData((prev) => ({
 ...prev,
 resumes: typeof update === 'function' ? (update as (v: ResumeVersion[]) => ResumeVersion[])(prev.resumes) : update,
 }))
 }, [])

 const setSettings = useCallback<SetSlice<AppSettings>>((update) => {
 setData((prev) => ({
 ...prev,
 settings:
 typeof update === 'function'
 ? (update as (s: AppSettings) => AppSettings)(prev.settings)
 : update,
 }))
 }, [])

 const replaceAppState = useCallback((next: AppPersistedStateV1) => {
 setData(next)
 }, [])

 const getAppStateSnapshot = useCallback(() => data, [data])

 const addResume = useCallback((item: Omit<ResumeVersion, 'id' | 'updatedAt'>) => {
 const id =
 typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function'
 ? crypto.randomUUID()
 : `r-${Date.now()}`
 const next: ResumeVersion = {
 ...item,
 id,
 updatedAt: new Date().toISOString(),
 }
 setData((prev) => {
 const list = item.isDefault ? prev.resumes.map((r) => ({ ...r, isDefault: false })) : prev.resumes
 return { ...prev, resumes: [...list, next] }
 })
 }, [])

 const updateResume = useCallback((id: string, patch: Omit<ResumeVersion, 'id' | 'updatedAt'>) => {
 setData((prev) => {
 const nextResumes = prev.resumes.map((r) =>
 r.id === id
 ? {
 ...r,
 ...patch,
 isDefault: patch.isDefault ? true : r.isDefault,
 updatedAt: new Date().toISOString(),
 }
 : patch.isDefault
 ? { ...r, isDefault: false }
 : r
 )
 return { ...prev, resumes: nextResumes }
 })
 }, [])

 const removeResume = useCallback((id: string) => {
 setData((prev) => {
 const next = prev.resumes.filter((r) => r.id !== id)
 if (next.length && !next.some((r) => r.isDefault)) {
 next[0] = { ...next[0], isDefault: true }
 }
 const nextDefaultId = next.find((r) => r.isDefault)?.id
 const nextJobs = prev.jobs.map((job) => {
 if (job.linkedResumeId !== id) return job
 return {
 ...job,
 linkedResumeId: nextDefaultId,
 hasResume: nextDefaultId ? true : false,
 }
 })
 return {
 ...prev,
 resumes: next,
 jobs: nextJobs,
 }
 })
 }, [])

 const setDefaultResume = useCallback((id: string) => {
 setData((prev) => ({
 ...prev,
 resumes: prev.resumes.map((r) => ({ ...r, isDefault: r.id === id })),
 }))
 }, [])

 useEffect(() => {
 const timer = window.setTimeout(() => saveAppState(data), SAVE_DEBOUNCE_MS)
 return () => window.clearTimeout(timer)
 }, [data])

 const value = useMemo(
 () => ({
 jobs: data.jobs,
 setJobs,
 interviews: data.interviews,
 setInterviews,
 resumes: data.resumes,
 setResumes,
 settings: data.settings,
 setSettings,
 replaceAppState,
 getAppStateSnapshot,
 addResume,
 updateResume,
 removeResume,
 setDefaultResume,
 }),
 [data, setJobs, setInterviews, setResumes, setSettings, replaceAppState, getAppStateSnapshot, addResume, updateResume, removeResume, setDefaultResume],
 )

 return <AppStateContext.Provider value={value}>{children}</AppStateContext.Provider>
}

export function useAppState(): AppStateContextValue {
 const ctx = useContext(AppStateContext)
 if (!ctx) {
 throw new Error('useAppState 必须在 AppStateProvider 内使用')
 }
 return ctx
}
