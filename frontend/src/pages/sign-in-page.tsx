import { LoginForm } from '@/components/login-form'
import { LogoIcon } from '@/components/logo-icon'

export default function SignInPage() {
  return (
    <div className="grid h-svh overflow-hidden lg:grid-cols-2">
      <div className="flex flex-col gap-4 p-6 md:p-10">
        <div className="flex items-center justify-center gap-2 md:justify-start">
          <div className="flex size-8 items-center justify-center rounded-md bg-primary text-primary-foreground">
            <LogoIcon />
          </div>
          База Знаний
        </div>
        <div className="flex flex-1 items-center justify-center">
          <div className="w-full max-w-xs">
            <LoginForm />
          </div>
        </div>
      </div>
      <div className="relative hidden bg-muted lg:block">
        <img
          src="/placeholder.png"
          alt="Image"
          className="absolute inset-0 h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
        />
      </div>
    </div>
  )
}
