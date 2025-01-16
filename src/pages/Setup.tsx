import { useEffect } from "react";
import { useUserSetup } from "./setup/useUserSetup";

export function Setup() {
    const { initializeProject } = useUserSetup();

    useEffect(() => {
        console.log('inicializando...')
        initializeProject();
    }, [initializeProject]);

    return(<></>)
}