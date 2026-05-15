import { Link } from 'react-router-dom'
import { Button } from '../components/ui/button'

type ErrorPageProps = {
  title: string
  description: string
  action?: React.ReactNode
}

export function NotFoundPage({ title, description }: Partial<ErrorPageProps>) {
  return (
    <ErrorPage
      title={title ?? 'Не найдено'}
      description={description ?? 'Страница не найдена'}
      action={
        <Button asChild>
          <Link to="/">На главную</Link>
        </Button>
      }
    />
  )
}

export function ErrorPage({ title, description, action }: ErrorPageProps) {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4 text-center">
      <h1 className="text-2xl font-semibold">{title}</h1>
      <p className="text-muted-foreground">{description}</p>
      {action}
    </div>
  )
}
