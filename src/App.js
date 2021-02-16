import logo from "./logo.svg";
// import './App.css';
import background from "./assets/images/background.jpg";
import img1 from "./assets/images/img1.jpg";
import { Card, Col, Row } from "react-bootstrap";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import { Button, Input } from "reactstrap";
import React, { Component } from "react";
// import { Button } from "bootstrap";
import axios from "axios";
import moment from "moment";
import TimePicker from "react-time-picker";
import "./App.css";
var date = new Date();
export default class App extends Component {
  state = {
    searchValue: "",
    week: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
    restArray: [],
    date: date,
    dataUpdate: false,
    today: null,
    currentTime: null,
    selectedDay: null,
    selectedTime: null,
    search: null,
    searching: false,
    showCalendar: false,
    showTimePicker: false,
  };
  componentDidMount() {
    axios
      .get("https://run.mocky.io/v3/b0f3e975-b815-4e88-8a6a-84af59fe32eb")
      .then((data) => {
        const dataArray = data.data;
        const restArray = [];
        dataArray.forEach((ele, index) => {
          const timeString = ele["Mon-Sun 11:30 am - 9 pm"];
          const timeobject = this.handleTimeString(timeString, index);
          console.log(timeobject);
          const newEle = {
            restaurant: ele["Kushi Tsuru"],
            start: timeobject.startArray,
            end: timeobject.endArray,
          };
          restArray.push(newEle);
        });
        this.setState({
          restArray,
          date,
          today: date.getDay(),
          selectedDay: date.getDay(),
          currentTime: date.getTime(),
          selectedTime: date.getTime(),
          dataUpdate: true,
        });
        // console.log(dataArray);
      });
    // console.log(restaurants);
  }
  handleTimeString = (string, index) => {
    const startArray = [];
    const endArray = [];
    if (index == 33) {
      for (
        let i = this.state.week.indexOf(string.slice(5, 8));
        i <= this.state.week.indexOf(string.slice(9, 12));
        i++
      ) {
        startArray[i] = string.slice(13).split(" - ")[0];
        endArray[i] = string.slice(13).split(" - ")[1];
      }
      let j = this.state.week.indexOf(string.slice(0, 3));
      startArray[j] = string.slice(13).split(" - ")[0];
      endArray[j] = string.slice(13).split(" - ")[1];
    } else {
      if (string.includes("/")) {
        string.split("  / ").forEach((ind) => {
          if (ind[3] == "-") {
            if (ind.includes(",")) {
              for (
                let i = this.state.week.indexOf(ind.slice(0, 3));
                i <= this.state.week.indexOf(ind.slice(4, 7));
                i++
              ) {
                startArray[i] = ind.slice(13).split(" - ")[0];
                endArray[i] = ind.slice(13).split(" - ")[1];
              }
              let j = this.state.week.indexOf(ind.slice(9, 12));
              startArray[j] = ind.slice(13).split(" - ")[0];
              endArray[j] = ind.slice(13).split(" - ")[1];
            } else {
              for (
                let i = this.state.week.indexOf(ind.slice(0, 3));
                i <= this.state.week.indexOf(ind.slice(4, 7));
                i++
              ) {
                startArray[i] = ind.slice(8).split(" - ")[0];
                endArray[i] = ind.slice(8).split(" - ")[1];
              }
            }
          } else {
            let k = this.state.week.indexOf(ind.slice(0, 3));
            startArray[k] = ind.slice(4).split(" - ")[0];
            endArray[k] = ind.slice(4).split(" - ")[1];
          }
        });
      } else {
        for (let i = 0; i < 7; i++) {
          startArray.push(string.slice(8).split(" - ")[0]);
          endArray.push(string.slice(8).split(" - ")[1]);
        }
      }
    }
    // console.log(startArray, endArray, string);
    return {
      startArray: startArray,
      endArray: endArray,
    };
  };
  validRest = (object) => {
    const begin = moment(object.start[this.state.selectedDay], "h:mma");
    const end = moment(object.end[this.state.selectedDay], "h:mma");
    const time = moment(this.state.selectedTime);
    console.log(time.isBetween(begin, end), begin, end, time);
    return time.isBetween(begin, end);
  };
  isSearched = (res, string) => {
    if (string.length > 0) {
      if (res.restaurant.toLowerCase().includes(string.toLowerCase())) {
        return true;
      } else return false;
    } else {
      this.setState({ searching: false });
    }
  };
  handleRestInput = (event) => {
    this.setState({ [event.target.name]: event.target.value, searching: true });
  };
  handleDate = (value) => {
    date = new Date(value);
    this.setState(
      {
        date,
        selectedDay: date.getDay(),
        showCalendar: false,
      },
      () => {
        console.log(this.state.selectedDay);
      }
    );
  };
  handleTime = (value) => {
    // this.setState;
    console.log(value);
  };
  comparator = (a, b) => {
    const closeA = moment(a.end[this.state.selectedDay], "hh:mma");
    const closeB = moment(b.end[this.state.selectedDay], "hh:mma");
    if (closeA.isBefore(closeB)) {
      return -1;
    } else {
      return 1;
    }
  };
  handleSort = () => {
    const arr = this.state.restArray;
    arr.sort(this.comparator);
    this.setState({ restArray: arr });
  };
  // handleOneRest=(res)=>{
  //   this.setState({selectedRest:res})
  // }
  render() {
    return (
      <div className="App">
        <div
          className="mb-5"
          style={{
            backgroundImage: "url(" + background + ")",
            backgroundPosition: "center",
            backgroundSize: "cover",
            backgroundRepeat: "no-repeat",
            width: "100%",
            height: "65vh",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexFlow: "column",
          }}
        >
          <div className="my-3">
            <h1 style={{ fontWeight: "bolder", color: "white" }}>FindFood</h1>
          </div>
          <Row className="w-75">
            <Col md={2}>
              <Button
                style={{
                  color: "black",
                  backgroundColor: "white",
                  fontSize: "1.4rem",
                  width: "100%",
                }}
                onClick={() => {
                  this.setState({ showTimePicker: !this.state.showTimePicker });
                }}
              >
                {moment(this.state.date.getTime()).format("hh:mma")}
              </Button>
              {this.state.showTimePicker && (
                <TimePicker
                  className="time-class"
                  disableClock="true"
                  onChange={this.handleTime}
                />
              )}
            </Col>
            <Col md={2}>
              <Button
                style={{
                  color: "black",
                  backgroundColor: "white",
                  fontSize: "1.4rem",
                  width: "100%",
                }}
                onClick={() => {
                  this.setState({ showCalendar: !this.state.showCalendar });
                }}
              >
                {this.state.date.getDate() +
                  "/" +
                  this.state.date.getMonth() +
                  "/" +
                  this.state.date.getFullYear()}
              </Button>
              {this.state.showCalendar && (
                <Calendar
                  className="calendar-class"
                  onChange={this.handleDate}
                />
              )}
            </Col>
            <Col>
              <Input
                className="py-4"
                placeholder="Search for a restaurant"
                name="search"
                value={this.state.search}
                onChange={this.handleRestInput}
              />
              {this.state.searching && (
                <div
                  className="py-2 mt-1 shadow"
                  style={{
                    backgroundColor: "white",
                    borderRadius: "10px",
                    maxHeight: "500px",
                    overflow: "auto",
                    position: "absolute",
                    zIndex: 1000,
                  }}
                >
                  {this.state.restArray.map(
                    (res) =>
                      this.isSearched(res, this.state.search.trim()) && (
                        <Row className="my-3">
                          <Col sm={"auto"}>
                            <img
                              height="60px"
                              width="60px"
                              src={img1}
                              style={{ borderRadius: "10px" }}
                            />
                          </Col>
                          <Col>
                            <div>{res.restaurant}</div>
                            <small>
                              {res.end[this.state.selectedDay]
                                ? "Open till " + res.end[this.state.selectedDay]
                                : "Closed"}
                            </small>
                          </Col>
                        </Row>
                      )
                  )}
                </div>
              )}
            </Col>
          </Row>
        </div>
        {this.state.dataUpdate && (
          <div className="text-center">
            <Row>
              <Col>
                <Button onClick={this.handleSort}>Sort by Closest time</Button>
              </Col>
            </Row>
            <Row className="mx-auto" style={{ width: "80%" }}>
              {this.state.restArray.map(
                (res) =>
                  res.start[this.state.selectedDay] &&
                  this.validRest(res) && (
                    <Col md={3}>
                      <Card
                        className="shadow my-4"
                        style={{
                          borderRadius: "15px",
                          fontSize: "1rem",
                          overflow: "hidden",
                          width: "100%",
                        }}
                      >
                        <img height="100%" width="100%" src={img1} />
                        <div className="p-2">
                          <div>{res.restaurant}</div>
                          <small>
                            {"Open till " + res.end[this.state.selectedDay]}
                          </small>
                        </div>
                      </Card>
                    </Col>
                  )
              )}
            </Row>
          </div>
        )}
      </div>
    );
  }
}
