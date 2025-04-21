"use client";
import React from "react";
import BackToRegButton from "./back-to-reg";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { ArrowRightIcon, InfoIcon } from "lucide-react";
import { useActionForm } from "@/hooks/use-action-form";
import { completeTeacherSignup, createSkeletonUser } from "@/app/_actions/auth.action";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const SignUpTeacherForm = () => {
    const [state, action, isPending] = useActionForm(createSkeletonUser);
    const [teacherState, teacherAction, isTeacherPending] = useActionForm(completeTeacherSignup);
    const [userId, setUserId] = React.useState<string | undefined>(undefined);
    const [activeTab, setActiveTab] = React.useState<string>("login-data");

    React.useEffect(() => {
        if (state.success) {
            if (state.inputs?.userId) {
                setUserId(state.inputs.userId);
            }
            setActiveTab("teacher-data");
        }
    }, [state.success, state.inputs?.userId]);

    return (
        <div className="w-full max-w-lg mx-auto">
            <h2 className="text-xl font-medium text-center">
                Tanár regisztráció
            </h2>
            <BackToRegButton />
            <Tabs
                value={activeTab}
                onValueChange={setActiveTab}
                className="w-full mt-4"
            >
                <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="login-data" className="">
                        1. Bejelentkezési adatok
                    </TabsTrigger>
                    <TabsTrigger
                        value="teacher-data"
                        className=""
                        disabled={userId === undefined}
                    >
                        2. Tanári adatok
                    </TabsTrigger>
                </TabsList>
                <TabsContent value="login-data">
                    <form className="flex flex-col gap-6 mt-8" action={action}>
                        <div className="flex flex-col gap-6">
                            <div className="grid gap-2">
                                <Label htmlFor="name">Név</Label>
                                <Input
                                    id="name"
                                    type="text"
                                    name="name"
                                    placeholder="Teljes név"
                                    required
                                    defaultValue={state.inputs?.name}
                                    className={`${
                                        state.errors?.name
                                            ? "border-red-500"
                                            : ""
                                    }`}
                                />
                                {state.errors?.name && (
                                    <p className="text-red-500 text-sm">
                                        {state.errors.name}
                                    </p>
                                )}
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="email">E-mail cím</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    name="email"
                                    placeholder="tehetseg@inf.elte.hu"
                                    required
                                    defaultValue={state.inputs?.email}
                                    className={`${
                                        state.errors?.email
                                            ? "border-red-500"
                                            : ""
                                    }`}
                                />
                                {state.errors?.email && (
                                    <p className="text-red-500 text-sm">
                                        {state.errors.email}
                                    </p>
                                )}
                            </div>

                            <div className="grid md:grid-cols-2 gap-2">
                                <div className="grid gap-2">
                                    <Label htmlFor="password">Jelszó</Label>
                                    <Input
                                        id="password"
                                        type="password"
                                        name="password"
                                        placeholder="********"
                                        required
                                        defaultValue={state.inputs?.password}
                                        className={`${
                                            state.errors?.password
                                                ? "border-red-500"
                                                : ""
                                        }`}
                                    />
                                    {state.errors?.password && (
                                        <p className="text-red-500 text-sm">
                                            {state.errors.password}
                                        </p>
                                    )}
                                </div>

                                <div className="grid gap-2">
                                    <Label htmlFor="passwordConfirm">
                                        Jelszó megerősítése
                                    </Label>
                                    <Input
                                        id="passwordConfirm"
                                        type="password"
                                        name="passwordConfirm"
                                        placeholder="********"
                                        required
                                        defaultValue={
                                            state.inputs?.passwordConfirm
                                        }
                                        className={`${
                                            state.errors?.passwordConfirm
                                                ? "border-red-500"
                                                : ""
                                        }`}
                                    />
                                    {state.errors?.passwordConfirm && (
                                        <p className="text-red-500 text-sm">
                                            {state.errors.passwordConfirm}
                                        </p>
                                    )}
                                </div>
                            </div>                            
                            <Button
                                type="submit"
                                variant="default"
                                className="w-full"
                                disabled={isPending}
                            >
                                {isPending ? (
                                    <span className="animate-pulse">
                                        Mentés...
                                    </span>
                                ) : (
                                    <span>Tovább</span>
                                )}
                                <ArrowRightIcon className="h-4 w-4 ml-2" />
                            </Button>
                        </div>
                    </form>
                    <p className="text-sm text-center text-muted-foreground mt-8 mb-4">
                        Vagy folytassa a regisztrációt egy közösségi fiókkal:
                    </p>
                    <div className="grid md:grid-cols-2 gap-4">
                        <form className="flex-1">
                            <Button
                                type="submit"
                                variant={"outline"}
                                className="w-full"
                            >
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"
                                        fill="currentColor"
                                    />
                                </svg>
                                <span className="">GitHub</span>
                            </Button>
                        </form>
                        <form className="flex-1">
                            <Button variant="outline" className="w-full">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z"
                                        fill="currentColor"
                                    />
                                </svg>
                                <span className="">Google</span>
                            </Button>
                        </form>
                    </div>
                </TabsContent>

                <TabsContent value="teacher-data">
                    <form className="flex flex-col gap-6 mt-8" action={teacherAction}>
                      <input type="hidden" name="userId" value={userId} />
                        <div className="flex flex-col gap-6">
                            <div className="grid gap-2">
                                <Label htmlFor="teacher">
                                    Milyen tantárgyakat tanít?
                                </Label>
                                <Textarea
                                    placeholder="Matematika, Média stb."
                                    defaultValue={teacherState.inputs?.subjects}
                                    className={`${
                                      teacherState.errors?.subjects
                                            ? "border-red-500"
                                            : ""
                                    }`}
                                    name="subjects"
                                    id="subjects"
                                />
                                {teacherState.errors?.subjects && (
                                    <p className="text-red-500 text-sm">
                                        {teacherState.errors.subjects}
                                    </p>
                                )}
                            </div>
                            {state.errors && state.message && (
                                <Alert variant={"destructive"}>
                                    <AlertDescription>
                                        {state.message}
                                    </AlertDescription>
                                </Alert>
                            )}
                            <Button
                                type="submit"
                                variant="default"
                                className="w-full"
                                disabled={isPending}
                            >
                                {isPending ? (
                                    <span className="animate-pulse">
                                        Mentés...
                                    </span>
                                ) : (
                                    <span>Regisztráció befejezése</span>
                                )}
                                <ArrowRightIcon className="h-4 w-4 ml-2" />
                            </Button>
                        </div>
                    </form>
                </TabsContent>
            </Tabs>

           
        </div>
    );
};

export default SignUpTeacherForm;