import React, { useState, useEffect } from "react";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";

import dayjs from "dayjs";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { MenuItem, Stack } from "@mui/material";

import { Customer } from "../types";

export default function AddTraining(props: any) {
    const [open, setOpen] = useState(false);
    const [customers, setCustomers] = useState<Customer[]>([]);
    const [training, setTraining] = useState({
        date: "",
        duration: 0,
        activity: "",
        customer: "",
    });

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

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setTraining((prev) => ({ ...prev, [name]: value }));
    };

    const setDate = (date: any) => {
        setTraining((prev) => ({ ...prev, date: date.format("YYYY-MM-DD") }));
    };

    const addTraining = () => {
        // console.log(training);
        if (
            !training.date ||
            !training.duration ||
            !training.activity ||
            !training.customer
        ) {
            alert("Please fill in all the fields.");
            return;
        }
        props.saveTraining(training);
        handleClose();
        setTraining({ date: "", duration: 0, activity: "", customer: "" });
    };

    return (
        <LocalizationProvider dateAdapter={AdapterDayjs}>
            <Button variant="outlined" onClick={handleClickOpen}>
                Add New Training
            </Button>
            <Dialog
                open={open}
                onClose={handleClose}
                slotProps={{
                    paper: {
                        component: "form",
                        onSubmit: (event: React.FormEvent<HTMLFormElement>) => {
                            event.preventDefault();
                            handleClose();
                        },
                    },
                }}
            >
                <DialogTitle>Add New Training</DialogTitle>
                <DialogContent>
                    <TextField
                        id="standard-select-customer"
                        select
                        margin="dense"
                        name="customer"
                        label="Customer"
                        variant="standard"
                        defaultValue=""
                        onChange={handleInputChange}
                        fullWidth
                        slotProps={{
                            select: {
                                MenuProps: {
                                    PaperProps: {
                                        sx: {
                                            maxHeight: "250px",
                                        },
                                    },
                                },
                            },
                        }}
                    >
                        {customers.map((customer, index) => (
                            <MenuItem
                                key={customer.id || index}
                                value={customer._links?.self.href}
                            >
                                {customer.firstname + " " + customer.lastname}
                            </MenuItem>
                        ))}
                    </TextField>
                    <TextField
                        margin="dense"
                        name="activity"
                        label="Activity"
                        type="text"
                        value={training.activity}
                        onChange={handleInputChange}
                        fullWidth
                        variant="standard"
                    />
                    <Stack
                        direction="row"
                        spacing={2}
                        mt={2}
                        alignItems="center"
                    >
                        <DatePicker
                            name="date"
                            label="Date"
                            value={training.date ? dayjs(training.date) : null}
                            onChange={setDate}
                            slotProps={{
                                textField: {
                                    variant: "standard",
                                    fullWidth: true,
                                },
                            }}
                        />
                        <TextField
                            margin="dense"
                            name="duration"
                            label="Duration"
                            type="number"
                            slotProps={{ input: { inputProps: { min: 1 } } }}
                            value={training.duration}
                            onChange={handleInputChange}
                            variant="standard"
                            fullWidth
                        />
                    </Stack>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>Cancel</Button>
                    <Button onClick={addTraining}>Save</Button>
                </DialogActions>
            </Dialog>
        </LocalizationProvider>
    );
}
