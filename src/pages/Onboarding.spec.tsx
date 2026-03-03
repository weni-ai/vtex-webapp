import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { Onboarding } from './Onboarding';
import { ONBOARDING_PAGES } from '../constants/onboarding';

const mocks = vi.hoisted(() => ({
  useSelector: vi.fn(),
}));

vi.mock('react-redux', () => ({
  useSelector: mocks.useSelector,
  useDispatch: () => vi.fn(),
}));

vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => key,
    i18n: {
      language: 'en',
      changeLanguage: () => new Promise(() => {}),
    },
  }),
}));

vi.mock('./onboarding/channelSelection/ChannelSelection', () => ({
  ChannelSelection: () => <div data-testid="channel-selection">ChannelSelection</div>,
}));

vi.mock('./onboarding/onboardSetup/WebchatOnboardSetup', () => ({
  WebchatOnboardSetup: () => <div data-testid="webchat-onboard-setup">WebchatOnboardSetup</div>,
}));

vi.mock('./onboarding/legacyOnboarding/LegacyOnboarding', () => ({
  LegacyOnboarding: () => <div data-testid="legacy-onboarding">LegacyOnboarding</div>,
}));

function mockOnboardingStatus(currentPage?: string) {
  mocks.useSelector.mockImplementation(() => {
    if (currentPage === undefined) return null;
    return { current_page: currentPage };
  });
}

describe('Onboarding router', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render ChannelSelection when current_page is ONBOARD_CHANNEL_SELECTION', () => {
    mockOnboardingStatus('ONBOARD_CHANNEL_SELECTION');

    render(<Onboarding />);

    expect(screen.getByTestId('channel-selection')).toBeInTheDocument();
  });

  it('should render ChannelSelection when onboarding status is null', () => {
    mockOnboardingStatus(undefined);

    render(<Onboarding />);

    expect(screen.getByTestId('channel-selection')).toBeInTheDocument();
  });

  it('should render ChannelSelection when current_page is empty', () => {
    mockOnboardingStatus('');

    render(<Onboarding />);

    expect(screen.getByTestId('channel-selection')).toBeInTheDocument();
  });

  it('should render OnboardSetup when current_page is ONBOARD_WEBCHAT_SETUP', () => {
    mockOnboardingStatus(ONBOARDING_PAGES.ONBOARD_WEBCHAT_SETUP);

    render(<Onboarding />);

    expect(screen.getByTestId('onboard-setup')).toBeInTheDocument();
  });

  it('should render LegacyOnboarding when current_page is ONBOARD_LEGACY', () => {
    mockOnboardingStatus('ONBOARD_LEGACY');

    render(<Onboarding />);

    expect(screen.getByTestId('legacy-onboarding')).toBeInTheDocument();
  });

  it('should fall back to ChannelSelection for unknown current_page values', () => {
    mockOnboardingStatus('UNKNOWN_STEP');

    render(<Onboarding />);

    expect(screen.getByTestId('channel-selection')).toBeInTheDocument();
  });
});
