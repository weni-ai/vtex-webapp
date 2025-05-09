import { Text, Flex, Grid, IconCaretDown, MenuProvider, MenuTrigger, MenuPopover, MenuSeparator, RadioGroup, Radio, Button, useRadioState } from "@vtex/shoreline";
import { DashboardItem } from "./DashboardItem";
import { useEffect, useState } from "react";
import { getSkillMetrics } from "../services/agent.service";

export function AgentMetrics() {
  const [agent, setAgent] = useState<string>('')
  const [data, setData] = useState<{ title: string; value: string; }[][]>([]);

  const agentRadioState = useRadioState({
    value: agent,
    setValue: setAgent as any,
  })

  useEffect(() => {
    const fetchData = async () => {
      setData([]);

      const response = await getSkillMetrics() as { data: { title: string; value: string; }[] };

      const count = response.data.length;

      const lines = Math.floor(count / 3) || 1;
      const itensByLine = Math.floor(count / lines);

      if ('data' in response) {
        let data = [];

        for (let i = 0; i < lines; i += 1) {
          const last = i === lines - 1 ? count : (i + 1) * itensByLine;
          data.push(response.data.slice(i * itensByLine, last));
        } 

        setData(data);
      }
    };
    fetchData();
  }, []);

  function getDashboardTitleById(id: string) {
    const knownIds = ['sent-messages', 'delivered-messages', 'read-messages', 'interactions', 'utm-revenue', 'orders-placed'];

    if (knownIds.includes(id)) {
      return t(`insights.dashboard.abandoned_cart.${id.replace(/-/g, '_')}`);
    }

    return id;
  }

  return (
    <>
      {/* Temporarily hidden */}
      <Flex style={{ display: 'none', }} align="center" gap="$space-1">
        <Text variant="display2" color="$fg-base">
          What's happening in:
        </Text>

        <MenuProvider placement="bottom-start">
          <MenuTrigger asChild>
            <Text variant="display2">
              <Flex align="center" gap="$space-1">
                Order status agent

                <IconCaretDown />
              </Flex>
            </Text>
          </MenuTrigger>

          <MenuPopover>
            <Flex style={{ padding: '0 var(--sl-space-3) var(--sl-space-4)' }}>
              <RadioGroup label="" state={agentRadioState}>
                <Radio value="1">Option 1</Radio>
                <Radio value="2">Option 2</Radio>
                <Radio value="3">Option 3</Radio>
              </RadioGroup>
            </Flex>

            <MenuSeparator />

            <Flex
              justify="end"
              gap="$space-2"
              style={{
                padding: 'var(--sl-space-4) var(--sl-space-3) var(--sl-space-3) var(--sl-space-3)'
              }}
            >
              <Button variant="secondary" disabled={agent === ''} onClick={() => agentRadioState.setValue('')}>
                Clear
              </Button>

              <Button variant="primary" disabled={agent === ''}>
                Apply
              </Button>
            </Flex>
          </MenuPopover>
        </MenuProvider>
      </Flex>

      <Flex
        direction="column"
        gap="$space-0"
        style={{
          border: 'var(--sl-border-base)',
          borderRadius: 'var(--sl-radius-2)',
          display: data.length > 0 ? 'block' : 'none',
        }}
      >
        {data.map((line, indexOfLine) => (
          <Grid
            key={`line-${indexOfLine}`}
            columns={`repeat(${line.length}, 1fr)`}
            gap="$space-0"
            style={{
              borderBottom: indexOfLine !== data.length - 1 ? 'var(--sl-border-base)' : undefined,
            }}
          >
            {line.map((detail, indexOfDetail) => (
              <DashboardItem
                key={`detail-${indexOfLine}-${indexOfDetail}`}
                title={getDashboardTitleById(detail.title)}
                value={detail.value}
                style={{
                  borderRight: indexOfDetail !== line.length - 1 ? 'var(--sl-border-base)' : undefined,
                }}
              />
            ))}
          </Grid>
        ))}
      </Flex>
    </>
  )
}
