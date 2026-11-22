import { Redirect } from 'expo-router';
import { useAppStore } from '@/store/useAppStore';

export default function Index() {
  const onboardingDone = useAppStore((state) => state.onboardingDone);
  return <Redirect href={onboardingDone ? '/home' : '/onboarding'} />;
}
