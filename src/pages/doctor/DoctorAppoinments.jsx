import React, { useState, useEffect } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import {
  Table,
  Button,
  Form,
  FormGroup,
  Label,
  Input,
  Row,
  Col,
} from "reactstrap";
import DoctorLayout from "../../component/DoctorLayout";
import {jwtDecode} from "jwt-decode";

const BASE_URL = "http://127.0.0.1:8000/appoinment"; // Update with your actual API base URL

const DoctorAppointments = () => {
  const { access } = useSelector((state) => state.auth);
  const [slots, setSlots] = useState([]);
  const [timeSlots, setTimeSlots] = useState([]);
  const [selectedSlot, setSelectedSlot] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [error, setError] = useState(null);

  const userId = jwtDecode(access).user_id;

  useEffect(() => {
    fetchSlots();
    fetchTimeSlots();
  }, []);

  const fetchSlots = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/slots/`, {
        headers: { Authorization: `Bearer ${access}` },
      });
      setSlots(response.data);
    } catch (error) {
      console.error("Error fetching slots:", error);
    }
  };

  const fetchTimeSlots = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/time-slots/`, {
        headers: { Authorization: `Bearer ${access}` },
      });
      setTimeSlots(response.data);
    } catch (error) {
      console.error("Error fetching time slots:", error);
    }
  };

  const handleSlotChange = (e) => {
    setSelectedSlot(e.target.value);
  };

  const handleFromDateChange = (e) => {
    setFromDate(e.target.value);
  };

  const handleToDateChange = (e) => {
    setToDate(e.target.value);
  };

  const handleAddSlot = async (e) => {
    e.preventDefault();
    setError(null);

    const newSlot = {
        start_date: fromDate,
        end_date: toDate,
        time: selectedSlot,
        doctor: userId,
      };
  
      try {
        await axios.post(`${BASE_URL}/slots/`, newSlot, {
          headers: {
            Authorization: `Bearer ${access}`,
          },
        });
        fetchSlots();
        setSelectedSlot("");
        setFromDate("");
        setToDate("");
      } catch (error) {
        if (error.response && error.response.data) {
          const errorData = error.response.data;
          const formattedError = {};
  
          // Reformat non_field_errors to be more user-friendly
          if (errorData.non_field_errors) {
            formattedError.detail = errorData.non_field_errors.join(", ");
          }
  
          setError(formattedError);
        } else {
          setError({ detail: "An unexpected error occurred." });
        }
      }
    };

  const handleDeleteSlot = async (slotId) => {
    try {
      await axios.delete(`${BASE_URL}/slots/${slotId}/`, {
        headers: { Authorization: `Bearer ${access}` },
      });
      fetchSlots();
    } catch (error) {
      console.error("Error deleting slot:", error);
    }
  };

  return (
    <DoctorLayout>
      <div className="w-100 mt-5">
        <h4>Create New Slot</h4>
        <hr />
        {error && (
          <div className="alert alert-danger">
            {Object.entries(error).map(([key, value]) => (
              <div key={key}>{`${key}: ${value}`}</div>
            ))}
          </div>
        )}
        <div className="p-2 bg-light rounded shadow">
          <Form onSubmit={handleAddSlot}>
            <Row>
              <Col md={3}>
                <FormGroup>
                  <Label for="from_date">From Date</Label>
                  <Input
                    type="date"
                    name="from_date"
                    id="from_date"
                    value={fromDate}
                    onChange={handleFromDateChange}
                    min={new Date().toISOString().split("T")[0]}
                    required
                  />
                </FormGroup>
              </Col>
              <Col md={3}>
                <FormGroup>
                  <Label for="to_date">To Date</Label>
                  <Input
                    type="date"
                    name="to_date"
                    id="to_date"
                    value={toDate}
                    onChange={handleToDateChange}
                    min={new Date().toISOString().split("T")[0]}
                    required
                  />
                </FormGroup>
              </Col>
              <Col md={3}>
                <FormGroup>
                  <Label for="slot">Select Time Slot</Label>
                  <Input
                    type="select"
                    name="slot"
                    id="slot"
                    value={selectedSlot}
                    onChange={handleSlotChange}
                    required
                  >
                    <option value="" disabled>
                      Select a time slot
                    </option>
                    {timeSlots.map((timeSlot) => (
                      <option key={timeSlot.id} value={timeSlot.id}>
                        {timeSlot.time}
                      </option>
                    ))}
                  </Input>
                </FormGroup>
              </Col>
              <Col md={3} className="d-flex align-items-end pb-3">
                <Button type="submit" color="primary" className="w-100">
                  Add Slot
                </Button>
              </Col>
            </Row>
          </Form>
        </div>

        <div className="row m-0 pt-5">
          <div className="col-md-6 p-2">
            <div className="bg-light p-2 rounded shadow border">
              <h2>Existing Slots</h2>
              <Table className="rounded table-striped">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>From Date</th>
                    <th>To Date</th>
                    <th>Time</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {slots.map((slot, index) => (
                    <tr key={slot.id}>
                      <th scope="row">{index + 1}</th>
                      <td>{slot.start_date}</td>
                      <td>{slot.end_date}</td>
                      <td>{slot.time_slot?.time}</td> {/* Accessing nested time */}
                      <td>
                        <Button
                          color="danger"
                          onClick={() => handleDeleteSlot(slot.id)}
                        >
                          Delete
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </div>
          </div>
        </div>
      </div>
    </DoctorLayout>
  );
};

export default DoctorAppointments;
