import { appText } from '@eggeo/domain';
import { EggeoPanel } from '../Panel';
import { EggeoButton, EggeoInput, EggeoText } from '../primitives';
import { styles } from './AuthPanel.styles';
import type { AuthPanelMode } from '../types';

export function EggeoAuthPanel({
  email,
  isSubmitting = false,
  message,
  mode,
  name,
  onChangeEmail,
  onChangeMode,
  onChangeName,
  onChangePassword,
  onSubmit,
  password,
}: {
  email: string;
  isSubmitting?: boolean;
  message?: string;
  mode: AuthPanelMode;
  name: string;
  onChangeEmail: (value: string) => void;
  onChangeMode: (mode: AuthPanelMode) => void;
  onChangeName: (value: string) => void;
  onChangePassword: (value: string) => void;
  onSubmit: () => void;
  password: string;
}) {
  return (
    <EggeoPanel>
      <EggeoText colorized style={styles.panelTitle}>
        {mode === 'login' ? appText.auth.actions.login : appText.auth.actions.createAccount}
      </EggeoText>
      {mode === 'create' && <EggeoInput autoCapitalize="words" onChangeText={onChangeName} placeholder={appText.auth.fields.name} value={name} />}
      <EggeoInput
        autoCapitalize="none"
        autoComplete="email"
        keyboardType="email-address"
        onChangeText={onChangeEmail}
        placeholder={appText.auth.fields.email}
        value={email}
      />
      <EggeoInput
        autoCapitalize="none"
        autoComplete={mode === 'create' ? 'new-password' : 'current-password'}
        onChangeText={onChangePassword}
        placeholder={appText.auth.fields.password}
        secureTextEntry
        value={password}
      />
      <EggeoButton isLoading={isSubmitting} onPress={onSubmit}>
        {mode === 'login' ? appText.auth.actions.login : appText.auth.actions.createAccount}
      </EggeoButton>
      <EggeoButton disabled={isSubmitting} intent="ghost" onPress={() => onChangeMode(mode === 'login' ? 'create' : 'login')}>
        {mode === 'login' ? appText.auth.actions.needAccount : appText.auth.actions.haveAccount}
      </EggeoButton>
      {message && <EggeoText style={styles.message}>{message}</EggeoText>}
    </EggeoPanel>
  );
}
