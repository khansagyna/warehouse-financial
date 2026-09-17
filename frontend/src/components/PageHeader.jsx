function PageHeader({ title, description, action }) {
  return (
    <div className="mb-8 flex items-start justify-between gap-4">
      <div>
        <h2 className="text-2xl font-bold text-slate-800">
          {title}
        </h2>

        <p className="mt-1 text-sm text-slate-500">
          {description}
        </p>
      </div>

      {action && (
        <div>
          {action}
        </div>
      )}
    </div>
  )
}

export default PageHeader