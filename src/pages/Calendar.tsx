import { useEffect, useState } from "react";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";

import { Training, Customer } from "../types";

const localizer = momentLocalizer(moment);

interface ApiResponse {
  _embedded: {
    trainings: Training[];
  };
}

const CalendarPage = () => {
  const [trainings, setTrainings] = useState<any[]>([]);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [currentView, setCurrentView] = useState<"month" | "week" | "day">("week");

  useEffect(() => {
    const fetchTrainings = async () => {
      try {
        const response = await fetch(
          "https://customer-rest-service-frontend-personaltrainer.2.rahtiapp.fi/api/trainings"
        );
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data: ApiResponse = await response.json();
        const trainingList = data._embedded.trainings;

        const updatedTrainings = await Promise.all(
          trainingList.map(async (training) => {
            if (training._links.customer) {
              try {
                const customerResponse = await fetch(training._links.customer.href);
                if (!customerResponse.ok) throw new Error("Failed to fetch customer");
                
                const customerData: Customer = await customerResponse.json();
                return { 
                  ...training, 
                  customerName: `${customerData.firstname} ${customerData.lastname}` 
                };
              } catch (error) {
                console.error("Error fetching customer:", error);
                return { ...training, customerName: "Unknown" };
              }
            }
            return { ...training, customerName: "Unknown" };
          })
        );

        const formattedTrainings = updatedTrainings.map((training) => ({
          id: training.id,
          title: `${training.activity} / ${training.customerName}`,
          start: new Date(training.date),
          end: new Date(moment(training.date).add(training.duration, "minutes").toISOString()),
        }));

        setTrainings(formattedTrainings);
      } catch (error) {
        console.error("Error fetching trainings:", error);
      }
    };

    fetchTrainings();
  }, []);

  const handleNavigate = (newDate: Date) => {
    setCurrentDate(newDate);
  };

  const handleViewChange = (newView: string) => {
    if (newView === "month" || newView === "week" || newView === "day") {
      setCurrentView(newView);
    }
  };

  return (
    <div style={{ height: "80vh", padding: "20px" }}>
      <Calendar
        localizer={localizer}
        events={trainings}
        startAccessor="start"
        endAccessor="end"
        views={['month', 'week', 'day']}
        view={currentView}
        onView={handleViewChange}
        date={currentDate}
        onNavigate={handleNavigate}
      />
    </div>
  );
};

export default CalendarPage;