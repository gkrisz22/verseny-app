'use client';

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import Icons from "@/components/icons"
import ThirdPartySignIn from "./third-party-login"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { GraduationCap, LoaderCircle, SchoolIcon, UserIcon } from "lucide-react"
import Link from "next/link"
import { useActionState } from "react";
import { signUpFirstStep } from "@/actions/auth.action"
import { ActionResponse } from "@/types/form/action-response"
import { SignUpFirstStepData } from "@/types/form/auth"
import { Alert, AlertDescription } from "@/components/ui/alert";

const initialState: ActionResponse<SignUpFirstStepData> = {
  success: false,
  message: "",
} 
export function SignUpForm({
  className,
  ...props 
}: React.ComponentPropsWithoutRef<"div">) {
  const [state, action, isPending] = useActionState(signUpFirstStep, initialState)
  return (
    <div className={cn("flex flex-col gap-6 mt-8", className)} {...props}>
      <form action={action}>
        <div className="flex flex-col gap-6">
          <div className="flex flex-col items-center gap-4">
            <Link
              href="/"
              className="flex flex-col items-center gap-4 font-medium"
            >
              <div className="flex size-10 lg:size-14 items-center justify-center rounded-md">
                <Icons.logo className="size-10 lg:size-14" />
              </div>
              <span className="sr-only">ELTE IK Tehetség</span>
            </Link>
            <h1 className="text-lg md:text-xl lg:text-2xl font-medium text-center">Üdvözöljük{" "}
                 az IK Tehetség felületén!</h1>
            <div className="text-center text-sm">
              Már regisztrált?{" "}
              <Link href="/sign-in" className="underline underline-offset-4 text-muted-foreground hover:text-primary">
                Jelentkezzen be fiókjával!
              </Link>
            </div>
          </div>
          <div className="flex flex-col gap-6">
            <div className="grid gap-2">
              <Label htmlFor="email">E-mail cím</Label>
              <Input
                id="email"
                type="email"
                name="email"
                placeholder="tehetseg@inf.elte.hu"
                defaultValue={state.inputs?.email}
                required
              />
              {
                state.errors?.email && (
                  <div className="text-red-500 text-sm">
                    {state.errors.email}
                  </div>
                )
              }
            </div>
            <div className="space-y-2">
              <Label>Fióktípus</Label>
              <RadioGroup name="role" className="grid grid-cols-3 gap-4" required defaultValue={state.inputs?.role}>
                <Label
                  htmlFor="school"
                  className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground [&:has([data-state=checked])]:border-primary"
                >
                  <RadioGroupItem value="school" id="school" className="sr-only" />
                  <SchoolIcon className="mb-3 h-6 w-6" />
                  Iskola
                </Label>
                <Label
                  htmlFor="teacher"
                  className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground [&:has([data-state=checked])]:border-primary"
                >
                  <RadioGroupItem value="teacher" id="teacher" className="sr-only" />
                  <UserIcon className="mb-3 h-6 w-6" />
                  Tanár
                </Label>
                <Label
                  htmlFor="student"
                  className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground [&:has([data-state=checked])]:border-primary"
                >
                  <RadioGroupItem value="student" id="student" className="sr-only" />
                  <GraduationCap className="mb-3 h-6 w-6" />
                  Diák
                </Label>
              </RadioGroup>
              {
                state.errors?.role && (
                  <div className="text-red-500 text-sm">
                    {state.errors.role}
                  </div>
                )
              }
            </div>

            {
              ((state.errors) && state.message ) && (
                <Alert variant={"destructive"}>
                  <AlertDescription>{state.message}</AlertDescription>
                </Alert>
              )
            }
            <Button type="submit" className="w-full" disabled={isPending}>
              {isPending ? <><LoaderCircle className="animate-spin" /> <span>Ellenőrzés...</span></> : "Tovább"}
            </Button>
          </div>
          <div className="relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t after:border-border">
            <span className="relative z-10 bg-background px-2 text-muted-foreground">
              Vagy folytassa
            </span>
          </div>
        </div>
      </form>

      <ThirdPartySignIn />
      <div className="text-balance text-center text-xs text-muted-foreground [&_a]:underline [&_a]:underline-offset-4 hover:[&_a]:text-primary  ">
        A folyatatással Ön elfogadja a <a href="#">használati feltételeinket</a>{" "}
        és megismerte az <a href="#">adatvédelmi irányelveinket.</a>.
      </div>
    </div>
  )
}

