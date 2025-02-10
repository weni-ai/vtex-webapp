 
import { DrawerProvider, DrawerPopover, DrawerHeader, DrawerDismiss, DrawerHeading, DrawerFooter, Button, Spinner, toast } from "@vtex/shoreline";
import './SettingsContainer.style.css';
import { PreferencesOrderStatusActive } from "../OrderStatusActive";
import { PreferencesAbandonedCartActive } from "../AbandonedCartActive";
import { useState } from "react";
import { SettingsContext, SettingsFormData } from "./SettingsContext";
import { useSelector } from "react-redux";
import { selectToken } from "../../../store/authSlice";
import { featureLoading, selectProject } from "../../../store/projectSlice";
import { updateAgentSettings } from "../../../services/features.service";

type codes = 'abandoned-cart' | 'order-status';

export interface SettingsContainerProps {
    open: boolean;
    code: codes;
    agentUuid: string;
    toggleOpen: () => void;
}

export function SettingsContainer({ open, toggleOpen, code, agentUuid }: SettingsContainerProps) {
    const token = useSelector(selectToken);
    const projectUuid = useSelector(selectProject);
    
    const [formData, setFormData] = useState<SettingsFormData>();
    const isUpdating = useSelector(featureLoading)

    async function updateAgent() {

        const body = {
            "feature_uuid": agentUuid,
            "project_uuid": projectUuid,
            "integration_settings": {
                "message_time_restriction": {
                    "is_active": formData?.messageTimeRestriction.isActive,
                    "periods": {
                        "weekdays": {
                            "from": formData?.messageTimeRestriction.periods.weekdays.from,
                            "to": formData?.messageTimeRestriction.periods.weekdays.to
                        },
                        "saturdays": {
                            "from": formData?.messageTimeRestriction.periods.saturdays.from,
                            "to": formData?.messageTimeRestriction.periods.saturdays.to
                        }
                    }
                }
            }
        };

        const response = await updateAgentSettings(body, token)

        if(response?.error){
            toast.critical(t('agents.common.configure.error'));
            return
        }
        toast.success(t('agents.common.configure.success'));
    }

    return (
        <DrawerProvider open={open} onClose={toggleOpen}>
            <DrawerPopover>
                <SettingsContext.Provider value={{ setFormData }}>
                    <DrawerHeader>
                        <DrawerHeading>{t('common.manage_settings')}</DrawerHeading>
                        <DrawerDismiss />
                    </DrawerHeader>

                    {
                        code === 'abandoned-cart'
                        && <PreferencesAbandonedCartActive />
                    }

                    {
                        code === 'order-status'
                        && <PreferencesOrderStatusActive />
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
                            {
                                isUpdating ?
                                <Spinner description="loading" /> :
                                t('common.save')
                            }
                        </Button>
                    </DrawerFooter>
                </SettingsContext.Provider>
            </DrawerPopover>
        </DrawerProvider >
    )
}