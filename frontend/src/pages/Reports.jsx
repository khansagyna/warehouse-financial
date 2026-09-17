import PageHeader from "../components/PageHeader"

function Reports() {
  return (
    <div>
      <PageHeader
        title="Reports"
        description="View warehouse and financial reports"
      />

      <div className="rounded-xl border border-slate-200 bg-white p-8 text-center shadow-sm">
        <h3 className="font-semibold text-slate-800">
          Reports Module
        </h3>

        <p className="mt-2 text-sm text-slate-500">
          This module will be developed next.
        </p>
      </div>
    </div>
  )
}

export default Reports