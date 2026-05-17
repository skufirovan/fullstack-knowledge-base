import { useLocation, useSearchParams } from 'react-router-dom'
import { PAGE_SIZE } from '@/lib/constants'
import { generatePagination, parsePage } from '@/lib/utils'
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from './ui/pagination'

type PaginationNumberProps = {
  page: number | '...'
  href: string
  isActive: boolean
  isEllipsis?: boolean
}

export function PaginationNumber({
  page,
  href,
  isActive,
  isEllipsis,
}: PaginationNumberProps) {
  if (isEllipsis) {
    return (
      <PaginationItem>
        <PaginationEllipsis />
      </PaginationItem>
    )
  }

  return (
    <PaginationItem>
      <PaginationLink to={href} isActive={isActive}>
        {page}
      </PaginationLink>
    </PaginationItem>
  )
}

type Props = {
  total: number
}

export function AppPagination({ total }: Props) {
  const [searchParams] = useSearchParams()
  const location = useLocation()
  const currentPage = parsePage(searchParams.get('page'))
  const totalPages = Math.ceil(total / PAGE_SIZE)

  if (totalPages <= 1) return

  function createPageURL(pageNumber: number) {
    const params = new URLSearchParams(searchParams)
    params.set('page', pageNumber.toString())
    return `${location.pathname}?${params.toString()}`
  }

  const allPages = generatePagination(currentPage, totalPages)

  return (
    <Pagination>
      <PaginationContent>
        {currentPage > 1 && (
          <PaginationItem>
            <PaginationPrevious
              to={createPageURL(currentPage - 1)}
              text="Назад"
            />
          </PaginationItem>
        )}

        {allPages.map((page, index) => {
          return (
            <PaginationNumber
              key={`${page}-${index}`}
              href={typeof page === 'number' ? createPageURL(page) : ''}
              page={page}
              isEllipsis={page === '...'}
              isActive={currentPage === page}
            />
          )
        })}

        {currentPage < totalPages && (
          <PaginationItem>
            <PaginationNext to={createPageURL(currentPage + 1)} text="Далее" />
          </PaginationItem>
        )}
      </PaginationContent>
    </Pagination>
  )
}
