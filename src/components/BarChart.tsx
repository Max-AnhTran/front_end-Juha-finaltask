import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
} from "recharts";
import _ from "lodash";

interface BarChartComponentProps {
    data: { name: string; dataKey: number }[];
    chartTitle: string;
    dataKeyName: string;
}

const BarChartComponent = (props: BarChartComponentProps) => {
    return (
        <div>
            <h3 style={{ textAlign: "center", marginBottom: "10px" }}>
                {props.chartTitle}
            </h3>
            <ResponsiveContainer width="100%" height={500}>
                <BarChart data={props.data}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar
                        dataKey="dataKey"
                        fill="#8884d8"
                        name={props.dataKeyName}
                    />
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
};

export default BarChartComponent;
