import { Label, Legend, Line, LineChart, ResponsiveContainer, XAxis, YAxis } from "recharts";

// component to display Progress graph
export default function ProgressGraph( {data} ) {
  const lineColours = ["#ffa500", "#66cdaa", "#7a49a5"];

  return (
    <ResponsiveContainer width='95%' height='50%'>
      <LineChart margin={{ top: 30, right: 0, left: 0, bottom: 30}}>
        <XAxis
        type="number"
        dataKey="date"
        domain={['auto', 'auto']}
        tickFormatter={(unixTime) => {
          return new Date(unixTime).toISOString().split('T')[0];
        }}>
          <Label value={"Date Completed"} offset={0} position="bottom" />
        </XAxis>
        <YAxis dataKey="avgWeight">
          <Label value={"Average Weight"} angle={-90} position="left"/>
        </YAxis>
        <Legend height={60} layout="vertical" verticalAlign="top"/>
        {data.map((lineData, i) => (
          <Line
            name={lineData[0].exerciseName}
            data={lineData}
            dataKey="avgWeight"
            stroke={lineColours[i]}
            type="monotone"
          />
        ))}
      </LineChart>
    </ResponsiveContainer>
  );
};
