import PageHeader from "../components/PageHeader"
import StatCard from "../components/StatCard"

function Dashboard({ categories, products }) {
  return (
    <div>
      <PageHeader
        title="Dashboard"
        description="Overview of your warehouse and financial system"
      />

      <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-4">
        <StatCard
          title="Total Products"
          value={products.length}
          description="Products registered in system"
        />

        <StatCard
          title="Categories"
          value={categories.length}
          description="Product categories"
        />

        <StatCard
          title="Low Stock"
          value="0"
          description="Inventory module not available yet"
        />

        <StatCard
          title="Total Sales"
          value="Rp 0"
          description="Sales module not available yet"
        />
      </div>

      <div className="mt-8 rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <h3 className="font-semibold text-slate-800">
          Welcome to Warehouse Financial System
        </h3>

        <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
          Manage your products, inventory, purchases, sales,
          and financial data from this dashboard.
        </p>
      </div>
    </div>
  )
}

export default Dashboard