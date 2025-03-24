import { useState, useEffect } from "react";
import { AgGridReact } from "ag-grid-react";
import { ColDef } from "ag-grid-community";
import { AllCommunityModule, ModuleRegistry } from "ag-grid-community";

import AddTraining from "./AddTraining";
import EditTraining from "./EditTraining";
import { Button } from "@mui/material";

import dayjs from "dayjs";
import { Training, Customer } from "../types";
import DeleteTraining from "./DeleteTraining";

ModuleRegistry.registerModules([AllCommunityModule]);

export default function TrainingList() {
    const [trainings, setTrainings] = useState<Training[]>([]);

    const fetchData = async () => {
        try {
            const response = await fetch(
                "https://customer-rest-service-frontend-personaltrainer.2.rahtiapp.fi/api/trainings"
            );

            if (!response.ok) throw new Error("Network response was not ok");

            const data = await response.json();
            const trainingList = data._embedded.trainings;

            const updatedTrainings = await Promise.all(
                trainingList.map(async (training: Training) => {
                    if (training._links.customer) {
                        try {
                            const customerResponse = await fetch(training._links.customer.href);
                            if (!customerResponse.ok) throw new Error("Failed to fetch customer");

                            const customerData: Customer = await customerResponse.json();
                            return { ...training, customerName: `${customerData.firstname} ${customerData.lastname}` };
                        } catch {
                            return { ...training, customerName: "Unknown" };
                        }
                    }
                    return { ...training, customerName: "Unknown" };
                })
            );

            setTrainings(updatedTrainings);
        } catch (error) {
            console.error("Error fetching trainings:", error);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const resetData = async () => {
        try {
            const response = await fetch("https://customer-rest-service-frontend-personaltrainer.2.rahtiapp.fi/reset", {
                method: "POST",
            });
            
            if (!response.ok) {
                throw new Error("Network response was not ok");
            }
    
            const text = await response.text();
    
            if (text === "DB reset done") {
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
            fetchData(); 
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

            fetchData();
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

            fetchData();
        } catch (error) {
            console.error("Error updating training:", error);
        }
    };

    const columnDefs: ColDef<Training>[] = [
        {
            headerName: "Date",
            field: "date",
            valueFormatter: (params) => dayjs(params.value).format("dddd, MMMM DD, YYYY"),
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
            cellRenderer: (row: any) => (
                <EditTraining training={row.data} updateTraining={updateTraining} />
            ),
            sortable: false,
            filter: false,
        },
        {
            headerName: "",
            flex: 0.5,
            cellStyle: { textAlign: "center" },
            cellRenderer: (row: any) => (
                <DeleteTraining training={row.data} deleteTraining={deleteTraining} />
            ),
            sortable: false,
            filter: false,
        },
    ];

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
            <AgGridReact rowData={trainings} columnDefs={columnDefs} />
        </div>
    );
}
