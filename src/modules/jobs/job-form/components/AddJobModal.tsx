import { Sparkles, Upload, X } from 'lucide-react'

interface AddJobModalProps {
  isOpen: boolean
  onClose: () => void
}

export function AddJobModal({ isOpen, onClose }: AddJobModalProps) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className="absolute inset-0 bg-black/20 backdrop-blur-sm"
        onClick={onClose}
      />

      <div className="relative max-h-[90vh] w-[800px] overflow-hidden rounded-[30px] bg-white shadow-2xl">
        <div className="flex items-center justify-between border-b border-gray-100 p-6">
          <h2 className="text-[24px] font-extrabold">添加新岗位</h2>
          <button
            onClick={onClose}
            className="flex h-10 w-10 items-center justify-center rounded-full transition-colors hover:bg-gray-100"
          >
            <X size={20} />
          </button>
        </div>

        <div className="grid grid-cols-2 gap-6 p-6">
          <div className="space-y-4">
            <div>
              <h3 className="mb-3 text-[18px] font-semibold">智能识别</h3>
              <div className="cursor-pointer rounded-[20px] border-2 border-dashed border-gray-300 bg-[#fbfaf8] p-8 text-center transition-colors hover:border-gray-400">
                <Upload size={32} className="mx-auto mb-3 text-gray-400" />
                <p className="text-sm text-[#666666]">拖拽或点击上传招聘详情截图</p>
                <p className="mt-1 text-xs text-[#999999]">支持 PNG, JPG 格式</p>
              </div>
              <button className="mt-4 flex w-full items-center justify-center gap-2 rounded-full bg-[#1a1a1a] py-3 text-white transition-colors hover:bg-[#333333]">
                <Sparkles size={18} />
                <span className="font-semibold">AI 智能一键解析</span>
              </button>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="mb-3 text-[18px] font-semibold">岗位信息</h3>
            <div>
              <label className="mb-1.5 block text-sm text-[#666666]">公司名称</label>
              <input
                type="text"
                placeholder="请输入公司名称"
                className="w-full rounded-[20px] border-none bg-[#f4f2ee] px-4 py-3 outline-none focus:ring-2 focus:ring-[#1a1a1a]/10"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-sm text-[#666666]">职位名称</label>
              <input
                type="text"
                placeholder="请输入职位名称"
                className="w-full rounded-[20px] border-none bg-[#f4f2ee] px-4 py-3 outline-none focus:ring-2 focus:ring-[#1a1a1a]/10"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-sm text-[#666666]">薪资范围</label>
              <input
                type="text"
                placeholder="如: 150-200K"
                className="w-full rounded-[20px] border-none bg-[#f4f2ee] px-4 py-3 outline-none focus:ring-2 focus:ring-[#1a1a1a]/10"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-sm text-[#666666]">状态</label>
              <select className="w-full cursor-pointer rounded-[20px] border-none bg-[#f4f2ee] px-4 py-3 outline-none focus:ring-2 focus:ring-[#1a1a1a]/10">
                <option>待投递</option>
                <option>已投递</option>
                <option>筛选中</option>
                <option>面试中</option>
                <option>Offer</option>
                <option>已淘汰</option>
              </select>
            </div>
            <button className="mt-6 w-full rounded-full bg-[#1a1a1a] py-3 font-semibold text-white transition-colors hover:bg-[#333333]">
              保存岗位
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
