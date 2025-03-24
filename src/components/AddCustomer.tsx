import React from "react";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";

export default function AddCustomer(props: any) {
    const [open, setOpen] = React.useState(false);

    const [customer, setCustomer] = React.useState({
        firstname: "",
        lastname: "",
        streetaddress: "",
        postcode: "",
        city: "",
        email: "",
        phone: "",
    });

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const handleInputChange = (e : React.ChangeEvent<HTMLInputElement>) => {
        setCustomer((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const addCustomer = () => {
        props.saveCustomer(customer);
        handleClose();
        setCustomer({ firstname: "", lastname: "", streetaddress: "", postcode: "", city: "",  email: "", phone: "" });
    };

    return (
        <React.Fragment>
            <Button variant="outlined" onClick={handleClickOpen}>
                Add New Customer
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
                <DialogTitle>Add New Customer</DialogTitle>
                <DialogContent>
                    <TextField
                        margin="dense"
                        name="firstname"
                        label="First Name"
                        type="text"
                        value={customer.firstname}
                        onChange={(e) => handleInputChange(e as any)}
                        fullWidth
                        variant="standard"
                    />
                    <TextField
                        margin="dense"
                        name="lastname"
                        label="Last Name"
                        type="text"
                        value={customer.lastname}
                        onChange={(e) => handleInputChange(e as any)}
                        fullWidth
                        variant="standard"
                    />
                    <TextField
                        margin="dense"
                        name="streetaddress"
                        label="Street Address"
                        type="text"
                        value={customer.streetaddress}
                        onChange={(e) => handleInputChange(e as any)}
                        fullWidth
                        variant="standard"
                    />
                    <TextField
                        margin="dense"
                        name="postcode"
                        label="Postcode"
                        type="text"
                        value={customer.postcode}
                        onChange={(e) => handleInputChange(e as any)}
                        fullWidth
                        variant="standard"
                    />
                    <TextField
                        margin="dense"
                        name="city"
                        label="City"
                        type="text"
                        value={customer.city}
                        onChange={(e) => handleInputChange(e as any)}
                        fullWidth
                        variant="standard"
                    />
                    <TextField
                        margin="dense"
                        name="email"
                        label="Email"
                        type="email"
                        value={customer.email}
                        onChange={(e) => handleInputChange(e as any)}
                        fullWidth
                        variant="standard"
                    />
                    <TextField
                        margin="dense"
                        name="phone"
                        label="Phone"
                        type="text"
                        value={customer.phone}
                        onChange={(e) => handleInputChange(e as any)}
                        fullWidth
                        variant="standard"
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>Cancel</Button>
                    <Button onClick={addCustomer}>Save</Button>
                </DialogActions>
            </Dialog>
        </React.Fragment>
    );
}
