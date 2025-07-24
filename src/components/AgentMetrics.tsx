import { Button, Flex, Grid, IconCaretDown, MenuPopover, MenuProvider, MenuSeparator, MenuTrigger, Radio, RadioGroup, Skeleton, Text, useRadioState } from "@vtex/shoreline";
import { useEffect, useMemo, useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../interfaces/Store";
import { agentCLI, agentMetrics, getSkillMetrics } from "../services/agent.service";
import { DashboardItem } from "./DashboardItem";

function getPeriodDates(period: 'today' | 'yesterday' | 'last 7 days' | 'last 28 days') {
  const toISODate = (date: Date) => date.toISOString().split('T')[0];

  const getStartAndEndDates = (daysAgo: number, includeToday: boolean = true) => {
    const end = new Date();
    const start = new Date();
    start.setDate(end.getDate() - daysAgo);
    return {
      startDate: toISODate(start),
      endDate: toISODate(includeToday ? end : start),
    };
  };

  const periodMap: Record<typeof period, () => { startDate: string; endDate: string }> = {
    'today': () => getStartAndEndDates(0),
    'yesterday': () => getStartAndEndDates(1, false),
    'last 7 days': () => getStartAndEndDates(7),
    'last 28 days': () => getStartAndEndDates(28),
  };

  return periodMap[period]();
}

function Menu({ value, setValue, options, trigger }: { value: string; setValue: (value: string) => void; options: { label: string; value: string }[]; trigger: (label: string) => React.ReactNode }) {
  const [localValue, setLocalValue] = useState(value);
  const [isOpen, setIsOpen] = useState(false);

  const radioState = useRadioState({
    value: localValue,
    setValue: setLocalValue as any,
  });

  function handleApply() {
    setValue(localValue);
    setIsOpen(false);
  }

  useEffect(() => {
    if (isOpen) {
      setLocalValue(value);
    }
  }, [isOpen]);

  return (
    <MenuProvider placement="bottom-start" open={isOpen} setOpen={setIsOpen}>
      <MenuTrigger asChild>
        {trigger(options.find((option) => option.value === value)?.label || '')}
      </MenuTrigger>

      <MenuPopover>
        <Flex style={{ padding: '0 var(--sl-space-3) var(--sl-space-4)' }}>
          <RadioGroup label="" state={radioState}>
            {options.map((option) => (
              <Radio key={option.value} value={option.value}>
                {option.label}
              </Radio>
            ))}
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
          <Button variant="primary" disabled={value === ''} onClick={handleApply}>
            Apply
          </Button>
        </Flex>
      </MenuPopover>
    </MenuProvider>
  );
}

export function AgentMetrics() {
  const [isDataLoading, setIsDataLoading] = useState<boolean>(false);
  const [dataRows, setDataRows] = useState<number>(0);
  const [data, setData] = useState<{ title: string; value: string; }[][]>([]);

  const [currentAgentUuid, setCurrentAgentUuid] = useState<string>('');
  const assignedAgents = useSelector((state: RootState) => state.project.agents.filter((agent) => agent.notificationType === 'active' && agent.isAssigned));
  const assignedAgentsUuids = useMemo(() => assignedAgents.map((agent) => agent.uuid), [assignedAgents]);

  const [currentTemplateUuid, setCurrentTemplateUuid] = useState<string>('');
  const [templates, setTemplates] = useState<{ uuid: string; name: string; }[]>([]);

  const [currentPeriod, setCurrentPeriod] = useState<'today' | 'yesterday' | 'last 7 days' | 'last 28 days'>('last 7 days');

  async function fetchSkillMetrics() {
    try {
      setIsDataLoading(true);
      setDataRows(2);

      const { startDate, endDate } = getPeriodDates(currentPeriod);

      const response = await getSkillMetrics({ startDate, endDate }) as { data: { title: string; value: string; }[] };

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
    } finally {
      setIsDataLoading(false);
    }
  }

  function getDashboardTitleById(id: string) {
    const knownIds = ['sent-messages', 'delivered-messages', 'read-messages', 'interactions', 'utm-revenue', 'orders-placed'];

    if (knownIds.includes(id)) {
      return t(`insights.dashboard.abandoned_cart.${id.replace(/-/g, '_')}`);
    }

    return id;
  }

  useEffect(() => {
    if (assignedAgentsUuids.length > 0 && currentAgentUuid === '') {
      setCurrentAgentUuid(assignedAgentsUuids[0]);
    }
  }, [assignedAgentsUuids, currentAgentUuid]);

  function getAgentName(uuid: string) {
    const agent = assignedAgents.find((agent) => agent.uuid === uuid);

    return agent?.name || '';
  }

  useEffect(() => {
    setTemplates([]);
    setCurrentTemplateUuid('');
    setData([]);

    const agent = assignedAgents.find((agent) => agent.uuid === currentAgentUuid);
    const isAbandonedCart = agent?.origin === 'commerce' && agent?.code === 'abandoned_cart';

    if (isAbandonedCart) {
      getMetrics();
      return;
    }

    if (agent?.origin === 'CLI') {
      getTemplates({ assignedAgentUuid: agent.assignedAgentUuid });
    }
  }, [currentAgentUuid]);

  async function getTemplates({ assignedAgentUuid }: { assignedAgentUuid: string }) {
    let templates = [];

    try {
      setIsDataLoading(true);
      setDataRows(1);

      const response = await agentCLI({
        agentUuid: assignedAgentUuid,
        dontSave: true,
        params: { showAll: true }
      });

      templates = response.templates.filter((template) => {
        return template.status !== 'needs-editing';
      });

      setTemplates(templates);

      if (templates.length > 0) {
        setCurrentTemplateUuid(templates[0].uuid);
      }
    } finally {
      if (templates.length === 0) {
        setIsDataLoading(false);
        setEmptyData();
      }
    }
  }

  function setEmptyData() {
    setData([[
      {
        title: 'sent-messages',
        value: '0',
      },
      {
        title: 'delivered-messages',
        value: '0',
      },
      {
        title: 'read-messages',
        value: '0',
      },
      {
        title: 'interactions',
        value: '0',
      },
    ]]);
  }

  useEffect(() => {
    if (currentTemplateUuid) {
      getMetrics();
    }
  }, [currentTemplateUuid]);

  const hasMetrics = useMemo(() => {
    const agent = assignedAgents.find((agent) => agent.uuid === currentAgentUuid);
    const isAbandonedCart = agent?.origin === 'commerce' && agent?.code === 'abandoned_cart';

    if (isAbandonedCart) {
      return true;
    }

    if (agent?.origin === 'CLI' && currentTemplateUuid) {
      return true;
    }

    return false;
  }, [currentAgentUuid, currentTemplateUuid]);

  useEffect(() => {
    if (hasMetrics) {
      getMetrics();
    }
  }, [currentPeriod]);

  function getMetrics() {
    setData([]);

    const agent = assignedAgents.find((agent) => agent.uuid === currentAgentUuid);
    const isAbandonedCart = agent?.origin === 'commerce' && agent?.code === 'abandoned_cart';

    if (isAbandonedCart) {
      fetchSkillMetrics();
      return;
    }

    fetchMetrics({ templateUuid: currentTemplateUuid, period: currentPeriod });
  }

  async function fetchMetrics({ templateUuid, period }: { templateUuid: string, period: typeof currentPeriod }) {
    const { startDate, endDate } = getPeriodDates(period);

    try {
      setIsDataLoading(true);
      setDataRows(1);
      const response = await agentMetrics({ templateUuid, startDate, endDate });

      setData([[
        {
          title: 'sent-messages',
          value: response.sent.value.toString(),
        },
        {
          title: 'delivered-messages',
          value: response.delivered.value.toString(),
        },
        {
          title: 'read-messages',
          value: response.read.value.toString(),
        },
        {
          title: 'interactions',
          value: response.clicked.value.toString(),
        },
      ]]);
    } finally {
      setIsDataLoading(false);
    }
  }

  function skeletonLoadingHeight(dataRows: number) {
    const rowHeight = 92;
    const borderWidth = 1;
    const borderTopAndBottom = borderWidth * 2;

    return `${dataRows * rowHeight + (dataRows - 1) * borderWidth + borderTopAndBottom}px`;
  }

  return (
    <Flex direction="column" gap="$space-4">
      <Flex
        style={{
          display: assignedAgents.length > 0 ? 'flex' : 'none',
          minHeight: '36px',
        }}
        align="center"
        justify="space-between"
        gap="$space-2"
      >
        <Flex align="center" gap="$space-1">
          <Text variant="display2">
            {t('insights.dashboard.abandoned_cart.title')}
          </Text>

          <Menu
            value={currentAgentUuid}
            setValue={setCurrentAgentUuid}
            options={assignedAgentsUuids.map((uuid) => ({ label: getAgentName(uuid), value: uuid }))}
            trigger={
              (label) =>
                <Text variant="display2">
                  <Flex align="center" gap="$space-1">
                    {label}
                    <IconCaretDown />
                  </Flex>
                </Text>
            }
          />
        </Flex>

        <Flex>
          {currentTemplateUuid && (
            <Menu
              value={currentTemplateUuid}
              setValue={setCurrentTemplateUuid}
              options={templates.map((template) => ({ label: template.name, value: template.uuid }))}
              trigger={
                (label) =>
                  <Button variant="secondary">
                    {t('metrics.fields.template.label') + ': ' + label}
                    <IconCaretDown />
                  </Button>
              }
            />
          )}

          {hasMetrics && (
            <Menu
              value={currentPeriod}
              setValue={(value) => setCurrentPeriod(value as typeof currentPeriod)}
              options={[
                { label: t('metrics.fields.period.options.today'), value: 'today' },
                { label: t('metrics.fields.period.options.yesterday'), value: 'yesterday' },
                { label: t('metrics.fields.period.options.last_7_days'), value: 'last 7 days' },
                { label: t('metrics.fields.period.options.last_28_days'), value: 'last 28 days' },
              ]}
              trigger={
                (label) =>
                  <Button variant="secondary">
                    {t('metrics.fields.period.label') + ': ' + label}
                    <IconCaretDown />
                  </Button>
              }
            />
          )}
        </Flex>
      </Flex>

      {isDataLoading && <Skeleton width="100%" height={skeletonLoadingHeight(dataRows)} />}

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
    </Flex>
  )
}
