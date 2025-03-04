import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { InfoIcon } from "lucide-react"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import ThirdPartySignIn from "./third-party-login"
import Link from "next/link"

export function SignInForm({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"div">) {
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
          <form>
            <div className="grid gap-6">
              <div className="grid gap-6">
                <div className="grid gap-2">
                  <Label htmlFor="email">E-mail cím</Label>
                  <Input
                    id="email"
                    type="email"
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <div className="flex items-center">
                    <Label htmlFor="password">Jelszó</Label>
                    <a
                      href="#"
                      className="ml-auto text-sm underline-offset-4 hover:underline text-muted-foreground hover:text-primary"
                    >
                      Elfelejtette a jelszavát?
                    </a>
                  </div>
                  <Input id="password" type="password" required />
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox id="remember" className="rounded" />
                  <Label htmlFor="remember">Emlékezzen rám</Label>
                  <Popover>
                    <PopoverTrigger>
                      <InfoIcon className="size-4" />
                    </PopoverTrigger>
                    <PopoverContent align="start" sideOffset={8}>
                      <div className="text-sm flex flex-col gap-4">
                        <h4 className="text-base font-bold">Kedves Felhasználó!</h4>

                        <p className="text-muted-foreground">
                          Ennek a funkciónak bepipálásával hosszabb idejű munkamenetet biztosítunk bejelentkezést követően.
                        </p>

                        <p className="text-muted-foreground">
                          Kérjük, hogy csak <strong>saját eszközén</strong> használja ezt a funkciót.
                        </p>
                      </div>
                    </PopoverContent>
                  </Popover>
                </div>
                <Button type="submit" className="w-full">
                  Bejelentkezés
                </Button>
              </div>
              <div className="text-center text-sm">
                Még nincs fiókja?{" "}
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
      <div className="text-balance text-center text-sm text-muted-foreground [&_a]:underline [&_a]:underline-offset-4 [&_a]:hover:text-primary  ">
        A folyatatással Ön elfogadja az{" "}
        <a href="#" className="underline underline-offset-4">
          Általános Szerződési Feltételeket
        </a>{" "}
        és az{" "}
        <a href="#" className="underline underline-offset-4">
          Adatvédelmi irányelveket
        </a>
      </div>
    </div>
  )
}
