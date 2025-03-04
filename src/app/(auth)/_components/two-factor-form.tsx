import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@/components/ui/input-otp";

export function TwoFactorForm({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"div">) {
  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-xl md:text-2xl lg:text-3xl">
            Kétlépcsős azonosítás
          </CardTitle>
          <CardDescription className="text-base text-muted-foreground">
            Kérjük adja meg a telefonjára érkező kódját!
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form>
            <div className="grid gap-6">
              <div className="w-fit mx-auto flex flex-col gap-8">
                <InputOTP maxLength={6}>
                  <InputOTPGroup>
                    <InputOTPSlot index={0} />
                    <InputOTPSlot index={1} />
                    <InputOTPSlot index={2} />
                  </InputOTPGroup>
                  <InputOTPSeparator />
                  <InputOTPGroup>
                    <InputOTPSlot index={3} />
                    <InputOTPSlot index={4} />
                    <InputOTPSlot index={5} />
                  </InputOTPGroup>
                </InputOTP>
                <Button type="submit" className="w-full">
                  Bejelentkezés
                </Button>
              </div>
            </div>
          </form>
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
  );
}
