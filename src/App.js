import React from 'react';
import axios from 'axios';
import './App.css';

class Forecast extends React.Component {
  render() {
    let spans = [];
    this.props.forecast.map(day => {
      day.map(flies => {
        const style = { "background-color" : (flies == 0) ? "red" : "green" };
        spans.push(<span style={style}>&nbsp;</span>);
      });
      spans.push(<span>&nbsp;</span>);
    });

    return (<div class="forecast">{spans}</div>);
  }
}

class Site extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  
  componentDidMount() {
    axios.get(`/api/site/?id=${this.props.pgeId}`)
      .then(res => {
        console.log(res.data.forecast);
        this.setState({
          "id": res.data.site.id,
          "name": res.data.site.name,
          "lng": res.data.site.lng,
          "lat":res.data.site.lat,
          "ourl":res.data.site.orientation,
          "forecast":res.data.forecast
        });
      });
  }

  renderTime(time) {
    const hours = Math.floor(time / 60);
    const minutes = time % 60;
    return ((hours > 0) ? `${hours}h ` : "") + `${minutes}m`
  }

  render() {
    if (this.state.name) {
      return (
        <div class="site">
          <img class="orientation" src={this.state.ourl} />
          <div class="name">{this.state.name} <a class="link" href={`https://paragliding.earth/?site=${this.props.pgeId}`} target="_blank">[PGE]</a></div>
          <div class="drive">{this.renderTime(this.props.drive)} <a class="link" href={`https://www.google.be/maps/dir/Sant+Cugat+del+Vallès,+Barcelona,+Spain/${this.state.lat},+${this.state.lng}/`} target="_blank">[GM]</a></div>
          <Forecast forecast={this.state.forecast} />
          <a class="link" href={`https://www.windy.com/${this.state.lat}/${this.state.lng}`} target="_blank">[W]</a>
          <a class="link" href={`https://meteo-parapente.com/#/${this.state.lat},${this.state.lng},10`} target="_blank">[MP]</a>
        </div>
      )
    } else {
      return (
        <div class="site">Loading...</div>
      )
    }
  }
}

class SiteList extends React.Component {
  render() {
    return (
      <div class="site-list">
        {this.props.sites.map((site, index) => (
          <Site key={index} pgeId={site.pgeId} drive={site.drive} />
        ))}
      </div>
    )
  }
}

class App extends React.Component {
  render() {
    const sites = [
      {"pgeId":11396, "drive": 40},
      {"pgeId":11019, "drive": 43},
      {"pgeId":14512, "drive": 48},
      {"pgeId":10581, "drive": 56},
      {"pgeId":10386, "drive": 60},
      {"pgeId":6700, "drive": 70},
      {"pgeId":9173, "drive": 69},
      {"pgeId":14511, "drive": 73},
      {"pgeId":18100, "drive": 73},
      {"pgeId":11018, "drive": 73},
      {"pgeId":6701, "drive": 80},
      {"pgeId":10490, "drive": 82},
      {"pgeId":10487, "drive": 83},
      {"pgeId":10387, "drive": 86},
      {"pgeId":21229, "drive": 92},
      {"pgeId":15837, "drive": 104},
      {"pgeId":11027, "drive": 107},
      {"pgeId":11096, "drive": 116},
      {"pgeId":6177, "drive": 118},
      {"pgeId":11110, "drive": 127},
      {"pgeId":2934, "drive": 129},
      {"pgeId":19675, "drive": 130},
      {"pgeId":2933, "drive": 133},
      {"pgeId":22048, "drive": 136},
      {"pgeId":15842, "drive": 136},
      {"pgeId":7366, "drive": 154}
    ];

    const days = ['Z', 'M', 'D', 'W', 'D', 'V', 'Z'];

    return (
      <div>
        <div>
          <div class='header-1'>Site</div>
          <div class='header-2'>
            <div class='header-3'>{days[new Date().getDay()]}</div>
            <div class='header-3'>{days[(new Date().getDay()+1)%7]}</div>
            <div class='header-3'>{days[(new Date().getDay()+2)%7]}</div>
            <div class='header-3'>{days[(new Date().getDay()+3)%7]}</div>
            <div class='header-3'>{days[(new Date().getDay()+4)%7]}</div>
          </div>
        </div>
        <SiteList sites={sites} />
      </div>
    );
  }
}

export default App;
