import React from 'react';
import { Check } from 'lucide-react';

export interface Step {
  number: number;
  label: string;
  sublabel?: string;
  icon?: React.ReactNode;
}

interface StepIndicatorProps {
  steps: Step[];
  currentStep: number;
  completedSteps?: number[];
  orientation?: 'horizontal' | 'vertical';
  size?: 'sm' | 'md' | 'lg';
}

export default function StepIndicator({
  steps,
  currentStep,
  completedSteps = [],
  orientation = 'horizontal',
  size = 'md',
}: StepIndicatorProps) {
  const isCompleted = (stepNum: number) => completedSteps.includes(stepNum);
  const isActive = (stepNum: number) => stepNum === currentStep;

  const sizeClasses = {
    sm: { circle: 'w-8 h-8 text-sm', label: 'text-xs', sublabel: 'text-xs' },
    md: { circle: 'w-12 h-12 text-base', label: 'text-sm', sublabel: 'text-xs' },
    lg: { circle: 'w-16 h-16 text-xl', label: 'text-base', sublabel: 'text-sm' },
  };

  const sc = sizeClasses[size];

  if (orientation === 'vertical') {
    return (
      <div className="flex flex-col gap-4">
        {steps.map((step, idx) => {
          const completed = isCompleted(step.number);
          const active = isActive(step.number);
          return (
            <div key={step.number} className="flex items-start gap-4">
              <div className="flex flex-col items-center">
                <div
                  className={`${sc.circle} rounded-full flex items-center justify-center font-orbitron font-bold border-2 transition-all duration-300 flex-shrink-0
                    ${completed
                      ? 'bg-bio-green/20 border-bio-green text-bio-green'
                      : active
                        ? 'bg-bio-cyan/20 border-bio-cyan text-bio-cyan animate-glow-pulse'
                        : 'bg-bio-surface3 border-bio-surface4 text-muted-foreground'
                    }`}
                  style={
                    completed
                      ? { boxShadow: '0 0 12px oklch(0.82 0.2 155 / 0.5)' }
                      : active
                        ? { boxShadow: '0 0 12px oklch(0.85 0.18 195 / 0.5)' }
                        : {}
                  }
                >
                  {completed ? (
                    <Check className="w-5 h-5" />
                  ) : step.icon ? (
                    step.icon
                  ) : (
                    <span>{step.number}</span>
                  )}
                </div>
                {idx < steps.length - 1 && (
                  <div
                    className={`w-0.5 h-8 mt-1 transition-all duration-300 ${
                      completed ? 'bg-bio-green/50' : 'bg-bio-surface4'
                    }`}
                  />
                )}
              </div>
              <div className="pt-2">
                <div
                  className={`font-mono font-semibold tracking-wider ${sc.label} ${
                    completed ? 'text-bio-green' : active ? 'text-bio-cyan' : 'text-muted-foreground'
                  }`}
                >
                  {step.label}
                </div>
                {step.sublabel && (
                  <div className={`text-muted-foreground ${sc.sublabel} mt-0.5`}>{step.sublabel}</div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center gap-0">
      {steps.map((step, idx) => {
        const completed = isCompleted(step.number);
        const active = isActive(step.number);
        return (
          <React.Fragment key={step.number}>
            <div className="flex flex-col items-center gap-2">
              <div
                className={`${sc.circle} rounded-full flex items-center justify-center font-orbitron font-bold border-2 transition-all duration-300
                  ${completed
                    ? 'bg-bio-green/20 border-bio-green text-bio-green'
                    : active
                      ? 'bg-bio-cyan/20 border-bio-cyan text-bio-cyan'
                      : 'bg-bio-surface3 border-bio-surface4 text-muted-foreground'
                  }`}
                style={
                  completed
                    ? { boxShadow: '0 0 12px oklch(0.82 0.2 155 / 0.5)' }
                    : active
                      ? { boxShadow: '0 0 12px oklch(0.85 0.18 195 / 0.5)' }
                      : {}
                }
              >
                {completed ? (
                  <Check className="w-5 h-5" />
                ) : step.icon ? (
                  step.icon
                ) : (
                  <span>{step.number}</span>
                )}
              </div>
              <div className="text-center">
                <div
                  className={`font-mono font-semibold tracking-wider ${sc.label} ${
                    completed ? 'text-bio-green' : active ? 'text-bio-cyan' : 'text-muted-foreground'
                  }`}
                >
                  {step.label}
                </div>
                {step.sublabel && (
                  <div className={`text-muted-foreground ${sc.sublabel}`}>{step.sublabel}</div>
                )}
              </div>
            </div>
            {idx < steps.length - 1 && (
              <div
                className={`h-0.5 w-16 sm:w-24 mx-2 mb-8 transition-all duration-300 ${
                  completed ? 'bg-bio-green/50' : 'bg-bio-surface4'
                }`}
              />
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
}
