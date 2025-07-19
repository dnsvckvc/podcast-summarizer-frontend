"use client";

import { API_URL } from "@/lib/constants";
import { useState, useCallback } from "react";
import { ValidationResult, UseUrlValidationReturn } from "@/utils/models";

export function useUrlValidation(): UseUrlValidationReturn {
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
        const response = await fetch(`${API_URL}/api/validate`, {
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
    [API_URL]
  );

  return {
    validateUrl,
    isValidating,
    lastValidation,
  };
}
