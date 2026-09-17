import PageHeader from "../components/PageHeader"

function Suppliers() {
  return (
    <div>
      <PageHeader
        title="Suppliers"
        description="Manage your suppliers"
      />

      <div className="rounded-xl border border-slate-200 bg-white p-8 text-center shadow-sm">
        <h3 className="font-semibold text-slate-800">
          Suppliers Module
        </h3>

        <p className="mt-2 text-sm text-slate-500">
          This module will be developed next.
        </p>
      </div>
    </div>
  )
}

export default Suppliers