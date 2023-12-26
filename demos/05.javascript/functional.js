const wolf = {
  name: "Wolf",
  howl: function () {
    console.log(this.name + ": awoooooooo");
  },
};
const dog = Object.create(wolf, {
  name: {
    value: "Dog",
  },
  woof: {
    value: function () {
      console.log(this.name + ":woof");
    },
  },
});
const rufus = Object.create(dog, {
  name: { value: "Rufus the dog" },
});

rufus.woof();
rufus.howl();
