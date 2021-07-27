"use strict";

const host = window.location.host == '' ? 'meucartola.pyanderson.dev' : window.location.host;
const actual_round = 13;
const user_data = {'team': {}};
const positions = ['gol', 'lat', 'zag', 'mei', 'ata', 'tec'];

Array.prototype.toObject = function(key) {
  const obj = {};
  for (let i = 0; i < this.length; i++) {
      obj[this[i][key]] = this[i];
  }
  return obj;
};

$(document).ready(function() {});
