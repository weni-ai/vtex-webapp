 
import { DrawerProvider, DrawerPopover, DrawerHeader, DrawerDismiss, DrawerHeading, DrawerFooter, Button, Spinner, toast } from "@vtex/shoreline";
import './SettingsContainer.style.css';
import { PreferencesOrderStatusActive } from "../OrderStatusActive";
import { PreferencesAbandonedCartActive } from "../AbandonedCartActive";
import { useState } from "react";
import { SettingsContext, SettingsFormData } from "./SettingsContext";
import { VTEXFetch } from "../../../utils/VTEXFetch";
import { useSelector } from "react-redux";
import { selectToken } from "../../../store/authSlice";
import { selectProject } from "../../../store/projectSlice";

type codes = 'abandoned_cart' | 'order_status';

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
    const [isUpdating, setIsUpdating] = useState(false);

    function updateAgentSettings() {
        setIsUpdating(true);

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

        VTEXFetch<{
            message: string;
        }>(`/_v/update-feature-settings?token=${token}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(body),
        }).then(() => {
            toast.success(t('agents.common.configure.success'));
        })
        .catch(() => {
            toast.critical(t('agents.common.configure.error'));
        }).finally(() => {
            setIsUpdating(false);
            toggleOpen();
        });
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
                        code === 'abandoned_cart'
                        && <PreferencesAbandonedCartActive />
                    }

                    {
                        code === 'order_status'
                        && <PreferencesOrderStatusActive />
                    }

                    <DrawerFooter style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <Button onClick={toggleOpen} size="large" style={{ width: '50%' }}>
                            {t('common.cancel')}
                        </Button>

                        <Button
                            variant="primary"
                            onClick={updateAgentSettings}
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