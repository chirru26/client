interface QueryErrorProps {
  message: string
  onRetry: () => void
}

export default function QueryError({ message, onRetry }: QueryErrorProps) {
  return (
    <div
      className="alert alert-error"
      role="alert"
      style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, flexWrap: 'wrap' }}
    >
      <span>Unable to load data: {message}</span>
      <button type="button" className="btn btn-secondary btn-sm" onClick={onRetry}>
        Retry
      </button>
    </div>
  )
}
