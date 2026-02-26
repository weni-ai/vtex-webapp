import { useEffect } from "react";
import { useOnboardingSetup } from "./setup/useOnboardingSetup";

export function Setup() {
    const { initializeOnboarding } = useOnboardingSetup();

    useEffect(() => {
        initializeOnboarding();
    }, [initializeOnboarding]);

    return (
        <></>
    )
}
