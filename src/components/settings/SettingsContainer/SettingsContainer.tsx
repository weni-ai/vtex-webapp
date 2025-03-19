import { DrawerProvider, DrawerPopover, DrawerHeader, DrawerDismiss, DrawerHeading, DrawerFooter, Button, Spinner, toast } from "@vtex/shoreline";
import './SettingsContainer.style.css';
import { PreferencesOrderStatusActive } from "../OrderStatusActive";
import { PreferencesAbandonedCartActive } from "../AbandonedCartActive";
import { useState } from "react";
import { SettingsContext, SettingsFormData } from "./SettingsContext";
import { useSelector } from "react-redux";
import { updateAgentLoading, selectProject } from "../../../store/projectSlice";
import { updateAgentSettings } from "../../../services/agent.service";
import { UpdateAgentSettingsData } from "../../../api/agents/adapters";

type codes = 'abandoned_cart' | 'order_status';

export interface SettingsContainerProps {
    open: boolean;
    code: codes;
    agentUuid: string;
    toggleOpen: () => void;
}

export function SettingsContainer({ open, toggleOpen, code, agentUuid }: SettingsContainerProps) {
    const projectUuid = useSelector(selectProject);
    const [formData, setFormData] = useState<SettingsFormData>({});
    const isUpdating = useSelector(updateAgentLoading);

    async function updateAgent() {
        let body: UpdateAgentSettingsData | undefined;

        if (code === 'abandoned_cart') {
            body = {
                feature_uuid: agentUuid,
                project_uuid: projectUuid,
                integration_settings: {
                    message_time_restriction: {
                        is_active: formData?.messageTimeRestriction?.isActive || false,
                        periods: {
                            weekdays: {
                                from: formData?.messageTimeRestriction?.periods?.weekdays?.from || "",
                                to: formData?.messageTimeRestriction?.periods?.weekdays?.to || ""
                            },
                            saturdays: {
                                from: formData?.messageTimeRestriction?.periods?.saturdays?.from || "",
                                to: formData?.messageTimeRestriction?.periods?.saturdays?.to || ""
                            }
                        }
                    }
                }
            };
        } else if (code === 'order_status') {
            body = {
                feature_uuid: agentUuid,
                project_uuid: projectUuid,
                integration_settings: {
                    order_status_restriction: {
                        is_active: formData?.order_status_restriction?.is_active || false,
                        phone_numbers: formData?.order_status_restriction?.phone_numbers ? [formData.order_status_restriction.phone_numbers] : [],
                        sellers: formData?.order_status_restriction?.sellers ?? []
                    }
                }
            };
        }

        if (!body) return;

        const response = await updateAgentSettings(body);
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
