import { DbOrderSelect } from "@/db/schemas/orders";

interface RecentSalesProps {
  items: Pick<DbOrderSelect, "name" | "email" | "amount">[];
}

export default function RecentSales({ items }: RecentSalesProps) {
  return (
    <div className="space-y-4">
      {!!items.length ? (
        items.map((item, index) => (
          <div
            key={`sale-item-${index}`}
            className="flex items-center justify-between rounded-lg border px-4 py-2 transition hover:bg-gray-100"
          >
            <div>
              <h5 className="font-medium">{item.name}</h5>
              <p className="text-sm text-muted-foreground">{item.email}</p>
            </div>
            <div className="font-medium text-primary">{item.amount}</div>
          </div>
        ))
      ) : (
        <div className="flex items-center justify-center rounded-lg border p-4 transition hover:bg-gray-100">
          <p className="text-muted-foreground">No Sales</p>
        </div>
      )}
    </div>
  );
}
