// Reusable skeleton shimmer blocks

export function SkeletonCard() {
  return (
    <div className="glass-card rounded-2xl overflow-hidden">
      <div className="skeleton h-40 w-full rounded-none" />
      <div className="p-5 space-y-3">
        <div className="skeleton h-5 w-3/4" />
        <div className="skeleton h-3 w-1/2" />
        <div className="flex gap-2 pt-1">
          <div className="skeleton h-3 w-16" />
          <div className="skeleton h-3 w-20" />
        </div>
      </div>
    </div>
  );
}

export function SkeletonText({ lines = 3 }) {
  return (
    <div className="space-y-2">
      {Array.from({ length: lines }).map((_, i) => (
        <div key={i} className="skeleton h-3" style={{ width: `${85 - i * 15}%` }} />
      ))}
    </div>
  );
}

export function SkeletonFoodCard() {
  return (
    <div className="glass-card rounded-2xl p-5 flex gap-4">
      <div className="flex-1 space-y-3">
        <div className="skeleton h-4 w-3/4" />
        <div className="skeleton h-3 w-full" />
        <div className="skeleton h-3 w-2/3" />
        <div className="skeleton h-4 w-16 mt-2" />
      </div>
      <div className="skeleton w-24 h-24 rounded-xl shrink-0" />
    </div>
  );
}

export default function SkeletonLoader({ type = 'card', count = 3 }) {
  const Component = type === 'food' ? SkeletonFoodCard : SkeletonCard;
  return (
    <div className={`grid gap-5 ${type === 'food' ? 'grid-cols-1' : 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3'}`}>
      {Array.from({ length: count }).map((_, i) => <Component key={i} />)}
    </div>
  );
}
