"use client";

import { ActionResponse } from '@/types/form/action-response';
import { useActionState, useEffect } from 'react';
import { toast } from 'sonner';

export function useActionForm<T>(
  action: (prevState: ActionResponse<T>, formData: FormData) => Promise<ActionResponse<T>>,
  initialValue: ActionResponse<T> = {
    message: '',
    success: false
  }
) {
  const [state, formAction, isPending] = useActionState<ActionResponse<T>>(
    action,
    initialValue
  );

  useEffect(() => {
    if (state?.success) {
      toast.success(state?.message);
    } else if (state?.errors) {
      toast.error(state?.message);
    }
  }, [state]);

  return [state, formAction, isPending] as const;
}