import React, { Component } from 'react';

// Styles
import './dashboard/Dashboard.css';

class Dashboard extends Component {
    
    const baseUrl = 'https://bbnknightlife.com/api/';
    
    constructor() {
        super();
        
        this.state = {
            date: ''
        }
    }

	render() {
		return (
			<div className="dashboard">
                <h1>Send updates</h1>
                <form method="post" enctype="multipart/form-data" target="https://bbnknightlife.com/api/push/update/">
                    <input type="date" value={ this.state.date } onChange={ this.updateSelectedDate }>
                </table>
                <button onclick={ this.sendScheduleUpdate }>Schedule</button>
                <button onclick={ this.sendEventsUpdate }>Events</button>
                <button onclick={ this.sendLunchUpdate }>Lunch</button>
            </div>
		);
	}

    updateSelectedDate(date) {
        this.setState({
            date: date.target.value
        })
    }

    sendScheduleUpdate() {
        fetch(baseUrl + 'push/refresh/schedule', {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                date: this.state.date
            }),
        }); 
    }

    sendEventsUpdate() {
        fetch(baseUrl + 'push/refresh/events', {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                date: this.state.date
            }),
        });
    }
    
    sendLunchUpdate() {
        fetch(baseUrl + 'push/refresh/lunch', {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                date: this.state.date
            }),
        });
    }
}

export default Dashboard;