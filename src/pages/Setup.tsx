import { useEffect } from "react";
import { useUserSetup } from "./setup/useUserSetup";
import { Page } from "@vtex/shoreline";

export function Setup() {
    const { initializeProject } = useUserSetup();

    useEffect(() => {
        console.log('inicializando...')
        initializeProject();
    }, [initializeProject]);

    return(
        <Page>
            jkssqwjksdiqhwdsjwhq
        </Page>
    )
}