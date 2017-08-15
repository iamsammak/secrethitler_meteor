import { Template } from 'meteor/templating';

import { Rooms, Players } from '../api/collections.js';

import './lobby.html';

Template.lobby.helpers({
  players: function() {
    let playerId = Session.get("playerId");
    let roomId = Session.get("roomId");
    let room = Rooms.findOne(roomId);
    if (!room) {
      return null;
    }

    return Players.find({ roomId: roomId }).fetch().map(
      function(player) {
        console.log(player);
        // set player.current to be player._id if player._id is equal to playerId
        player.current = player._id == playerId;
        return player;
      });
  },
  room: function() {
    let roomId;
    if (roomId = Session.get("roomId")) {
      return Rooms.findOne(roomId);
    }
  },
  // to be removed later
  tempCode: function() {
    return "j3r3my";
  },
  owner: function() {
    let playerId = Session.get("playerId");
    let roomId = Session.get("roomId");
    let room = Rooms.findOne(roomId);

    return playerId === room.owner;
  },
  ready: function(players) {
    // testing
    console.log("Ready?");

    let attributes = {};
    if (players.length < 5) {
      attributes.disabled = false;
    }
    return attributes;
  },
});

Template.lobby.events({
  "click .remove-button": function(event) {
    console.log("click remove");

    let playerId = $(event.currentTarget).data("playerid");
    Meteor.call("leavegame", { playerId: playerId });
  },
  "click .start-button": function() {
    let roomId = Session.get("roomId");
    console.log("uncomment out start game Meteor.call");
    Meteor.call("startgame", { roomId: roomId });
  },
  "click .quit-button": function() {
    let playerId = Session.get("playerId");
    Meteor.call("leavegame", { playerId: playerId }, (err) => {
      if (err) {
        console.error(err);
      }
      Session.set("roomId", null);
      Session.set("playerId", null);
      Session.set("view", "startmenu");
    });
  }
});
