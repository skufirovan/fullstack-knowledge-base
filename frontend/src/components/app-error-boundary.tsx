import { Component, type ErrorInfo, type ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { ErrorPage } from '@/pages/not-found-page'
import { Button } from './ui/button'

type Props = {
  children: ReactNode
}

type State = {
  hasError: boolean
}

export class AppErrorBoundary extends Component<Props, State> {
  state: State = {
    hasError: false,
  }

  static getDerivedStateFromError(): State {
    return {
      hasError: true,
    }
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error(error, errorInfo)
  }

  render() {
    if (this.state.hasError) {
      return (
        <ErrorPage
          title="Непредвиденная ошибка"
          description="Что-то пошло не так :("
          action={
            <div className="flex gap-3">
              <Button asChild>
                <Link to="/">На главную</Link>
              </Button>
              <Button
                variant="outline"
                onClick={() => window.location.reload()}
              >
                Обновить страницу
              </Button>
            </div>
          }
        />
      )
    }

    return this.props.children
  }
}
