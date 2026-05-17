import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function capitalize(str: string): string {
  if (!str.length) return str
  return str.charAt(0).toUpperCase() + str.slice(1)
}

export function parsePage(value: string | null): number {
  const page = Number(value)

  if (!Number.isInteger(page) || page < 1) {
    return 1
  }

  return page
}

export const generatePagination = (
  currentPage: number,
  totalPages: number,
): ('...' | number)[] => {
  if (totalPages <= 7) {
    return Array.from({ length: totalPages }, (_, i) => i + 1)
  }

  if (currentPage <= 3) {
    return [1, 2, 3, '...', totalPages - 1, totalPages]
  }

  if (currentPage >= totalPages - 2) {
    return [1, 2, '...', totalPages - 2, totalPages - 1, totalPages]
  }

  return [
    1,
    '...',
    currentPage - 1,
    currentPage,
    currentPage + 1,
    '...',
    totalPages,
  ]
}
