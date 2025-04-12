"use client";

import { ArrowUp } from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "../ui/button";

export const BackToTop = () => {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const toggleVisibility = () => {
            if (window.scrollY > 300) {
                setIsVisible(true);
            } else {
                setIsVisible(false);
            }
        };

        window.addEventListener("scroll", toggleVisibility);
        return () => window.removeEventListener("scroll", toggleVisibility);
    }, []);

    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: "smooth",
        });
    };

    return (
        <button
            aria-label="Vissza az oldal tetejére"
            onClick={scrollToTop}
            className={`fixed bottom-6 right-6 z-50 rounded-full bg-primary p-3 text-primary-foreground shadow-lg transition-opacity duration-300 hover:bg-primary/90 ${isVisible ? "opacity-100" : "opacity-0"
                }`}
        >
            <ArrowUp className="h-5 w-5" />
        </button>
    );
};