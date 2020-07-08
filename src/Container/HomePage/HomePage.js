import React from 'react';
import PropTypes from 'prop-types';
import './HomePage.scss';
import flightLogo from '../../assets/airplane.svg'

/// cities array
var cities = ["Pune (PNQ)", "Mumbai (BOM)", "Bengaluru (BLR)", "Delhi (DEL)"];
// hashmap for to convert numeric month to words

var monthsObj = {
    '01': 'Jan', '02': 'Feb', '03': 'March', '04': 'April',
    '05': 'May', '06': 'June', '07': 'July', '08': 'August', '09': 'September', '10': 'October', '11': 'November', '12': 'December'
}
class HomePage extends React.Component {

    state = {
        returnJourney: false,
        onewayJourney: true,
        origin: '',
        destination: '',
        departureDate: '',
        returnDate: '',
        dummyArrayOneWAY: [],
        originArray: [],
        showData: false
    }

    componentWillMount() {
        // setting the data coming from api
        this.props.getPostsListAsync().then(() => {
            this.setState({ originArray: this.props.postsList.postListData.postData })
        })
    }

    /// Auto component logic 
    autoComleteFunc = () => {
        function autocomplete(inp, arr) {
            var currentFocus;
            inp.addEventListener("input", function (e) {
                var a, b, i, val = this.value;
                closeAllLists();
                if (!val) { return false; }
                currentFocus = -1;
                a = document.createElement("DIV");
                a.setAttribute("id", this.id + "autocomplete-list");
                a.setAttribute("class", "autocomplete-items");
                this.parentNode.appendChild(a);
                for (i = 0; i < arr.length; i++) {
                    if (arr[i].substr(0, val.length).toUpperCase() == val.toUpperCase()) {
                        b = document.createElement("DIV");
                        b.innerHTML = "<strong>" + arr[i].substr(0, val.length) + "</strong>";
                        b.innerHTML += arr[i].substr(val.length);
                        b.innerHTML += "<input type='hidden' value='" + arr[i] + "'>";
                        b.addEventListener("click", function (e) {
                            inp.value = this.getElementsByTagName("input")[0].value;
                            closeAllLists();
                        });
                        a.appendChild(b);
                    }
                }
            });
            inp.addEventListener("keydown", function (e) {
                var x = document.getElementById(this.id + "autocomplete-list");
                if (x) x = x.getElementsByTagName("div");
                if (e.keyCode == 40) {
                    currentFocus++;
                    addActive(x);
                } else if (e.keyCode === 38) {
                    currentFocus--;
                    addActive(x);
                } else if (e.keyCode === 13) {
                    e.preventDefault();
                    if (currentFocus > -1) {
                        if (x) x[currentFocus].click();
                    }
                }
            });
            function addActive(x) {
                if (!x) return false;
                removeActive(x);
                if (currentFocus >= x.length) currentFocus = 0;
                if (currentFocus < 0) currentFocus = (x.length - 1);
                x[currentFocus].classList.add("autocomplete-active");
            }
            function removeActive(x) {
                for (var i = 0; i < x.length; i++) {
                    x[i].classList.remove("autocomplete-active");
                }
            }
            function closeAllLists(elmnt) {
                var x = document.getElementsByClassName("autocomplete-items");
                for (var i = 0; i < x.length; i++) {
                    if (elmnt != x[i] && elmnt != inp) {
                        x[i].parentNode.removeChild(x[i]);
                    }
                }
            }
            document.addEventListener("click", function (e) {
                closeAllLists(e.target);
            });
        }
        autocomplete(document.getElementById("myOrigin"), cities);
        autocomplete(document.getElementById("myDestination"), cities);
    }

    componentDidMount() {
        if (this.state.showData) {
            // calling auto complete logic after component rendered
            this.autoComleteFunc()
        }
    }

