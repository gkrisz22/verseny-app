"use client";

import React from "react";
import EvaluationTable from "./evaluation/evaluation-table";

interface EvaluatorBuilderProps {
  stageId: string;
}

const EvaluatorBuilder = ({ stageId }: EvaluatorBuilderProps) => {
  return (
    <EvaluationTable />
  );
};

export default EvaluatorBuilder;
