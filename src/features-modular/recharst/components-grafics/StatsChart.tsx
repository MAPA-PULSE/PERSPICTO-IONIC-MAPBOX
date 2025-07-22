// import { LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, Legend, ResponsiveContainer } from "recharts";

// interface Stat {
//   date: string;
//   total_searches: number;
//   alerts_triggered: number;
// }

// interface Props {
//   data: Stat[];
// }

// export const StatsChart: React.FC<Props> = ({ data }) => {
//   return (
//     <ResponsiveContainer width="100%" height={400}>
//       <LineChart data={data} margin={{ top: 20, right: 30, left: 10, bottom: 5 }}>
//         <CartesianGrid strokeDasharray="3 3" />
//         <XAxis dataKey="date" />
//         <YAxis allowDecimals={false} />
//         <Tooltip />
//         <Legend />
//         <Line type="monotone" dataKey="total_searches" stroke="#8884d8" name="Total Búsquedas" />
//         <Line type="monotone" dataKey="alerts_triggered" stroke="#82ca9d" name="Alertas Disparadas" />
//       </LineChart>
//     </ResponsiveContainer>
//   );
// };
// src/common/components/statschart/StatsChart.tsx

// import {
//   LineChart, Line, XAxis, YAxis, Tooltip,
//   CartesianGrid, Legend, ResponsiveContainer,
// } from "recharts";

// import React from "react";
// import { Stat } from "../../hooks/useStatistics";

// interface Props {
//   data: Stat[];
// }

// export const StatsChart: React.FC<Props> = ({ data }) => (
//   <ResponsiveContainer width="100%" height={400}>
//     <LineChart data={data} margin={{ top: 20, right: 30, left: 10, bottom: 5 }}>
//       <CartesianGrid strokeDasharray="3 3" />
//       <XAxis dataKey="date" />
//       <YAxis allowDecimals={false} />
//       <Tooltip />
//       <Legend />
//       <Line type="monotone" dataKey="total_searches" stroke="#8884d8" name="Total Búsquedas" />
//       <Line type="monotone" dataKey="alerts_triggered" stroke="#82ca9d" name="Alertas Disparadas" />
//     </LineChart>
//   </ResponsiveContainer>
// );



import React from "react";
import {
  LineChart, Line,
  BarChart, Bar,
  AreaChart, Area,
  RadarChart, Radar,
  PolarGrid, PolarAngleAxis, PolarRadiusAxis,
  XAxis, YAxis, Tooltip, Legend, CartesianGrid, ResponsiveContainer
} from "recharts";

import { Stat } from "../hooks/useStatistics";

interface Props {
  data: Stat[];
  type: "line" | "bar" | "area" | "radar";
}



export const StatsChart: React.FC<Props> = ({ data, type }) => {
  switch (type) {
    case "bar":
      return (
        <ResponsiveContainer width="100%" height={400}>
          <BarChart data={data} margin={{ top: 20, right: 30, left: 10, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="total_searches" fill="#8884d8" name="Total Búsquedas" />
            <Bar dataKey="alerts_triggered" fill="#82ca9d" name="Alertas Disparadas" />
          </BarChart>
        </ResponsiveContainer>
      );
    case "area":
      return (
        <ResponsiveContainer width="100%" height={400}>
          <AreaChart data={data} margin={{ top: 20, right: 30, left: 10, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Area type="monotone" dataKey="total_searches" stroke="#8884d8" fill="#8884d8" name="Total Búsquedas" />
            <Area type="monotone" dataKey="alerts_triggered" stroke="#82ca9d" fill="#82ca9d" name="Alertas Disparadas" />
          </AreaChart>
        </ResponsiveContainer>
      );
    case "radar":
      return (
        <ResponsiveContainer width="100%" height={400}>
          <RadarChart outerRadius={150} data={data}>
            <PolarGrid />
            <PolarAngleAxis dataKey="date" />
            <PolarRadiusAxis />
            <Radar dataKey="total_searches" stroke="#8884d8" fill="#8884d8" fillOpacity={0.6} name="Total Búsquedas" />
            <Radar dataKey="alerts_triggered" stroke="#82ca9d" fill="#82ca9d" fillOpacity={0.6} name="Alertas Disparadas" />
            <Legend />
            <Tooltip />
          </RadarChart>
        </ResponsiveContainer>
      );
    case "line":
    default:
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
  }
};
