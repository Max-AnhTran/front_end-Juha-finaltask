import { useState, useEffect, useMemo } from "react";
import { AgGridReact } from "ag-grid-react";
import { ColDef, ICellRendererParams } from "ag-grid-community";
import { AllCommunityModule, ModuleRegistry } from "ag-grid-community";

import AddTraining from "./AddTraining";
import EditTraining from "./EditTraining";
import { Button } from "@mui/material";

import dayjs from "dayjs";
import { Training } from "../types";
import DeleteTraining from "./DeleteTraining";
import { getTrainingsData } from "../services/TrainingService";
import ConsecutiveSnackbars from "./SnackBar";

ModuleRegistry.registerModules([AllCommunityModule]);

export default function TrainingList() {
    const [trainings, setTrainings] = useState<Training[]>([]);
    const [snackMessage, setSnackMessage] = useState<string | null>(null);

    const fetchData = async () => {
        try {
            const data = await getTrainingsData();
            console.log(data);
            setTrainings(data || []);
        } catch (error) {
            console.error("Error fetching trainings:", error);
            setTrainings([]);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const resetData = async () => {
        try {
            const response = await fetch(
                "https://customer-rest-service-frontend-personaltrainer.2.rahtiapp.fi/reset",
                {
                    method: "POST",
                }
            );

            if (!response.ok) {
                throw new Error("Network response was not ok");
            }

            const text = await response.text();

            if (text === "DB reset done") {
                setSnackMessage("DB reset done");
                await fetchData();
            } else {
                throw new Error("Unexpected response text");
            }
        } catch (error) {
            console.error("Error resetting customers:", error);
        }
    };

    const deleteTraining = async (link: string) => {
        try {
            await fetch(link, { method: "DELETE" });
            setSnackMessage("Training deleted successfully");
            await fetchData();
        } catch (error) {
            console.error("Error deleting training:", error);
        }
    };

    const saveTraining = async (training: Training) => {
        try {
            const response = await fetch(
                "https://customer-rest-service-frontend-personaltrainer.2.rahtiapp.fi/api/trainings",
                {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(training),
                }
            );

            if (!response.ok) throw new Error("Network response was not ok");

            setSnackMessage("Training added successfully");
            await fetchData();
        } catch (error) {
            console.error("Error saving training:", error);
        }
    };

    const updateTraining = async (training: Training, link: string) => {
        try {
            const response = await fetch(link, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(training),
            });

            if (!response.ok) throw new Error("Network response was not ok");

            setSnackMessage("Training edited successfully");
            await fetchData();
        } catch (error) {
            console.error("Error updating training:", error);
        }
    };

    const columnDefs: ColDef<Training>[] =  useMemo(() => [
        {
            headerName: "Date",
            field: "date",
            valueFormatter: (params) =>
                dayjs(params.value).format("dddd, MMMM DD, YYYY"),
            sortable: true,
            filter: true,
            flex: 1.5,
        },
        {
            headerName: "Duration",
            field: "duration",
            sortable: true,
            filter: true,
            flex: 1,
        },
        {
            headerName: "Activity",
            field: "activity",
            sortable: true,
            filter: true,
            flex: 1,
        },
        {
            headerName: "Customer",
            field: "customerName",
            sortable: true,
            filter: true,
            flex: 1,
        },
        {
            headerName: "",
            flex: 0.5,
            cellStyle: { textAlign: "center" },
            cellRenderer: (row: ICellRendererParams<Training>) => (
                <EditTraining
                    training={row.data}
                    updateTraining={updateTraining}
                />
            ),
            sortable: false,
            filter: false,
        },
        {
            headerName: "",
            flex: 0.5,
            cellStyle: { textAlign: "center" },
            cellRenderer: (row: ICellRendererParams<Training>) => (
                <DeleteTraining
                    training={row.data}
                    deleteTraining={deleteTraining}
                />
            ),
            sortable: false,
            filter: false,
        },
    ], []);

    return (
        <div style={{ height: "calc(100vh - 250px)", width: "100%" }}>
            <div
                style={{
                    display: "flex",
                    justifyContent: "space-between",
                    paddingTop: "10px",
                    paddingBottom: "10px",
                }}
            >
                <AddTraining saveTraining={saveTraining} />
                <Button variant="outlined" onClick={resetData}>
                    Reset Data
                </Button>
            </div>
            <AgGridReact
                rowData={trainings || []}
                columnDefs={columnDefs || []}
                pagination
                paginationAutoPageSize
            />
            <ConsecutiveSnackbars
                snackMessage={snackMessage}
                setSnackMessage={setSnackMessage}
            />
        </div>
    );
}
