import { ProjectCost } from "../lib/definitions";

export function ProjectCostsTable({ costs }: { costs: ProjectCost[] }) {
  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Project Costs</h2>
      <table className="w-full">
        <thead>
          <tr>
            <th>Category</th>
            <th>Cost Name</th>
            <th>Estimate</th>
            <th>Real</th>
            <th>Period</th>
          </tr>
        </thead>
        <tbody>
          {costs.map((cost : ProjectCost) => (
            <tr key={cost.cost_id}>
              <td>{cost.category_name}</td>
              <td>{cost.cost_name}</td>
              <td>{cost.estimate}</td>
              <td>{cost.real}</td>
              <td>{cost.period_start.toLocaleDateString()} - {cost.period_end.toLocaleDateString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
} 