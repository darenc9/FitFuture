import { Label, Legend, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

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
          return new Date(unixTime).toDateString().slice(4);
        }}>
          <Label value={"Date Completed"} offset={0} position="bottom" />
        </XAxis>
        <YAxis dataKey="avgWeight">
          <Label value={"Average Weight"} angle={-90}/>
        </YAxis>
        <Legend height={60} layout="vertical" verticalAlign="top"/>
        <Tooltip labelFormatter={(lbl, lines) => {
          for (const ln of lines) {
            ln.value = Math.round(ln.value);  // round averages for better display
          }
          return `${new Date(lbl).toDateString().slice(4)}` // show timestamp as human readable date
        }}/>
        {data.map((lineData, i) => (
          <Line
            name={lineData[0].exerciseName}
            data={lineData}
            dataKey="avgWeight"
            stroke={lineColours[i]}
            type="monotone"
            key={i}
          />
        ))}
      </LineChart>
    </ResponsiveContainer>
  );
};
