"use client";

import { ActionResponse } from '@/types/form/action-response';
import { useActionState, useEffect } from 'react';
import { toast } from 'sonner';

export function useActionForm<T>(
  action: (prevState: ActionResponse<T>, payload: FormData) => Promise<ActionResponse<T>> | ActionResponse<T>,
  initialValue: ActionResponse<T> = {
    message: '',
    success: false
  },
  options?: {
    onSuccess?: (data: ActionResponse<T>) => void;
    onError?: (error: Partial<ActionResponse<T>>) => void;
  }
) {
  const [state, formAction, isPending] = useActionState<ActionResponse<T>, FormData>(
    action,
    initialValue
  );

  useEffect(() => {
    if (state?.success) {
      toast.success(state?.message);
      options?.onSuccess?.(state);
    } else if (state?.errors) {
      toast.error(state?.message);
      options?.onError?.(state.errors);
    }
  }, [state, options]);

  return [state, formAction, isPending] as const;
}