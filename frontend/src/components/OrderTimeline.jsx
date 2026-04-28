import { CheckCircle2, Circle, Loader2, Package, ChefHat, Bike, Home } from 'lucide-react';

const STEP_ICONS = {
  placed:           Package,
  confirmed:        CheckCircle2,
  preparing:        ChefHat,
  out_for_delivery: Bike,
  delivered:        Home,
};

function OrderTimeline({ statusHistory, currentStatus }) {
  const activeIndex = statusHistory.findIndex(s => s.status === currentStatus);

  return (
    <div className="relative">
      {statusHistory.map((step, idx) => {
        const Icon = STEP_ICONS[step.status] || Circle;
        const isDone    = step.done;
        const isActive  = step.status === currentStatus && !step.done;
        const isFuture  = !step.done && step.status !== currentStatus;

        return (
          <div key={step.status} className="flex gap-4 relative">
            {/* Connector line */}
            {idx < statusHistory.length - 1 && (
              <div className="absolute left-[19px] top-10 w-0.5 h-8"
                style={{ background: isDone ? 'rgba(255,87,34,0.4)' : 'rgba(255,255,255,0.06)' }} />
            )}

            {/* Icon node */}
            <div className="relative z-10 shrink-0">
              {isActive ? (
                <div className="w-10 h-10 rounded-full flex items-center justify-center"
                  style={{ background:'rgba(255,87,34,0.15)', border:'2px solid #FF5722', boxShadow:'0 0 12px rgba(255,87,34,0.3)' }}>
                  <Loader2 size={18} style={{ color:'#FF5722' }} className="animate-spin" />
                </div>
              ) : isDone ? (
                <div className="w-10 h-10 rounded-full flex items-center justify-center"
                  style={{ background:'linear-gradient(135deg,#FF5722,#FF8C00)' }}>
                  <Icon size={16} className="text-white" />
                </div>
              ) : (
                <div className="w-10 h-10 rounded-full flex items-center justify-center border-2 border-white/10">
                  <Icon size={16} className="text-muted" />
                </div>
              )}
            </div>

            {/* Text */}
            <div className="pb-8 flex-1">
              <p className={`text-sm font-semibold leading-snug
                ${isDone ? 'text-ink' : isActive ? '' : 'text-muted'}`}
                style={isActive ? { color:'#FF8A65' } : {}}>
                {step.label}
              </p>
              {step.time && (
                <p className="text-xs text-muted mt-0.5">{step.time}</p>
              )}
              {isActive && (
                <p className="text-xs mt-1 font-medium" style={{ color:'#FF8A65' }}>
                  In progress…
                </p>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default OrderTimeline;
