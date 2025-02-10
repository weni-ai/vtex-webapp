import { DrawerContent, Flex, TimeInput, Divider, Text, Grid, GridCell, Checkbox } from "@vtex/shoreline";
import { TimeValue } from '@react-aria/datepicker';
import { ChangeEvent, useContext, useEffect, useState } from "react";
import { SettingsContext } from "./SettingsContainer/SettingsContext";

export function PreferencesAbandonedCartActive() {
  const context = useContext(SettingsContext);
  
  const [restriction, setRestriction] = useState(false)
  const setRestrictionValue = (event: ChangeEvent<HTMLInputElement>) => {
      setRestriction(Boolean(event.target.value))
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
          <Checkbox onChange={setRestrictionValue} aria-label={t('agent_gallery.features.abandoned-cart.preferences.restriction_details')}>
              <Flex direction="column" style={{ gap: '0px' }}>
                  <Text variant="body">{t('agent_gallery.features.abandoned-cart.preferences.restriction')}</Text>
                  <Text variant="caption2" color="$fg-base-soft">{t('agent_gallery.features.abandoned-cart.preferences.restriction_details')}</Text>
              </Flex>
          </Checkbox>
      </Flex>

      {restriction ? <>
          <Flex direction="column" style={{paddingTop: '24px'}}>
              <Flex direction="column" >
                  <Text variant="emphasis">{t('agent_gallery.features.abandoned-cart.preferences.monday_until_friday')}</Text>
                  <Grid columns="repeat(2, 1fr)">
                      <GridCell>
                          <Text variant="body" color="$fg-base-soft">{t('agent_gallery.features.abandoned-cart.preferences.from')}</Text>
                          <Flex>
                              <TimeInput
                                className='custom-time-input'
                                value={weekdaysFrom}
                                onChange={setWeekdaysFrom}
                              />
                          </Flex>
                      </GridCell>
                      <GridCell>
                          <Text variant="body" color="$fg-base-soft">{t('agent_gallery.features.abandoned-cart.preferences.to')}</Text>
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
                  <Text variant="emphasis">{t('agent_gallery.features.abandoned-cart.preferences.saturday')}</Text>
                  <Grid columns="repeat(2, 1fr)">
                      <GridCell>
                          <Text variant="body" color="$fg-base-soft">{t('agent_gallery.features.abandoned-cart.preferences.from')}</Text>
                          <TimeInput
                            className='custom-time-input'
                            value={saturdaysFrom}
                            onChange={setSaturdaysFrom}
                          />
                      </GridCell>
                      <GridCell>
                          <Text variant="body" color="$fg-base-soft">{t('agent_gallery.features.abandoned-cart.preferences.to')}</Text>
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