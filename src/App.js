import React, { Component } from 'react';
import {Carousel} from "react-bootstrap";
import './App.css';
import axios from 'axios';

class App extends Component {

    constructor(props) {
        super(props);
        this.state = {
            carouselArray:[],
            carouselArrayIndex: 0,
            lazyLoadCarouselArray: []
        }
    };

    componentDidMount() {
        this.getData();
        setInterval(() => {
            console.log("fetch data");
            this.getData();
        }, 30000);
    };

    getData=()=> {
        axios.get("http://www.json-generator.com/api/json/get/cfhnwVaiwi?indent=2", {
            method: 'GET',
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json"
            }
        })
            .then(res => {
                const carouselArray = res.data;
                let lazyLoadCarouselArray = this.getActiveArray(carouselArray,this.state.carouselArrayIndex);
                this.setState({carouselArray ,lazyLoadCarouselArray});
            });
    };

    getActiveArray = (carouselArray,carouselArrayIndex) => {
        let lazyLoadCarouselArray = [];

        //prev
        lazyLoadCarouselArray.push(carouselArrayIndex === 0 ? carouselArray[carouselArray.length - 1] : carouselArray[carouselArrayIndex - 1]);
        //current
        lazyLoadCarouselArray.push(carouselArray[carouselArrayIndex]);
        //next
        lazyLoadCarouselArray.push(carouselArrayIndex === carouselArray.length - 1 ? carouselArray[0] : carouselArray[carouselArrayIndex + 1]);

        return lazyLoadCarouselArray;
    };

    handleSelect=(selectedIndex, e) => {
        let carouselArrayIndex = this.state.carouselArrayIndex;
        if(e.direction === "next"){
            if(carouselArrayIndex === this.state.carouselArray.length - 1) {
                carouselArrayIndex = 0;
            }
            else {
                carouselArrayIndex++;
            }
        }
        if(e.direction === "prev"){
            if(carouselArrayIndex === 0) {
                carouselArrayIndex = this.state.carouselArray.length - 1;
            }
            else {
                carouselArrayIndex--;
            }
        }
        console.log('carouselArrayIndex:' + carouselArrayIndex + ' direction:' + e.direction);
        let lazyLoadCarouselArray = this.getActiveArray(this.state.carouselArray,carouselArrayIndex);
        this.setState({
            carouselArrayIndex,
            lazyLoadCarouselArray
        });
    };

    render() {
        const getCarousel = () => {
            return this.state.lazyLoadCarouselArray.map((item, itemIndex) => {
                return (
                    <Carousel.Item className="caruselImage" key={"CarouselItem"+itemIndex}>
                        <img  src={item.media.m} />
                        <Carousel.Caption>
                            <h3>{item.title}</h3>
                            <p>{item.tags}</p>
                        </Carousel.Caption>
                    </Carousel.Item>
                );
            });
        };

        return (
            <div className="App">
                <div className="container">
                    <Carousel onSelect={this.handleSelect} interval={null} activeIndex={1}>
                        {getCarousel()}
                    </Carousel>
                </div>
            </div>
        );
    }
}

export default App;
