import React from "react";

const UsersLayout = ({ children }: { children: React.ReactNode }) => {
    return (
        <div className="flex flex-col w-full space-y-4">
            <div className="space-y-0.5">
                <h1 className="text-2xl font-bold tracking-tight md:text-3xl">
                    Felhasználók
                </h1>
                <p className="text-muted-foreground">
                    Itt találhatók a felhasználókkal kapcsolatos beállítások.
                </p>
            </div>
            {children}
        </div>
    );
};

export default UsersLayout;