    // Tab hanler for oneway and return journey
    handleTab = (e, type) => {
        if (type === 'return') {
            this.setState({
                returnJourney: true,
                onewayJourney: false
            })
        } else if (type === 'oneway') {
            this.setState({
                returnJourney: false,
                onewayJourney: true
            })
        }

    }
    // City handler
    handleCityChange = (e, type) => {
        console.log('e.target.value', e.target.value)
        if (type === 'origin') {
            this.setState({
                origin: e.target.value
            })
        } else if (type === 'destination') {
            this.setState({
                destination: e.target.value
            })
        }
    }
    // filtering flights on behalf of origin and destination
    fetchFlights = (e) => {
        e.preventDefault();
        var data = this.state.originArray.filter(item => item.origin === this.state.origin && item.destination === this.state.destination)
        // multiple route handling
        
        this.state.originArray.map((p0) => {
            let arr1 = this.state.originArray.filter(item2 => p0.origin === item2.origin && item2.origin === this.state.origin && p0.origin ===this.state.origin);
            let arr2 = this.state.originArray.filter(item2 => p0.destination === item2.destination && this.state.destination && p0.destination === this.state.destination);
            arr1.map((p1) => {
                arr2.map((p2) => {
                    if(p1.destination === p2.origin){
                        let tempArr = [p1,p2]
                        tempArr.push(p1);
                        tempArr.push(p2);
                    }
                })
            })
        })
        
        this.setState({
            dummyArrayOneWAY: data,
            showData: true
        })
    }
    handleChange = (e, type) => {
        if (type === 'departure') {
            this.setState({ departureDate: e.target.value })
        }
        else if (type === 'return') {
            this.setState({ returnDate: e.target.value })
        }
    }
    render() {
        var departDate = this.state.departureDate.split('-');
        var returnDate = this.state.returnDate.split('-');
        console.log('dummyArrayOneWAY ->', this.state.dummyArrayOneWAY)
        return (
            <React.Fragment>
                <div className="flightSearchApp">
                    <div className="appTitle">
                        <h2> Flight Search App </h2>
                    </div>
                    <div className="searchFormWrapper">
                        <div className="tabWrapper">
                            <button className={`tablink ${this.state.onewayJourney ? 'active' : 'inactive'}`} onClick={(e) => this.handleTab(e, 'oneway')}>One way</button>
                            <button className={`tablink ${this.state.returnJourney ? 'active' : 'inactive'}`} onClick={(e) => this.handleTab(e, 'return')}>Return</button>
                        </div>
                        <div className="searchForm">
                            <form className="formWrapper" onSubmit={this.fetchFlights}>
                                <div className='autocomplete'>
                                    <input required id='myOrigin' type='text' name='originCity' placeholder='Enter Origin City' onChange={(e) => this.handleCityChange(e, 'origin')} />
                                </div>
                                <div className='autocomplete'>
                                    <input required id='myDestination' type='text' name='destinationCity' placeholder='Enter Destination City' onChange={(e) => this.handleCityChange(e, 'destination')} />
                                </div>
                                <div className="datePicker">
                                    <input required type="date" id="departureDate" name="departure" onChange={(e) => this.handleChange(e, "departure")} />
                                </div>
                                {
                                    this.state.returnJourney ?
                                        <div className="datePicker">
                                            <input required type="date" id="returnDate" name="return" min={this.state.departureDate} onChange={(e) => this.handleChange(e, "return")} />
                                        </div> : ''
                                }
                                <div className="passengersInput">
                                    <select name="passengers" id="passengers" placeholder="select passengers">
                                        <option value="" disabled selected hidden>Select Passengers</option>
                                        <option value="1">1 passenger</option>
                                        <option value="2">2 passengers</option>
                                        <option value="3">3 passengers</option>
                                        <option value="4">4 passengers</option>
                                        <option value="5">5 passengers</option>
                                    </select>
                                </div>
                                <div className="searchButtonWrapper">
                                    <button type='submit' className="searchButton" >Search</button>
                                </div>
                            </form>
                        </div>
                    </div>
                    <div className="flightsWrapper">
                        {this.state.showData ?
                            <React.Fragment>
                                <div className="flightsRoute">
                                    <div className={`flightsRouteDetails ${this.state.returnJourney ? 'returnWidthTitle' : 'oneWayWidthTitle'}`}>
                                        {this.state.origin && this.state.destination ? this.state.origin + ' to ' + this.state.destination : 'Please Enter the Deatils for flights'}
                                        <div >{this.state.dummyArrayOneWAY.length} flights found on {departDate[0] + ' ' + monthsObj[departDate[1]] + ' ' + departDate[2]}</div>
                                    </div>
                                    {this.state.returnJourney ?
                                        <div className={`flightsRouteDetails ${this.state.returnJourney ? 'returnWidthTitle' : ''}`}>
                                            {this.state.origin && this.state.destination ? this.state.destination + ' to ' + this.state.origin : 'Please Enter the Deatils for flights'}
                                            <div >{this.state.dummyArrayOneWAY.length} flights found on {returnDate[0] + ' ' + monthsObj[returnDate[1]] + ' ' + returnDate[2]}</div>
                                        </div> : ''}
                                </div>
                                <div className={`flightsList  ${this.state.returnJourney ? 'returnWidthContent' : 'oneWayWidthTitle'}`}>
                                    {this.state.dummyArrayOneWAY.map((obj, index) =>
                                        (
                                            <div className="card-wrapper">
                                                <div className="departureTabMain">
                                                    <div class='flightsLogoInfo'>
                                                        <div className='companyLogo'><img src={flightLogo} alt='Logo' width="27px" height="27px" /></div>
                                                    </div>
                                                    <div class='flightsCompanyInfo'>
                                                        <div className='companyname'>{obj.name}</div>
                                                        <div>{obj.flightNo}</div>
                                                    </div>
                                                    <div className="flightsDepartTime">
                                                        <div>{obj.departureTime}</div>
                                                        <div className='companyName flights--tooltip' title=''> {obj.origin.split(" ")[0]}</div>
                                                    </div>
                                                    <div class="flightsArrivalTime">
                                                        <div className="durationTime css-fl-cheapest-background flights--tooltip" title="" data-original-title="Fastest flight">{obj.arrivalTime}</div>
                                                        <div className="destination"><span title="" >{obj.destination.split(" ")[0]}</span>
                                                        </div>
                                                    </div>
                                                    <div class="flightsDurationTime">
                                                        <div className="durationTime css-fl-cheapest-background flights--tooltip" title="" data-original-title="Fastest flight">
                                                            {'0' + (obj.arrivalTime.split(':')[0] - obj.departureTime.split(':')[0]) + 'h'}
                                                            {' ' + (obj.arrivalTime.split(':')[1] - obj.departureTime.split(':')[1]) + 'm'}
                                                        </div>
                                                    </div>
                                                    <div className="css-fl-nobuggage-icons"></div>
                                                    <div className="flightsPrice js-flight-price">
                                                        <div className="discountPrice css-16px-size " title="">
                                                            <div className="">
                                                                <div className="css-currency currency-js"><span><i className="icon icon_currency-inr"></i></span><span data-base="7094"><span>&#8377;</span>{obj.price}</span></div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="bookButton">
                                                        <button>
                                                            Book
                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        )
                                    )
                                    }
                                </div>
                                {this.state.returnJourney
                                    ?
                                    <div className={`flightsList  ${this.state.returnJourney ? 'returnWidthContent' : 'oneWayWidthTitle'}`}>
                                        {this.state.dummyArrayOneWAY.map((obj, index) =>
                                            (
                                                <div className="card-wrapper">
                                                    <div className="departureTabMain">
                                                        <div class='flightsLogoInfo'>
                                                            <div className='companyLogo'><img src={flightLogo} alt='Logo' width="27px" height="27px" /></div>
                                                        </div>
                                                        <div class='flightsCompanyInfo'>
                                                            <div className='companyname'>{obj.name}</div>
                                                            <div>{obj.flightNo}</div>
                                                        </div>
                                                        <div className="flightsDepartTime">
                                                            <div>{obj.departureTime}</div>
                                                            <div className="companyName"><span title="">{obj.destination.split(" ")[0]}</span>
                                                            </div>
                                                        </div>
                                                        <div class="flightsArrivalTime">
                                                            <div className="durationTime " title="" >{obj.arrivalTime}</div>
                                                            <div className='destination' title=''> {obj.origin.split(" ")[0]}</div>
                                                        </div>
                                                        <div class="flightsDurationTime">
                                                            <div className="durationTime css-fl-cheapest-background flights--tooltip" title="" >
                                                                {'0' + (obj.arrivalTime.split(':')[0] - obj.departureTime.split(':')[0]) + 'h'}
                                                                {' ' + (obj.arrivalTime.split(':')[1] - obj.departureTime.split(':')[1]) + 'm'}
                                                            </div>
                                                        </div>
                                                        <div className="flightsPrice js-flight-price">
                                                            <div className="discountPrice css-16px-size " title="">
                                                                <div className="">
                                                                    <div className="css-currency currency-js"><span><i className="icon icon_currency-inr"></i></span><span data-base="7094"><span>&#8377;</span>{obj.price}</span></div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div className="bookButton">
                                                            <button>
                                                                Book
                                        </button>
                                                        </div>
                                                    </div>
                                                </div>
                                            )
                                        )
                                        }
                                    </div>
                                    :
                                    ''
                                }
                            </React.Fragment>
                            :
                            <React.Fragment>
                                <h1>Please Enter the details to search the flights</h1>
                            </React.Fragment>
                        }
                    </div>
                </div>
            </React.Fragment>
        );
    }
}
HomePage.propTypes = {
    getPostsListAsync: PropTypes.func.isRequired
}
export default HomePage;


