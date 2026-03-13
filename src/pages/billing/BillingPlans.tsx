import { Tag } from '../../components/adapters/Tag';
import { Button } from '../../components/adapters/Button';
import { Bleed, Divider, Flex, Grid, IconArrowLeft, IconButton, IconCheck, IconX, Page, PageContent, PageHeader, PageHeaderRow, PageHeading, Text } from "@vtex/shoreline";

import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

import './BillingPlans.css';

export function BillingPlans() {
  const navigate = useNavigate();

  function goBack() {
    navigate(-1);
  }

  return (
    <Page style={{ height: '100vh', padding: 'var(--sl-space-6)' }}>
      <PageHeader style={{ padding: 'var(--sl-space-5)' }}>
        <PageHeaderRow>
          <Flex align="center">
            <Bleed top="$space-2" bottom="$space-2">
              <IconButton
                label="Return"
                asChild
                variant="tertiary"
                size="large"
              >
                <IconArrowLeft onClick={goBack} />
              </IconButton>
            </Bleed>

            <PageHeading>
              {t('billing.plans.title')}
            </PageHeading>
          </Flex>
        </PageHeaderRow>
      </PageHeader>

      <PageContent>
        <Grid columns="repeat(auto-fill, minmax(350px, 1fr))" gap="$space-5" className="billing-plans">
          {PLANS.map((plan) => (
            <PlanCard key={plan.key} plan={plan} />
          ))}
        </Grid>

        <Flex direction="column" style={{ marginTop: 'var(--sl-space-10)', whiteSpace: 'pre-wrap' }}>
          <Text variant="caption2">
            {t('billing.plans.notes.explanations')}
          </Text>

          <Text variant="caption2" color="$fg-base-soft">
            {t('billing.plans.notes.conversation_definition')}
          </Text>
        </Flex>
      </PageContent>
    </Page>
  )
}

function PlanCard(props: { plan: typeof PLANS[number] }) {
  const { plan } = props;
  const { i18n } = useTranslation();

  function formatPrice(currency: string, price: number) {
    return new Intl.NumberFormat(i18n.language, {
      style: 'currency',
      currency: currency,
      currencyDisplay: 'narrowSymbol',
    }).format(price);
  }

  function formatNumber(number: number) {
    return new Intl.NumberFormat(i18n.language).format(number);
  }

  return (
    <Flex direction="column" className={`billing-plan-card ${plan.isRecommended ? 'billing-plan-card--recommended' : ''}`}>
      <Flex direction="column" gap="$space-2">
        <Flex align="center" justify="space-between">
          <Text variant="display3">{t(`billing.plans.${plan.key}.title`)}</Text>

          {plan.isRecommended && (
            <Tag variant="primary" color="blue" style={{ border: 'unset' }}>
              {t('billing.plans.recommended')}
            </Tag>
          )}
        </Flex>

        <Flex direction="column" className="billing-plan-card__pricing" gap="$space-05">
          <Text variant="display1" color="$fg-informational">{formatPrice(...plan.pricing)}</Text>
          <Text variant="caption2">{t('billing.plans.princing.per_conversation')}</Text>
          <Text variant="caption2" color="$fg-base-soft" style={{ marginTop: 'var(--sl-space-05)' }}>
            {t('billing.plans.princing.limited_to', { number: formatNumber(plan.conversationsLimit) })}
          </Text>
        </Flex>
      </Flex>

      <Divider />

      <Flex direction="column" gap="$space-3">
        {plan.features.map((feature) => (
          <Flex key={feature.key} gap="$space-2">
            <FeatureIcon isIncluded={feature.isIncluded} />

            <Flex direction="column" gap="$space-05">
              <Text variant="body">{t(`billing.plans.features.${feature.key}.title`)}</Text>

              {feature.showDescription && (
                <Text variant="caption2" color="$fg-base-soft">{t(`billing.plans.features.${feature.key}.description`)}</Text>
              )}
            </Flex>
          </Flex>
        ))}
      </Flex>

      <Button variant="primary" size="large">
        {t('billing.plans.actions.start_with', { plan: t(`billing.plans.${plan.key}.title`) })}
      </Button>
    </Flex>
  );
}

function FeatureIcon(props: { isIncluded: boolean }) {
  const color = props.isIncluded ? '$fg-informational' : '$fg-critical';
  const Icon = props.isIncluded ? IconCheck : IconX;

  return (
    <Text variant="body" color={color} style={{ minWidth: 'fit-content' }}>
      <Icon height={20} width={20} />
    </Text>
  );
}

const PLANS = [{
  key: 'starter',
  isRecommended: false,
  pricing: ['USD', 0.35] as [string, number],
  conversationsLimit: 1_000,
  features: [
    {
      key: 'unlimited_users',
      isIncluded: true,
    },
    {
      key: 'ready_to_use_ai_agents',
      isIncluded: true,
    },
    {
      key: 'custom_ai_agents_builder',
      isIncluded: false,
    },
    {
      key: 'on_demand_marketing_and_utility_messages',
      showDescription: true,
      isIncluded: true,
    },
    {
      key: 'workflows',
      showDescription: true,
      isIncluded: true,
    },
    {
      key: 'events_data_api',
      isIncluded: false,
    },
  ],
}, {
  key: 'corporate',
  isRecommended: true,
  pricing: ['USD', 0.32] as [string, number],
  conversationsLimit: 5_000,
  features: [
    {
      key: 'unlimited_users',
      isIncluded: true,
    },
    {
      key: 'ready_to_use_ai_agents',
      isIncluded: true,
    },
    {
      key: 'custom_ai_agents_builder',
      showDescription: true,
      isIncluded: true,
    },
    {
      key: 'on_demand_marketing_and_utility_messages',
      showDescription: true,
      isIncluded: true,
    },
    {
      key: 'workflows',
      isIncluded: true,
    },
    {
      key: 'events_data_api',
      isIncluded: false,
    },
  ],
}, {
  key: 'enterprise',
  isRecommended: false,
  pricing: ['USD', 0.29] as [string, number],
  conversationsLimit: 20_000,
  features: [
    {
      key: 'unlimited_users',
      isIncluded: true,
    },
    {
      key: 'ready_to_use_ai_agents',
      isIncluded: true,
    },
    {
      key: 'custom_ai_agents_builder',
      isIncluded: true,
    },
    {
      key: 'on_demand_marketing_and_utility_messages',
      showDescription: true,
      isIncluded: true,
    },
    {
      key: 'workflows',
      isIncluded: true,
    },
    {
      key: 'events_data_api',
      showDescription: true,
      isIncluded: true,
    },
  ],
}];
