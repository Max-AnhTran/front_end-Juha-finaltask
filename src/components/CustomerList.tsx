import { useState, useEffect, useCallback, useRef } from "react";
import { AgGridReact } from "ag-grid-react";
import { AllCommunityModule, ModuleRegistry, ColDef } from "ag-grid-community";

import AddCustomer from "./AddCustomer";
import EditCustomer from "./EditCustomer";
import { Button } from "@mui/material";

import { Customer } from "../types";
import DeleteCustomer from "./DeleteCustomer";
import ConsecutiveSnackbars from "./SnackBar";

ModuleRegistry.registerModules([AllCommunityModule]);

export default function CustomerList() {
    const [customers, setCustomers] = useState<Customer[]>([]);
    const gridRef = useRef<AgGridReact>(null);
    const [snackMessage, setSnackMessage] = useState<string | null>(null);

    const fetchData = async () => {
        try {
            const response = await fetch(
                "https://customer-rest-service-frontend-personaltrainer.2.rahtiapp.fi/api/customers"
            );
            if (!response.ok) {
                throw new Error("Network response was not ok");
            }
            const data = await response.json();
            setCustomers(data._embedded.customers);
        } catch (error) {
            console.error("Error fetching customers:", error);
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
                await fetchData();
            } else {
                throw new Error("Unexpected response text");
            }
        } catch (error) {
            console.error("Error resetting customers:", error);
        }
    };

    const deleteCustomer = async (link: any) => {
        console.log("Delete clicked for:", link);
        try {
            await fetch(link, { method: "DELETE" });
            setSnackMessage("Customer deleted successfully");
            await fetchData();
        } catch (error) {
            console.error("Error deleting customer:", error);
        }
    };

    const saveCustomer = async (customer: Customer) => {
        try {
            const response = await fetch(
                "https://customer-rest-service-frontend-personaltrainer.2.rahtiapp.fi/api/customers",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(customer),
                }
            );
            if (!response.ok) {
                throw new Error("Network response was not ok");
            }
            setSnackMessage("Customer added successfully");
            await fetchData();
        } catch (error) {
            console.error("Error saving customer:", error);
        }
    };

    const updateCustomer = async (customer: Customer, link: any) => {
        try {
            const response = await fetch(link, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(customer),
            });
            if (!response.ok) {
                throw new Error("Network response was not ok");
            }
            setSnackMessage("Customer edited successfully");
            await fetchData();
        } catch (error) {
            console.error("Error updating customer:", error);
        }
    };

    const exportToCSV = useCallback(() => {
        gridRef.current!.api.exportDataAsCsv();
    }, []);

    const [columnDefs] = useState<ColDef<Customer>[]>([
        {
            field: "firstname",
            headerName: "First Name",
            flex: 1,
            sortable: true,
            filter: true,
        },
        {
            field: "lastname",
            headerName: "Last Name",
            flex: 1,
            sortable: true,
            filter: true,
        },
        {
            field: "streetaddress",
            headerName: "Street Address",
            flex: 1,
            sortable: true,
            filter: true,
        },
        {
            field: "postcode",
            headerName: "Postcode",
            flex: 1,
            sortable: true,
            filter: true,
        },
        {
            field: "city",
            headerName: "City",
            flex: 1,
            sortable: true,
            filter: true,
        },
        {
            field: "email",
            headerName: "Email",
            flex: 1,
            sortable: true,
            filter: true,
        },
        {
            field: "phone",
            headerName: "Phone",
            flex: 1,
            sortable: true,
            filter: true,
        },
        {
            headerName: "",
            flex: 0.75,
            cellStyle: { textAlign: "center" },
            cellRenderer: (row: any) => (
                <EditCustomer
                    customer={row.data}
                    updateCustomer={updateCustomer}
                />
            ),
            sortable: false,
            filter: false,
        },
        {
            headerName: "",
            flex: 0.75,
            cellStyle: { textAlign: "center" },
            cellRenderer: (row: any) => (
                <DeleteCustomer
                    customer={row.data}
                    deleteCustomer={deleteCustomer}
                />
            ),
            sortable: false,
            filter: false,
        },
    ]);

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
                <AddCustomer saveCustomer={saveCustomer} />
                <Button
                    onClick={exportToCSV}
                    variant="outlined"
                    color="success"
                >
                    Export to CSV
                </Button>
                <Button variant="outlined" onClick={resetData}>
                    Reset Data
                </Button>
            </div>
            <AgGridReact
                ref={gridRef}
                rowData={customers}
                columnDefs={columnDefs}
                pagination={true}
                paginationAutoPageSize
            />
            <ConsecutiveSnackbars
                snackMessage={snackMessage}
                setSnackMessage={setSnackMessage}
            />
        </div>
    );
}
