"use client";

import { ActionResponse } from '@/types/form/action-response';
import { useActionState } from 'react';
import { toast } from 'sonner';

/**
* @description: A React 19-ben megvalósított useActionState hook wrapper függvénye, helyi válaszokkal.
* @param action: (prevState: ActionResponse<T>, payload: FormData) => Promise<ActionResponse<T>> | ActionResponse<T>
* @param options: {
*   onSuccess?: (data: T) => void;
*   onError?: (error: string) => void;
* }
* @returns: [state, formAction, isPending]
* @example: const [state, formAction, isPending] = useActionForm(serverAction);
*/
export function useActionForm<T>(
  action: (prevState: ActionResponse<T>, payload: FormData) => Promise<ActionResponse<T>> | ActionResponse<T>,
  options?: {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onSuccess?: (data: any) => void;
    onError?: (error: string) => void;
    onComplete?: () => void
  }
) {
  const [state, formAction, isPending] = useActionState<ActionResponse<T>, FormData>(
    async (prevState, payload) => {
      const result = await action(prevState, payload);
      if (result.message) {
        if (result.success) {
          toast.success(result.message);
          options?.onSuccess?.(result.data);
        } else {
          toast.error(result.message);
          options?.onError?.(result.message);
        }
      }
      options?.onComplete?.();
      return result;
    },
    { message: '', success: false }, // Alapértelmezett állapot (state)
  );

  return [state, formAction, isPending] as const;
}