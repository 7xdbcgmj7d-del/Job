import type { JobItem } from '../types'

function daysAgo(days: number): string {
 const d = new Date()
 d.setHours(0, 0, 0, 0)
 d.setDate(d.getDate() - days)
 return d.toISOString().slice(0, 10)
}

/** 演示数据：投递日期分散在近 30 天内，便于趋势图与动态列表 */
export const initialJobsData: JobItem[] = [
 { id: 1, company: 'Google', position: 'Senior Product Manager', salary: '150-200K', status: '待面试', bgColor: '#fadcd9', hasResume: true, appliedAt: daysAgo(2) },
 { id: 2, company: 'Microsoft', position: 'Product Manager', salary: '120-180K', status: '筛选中', bgColor: '#dcd6f7', hasResume: true, appliedAt: daysAgo(5) },
 { id: 3, company: 'Meta', position: 'Product Lead', salary: '180-250K', status: 'Offer', bgColor: '#c8e8d5', hasResume: true, appliedAt: daysAgo(18) },
 { id: 4, company: 'Apple', position: 'Product Manager', salary: '140-190K', status: '待面试', bgColor: '#fbe0c3', hasResume: false, appliedAt: daysAgo(8) },
 { id: 5, company: 'Amazon', position: 'Senior PM - AWS', salary: '160-220K', status: '待投递', bgColor: '#c5e1a5', hasResume: true },
 { id: 6, company: 'Netflix', position: 'Product Manager', salary: '150-200K', status: '筛选中', bgColor: '#fadcd9', hasResume: true, appliedAt: daysAgo(12) },
 { id: 7, company: 'Tesla', position: 'Product Manager', salary: '130-170K', status: '待面试', bgColor: '#dcd6f7', hasResume: false, appliedAt: daysAgo(1) },
 { id: 8, company: 'Airbnb', position: 'Senior Product Manager', salary: '160-210K', status: 'Offer', bgColor: '#c8e8d5', hasResume: true, appliedAt: daysAgo(22) },
 { id: 9, company: 'Uber', position: 'Product Manager', salary: '140-180K', status: '筛选中', bgColor: '#fbe0c3', hasResume: true, appliedAt: daysAgo(27) },
]
