"use client";

import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { AddTaskDialog } from "./add-task-dialog";
import { ArrowUpDownIcon, ChevronsUpDownIcon, GripVerticalIcon, PlusIcon } from "lucide-react";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Input } from "@/components/ui/input";
import EvaluationTable from "./evaluation/evaluation-table";

interface EvaluatorBuilderProps {
  stageId: string;
}

interface Task {
  id: string;
  name: string;
}

const EvaluatorBuilder = ({ stageId }: EvaluatorBuilderProps) => {
  return (
    <EvaluationTable />
  );
};

export default EvaluatorBuilder;
