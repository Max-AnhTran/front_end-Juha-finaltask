import { Customer, Training } from "../types";

    export const getTrainingsData = async () => {
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
                            const customerResponse = await fetch(
                                training._links.customer.href
                            );
                            if (!customerResponse.ok)
                                throw new Error("Failed to fetch customer");

                            const customerData: Customer =
                                await customerResponse.json();
                            return {
                                ...training,
                                customerName: `${customerData.firstname} ${customerData.lastname}`,
                            };
                        } catch {
                            return { ...training, customerName: "Unknown" };
                        }
                    }
                    return { ...training, customerName: "Unknown" };
                })
            );

            return updatedTrainings;
        } catch (error) {
            console.error("Error fetching trainings:", error);
            return [];
        }
    };