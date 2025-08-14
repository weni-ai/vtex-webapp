import { TimeValue } from '@react-aria/datepicker';
import { Checkbox, Divider, DrawerContent, Flex, Grid, GridCell, Text, TimeInput } from "@vtex/shoreline";
import { ChangeEvent, useContext, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { agents } from "../../store/projectSlice";
import { convertStringToTimeValue, convertTimeValueToString } from "../../utils/timeConversor";
import { SettingsContext } from "./SettingsContainer/SettingsContext";
import { useTranslation } from "react-i18next";

export function PreferencesAbandonedCartActive() {
  const { t } = useTranslation();
  
  const context = useContext(SettingsContext);
  const agentsList = useSelector(agents);
  const abandonedCartAgent = agentsList.find(agent => agent.origin === 'commerce' && agent.code === 'abandoned_cart');
  const currentMessageTimeRestrictions = abandonedCartAgent?.restrictMessageTime;
  const [restriction, setRestriction] = useState<boolean>(currentMessageTimeRestrictions?.isActive ?? false);
  const setRestrictionValue = (event: ChangeEvent<HTMLInputElement>) => {
    setRestriction(event.target.checked)
  }

  type TimeType = TimeValue | null;

  const [weekdaysFrom, setWeekdaysFrom] = useState<TimeType>(
    currentMessageTimeRestrictions?.periods?.weekdays?.from ?
      convertStringToTimeValue(currentMessageTimeRestrictions.periods.weekdays.from) :
      null
  );
  const [weekdaysTo, setWeekdaysTo] = useState<TimeType>(
    currentMessageTimeRestrictions?.periods?.weekdays?.to ?
      convertStringToTimeValue(currentMessageTimeRestrictions?.periods?.weekdays?.to) :
      null
  );

  const [saturdaysFrom, setSaturdaysFrom] = useState<TimeType>(
    currentMessageTimeRestrictions?.periods?.saturdays?.from ?
      convertStringToTimeValue(currentMessageTimeRestrictions?.periods?.saturdays?.from) :
      null
  );
  const [saturdaysTo, setSaturdaysTo] = useState<TimeType>(
    currentMessageTimeRestrictions?.periods?.saturdays?.to ?
      convertStringToTimeValue(currentMessageTimeRestrictions?.periods?.saturdays?.to) :
      null
  );

  const handleTimeChange = (setter: (value: TimeType) => void) => (value: TimeValue | null) => {
    setter(value);
  };

  useEffect(() => {
    context?.setFormData({
      messageTimeRestriction: {
        isActive: restriction,
        periods: {
          weekdays: {
            from: weekdaysFrom ? convertTimeValueToString(weekdaysFrom) : '',
            to: weekdaysTo ? convertTimeValueToString(weekdaysTo) : '',
          },
          saturdays: {
            from: saturdaysFrom ? convertTimeValueToString(saturdaysFrom) : '',
            to: saturdaysTo ? convertTimeValueToString(saturdaysTo) : '',
          }
        }
      }
    })
  }, [restriction, weekdaysFrom, weekdaysTo, saturdaysFrom, saturdaysTo]);

  return (
    <DrawerContent data-testid="drawer-content">
      <Flex style={{ marginBottom: '1rem' }}>
        <Checkbox checked={restriction} onChange={setRestrictionValue} aria-label={t('agents.active.abandoned_cart.settings.restriction.description')} data-testid="checkbox-input">
          <Flex direction="column" style={{ gap: '0px' }}>
            <Text variant="body">{t('agents.categories.active.abandoned_cart.settings.restriction.title')}</Text>
            <Text variant="caption2" color="$fg-base-soft">{t('agents.categories.active.abandoned_cart.settings.restriction.description')}</Text>
          </Flex>
        </Checkbox>
      </Flex>

      {restriction ? <>
        <Flex direction="column" style={{ paddingTop: '24px' }}>
          <Flex direction="column">
            <Text variant="emphasis" data-testid="weekdays-title">{t('agents.categories.active.abandoned_cart.settings.restriction.monday_until_friday')}</Text>
            <Grid columns="repeat(2, 1fr)">
              <GridCell>
                <Text variant="body" color="$fg-base-soft">{t('agents.categories.active.abandoned_cart.settings.restriction.from')}</Text>
                <Flex>
                  <TimeInput
                    aria-label={t('agents.categories.active.abandoned_cart.settings.restriction.from')}
                    className='custom-time-input'
                    data-testid="time-input"
                    value={weekdaysFrom}
                    onChange={handleTimeChange(setWeekdaysFrom)}
                  />
                </Flex>
              </GridCell>
              <GridCell>
                <Text variant="body" color="$fg-base-soft">{t('agents.categories.active.abandoned_cart.settings.restriction.to')}</Text>
                <TimeInput
                  aria-label={t('agents.categories.active.abandoned_cart.settings.restriction.to')}
                  className='custom-time-input'
                  data-testid="time-input-weekdays-to"
                  value={weekdaysTo}
                  onChange={handleTimeChange(setWeekdaysTo)}
                />
              </GridCell>
            </Grid>
          </Flex>
          <Divider style={{ margin: 'var(--sl-space-4) 0' }} />
          <Flex direction="column">
            <Text variant="emphasis">{t('agents.categories.active.abandoned_cart.settings.restriction.saturday')}</Text>
            <Grid columns="repeat(2, 1fr)">
              <GridCell>
                <Text variant="body" color="$fg-base-soft">{t('agents.categories.active.abandoned_cart.settings.restriction.from')}</Text>
                <TimeInput
                  aria-label={t('agents.categories.active.abandoned_cart.settings.restriction.from')}
                  data-testid="time-input-saturdays-from"
                  className='custom-time-input'
                  value={saturdaysFrom}
                  onChange={handleTimeChange(setSaturdaysFrom)}
                />
              </GridCell>
              <GridCell>
                <Text variant="body" color="$fg-base-soft">{t('agents.categories.active.abandoned_cart.settings.restriction.to')}</Text>
                <TimeInput
                  aria-label={t('agents.categories.active.abandoned_cart.settings.restriction.to')}
                  data-testid="time-input-saturdays-to"
                  className='custom-time-input'
                  value={saturdaysTo}
                  onChange={handleTimeChange(setSaturdaysTo)}
                />
              </GridCell>
            </Grid>
          </Flex>
        </Flex>
      </> : null}
    </DrawerContent>
  );
}
