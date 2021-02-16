import logo from "./logo.svg";
// import './App.css';
import background from "./assets/images/background.jpg";
import img1 from "./assets/images/img1.jpg";
import { Card, Col, Row } from "react-bootstrap";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import { Button, Input } from "reactstrap";
import React, { Component } from "react";
import {
  DatePicker,
  TimePicker,
  DateTimePicker,
  MuiPickersUtilsProvider,
} from '@material-ui/pickers';
import DateFnsUtils from "@date-io/date-fns"; // choose your lib

// import { Button } from "bootstrap";
import axios from "axios";
import moment from "moment";
import "./App.css";
// var date = new Date();
export default class App extends Component {
  state = {
    searchValue: "",
    week: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
    restArray: [],
    filteredRestArray: [],
    date: new Date(),
    dataUpdate: false,
    today: null,
    currentTime: null,
    selectedDay: null,
    selectedTime: null,
    search: null,
    searching: false,
    showCalendar: false,
    showTimePicker: false,
    isDateChanged: false,
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
          const newEle = {
            restaurant: ele["Kushi Tsuru"],
            start: timeobject.startArray,
            end: timeobject.endArray,
          };
          restArray.push(newEle);
        });
        this.setState({
          restArray,
          filteredRestArray: restArray,
          today: this.state.date.getDay(),
          selectedDay: this.state.date.getDay(),
          currentTime: this.state.date.getTime(),
          selectedTime: this.state.date.getTime(),
          dataUpdate: true,
        });
      });
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
    return {
      startArray: startArray,
      endArray: endArray,
    };
  };
  validRest = (object) => {
    const begin = moment(object.start[this.state.selectedDay], "h:mma");
    begin.set('month',this.state.date.getMonth());
    begin.set('date', this.state.date.getDate());
    begin.set('year', this.state.date.getFullYear());
    const end = moment(object.end[this.state.selectedDay], "h:mma");
    end.set('month',this.state.date.getMonth());
    end.set('date', this.state.date.getDate());
    end.set('year', this.state.date.getFullYear());
    const time = moment(this.state.selectedTime);
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
    const date = new Date(value);
    const restArray = this.state.restArray;
    let newRestArray = [];
    this.setState({
      selectedDay:date.getDay(), 
      selectedTime: date.getTime(),
      date
    },()=>{
      restArray.forEach((item, index) => {
        if((item.start[date.getDay()] &&
          this.validRest(item))){
            newRestArray.push(item);
          }
      });
      this.setState({ 
        filteredRestArray: newRestArray,
      })
    });
    
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
    this.setState({ filteredRestArray: arr });
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
            <h1 style={{ fontWeight: "bolder", color: "white",letterSpacing:"0.4rem" }}>FindFood</h1>
          </div>
          <Row className="w-75">
            <Col md={'auto'}>
            <MuiPickersUtilsProvider utils={DateFnsUtils}>
            <DateTimePicker value={this.state.date} className="time-class px-2 py-2 rounded" onChange={this.handleDate}/>
          </MuiPickersUtilsProvider> 
           {/*}   <MuiPickersUtilsProvider utils={DateFnsUtils}>
      <DatePicker value={this.state.date} className="time-class px-2 py-2 rounded" onChange={this.handleDate} />
    </MuiPickersUtilsProvider> */}
            </Col>
            <Col md={8}>
              <Input
                className="py-4"
                placeholder="Search for a restaurant"
                name="search"
                value={this.state.search}
                onChange={this.handleRestInput}
              />
              {this.state.searching && (
                <div
                  className="p-2 mt-1 shadow w-100"
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
                        <Row className="my-3 w-100 m-0">
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
          <div className="text-center container">
            <Row className="w-100 m-0">
              <Col style={{textAlign:"end"}}>
                <Button onClick={this.handleSort} style={{backgroundColor:"#3c170d", color:"white"}}>Sort by Closest time</Button>
              </Col>
            </Row>
            <Row className="mx-auto w-100 m-0" style={{ width: "80%" }}>
              {this.state.filteredRestArray.map(
                (res) =>
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
