function Sidebar({ activePage, setActivePage }) {
  const menus = [
    {
      name: "Dashboard",
      key: "dashboard",
    },
    {
      name: "Products",
      key: "products",
    },
    {
      name: "Categories",
      key: "categories",
    },
    {
      name: "Suppliers",
      key: "suppliers",
    },
    {
      name: "Customers",
      key: "customers",
    },
    {
      name: "Purchases",
      key: "purchases",
    },
    {
      name: "Sales",
      key: "sales",
    },
    {
      name: "Reports",
      key: "reports",
    },
  ]

  return (
    <aside className="flex min-h-screen w-64 shrink-0 flex-col border-r border-slate-200 bg-white p-5">
      
      {/* Logo / Brand */}
      <div className="mb-8">
        <h1 className="text-xl font-bold text-slate-800">
          Warehouse
        </h1>

        <p className="mt-1 text-sm text-slate-500">
          Financial System
        </p>
      </div>

      {/* Navigation */}
      <nav className="space-y-1.5">
        {menus.map((menu) => (
          <button
            key={menu.key}
            type="button"
            onClick={() => setActivePage(menu.key)}
            className={`w-full rounded-lg px-4 py-3 text-left text-sm font-medium transition ${
              activePage === menu.key
                ? "bg-slate-900 text-white"
                : "text-slate-600 hover:bg-slate-100"
            }`}
          >
            {menu.name}
          </button>
        ))}
      </nav>

      {/* Bottom Information */}
      <div className="mt-auto border-t border-slate-200 pt-5">
        <p className="text-xs font-medium text-slate-500">
          Warehouse Financial System
        </p>

        <p className="mt-1 text-xs text-slate-400">
          Version 1.0.0
        </p>
      </div>
    </aside>
  )
}

export default Sidebar