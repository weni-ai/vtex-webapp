import { DrawerProvider, DrawerPopover, DrawerHeader, DrawerDismiss, DrawerHeading, DrawerFooter, Button, Spinner, toast } from "@vtex/shoreline";
import './SettingsContainer.style.css';
import { PreferencesOrderStatusActive } from "../OrderStatusActive";
import { PreferencesAbandonedCartActive } from "../AbandonedCartActive";
import { useState } from "react";
import { SettingsContext, SettingsFormData } from "./SettingsContext";
import { useSelector } from "react-redux";
import { updateAgentLoading } from "../../../store/projectSlice";
import { updateAgentSettings } from "../../../services/agent.service";
import { Feature } from "../../../interfaces/Store";

export interface SettingsContainerProps {
    open: boolean;
    code: Feature['code'];
    agentUuid: string;
    toggleOpen: () => void;
}

export function SettingsContainer({ open, toggleOpen, code, agentUuid }: SettingsContainerProps) {    
    const [formData, setFormData] = useState<SettingsFormData>({});
    const isUpdating = useSelector(updateAgentLoading);

    async function updateAgent() {
        const response = await updateAgentSettings(code, {
            agentUuid,
            formData,
        });

        toggleOpen();
        
        if (response?.error) {
            toast.critical(t('agents.common.configure.error'));
            return;
        }
        toast.success(t('agents.common.configure.success'));
    }

    return (
        <DrawerProvider open={open} onClose={toggleOpen}>
            <DrawerPopover>
                <SettingsContext.Provider value={{ formData, setFormData }}>
                    <DrawerHeader>
                        <DrawerHeading>{t('common.manage_settings')}</DrawerHeading>
                        <DrawerDismiss />
                    </DrawerHeader>

                    {
                        code === 'abandoned_cart' &&
                        <PreferencesAbandonedCartActive />
                    }

                    {
                        code === 'order_status' &&
                        <PreferencesOrderStatusActive />
                    }

                    <DrawerFooter style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <Button onClick={toggleOpen} size="large" style={{ width: '50%' }}>
                            {t('common.cancel')}
                        </Button>

                        <Button
                            variant="primary"
                            onClick={updateAgent}
                            size="large"
                            style={{ width: '50%' }}
                            disabled={isUpdating}
                        >
                            {isUpdating ? <Spinner description="loading" /> : t('common.save')}
                        </Button>
                    </DrawerFooter>
                </SettingsContext.Provider>
            </DrawerPopover>
        </DrawerProvider>
    );
}
