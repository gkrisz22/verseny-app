'use client';

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroupItem } from "@/components/ui/radio-group";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowRightIcon } from "lucide-react";
import React from "react";

const SignUpSchoolForm = ({
  email,
  token,
}: {
  email: string;
  token?: string;
}) => {

  const [currentTab, setCurrentTab] = React.useState("school-info");

  return (
    <div className="w-full max-w-lg mx-auto">
      <Tabs className="w-full" value={currentTab} onValueChange={setCurrentTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="school-info">
            1. Általános információk
          </TabsTrigger>
          <TabsTrigger value="school-contact">2. Kapcsolattartó</TabsTrigger>
          <TabsTrigger value="school-admin">3. Adminisztrátor</TabsTrigger>
        </TabsList>

        <TabsContent value="school-info">
          <div className="flex flex-col gap-6">
            <div className="grid gap-2">
              <Label htmlFor="school">Iskola neve</Label>
              <Input
                id="school"
                type="text"
                name="school"
                required
                placeholder="Eötvös Loránd Tudományegyetem"
              />
            </div>

            <div className="grid md:grid-cols-2 gap-2">
              <div className="grid gap-2">
                <Label htmlFor="irsz">Irányítószám</Label>
                <Input
                  id="irsz"
                  type="number"
                  name="irsz"
                  required
                  placeholder="1117"
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="city">Város</Label>
                <Input
                  id="city"
                  type="text"
                  name="city"
                  required
                  placeholder="Budapest"
                />
              </div>

              <div className="grid gap-2 md:col-span-2">
                <Label htmlFor="address">Cím</Label>
                <Input
                  id="address"
                  type="text"
                  name="address"
                  required
                  placeholder="Pázmány Péter sétány 1/C"
                />
              </div>
            </div>

            <Button type="submit" className="w-full" onClick={() => setCurrentTab("school-contact")}>
              Tovább <ArrowRightIcon size={24} />
            </Button>
          </div>
        </TabsContent>

        <TabsContent value="school-contact">
          <div className="flex flex-col gap-6">
            <div className="grid gap-2">
              <Label htmlFor="name">Név</Label>
              <Input
                id="name"
                type="text"
                name="name"
                required
                placeholder="Kovács János"
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="email">E-mail cím</Label>
              <Input
                id="email"
                type="email"
                name="email"
                required
                placeholder="tehetseg@inf.elte.hu"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="phone">Telefonszám</Label>
              <Input
                id="phone"
                type="tel"
                name="phone"
                required
                placeholder="+36 30 123 4567"
              />
            </div>

            <Button type="submit" className="w-full" onClick={() => setCurrentTab("school-admin")}>
              Tovább
            </Button>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SignUpSchoolForm;
