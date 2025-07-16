import { LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, Legend, ResponsiveContainer } from "recharts";

interface Stat {
  date: string;
  total_searches: number;
  alerts_triggered: number;
}

interface Props {
  data: Stat[];
}

export const StatsChart: React.FC<Props> = ({ data }) => {
  return (
    <ResponsiveContainer width="100%" height={400}>
      <LineChart data={data} margin={{ top: 20, right: 30, left: 10, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="date" />
        <YAxis allowDecimals={false} />
        <Tooltip />
        <Legend />
        <Line type="monotone" dataKey="total_searches" stroke="#8884d8" name="Total Búsquedas" />
        <Line type="monotone" dataKey="alerts_triggered" stroke="#82ca9d" name="Alertas Disparadas" />
      </LineChart>
    </ResponsiveContainer>
  );
};
