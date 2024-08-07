import { Label, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

// component to display weight graph
export default function WeightGraph( {data} ) {
  return (
    <ResponsiveContainer width='95%' height='50%'>
      <LineChart margin={{ top: 30, right: 0, left: 0, bottom: 30}}>
        <XAxis
        type="number"
        dataKey="timeStamp"
        domain={['auto', 'auto']}
        tickFormatter={(unixTime) => {
          return new Date(unixTime).toISOString().split('T')[0];
        }}>
          <Label value={"Date Entered"} offset={0} position="bottom" />
        </XAxis>
        <YAxis dataKey="weight">
          <Label value={"Body Weight (kgs)"} angle={-90}/>
        </YAxis>
        <Tooltip />
        <Line
          data={data}
          dataKey="weight"
          stroke="#7a49a5"
          type="monotone"
        />
      </LineChart>
    </ResponsiveContainer>
  );
};
