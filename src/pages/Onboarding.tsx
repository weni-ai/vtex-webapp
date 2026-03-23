import { useSelector } from "react-redux";
import { selectOnboardingStatus } from "../store/onboardSlice";
import { ChannelSelection } from "./onboarding/channelSelection/ChannelSelection";
import { WebchatOnboardSetup } from "./onboarding/webchat/WebchatOnboardSetup";
import { WebchatTestAndActivate } from "./onboarding/webchat/WebchatTestAndActivate";
import { WhatsAppOnboardSetup } from "./onboarding/whatsapp/WhatsAppOnboardSetup";
import { WhatsAppTestAndActivate } from "./onboarding/whatsapp/WhatsAppTestAndActivate";
import { LegacyOnboarding } from "./onboarding/legacyOnboarding/LegacyOnboarding";
import { ONBOARDING_PAGES } from "../constants/onboarding";

const PAGE_COMPONENTS: Record<string, React.ComponentType> = {
  [ONBOARDING_PAGES.ONBOARD_CHANNEL_SELECTION]: ChannelSelection,
  [ONBOARDING_PAGES.ONBOARD_WEBCHAT_SETUP]: WebchatOnboardSetup,
  [ONBOARDING_PAGES.ONBOARD_WEBCHAT_TEST]: WebchatTestAndActivate,
  [ONBOARDING_PAGES.ONBOARD_WHATSAPP_SETUP]: WhatsAppOnboardSetup,
  [ONBOARDING_PAGES.ONBOARD_WHATSAPP_TEST]: WhatsAppTestAndActivate,
  [ONBOARDING_PAGES.ONBOARD_LEGACY]: LegacyOnboarding,
};

const DEFAULT_PAGE = PAGE_COMPONENTS.ONBOARD_CHANNEL_SELECTION;

export function Onboarding() {
  const onboardingStatus = useSelector(selectOnboardingStatus);
  const currentPage = onboardingStatus?.current_page ?? "";

  const PageComponent = PAGE_COMPONENTS[currentPage] ?? DEFAULT_PAGE;

  return <PageComponent />;
}
