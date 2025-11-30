
import { TrendingUp, TrendingDown } from "lucide-react"; 

export function SummaryCard({ title, value, description, icon, trend, trendUp }) {
  return (
    <div className="bg-surface border border-border rounded-lg p-6 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-4">
        <div>
          <p className="text-text-secondary text-sm font-medium">{title}</p>
          <h3 className="text-3xl font-bold text-text-primary mt-1">{value}</h3>
        </div>
        <div className="p-3 bg-blue-100 rounded-lg text-primary">{icon}</div>
      </div>

      <p className="text-text-secondary text-sm mb-3">{description}</p>

      <div className="flex items-center gap-1 text-sm">
        {trendUp ? (
          <TrendingUp className="w-4 h-4 text-success" />
        ) : (
          <TrendingDown className="w-4 h-4 text-warning" />
        )}
        <span className={trendUp ? "text-success" : "text-warning"}>{trend}</span>
      </div>
    </div>
  );
}
