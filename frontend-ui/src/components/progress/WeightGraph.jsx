import { Label, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

// component to display weight graph
export default function WeightGraph( {data} ) {
  // find minimum weight entry value
  var minWeight = 9999;
  for (const entry of data) {
    if (entry.weight < minWeight) {
      minWeight = entry.weight;
    }
  }
  return (
    <ResponsiveContainer width='95%' height='50%'>
      <LineChart margin={{ top: 30, right: 0, left: 0, bottom: 30}}>
        <XAxis
        type="number"
        dataKey="timeStamp"
        domain={['auto', 'auto']}
        tickFormatter={(unixTime) => {
          return new Date(unixTime).toDateString().slice(4);
        }}>
          <Label value={"Date Entered"} offset={0} position="bottom" />
        </XAxis>
        <YAxis dataKey="weight" domain={[(minWeight - 5), 'auto']}>
          <Label value={"Body Weight (kgs)"} angle={-90}/>
        </YAxis>
        <Tooltip labelFormatter={value => {return `${new Date(value).toDateString().slice(4)}`}}/>
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
