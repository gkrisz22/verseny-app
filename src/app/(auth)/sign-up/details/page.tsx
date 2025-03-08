"use client";

import { useSearchParams } from "next/navigation";
import React from "react";
import SignUpSchoolForm from "../../_components/sign-up-school-form";
import SignUpTeacherForm from "../../_components/sign-up-teacher-form";
import Icons from "@/components/icons";

const SignUpDetailsPage = () => {
  const searchParams = useSearchParams();
  const email = searchParams.get("email");
  const role = searchParams.get("role");

  const renderForm = () => {
    if (!email || !role) {
      return <p>Invalid parameters.</p>;
    }
    switch (role) {
      case "school":
        return <SignUpSchoolForm email={email} />;
      case "teacher":
        return <SignUpTeacherForm email={email} />;
      default:
        return <p>Invalid role selected.</p>;
    }
  };

  return (
    <div className="w-full">
      <a href="#" className="flex items-center gap-2 self-center font-medium w-fit mx-auto mb-8">
        <div className="flex size-10 items-center justify-center rounded-full bg-primary text-primary-foreground">
          <Icons.logo className="size-8" />
        </div>
        ELTE IK Tehetség
      </a>
      {renderForm()}
    </div>
  );
};

export default SignUpDetailsPage;
