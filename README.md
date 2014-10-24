webtasks
========

A lightweight web framework based on <a href="https://github.com/strongloop/express">express</a> and <a href="https://github.com/zordius/subtask.js">subtask.js</a>

Features
--------

Make developer decouple complex web application logic into small logic pieces to help them reuse them, and speed up implement and testing.

**Logical components in this framework**

* **Input**: focus on deal with params or other request based inputs
* **Data**: call api or get data from storage
* **Module**: handle presentation logics then rendered with a view
* **Page**: composite modules then rendered with a view
