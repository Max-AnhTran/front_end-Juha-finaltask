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

export default function EditTraining(props: any) {
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

    const getCustomerLink = async (link: string) => {
        try {
            const response = await fetch(link);
            if (!response.ok) {
                throw new Error("Network response was not ok");
            }
            const data = await response.json();
            return `${data._links.self.href}`;
        } catch (error) {
            console.error("Error fetching customers:", error);
        }
    };

    const handleClickOpen = async () => {
        const customerLink = await getCustomerLink(props.training._links.customer.href);
        if (customerLink) {
            setTraining({ date: props.training.date, duration: props.training.duration, activity: props.training.activity, customer: customerLink });
        }
        setOpen(true);
    };
    

    const handleClose = () => {
        setOpen(false);
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setTraining((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const setDate = (date: any) => {
        setTraining((prev) => ({ ...prev, date: date.format("YYYY-MM-DD") }));
    };

    const editTraining = () => {
        props.updateTraining(training, props.training._links.training.href);
        handleClose();
    };

    return (
        <LocalizationProvider dateAdapter={AdapterDayjs}>
            <Button onClick={handleClickOpen}>EDIT</Button>
            <Dialog
                open={open}
                onClose={handleClose}
                slotProps={{
                    paper: {
                        component: "form",
                        onSubmit: (event: React.FormEvent<HTMLFormElement>) => {
                            event.preventDefault();
                            const formData = new FormData(event.currentTarget);
                            const formJson = Object.fromEntries(
                                (formData as any).entries()
                            );
                            const email = formJson.email;
                            console.log(email);
                            handleClose();
                        },
                    },
                }}
            >
                <DialogTitle>Edit Training</DialogTitle>
                <DialogContent>
                <TextField
                        id="standard-select-currency"
                        select
                        margin="dense"
                        name="customer"
                        label="Customer"
                        variant="standard"
                        defaultValue={training.customer}
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
                        {customers.map((option) => (
                            <MenuItem key={option.id} value={option._links?.self.href}>
                                {option.firstname + " " + option.lastname}
                            </MenuItem>
                        ))}
                    </TextField>
                    <TextField
                        margin="dense"
                        name="activity"
                        label="Activity"
                        type="text"
                        value={training.activity}
                        onChange={(e) => handleInputChange(e as any)}
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
                            onChange={(date) => setDate(date)}
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
                            value={training.duration}
                            onChange={(e) => handleInputChange(e as any)}
                            variant="standard"
                            fullWidth
                        />
                    </Stack>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>Cancel</Button>
                    <Button onClick={editTraining}>Save</Button>
                </DialogActions>
            </Dialog>
        </LocalizationProvider>
    );
}
