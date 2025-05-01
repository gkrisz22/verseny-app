"use client";

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import ThirdPartySignIn from "./third-party-login"
import Link from "next/link"
import { signInAction } from "@/app/_actions/auth.action";
import FormField from "@/app/(dashboard)/_components/common/form-field";
import { Loader2Icon } from "lucide-react";
import { useActionForm } from "@/hooks/use-action-form";

export function SignInForm({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"div">) {
  const [state, action, isPending] = useActionForm(signInAction);

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-xl md:text-2xl lg:text-3xl">Üdvözöljük!</CardTitle>
          <CardDescription className="text-base text-muted-foreground">
            Jelentkezzen be fiókjába!
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form action={action} className="grid gap-6">
            <div className="grid gap-6">
              <div className="grid gap-6">
                <div className="grid gap-2">
                  <FormField id="email" name="email" label="E-mail cím" type="email" defaultValue={state?.inputs?.email} required errors={state?.errors?.email} />
                </div>
                <div className="grid gap-2">
                  <FormField id="password" name="password" label="Jelszó" type="password" defaultValue={state?.inputs?.password} required errors={state?.errors?.password} />
                </div>
                {!state?.success && state?.message && (
                  <div className="text-red-500 text-sm">
                    {state?.message}
                  </div>
                )}
                <Button type="submit" className="w-full" disabled={isPending}>
                  {
                    isPending ? <>
                    <Loader2Icon className="animate-spin" />
                    <span className="ml-2">Bejelentkezés...</span>
                    </> : <>
                    Bejelentkezés
                    </>
                  }
                </Button>
              </div>
              <div className="text-center text-sm text-muted-foreground">
                Még nem regisztrált?{" "}
                <Link href="/sign-up" className="underline underline-offset-4">
                  Regisztráljon egy fiókot!
                </Link>
              </div>
              <div className="relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t after:border-border mb-6">
                <span className="relative z-10 bg-background px-2 text-muted-foreground">
                  Vagy az alábbi lehetőségekkel
                </span>
              </div>
              
            </div>
          </form>
          <ThirdPartySignIn />

        </CardContent>
      </Card>

    </div>
  )
}
