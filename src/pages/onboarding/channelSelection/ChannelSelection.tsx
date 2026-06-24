import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useTranslation, Trans } from "react-i18next";
import { Flex, Grid, Heading, Text } from "@vtex/shoreline";
import { OnboardChannel } from "../../../interfaces/Store";
import { setSelectedChannel, selectOnboardingStatus, setOnboardingStatus } from "../../../store/onboardSlice";
import { selectAccount, selectUser } from "../../../store/userSlice";
import { startOnboardingSetup, updateOnboarding } from "../../../services/onboarding.service";
import { startFacebookLogin } from "../../../utils/facebook/login";
import type { FacebookLoginResult } from "../../../utils/facebook/login";
import { ChannelCard } from "./ChannelCard";
import { SelectAccountHostModal } from "./SelectAccountHostModal";
import { WhatsAppActivationModal } from "./WhatsAppActivationModal";
import { ONBOARD_CHANNEL, SETUP_CHANNEL, ONBOARDING_PAGES } from "../../../constants/onboarding";
import { TermsAndConditionsModal } from "./TermsAndConditionsModal";

export function ChannelSelection() {
  const { t } = useTranslation();
  const dispatch = useDispatch();

  const onboardingStatus = useSelector(selectOnboardingStatus);
  const accountData = useSelector(selectAccount);
  const userData = useSelector(selectUser);

  const [isWebchatHostModalOpen, setIsWebchatHostModalOpen] = useState(false);
  const [isTermsModalOpen, setIsTermsModalOpen] = useState(false);
  const [isWhatsAppActivationModalOpen, setIsWhatsAppActivationModalOpen] = useState(false);
  const [isWhatsAppLoginLoading, setIsWhatsAppLoginLoading] = useState(false);
  const [isWhatsAppHostModalOpen, setIsWhatsAppHostModalOpen] = useState(false);
  const [whatsAppCredentials, setWhatsAppCredentials] = useState<FacebookLoginResult | null>(null);

  const hosts = accountData?.hosts ?? [];

  function handleCardClick(channel: OnboardChannel) {
    dispatch(setSelectedChannel(channel));

    if (channel === ONBOARD_CHANNEL.WEBCHAT) {
      setIsWebchatHostModalOpen(true);
      return;
    }

    if (channel === ONBOARD_CHANNEL.WHATSAPP) {
      setIsWhatsAppActivationModalOpen(true);
      return;
    }
  }

  async function handleWebchatHostConfirm(host: string) {
    const vtexAccount = userData?.account;
    if (!vtexAccount) return;

    updateOnboarding(vtexAccount, { current_page: ONBOARDING_PAGES.ONBOARD_WEBCHAT_SETUP });

    startOnboardingSetup(vtexAccount, host, SETUP_CHANNEL.webchat);

    dispatch(
      setOnboardingStatus({
        ...onboardingStatus!,
        current_page: ONBOARDING_PAGES.ONBOARD_WEBCHAT_SETUP,
      }),
    );

    setIsWebchatHostModalOpen(false);
  }

  function handleWhatsAppContinue() {
    setIsWhatsAppLoginLoading(true);

    startFacebookLogin("", {
      onSuccess: handleFacebookLoginSuccess,
      onCancel: handleFacebookLoginCancel,
    });
  }

  function handleFacebookLoginSuccess(result: FacebookLoginResult) {
    setIsWhatsAppLoginLoading(false);
    setIsWhatsAppActivationModalOpen(false);
    setWhatsAppCredentials(result);
    setIsWhatsAppHostModalOpen(true);
  }

  function handleFacebookLoginCancel() {
    setIsWhatsAppLoginLoading(false);
  }

  async function handleWhatsAppHostConfirm(host: string) {
    const vtexAccount = userData?.account;
    if (!vtexAccount || !whatsAppCredentials) return;

    await startOnboardingSetup(vtexAccount, host, SETUP_CHANNEL.whatsapp, {
      auth_code: whatsAppCredentials.code,
      waba_id: whatsAppCredentials.wabaId,
      phone_number_id: whatsAppCredentials.phoneId,
    });

    updateOnboarding(vtexAccount, { current_page: ONBOARDING_PAGES.ONBOARD_WHATSAPP_SETUP });

    dispatch(
      setOnboardingStatus({
        ...onboardingStatus!,
        current_page: ONBOARDING_PAGES.ONBOARD_WHATSAPP_SETUP,
      }),
    );

    setIsWhatsAppHostModalOpen(false);
    setWhatsAppCredentials(null);
  }

  return (
    <Flex
      direction="column"
      align="center"
      justify="center"
      gap="$space-8"
      style={{ height: "100vh", width: "100%" }}
    >
      <Flex
        direction="column"
        align="center"
        gap="$space-2"
        style={{ padding: "0 var(--sl-space-20)", textAlign: "center" }}
      >
        <Heading variant="display1">
          {t("onboarding.channel_selection.title")}
        </Heading>
        <Text variant="body" style={{ maxWidth: 900 }}>
          {t("onboarding.channel_selection.subtitle")}
        </Text>
      </Flex>

      <Grid
        columns="repeat(2, minmax(0, 500px))"
        gap="$space-6"
        style={{ width: "100%", padding: "0 var(--sl-space-32)", justifyContent: "center" }}
      >
        <ChannelCard
          title={t("onboarding.channel_selection.webchat.title")}
          description={t("onboarding.channel_selection.webchat.description")}
          benefits={t("onboarding.channel_selection.webchat.benefits", { returnObjects: true }) as string[]}
          footer={t("onboarding.channel_selection.webchat.footer")}
          onClick={() => handleCardClick(ONBOARD_CHANNEL.WEBCHAT)}
          isRecommended
        />

        <ChannelCard
          title={t("onboarding.channel_selection.whatsapp.title")}
          description={t("onboarding.channel_selection.whatsapp.description")}
          benefits={t("onboarding.channel_selection.whatsapp.benefits", { returnObjects: true }) as string[]}
          footer={t("onboarding.channel_selection.whatsapp.footer")}
          onClick={() => handleCardClick(ONBOARD_CHANNEL.WHATSAPP)}
        />
      </Grid>

      <Flex direction="column" align="center" gap="$space-4">
        <Text variant="caption1" color="$fg-base-soft">
          {t("onboarding.channel_selection.disclaimer")}
        </Text>
        <Text variant="caption2" color="$fg-base-soft">
          <Trans
            i18nKey="onboarding.channel_selection.terms"
            components={[
              <Text
                as="span"
                variant="caption2"
                color="$fg-base-soft"
                style={{ textDecoration: "underline", cursor: "pointer" }}
                onClick={() => setIsTermsModalOpen(true)}
              />,
            ]}
          />
        </Text>
      </Flex>

      <SelectAccountHostModal
        open={isWebchatHostModalOpen}
        onClose={() => setIsWebchatHostModalOpen(false)}
        onConfirm={handleWebchatHostConfirm}
        hosts={hosts}
      />

      <WhatsAppActivationModal
        open={isWhatsAppActivationModalOpen}
        isLoading={isWhatsAppLoginLoading}
        onClose={() => setIsWhatsAppActivationModalOpen(false)}
        onContinue={handleWhatsAppContinue}
      />

      <SelectAccountHostModal
        open={isWhatsAppHostModalOpen}
        onClose={() => {
          setIsWhatsAppHostModalOpen(false);
          setWhatsAppCredentials(null);
        }}
        onConfirm={handleWhatsAppHostConfirm}
        hosts={hosts}
      />

      <TermsAndConditionsModal
        open={isTermsModalOpen}
        onClose={() => setIsTermsModalOpen(false)}
      />
    </Flex>
  );
}
