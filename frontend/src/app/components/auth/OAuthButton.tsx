import React from "react";
import { oauthProviderIcon } from "./ProviderIcons";

interface OAuthButtonProps {
  provider: string;
  onClick: () => void;
  disabled?: boolean;
  className?: string;
}

export function OAuthButton({ provider, onClick, disabled = false, className = "" }: OAuthButtonProps) {
  const providerName = provider.charAt(0).toUpperCase() + provider.slice(1);
  
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`flex items-center justify-center w-full rounded border border-border bg-body px-6 py-3 text-dark hover:bg-border/10 disabled:opacity-50 dark:border-darkmode-border dark:bg-darkmode-body dark:text-darkmode-dark ${className}`}
    >
      <div className="w-4 h-4 mr-2">
        {oauthProviderIcon(provider)}
      </div>
      Continue with {providerName}
    </button>
  );
}