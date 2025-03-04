"use client";

import { useSearchParams } from "next/navigation";
import React from "react";
import SignUpSchoolForm from "../../_components/sign-up-school-form";
import SignUpTeacherForm from "../../_components/sign-up-teacher-form";

const SignUpDetailsPage = () => {
  const searchParams = useSearchParams();
  const email = searchParams.get("email")
  const role = searchParams.get("role")

  const renderForm = () => {
    if(!email || !role) {
      return <p>Invalid parameters.</p>
    }
    switch (role) {
      case "school":
        return <SignUpSchoolForm email={email} />
      case "teacher":
        return <SignUpTeacherForm email={email} />
      default:
        return <p>Invalid role selected.</p>
    }
  }

  return <div className="w-full">{
    renderForm()
    }</div>;
};

export default SignUpDetailsPage;
