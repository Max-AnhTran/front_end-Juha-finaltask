export type Training = {
    id: number;
    date: string;
    duration: number;
    activity: string;
    customerName: string;
    _links: { self: { href: string }; customer: { href: string } };
}

export type Customer = {
    id: number;
    firstname: string;
    lastname: string;
    streetaddress: string;
    postcode: string;
    city: string;
    email: string;
    phone: string;
    _links: { self: { href: string }; trainings: { href: string } };
}