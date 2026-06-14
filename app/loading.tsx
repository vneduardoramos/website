export default function Loading() {
  return (
    <div className="flex min-h-[60vh] items-center justify-center" aria-label="Loading" role="status">
      <span className="h-8 w-8 animate-spin rounded-full border-2 border-primary/25 border-t-primary" />
    </div>
  );
}
