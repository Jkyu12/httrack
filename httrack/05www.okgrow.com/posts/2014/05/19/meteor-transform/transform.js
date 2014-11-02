Pomodoros = new Meteor.Collection("Pomodoros", {
  transform: function (doc) {
    doc.endDate = function () {
      // SugarJS gives us minutesAfter() which gives us a nice syntax for
      // creating new Date objects
      // http://sugarjs.com/api/Number/unitAfter
      return ((25).minutesAfter(this.startDate));
    };
    doc.remaining = function () {
      return this.endDate().getTime() - Date.now();
    };
    return doc;
  }
});
