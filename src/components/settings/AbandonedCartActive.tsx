import { DrawerContent, Flex, TimeInput, Divider, Text, Grid, GridCell, Checkbox } from "@vtex/shoreline";
import { ChangeEvent, useContext, useEffect, useState } from "react";
import { SettingsContext } from "./SettingsContainer/SettingsContext";
import { integratedFeatures } from "../../store/projectSlice";
import { useSelector } from "react-redux";
import { RootState } from "src/interfaces/Store";
import { convertStringToTimeValue, convertTimeValueToString } from "../../utils/timeConversor";
import { TimeValue } from '@react-aria/datepicker';

export function PreferencesAbandonedCartActive() {
  const context = useContext(SettingsContext);
  const currentMessageTimeRestrictions = useSelector((state: RootState) => integratedFeatures(state).find((feature) => feature.code === 'abandoned_cart')?.message_time_restrictions);
  const [restriction, setRestriction] = useState(currentMessageTimeRestrictions?.is_active || false)
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
    <DrawerContent>
      <Flex style={{ marginBottom: '1rem' }}>
        <Checkbox onChange={setRestrictionValue} aria-label={t('agents.active.abandoned_cart.settings.restriction.description')}>
          <Flex direction="column" style={{ gap: '0px' }}>
            <Text variant="body">{t('agents.categories.active.abandoned_cart.settings.restriction.title')}</Text>
            <Text variant="caption2" color="$fg-base-soft">{t('agents.categories.active.abandoned_cart.settings.restriction.description')}</Text>
          </Flex>
        </Checkbox>
      </Flex>

      {restriction ? <>
        <Flex direction="column" style={{ paddingTop: '24px' }}>
          <Flex direction="column" >
            <Text variant="emphasis">{t('agents.categories.active.abandoned_cart.settings.restriction.monday_until_friday')}</Text>
            <Grid columns="repeat(2, 1fr)">
              <GridCell>
                <Text variant="body" color="$fg-base-soft">{t('agents.categories.active.abandoned_cart.settings.restriction.from')}</Text>
                <Flex>
                  <TimeInput
                    className='custom-time-input'
                    value={weekdaysFrom}
                    onChange={handleTimeChange(setWeekdaysFrom)}
                  />
                </Flex>
              </GridCell>
              <GridCell>
                <Text variant="body" color="$fg-base-soft">{t('agents.categories.active.abandoned_cart.settings.restriction.to')}</Text>
                <TimeInput
                  className='custom-time-input'
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
                  className='custom-time-input'
                  value={saturdaysFrom}
                  onChange={handleTimeChange(setSaturdaysFrom)}
                />
              </GridCell>
              <GridCell>
                <Text variant="body" color="$fg-base-soft">{t('agents.categories.active.abandoned_cart.settings.restriction.to')}</Text>
                <TimeInput
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