"use client";

import { DatePicker } from "@/app/(dashboard)/_components/common/date-picker";
import { Label } from "@/components/ui/label";
import React from "react";

const HataridoForm = () => {
    return (
        <form className="space-y-8">
            <div className="p-6 rounded-xl border shadow">
                <h3 className="uppercase text-sm font-semibold mb-6 text-foreground">
                    Jelentkezési időszak
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div className="flex flex-col gap-2">
                        <Label htmlFor="signUpStartDate" className="text-gray-600">
                            Kezdete
                        </Label>
                        <DatePicker
                            date={new Date()}
                            setDate={() => {}}
                            label="Kezdés dátuma"
                            name="signUpStartDate"
                        />
                    </div>

                    <div className="flex flex-col gap-2">
                        <Label htmlFor="signUpEndDate" className="text-gray-600">
                            Vége
                        </Label>
                        <DatePicker
                            date={new Date()}
                            setDate={() => {}}
                            label="Vége dátuma"
                            name="signUpEndDate"
                        />
                    </div>
                </div>
            </div>

            <div className="p-6 rounded-xl border shadow">
                <h3 className="uppercase text-sm font-semibold mb-6 text-foreground">
                    Verseny időpontja
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div className="flex flex-col gap-2">
                        <Label htmlFor="competitionStartDate" className="text-gray-600">
                            Kezdete
                        </Label>
                        <DatePicker
                            date={new Date()}
                            setDate={() => {}}
                            label="Kezdés dátuma"
                            name="competitionStartDate"
                        />
                    </div>

                    <div className="flex flex-col gap-2">
                        <Label htmlFor="competitionEndDate" className="text-gray-600">
                            Vége
                        </Label>
                        <DatePicker
                            date={new Date()}
                            setDate={() => {}}
                            label="Vége dátuma"
                            name="competitionEndDate"
                        />
                    </div>
                </div>
            </div>
        </form>
    );
};

export default HataridoForm;
