import React from "react";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";

export default function EditCustomer(props: any) {
    const [open, setOpen] = React.useState(false);

    const [customer, setCustomer] = React.useState({
        firstname: "",
        lastname: "",
        email: "",
        phone: "",
        streetaddress: "",
        postcode: "",
        city: "",
    });

    const handleClickOpen = () => {
        console.log(props.customer);
        setCustomer(props.customer);
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const handleInputChange = (e : React.ChangeEvent<HTMLInputElement>) => {
        setCustomer((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const editCustomer = () => {
        props.updateCustomer(customer, props.customer._links.customer.href);
        handleClose();
    };

    return (
        <React.Fragment>
            <Button onClick={handleClickOpen}>
                EDIT
            </Button>
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
                <DialogTitle>Edit Customer</DialogTitle>
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
                    <Button onClick={editCustomer}>Save</Button>
                </DialogActions>
            </Dialog>
        </React.Fragment>
    );
}
