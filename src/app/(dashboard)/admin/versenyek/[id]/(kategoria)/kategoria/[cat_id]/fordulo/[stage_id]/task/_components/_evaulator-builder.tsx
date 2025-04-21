"use client";

import React from "react";
import EvaluationTable from "./evaluation/evaluation-table";

interface EvaluatorBuilderProps {
  stageId: string;
}

const EvaluatorBuilder = ({ stageId }: EvaluatorBuilderProps) => {
  return (
    <EvaluationTable stageId={stageId} />
  );
};

export default EvaluatorBuilder;
