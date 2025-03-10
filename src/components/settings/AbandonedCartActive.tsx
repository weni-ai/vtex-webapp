import { DrawerContent, Flex, TimeInput, Divider, Text, Grid, GridCell, Checkbox } from "@vtex/shoreline";
import { TimeValue } from '@react-aria/datepicker';
import { ChangeEvent, useContext, useEffect, useState } from "react";
import { SettingsContext } from "./SettingsContainer/SettingsContext";
import { integratedFeatures } from "../../store/projectSlice";
import { useSelector } from "react-redux";
import { RootState } from "src/interfaces/Store";

export function PreferencesAbandonedCartActive() {
  const context = useContext(SettingsContext);
  const currentMessageTimeRestrictions = useSelector((state: RootState) => integratedFeatures(state).find((feature) => feature.code === 'abandoned_cart')?.message_time_restrictions);
  const [restriction, setRestriction] = useState(currentMessageTimeRestrictions?.is_active || false)
  const setRestrictionValue = (event: ChangeEvent<HTMLInputElement>) => {
      setRestriction(event.target.checked)
  }

  type TimeType = TimeValue | undefined | null;
  
  const [weekdaysFrom, setWeekdaysFrom] = useState<TimeType>();
  const [weekdaysTo, setWeekdaysTo] = useState<TimeType>();
  
  const [saturdaysFrom, setSaturdaysFrom] = useState<TimeType>();
  const [saturdaysTo, setSaturdaysTo] = useState<TimeType>();

  useEffect(() => {
    function convertToTimeString(time: TimeType) {
      if (time === undefined || time === null) {
        return '00:00';
      }
      
      return `${time.hour.toString().padStart(2, '0')}:${time.minute.toString().padStart(2, '0')}`;
    }

    context?.setFormData({
      messageTimeRestriction: {
        isActive: restriction,
        periods: {
          weekdays: {
            from: convertToTimeString(weekdaysFrom),
            to: convertToTimeString(weekdaysTo),
          },
          saturdays: {
            from: convertToTimeString(saturdaysFrom),
            to: convertToTimeString(saturdaysTo),
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
          <Flex direction="column" style={{paddingTop: '24px'}}>
              <Flex direction="column" >
                  <Text variant="emphasis">{t('agents.categories.active.abandoned_cart.settings.restriction.monday_until_friday')}</Text>
                  <Grid columns="repeat(2, 1fr)">
                      <GridCell>
                          <Text variant="body" color="$fg-base-soft">{t('agents.categories.active.abandoned_cart.settings.restriction.from')}</Text>
                          <Flex>
                              <TimeInput
                                className='custom-time-input'
                                value={weekdaysFrom}
                                onChange={setWeekdaysFrom}
                              />
                          </Flex>
                      </GridCell>
                      <GridCell>
                          <Text variant="body" color="$fg-base-soft">{t('agents.categories.active.abandoned_cart.settings.restriction.to')}</Text>
                          <TimeInput
                            className='custom-time-input'
                            value={weekdaysTo}
                            onChange={setWeekdaysTo}
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
                            onChange={setSaturdaysFrom}
                          />
                      </GridCell>
                      <GridCell>
                          <Text variant="body" color="$fg-base-soft">{t('agents.categories.active.abandoned_cart.settings.restriction.to')}</Text>
                          <TimeInput
                            className='custom-time-input'
                            value={saturdaysTo}
                            onChange={setSaturdaysTo}
                          />
                      </GridCell>
                  </Grid>
              </Flex>
          </Flex>
      </> : null}
    </DrawerContent>
  );
}