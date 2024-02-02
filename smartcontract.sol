// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract Microgrid {
  string[] public battery_data;
  function battery(string memory element) public {
       battery_data.push(element);
   }

  function show_battery() public view returns (string[] memory) {
      return battery_data;
  }

  string[] public renewable_data;
  function renewable(string memory element) public {
       renewable_data.push(element);
   }

  function show_renewable() public view returns (string[] memory) {
      return renewable_data;
  }

  string[] public genset_data;
  function genset(string memory element) public {
       genset_data.push(element);
   }

  function show_genset() public view returns (string[] memory) {
      return genset_data;
  }

  string[] public load_data;
  function load(string memory element) public {
       load_data.push(element);
   }

  function show_load() public view returns (string[] memory) {
      return load_data;
  }

  string[] public grid_data;
  function grid(string memory element) public {
       grid_data.push(element);
   }

  function show_grid() public view returns (string[] memory) {
      return grid_data;
  }
}
