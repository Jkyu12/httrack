// create an object with the desired methods to use as prototype
var pomodoro = {
  endDate: function () {
    // SugarJS gives us minutesAfter() which gives us a nice syntax for
    // creating new Date objects
    // http://sugarjs.com/api/Number/unitAfter
    return ((25).minutesAfter(this.startDate));
  },
  remaining: function () {
    return this.endDate().getTime() - Date.now();
  }
};

Pomodoros = new Meteor.Collection("Pomodoros", {
  transform: function (doc) {
    // create a new empty object with pomodoro as it's prototype
    var newInstance = Object.create(pomodoro);

    // copy the data from doc to newInstance and return newInstance
    return  _.extend(newInstance, doc);
  }
});
