'use client'

import React, { createContext, useContext, useState, ReactNode } from "react";
import { Competition } from "@prisma/client";

const CompetitionContext = createContext<{
    competition: Competition | null;
    setCompetition: React.Dispatch<React.SetStateAction<Competition | null>>;
    updateCompetition: (updatedFields: Partial<Competition>) => void;
}>({
    competition: null,
    setCompetition: () => { },
    updateCompetition: () => { },
});

export const CompetitionProvider: React.FC<{ children: ReactNode; value?: Competition }> = ({ children, value = null }) => {
    const [competition, setCompetition] = useState<Competition | null>(value);

    const updateCompetition = (updatedFields: Partial<Competition>) => {
        setCompetition(prevCompetition => prevCompetition ? ({
            ...prevCompetition,
            ...updatedFields
        }) : null);
    };

    return (
        <CompetitionContext.Provider value={{ competition, setCompetition, updateCompetition }}>
            {children}
        </CompetitionContext.Provider>
    );
};

export const useCompetition = () => {
    return useContext(CompetitionContext);
};