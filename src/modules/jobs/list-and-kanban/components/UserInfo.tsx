export function UserInfo() {
  return (
    <div className="mb-6 flex flex-col items-center gap-3">
      <div className="relative">
        <div className="h-16 w-16 rounded-full bg-gradient-to-br from-purple-400 to-pink-400" />
        <div className="absolute -right-1 -top-1 text-xl">👑</div>
      </div>
      <div className="text-center">
        <h3 className="font-semibold text-[#1a1a1a]">Alex Chen</h3>
        <div className="mt-1.5 flex gap-2">
          <span className="rounded-full bg-white px-3 py-1 text-xs text-[#666666]">
            求职中
          </span>
          <span className="rounded-full bg-white px-3 py-1 text-xs text-[#666666]">
            产品经理
          </span>
        </div>
      </div>
    </div>
  )
}
