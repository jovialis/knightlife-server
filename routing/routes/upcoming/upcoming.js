// Special schedules
// Schedule notices
// Upcoming events
// upcomingType: 'schedule' ; 'notice' ; 'event'

module.exports = function (req, res) {
	let formatter = require(`${__basedir}/utils/response-formatter`);

	const date = new Date(req.param("date"));
	if (!date) {
		console.log("Invalid date requested: " + req.param("date") + ".");

		res.json(formatter.error("Invalid date requested"));
		return;
	}
    
    getChangedSchedules(date, function(error, result) {
        if (error) {
            console.log("Failed to fetch upcoming: " + error);
            
            res.json(formatter.error("Failed to fetch upcoming."));
            return;
        }
        
        const dateFormatter = require(`${__basedir}/utils/date-formatter`);
        res.json(formatter.success(result, "upcoming", dateFormatter(date)));
    });
};

function buildItem(type, date, data) {
    const dateFormatter = require(`${__basedir}/utils/date-formatter`);

    return {
        "upcomingType": type,
        "date": dateFormatter(date),
        "data": data
    }
}

function getChangedSchedules(date, callback) {
    require(`${__basedir}/database/models/schedule`).find({
		date: { 
            $gte: date, 
        },
        changed: true // Only fetch Schedules that have the Changed flag for a changed schedule.
	}, function (error, object) {
        if (error) {
            callback(error, null);
            return;
        }
        
        let resultList = [];        
		object.forEach(function(item) {
            resultList.push(buildItem("schedule", item["date"], {}));
		});
        
        getScheduleNotices(date, resultList, callback);
    });
}

function getScheduleNotices(date, list, callback) {
    require(`${__basedir}/database/models/schedule`).find({
		date: {
            $gte: date, 
        },
        notices: {
            $exists: true,
        }
    }, function (error, object) {
        if (error) {
            callback(error, null);
            return;
        }
        
		object.forEach(function(item) {
            item["notices"].forEach(function(notice) {
                list.push(buildItem("notice", item["date"], notice));
            });
		});
        
        getEvents(date, list, callback);
    });
}

function getEvents(date, list, callback) {
    require(`${__basedir}/database/models/event`).find({
		date: {
            $gte: date, 
        },
    }).lean().select({ _id: 0 }).exec(function (error, events) {
        if (error) {
            callback(error, null);
            return;
        }
        
        events.forEach(function(event) {
            let eventDate = event["date"];

            delete event['date'];
            
			list.push(buildItem("event", eventDate, event));
		});

		callback(null, list);
	});
}






