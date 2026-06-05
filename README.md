# *US Education statistics*

This is my project for Data Visualization course.

## Table of contents

1. [List of used technologies](#list-of-used-technologies)
2. [Setup instructions](#setup-instructions)
    1. [Step 1 - Clone the project](#step-1-\--clone-the-project)
    2. [Step 2 - Start local server](#step-2-\--start-local-server)
    3. [Step 3 - Open app](#step-3-\--open-app)



## List of used technologies

- D3.js v7.9.0
- TopoJSON v3.0.2
- us-atlas@3 (CDN - states-10m.json)
- HTML5 / CSS3
- JavaScript ES2022 (ES Modules)
- Google Fonts - Space Mono, DM Sans
- Python 3 local server
- Kaggle - U.S. Education Dataset

## Setup instructions

### Requirements

1. Web browser with ES Module support - Chrome 61+, Firefox 60+, Edge 16+
2. Python 3

### Step 1 - Clone the project

- HTTPS: `git clone https://github.com/Kailu23/us-education-statistics.git` or using SSH: `git clone git@github.com:Kailu23/us-education-statistics.git`

### Step 2 - Start local server

1. `cd us-education-statistics`
2. `python -m http.server [PORT]`

### Step 3 - Open app

`http://localhost:[PORT]/index.html`

> [!NOTE]
> When starting, the app automatically fetches TopoJSON geometry from jsDelivr [CDN](https://cdn.jsdelivr.net/npm/us-atlas@3/states-10m.json). Internet connection is **required**.
