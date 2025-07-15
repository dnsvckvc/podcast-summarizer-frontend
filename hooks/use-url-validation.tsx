"use client";

import { useState, useCallback } from "react";
import { ValidationResult, UseUrlValidationReturn } from "@/utils/models";

export function useUrlValidation(apiUrl: string): UseUrlValidationReturn {
  const [isValidating, setIsValidating] = useState(false);
  const [lastValidation, setLastValidation] = useState<ValidationResult | null>(
    null
  );

  const validateUrl = useCallback(
    async (url: string, platform: string): Promise<ValidationResult> => {
      if (!url.trim()) {
        const result = { valid: false, error: "URL is required" };
        setLastValidation(result);
        return result;
      }

      setIsValidating(true);

      try {
        const response = await fetch(`${apiUrl}/api/validate`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            url: url.trim(),
            platform: platform,
          }),
        });

        const data = await response.json();

        const result: ValidationResult = {
          valid: data.success,
          error: data.error,
          data: data.data,
        };

        setLastValidation(result);
        return result;
      } catch (error) {
        const result = {
          valid: false,
          error: "Network error during validation",
        };
        setLastValidation(result);
        return result;
      } finally {
        setIsValidating(false);
      }
    },
    [apiUrl]
  );

  return {
    validateUrl,
    isValidating,
    lastValidation,
  };
}
