import React from "react";
import BackToRegButton from "./back-to-reg";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

const SignUpTeacherForm = ({
  email,
  token,
}: {
  email: string;
  token?: string;
}) => {
  return (
    <div className="w-full max-w-lg mx-auto">
      <h2 className="text-xl font-medium text-center">Tanár regisztráció</h2>
      <BackToRegButton />

      <form>
        <div className="flex flex-col gap-6">
          <div className="grid gap-2">
            <Label htmlFor="name">Név</Label>
            <Input
              id="name"
              type="text"
              name="name"
              placeholder="Teljes név"
              required
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="email">E-mail cím</Label>
            <Input
              id="email"
              type="email"
              name="email"
              placeholder="tehetseg@inf.elte.hu"
              required
              value={email}
              disabled
              readOnly
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="password">Jelszó</Label>
            <Input
              id="password"
              type="password"
              name="password"
              placeholder="********"
              required
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="password-confirm">Jelszó megerősítése</Label>
            <Input
              id="password-confirm"
              type="password"
              name="password-confirm"
              placeholder="********"
              required
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="teacher">Milyen tantárgyakat tanít?</Label>
            <Textarea placeholder="Matematika, Média stb." />
          </div>

          <Button type="submit" variant="default" className="w-full">
            Regisztráció
          </Button>
        </div>
      </form>
    </div>
  );
};

export default SignUpTeacherForm;
