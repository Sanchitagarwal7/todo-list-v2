//jshint esversion:6  

module.exports.getDate = function(){
// const week = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
const info = new Date();
// let today = date.getDay();
// let day = week[today];
const options = {
    weekday:"long",
    day: "numeric",
    month: "long",
    // year: "numeric"
};

const today = info.toLocaleDateString("en-US", options);

return today;
}

module.exports.getDay = function (){
    // const week = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
    const info = new Date();
    // let today = date.getDay();
    // let day = week[today];
    const options = {
        weekday:"long",
    };
    
    const today = info.toLocaleDateString("en-US", options);
    
    return today;
    }