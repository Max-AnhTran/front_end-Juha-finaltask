import { useEffect, useState } from "react";
import { getTrainingsData } from "../services/TrainingService";
import { Training } from "../types";
import BarChartComponent from "../components/BarChart";
import _ from "lodash";
import Grid from "@mui/material/Grid";

function Statistics() {
    const [trainings, setTrainings] = useState<Training[]>([]);

    const fetchData = async () => {
        try {
            const data = await getTrainingsData();
            console.log(data);
            setTrainings(data || []);
        } catch (error) {
            console.error("Error fetching trainings:", error);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const groupedByActivity = _.groupBy(trainings, "activity");

    const averageDurationsArray = _.map(
        groupedByActivity,
        (trainings: Training[], activity: string) => ({
            name: activity,
            dataKey: _.meanBy(trainings, "duration"),
        })
    );

    console.log(averageDurationsArray);

    const trainingCountsArray = _.map(
        _.countBy(trainings, "activity"),
        (count, activity) => ({
            name: activity,
            dataKey: count,
        })
    );

    console.log(trainingCountsArray);

    return (
        <div>
            <h1 hidden>Statistics</h1>

            {/* Grid Container */}
            <Grid container spacing={3}>
                {/* Row 1 */}
                <Grid item xs={12} sm={6}>
                    <BarChartComponent
                        data={averageDurationsArray}
                        chartTitle="Average Durations by Activity"
                        dataKeyName="Minutes"
                    />
                </Grid>
                <Grid item xs={12} sm={6}>
                    <BarChartComponent
                        data={trainingCountsArray}
                        chartTitle="Training Counts by Activity"
                        dataKeyName="Count"
                    />
                </Grid>
            </Grid>
        </div>
    );
}

export default Statistics;
