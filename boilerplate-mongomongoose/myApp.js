require("dotenv").config();
let mongoose = require("mongoose");
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

const personSchema = {
    name: {
        type: String,
        required: true,
    },
    age: Number,
    favoriteFoods: [String],
};

let Person = mongoose.model("Person", personSchema);
const garvit = new Person({
    name: "Garvit",
    age: 20,
    favoriteFoods: ["Chhole Kulche"],
});
const arrayOfPeople = [garvit];

const createAndSavePerson = (done) => {
    garvit.save((err, data) => (err ? done(err) : done(null, data)));
};

const createManyPeople = (arrayOfPeople, done) => {
    Person.create(arrayOfPeople, (err, data) =>
        err ? done(err) : done(null, data)
    );
};

const findPeopleByName = (personName, done) => {
    Person.find({ name: personName }, (err, data) =>
        err ? done(err) : done(null, data)
    );
};

const findOneByFood = (food, done) => {
    Person.findOne({ favoriteFoods: food }, (err, data) =>
        err ? done(err) : done(null, data)
    );
};

const findPersonById = (personId, done) => {
    Person.findById(personId, (err, data) =>
        err ? done(err) : done(null, data)
    );
};

const findEditThenSave = (personId, done) => {
    const foodToAdd = "hamburger";

    Person.findById(personId, (err, person) => {
        if (err) return done(err);
        person.favoriteFoods.push(foodToAdd);
        person.save((err, updatedPerson) =>
            err ? done(err) : done(null, updatedPerson)
        );
    });
};

const findAndUpdate = (personName, done) => {
    const ageToSet = 20;

    Person.findOneAndUpdate(
        { name: personName },
        { age: ageToSet },
        { new: true },
        (err, updatedPerson) => (err ? done(err) : done(null, updatedPerson))
    );
};

const removeById = (personId, done) => {
    Person.findByIdAndRemove(personId, (err, deletedPerson) =>
        err ? done(err) : done(null, deletedPerson)
    );
};

const removeManyPeople = (done) => {
    const nameToRemove = "Mary";

    Person.remove({ name: nameToRemove }, (err, deletedPersons) =>
        err ? done(err) : done(null, deletedPersons)
    );
};

const queryChain = (done) => {
    const foodToSearch = "burrito";

    Person.find({ favoriteFoods: foodToSearch })
        .sort({ name: 1 })
        .limit(2)
        .select({ age: 0 })
        .exec((err, deletedPersons) =>
            err ? done(err) : done(null, deletedPersons)
        );
};

/** **Well Done !!**
/* You completed these challenges, let's go celebrate !
 */

//----- **DO NOT EDIT BELOW THIS LINE** ----------------------------------

exports.PersonModel = Person;
exports.createAndSavePerson = createAndSavePerson;
exports.findPeopleByName = findPeopleByName;
exports.findOneByFood = findOneByFood;
exports.findPersonById = findPersonById;
exports.findEditThenSave = findEditThenSave;
exports.findAndUpdate = findAndUpdate;
exports.createManyPeople = createManyPeople;
exports.removeById = removeById;
exports.removeManyPeople = removeManyPeople;
exports.queryChain = queryChain;
