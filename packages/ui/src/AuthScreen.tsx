'use client';

import { appText } from '@eggeo/static-text';
import { Box } from '@gluestack-ui/themed/build/components/Box';
import { EggeoAuthPanel } from './AuthPanel';
import { EggeoSkyScene } from './SkyScene';
import { EggeoTitle } from './primitives';
import { styles } from './styles';
import type { AuthPanelMode } from './types';

export function EggeoAuthScreen({
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
  title = appText.brand.title,
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
  title?: string;
}) {
  return (
    <EggeoSkyScene>
      <Box style={styles.authHeader}>
        <EggeoTitle>{title}</EggeoTitle>
      </Box>
      <EggeoAuthPanel
        email={email}
        isSubmitting={isSubmitting}
        message={message}
        mode={mode}
        name={name}
        onChangeEmail={onChangeEmail}
        onChangeMode={onChangeMode}
        onChangeName={onChangeName}
        onChangePassword={onChangePassword}
        onSubmit={onSubmit}
        password={password}
      />
    </EggeoSkyScene>
  );
}
