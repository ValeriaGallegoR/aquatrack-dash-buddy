import { Check, X } from 'lucide-react';
import { checkPasswordStrength } from '@/lib/auth';

interface PasswordRequirementsProps {
  password: string;
}

export function PasswordRequirements({ password }: PasswordRequirementsProps) {
  const requirements = checkPasswordStrength(password);

  return (
    <ul className="space-y-1 pt-1">
      {requirements.map((req) => (
        <li key={req.key} className="flex items-center gap-2 text-xs">
          {password.length === 0 ? (
            <span className="h-3.5 w-3.5 rounded-full border border-muted-foreground/40" />
          ) : req.met ? (
            <Check className="h-3.5 w-3.5 text-accent" />
          ) : (
            <X className="h-3.5 w-3.5 text-destructive" />
          )}
          <span className={password.length === 0 ? 'text-muted-foreground' : req.met ? 'text-accent' : 'text-destructive'}>
            {req.label}
          </span>
        </li>
      ))}
    </ul>
  );
}
