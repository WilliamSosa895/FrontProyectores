import { COLORS as C } from "../constants";
import { CheckIcon, SpinnerIcon } from "./Icons";

export default function StepIndicator({ steps, currentStep, processing, isOn }) {
  if (currentStep < 0) return null;

  return (
    <div
      style={{
        width: "100%",
        maxWidth: 400,
        background: C.card,
        borderRadius: 14,
        padding: "22px 24px",
        border: `1.5px solid ${C.blue}`,
        animation: "slideUp 0.5s cubic-bezier(0.16,1,0.3,1)",
      }}
    >
      {steps.map((step, i) => {
        const done =
          i < currentStep || (i === currentStep && !processing && isOn);
        const active = i === currentStep && processing;
        const pending = i > currentStep;

        return (
          <div
            key={i}
            style={{
              display: "flex",
              alignItems: "flex-start",
              gap: 14,
            }}
          >
            {/* Punto + línea */}
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                paddingTop: 2,
              }}
            >
              <div
                style={{
                  width: 28,
                  height: 28,
                  borderRadius: "50%",
                  background: "transparent",
                  border: `2px solid ${
                    done ? C.green : active ? C.blue : C.card
                  }`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  transition: "all 0.5s ease",
                  color: done ? C.green : active ? C.blue : C.textSub,
                }}
              >
                {done ? (
                  <CheckIcon size={14} />
                ) : active ? (
                  <SpinnerIcon size={14} />
                ) : (
                  <span
                    style={{
                      fontSize: 10,
                      fontWeight: 700,
                      color: C.textSub,
                    }}
                  >
                    {i + 1}
                  </span>
                )}
              </div>
              {i < steps.length - 1 && (
                <div
                  style={{
                    width: 2,
                    height: 22,
                    background: done ? C.green + "60" : C.card,
                    transition: "background 0.5s ease",
                    borderRadius: 1,
                  }}
                />
              )}
            </div>

            {/* Texto */}
            <div style={{ paddingTop: 4 }}>
              <div
                style={{
                  fontSize: 13,
                  fontWeight: done || active ? 600 : 400,
                  color: pending ? C.textSub : C.white,
                  transition: "all 0.4s ease",
                }}
              >
                {step.label}
              </div>
              {(done || active) && (
                <div
                  style={{
                    fontSize: 11,
                    color: C.textSub,
                    marginTop: 2,
                    animation: "fadeIn 0.3s ease",
                  }}
                >
                  {step.detail}
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
