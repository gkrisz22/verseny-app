"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeftIcon, ArrowRightIcon, CheckCircle2Icon } from "lucide-react";
import React from "react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import regions from "./regions.json";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { toast } from "sonner";
import BackToRegButton from "./back-to-reg";

const SignUpSchoolForm = ({
  email,
  token,
}: {
  email: string;
  token?: string;
}) => {
  const [currentTab, setCurrentTab] = React.useState("school-info");
  const [schoolInfo, setSchoolInfo] = React.useState({
    school: "",
    regio: "pest",
    irsz: "",
    city: "",
    address: "",
    om: "",
    t_azon: "",
    school_display_name: "",
  });

  const [contactInfo, setContactInfo] = React.useState({
    name: "",
    email: "",
    phone: "",
  });

  const [adminInfo, setAdminInfo] = React.useState({
    adminName: "",
    adminEmail: "",
  });

  const handleSchoolInfoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSchoolInfo((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleContactInfoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setContactInfo((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleAdminInfoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAdminInfo((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleNextTab = () => {
    if (currentTab === "school-info") {
      if(schoolInfo.school === "" || schoolInfo.regio === "" || schoolInfo.irsz === "" || schoolInfo.city === "" || schoolInfo.address === "") {
        toast.error("Kérjük töltse ki az összes mezőt!");
        return;
      }
      setCurrentTab("school-contact");
    } else if (currentTab === "school-contact") {
      if(contactInfo.name === "" || contactInfo.email === "" || contactInfo.phone === "") {
        toast.error("Kérjük töltse ki az összes mezőt!");
        return;
      }
      setCurrentTab("school-admin");
    }
  };

  const handlePrevTab = () => {
    if (currentTab === "school-contact") {
      setCurrentTab("school-info");
    } else if (currentTab === "school-admin") {
      setCurrentTab("school-contact");
    }
  };

  return (
    <div className="w-full max-w-lg mx-auto">
      <h2 className="text-xl font-medium text-center">
        Iskola regisztráció
      </h2>
      <BackToRegButton />
      <Tabs className="w-ful mt-6" value={currentTab} onValueChange={setCurrentTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="school-info">
            1. Általános információk
          </TabsTrigger>
          <TabsTrigger value="school-contact">2. Kapcsolattartó</TabsTrigger>
          <TabsTrigger value="school-admin">3. Adminisztrátor</TabsTrigger>
        </TabsList>

        <TabsContent value="school-info" className="mt-8">
          <div className="flex flex-col gap-6">
            <div className="grid gap-2">
              <Label htmlFor="email">E-mail cím</Label>

              <div className="w-full relative">
                <Input
                  id="email"
                  type="email"
                  name="email"
                  required
                  placeholder={email}
                  disabled
                  readOnly
                />
                <span className="absolute right-0 top-0 bottom-0 flex items-center px-2 text-green-500">
                  <CheckCircle2Icon size={18} />
                </span>
              </div>
            </div>

            <div className="grid gap-2 md:grid-cols-2 lg:grid-cols-3">

              <div className="grid gap-2 lg:col-span-2">
                <Label htmlFor="school">Iskola neve</Label>
                <Input
                  id="school"
                  type="text"
                  name="school"
                  required
                  placeholder="Eötvös Loránd Tudományegyetem"
                  onChange={handleSchoolInfoChange}
                  value={schoolInfo.school}
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="om">OM (ha van)</Label>
                <Input
                  id="om"
                  type="text"
                  name="om"
                  required
                  placeholder="123456"
                  onChange={handleSchoolInfoChange}
                  value={schoolInfo.om}
                />
                </div>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="regio">Vármegye / Régió</Label>
              <Select
                value={schoolInfo.regio}
                onValueChange={(val: string) =>
                  setSchoolInfo((prev) => ({ ...prev, regio: val }))
                }
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Pest" />
                </SelectTrigger>
                <SelectContent id="regio">
                  <SelectGroup>
                    <SelectLabel>Régiók</SelectLabel>
                    {regions.regions.map((r) => {
                      return (
                        <SelectItem key={r.id} value={r.id}>
                          {r.name}
                        </SelectItem>
                      );
                    })}
                  </SelectGroup>
                  <SelectSeparator />
                  <SelectGroup>
                    <SelectLabel>Vármegyék</SelectLabel>
                    {regions.counties.map((r) => {
                      return (
                        <SelectItem key={r.id} value={r.id}>
                          {r.name}
                        </SelectItem>
                      );
                    })}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-2">
              <div className="grid gap-2">
                <Label htmlFor="irsz">Irányítószám</Label>
                <Input
                  id="irsz"
                  type="number"
                  name="irsz"
                  required
                  placeholder="1117"
                  onChange={handleSchoolInfoChange}
                  value={schoolInfo.irsz}
                />
              </div>

              <div className="grid gap-2 lg:col-span-2">
                <Label htmlFor="city">Város</Label>
                <Input
                  id="city"
                  type="text"
                  name="city"
                  required
                  placeholder="Budapest"
                  onChange={handleSchoolInfoChange}
                  value={schoolInfo.city}
                />
              </div>

              <div className="grid gap-2 md:col-span-2 lg:col-span-3">
                <Label htmlFor="address">Cím</Label>
                <Input
                  id="address"
                  type="text"
                  name="address"
                  required
                  placeholder="Pázmány Péter sétány 1/C"
                  onChange={handleSchoolInfoChange}
                  value={schoolInfo.address}
                />
              </div>
            </div>
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
                placeholder=""
                value={contactInfo.name}
                onChange={handleContactInfoChange}
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
                value={contactInfo.email}
                onChange={handleContactInfoChange}
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
                value={contactInfo.phone}
                onChange={handleContactInfoChange}
              />
            </div>

            <Alert variant="default">
              <AlertTitle>Kapcsolattartó</AlertTitle>
              <AlertDescription className="text-muted-foreground">
                Fogadja a rendszerrel kapcsolatos értesítéseket, híreket, értesül az eredményekről.
              </AlertDescription>
            </Alert>
          </div>
        </TabsContent>

        <TabsContent value="school-admin">
          <div className="flex flex-col gap-6">
          <div className="grid gap-2">
              <Label htmlFor="adminName">Név</Label>
              <Input
                id="adminName"
                type="text"
                name="adminName"
                required
                placeholder="Adminisztrátor neve"
                onChange={handleAdminInfoChange}
                value={adminInfo.adminName}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="adminEmail">E-mail cím</Label>
              <Input
                id="adminEmail"
                type="email"
                name="adminEmail"
                required
                placeholder="Adminisztrátor e-mail címe"
                onChange={handleAdminInfoChange}
                value={adminInfo.adminEmail}
              />
            </div>

            <Alert variant="default">
              <AlertTitle>Adminisztrátor</AlertTitle>
              <AlertDescription className="text-muted-foreground">
                Az adminisztrátor felelős az iskolai szerepkörök felosztásáért,
                tanárok meghívásáért a rendszerbe.
              </AlertDescription>
            </Alert>
          </div>
        </TabsContent>
      </Tabs>
      <div className="w-full mt-6 flex items-center justify-between gap-6">
        <Button
          type="submit"
          variant={"link"}
          className=""
          onClick={handlePrevTab}
          disabled={currentTab === "school-info"}
        >
          <ArrowLeftIcon size={24} /> Vissza
        </Button>

        <Button
          type="submit"
          className="w-full max-w-[200px]"
          onClick={handleNextTab}
          disabled={currentTab === "school-admin"}
        >
          Tovább <ArrowRightIcon size={24} />
        </Button>
      </div>
    </div>
  );
};

export default SignUpSchoolForm;
