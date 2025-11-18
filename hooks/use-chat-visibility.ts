import { useState } from 'react';

export function useChatVisibility ({
  chatId,
  initialVisibility
}: {
  chatId: string;
  initialVisibility: 'private' | 'public';
}) {
  const [visibilityType, setVisibilityType] = useState<'private' | 'public'>(initialVisibility);

  return {
    visibilityType,
    setVisibilityType
  };
}
