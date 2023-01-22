import { BiCalendar } from "react-icons/bi";
import Search from "./components/Search";
import AddAppointment from "./components/AddAppointment";
import AppointmentInfo from "./components/AppointmentInfo";
import { useState, useEffect, useCallback } from "react";

function App() {
  const [appointmentList, setAppointmentList] = useState([]);
  const [query, setQuery] = useState("");
  const [sortBy, setsortBy] = useState("petName");
  const [orderBy, setorderBy] = useState("asc");
  const filteredAppointmentList = appointmentList
    .filter(
      (appointment) =>
        appointment.petName.toLowerCase().includes(query.toLocaleLowerCase()) ||
        appointment.ownerName.toLowerCase().includes(query.toLocaleLowerCase()) ||
        appointment.aptNotes.toLowerCase().includes(query.toLocaleLowerCase())
    )
    .sort((a, b) => {
      const order = orderBy === "asc" ? 1 : -1;
      return a[sortBy].toLowerCase() < b[sortBy].toLocaleLowerCase() ? -1 * order : order;
    });

  const fetchData = useCallback(() => {
    fetch("./data.json")
      .then((response) => response.json())
      .then((data) => setAppointmentList(data));
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return (
    <div className="container mx-auto mt-3 font-thin">
      <h1 className="text-5xl mb-3">
        <BiCalendar className="inline-block text-red-400 align-top" />
        Your Appointments
      </h1>
      <AddAppointment
        lastId={Math.max(...appointmentList.map((appointment) => appointment.id))}
        onSendAppointment={(newAppointment) => {
          setAppointmentList([...appointmentList, newAppointment]);
        }}
      />
      <Search
        onQueryChange={(newQuery) => setQuery(newQuery)}
        orderBy={orderBy}
        onOrderByChange={(newOrder) => setorderBy(newOrder)}
        sortBy={sortBy}
        onSortByChange={(newSort) => setsortBy(newSort)}
      />

      <ul className="divide-y divide-gray-200">
        {filteredAppointmentList.map((appointment) => (
          <AppointmentInfo
            key={appointment.id}
            appointment={appointment}
            onDeleteAppointment={(appointmentId) => {
              setAppointmentList(appointmentList.filter((appointment) => appointment.id !== appointmentId));
            }}
          />
        ))}
      </ul>
    </div>
  );
}

export default App;

// raybo.org/slides_reactinterface
// https://github.com/LinkedInLearning/react-interface-2880067
