import { useAppState } from '@/state/AppStateContext'

/** 简历数据由 AppStateProvider 持久化；此处仅暴露与原先一致的 API */
export function useResumeVersions() {
 const { resumes, addResume, updateResume, removeResume, setDefaultResume } = useAppState()
 return { resumes, addResume, updateResume, removeResume, setDefault: setDefaultResume }
}
